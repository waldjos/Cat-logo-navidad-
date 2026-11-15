import {firebaseConfig,adminUid} from '/firebase-config.js';
import {initializeApp} from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js';
import {getAuth,onAuthStateChanged,signInWithEmailAndPassword,signOut} from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js';
import {getFirestore,collection,doc,setDoc,deleteDoc,onSnapshot,serverTimestamp} from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js';
import {getStorage,ref,uploadBytes,getDownloadURL,deleteObject} from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-storage.js';
const $=id=>document.getElementById(id);
const show=(id,visible)=>$(id).classList.toggle('hidden',!visible);
const status=message=>{$('status').textContent=message;};
const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const slug=s=>String(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,60);
const initialCategories=[['tazas','Tazas y mugs'],['vasos','Vasos y termos'],['textiles','Ropa navideña'],['empaques','Empaques y regalos'],['adornos','Adornos'],['corporativos','Corporativos'],['accesorios','Accesorios']];
let products=[],categories=[],unsubscribe=[],auth,db,storage;
if(!firebaseConfig.apiKey||!firebaseConfig.projectId||!adminUid){show('setup',true);}
else {
 const app=initializeApp(firebaseConfig);auth=getAuth(app);db=getFirestore(app);storage=getStorage(app);
 onAuthStateChanged(auth,user=>{
  unsubscribe.forEach(fn=>fn());unsubscribe=[];
  show('workspace',false);show('login',!user);show('logout',!!user);
  if(!user)return;
  if(user.uid!==adminUid){signOut(auth);alert('Esta cuenta no está autorizada.');return;}
  show('login',false);show('workspace',true);$('userEmail').textContent=user.email;
  unsubscribe.push(onSnapshot(collection(db,'eclipseCategories'),snap=>{
   categories=snap.docs.map(d=>({id:d.id,...d.data()})).sort((a,b)=>(a.order||0)-(b.order||0));
   renderCategories();renderCategoryOptions();
  },err=>status('Error leyendo categorías: '+err.message)));
  unsubscribe.push(onSnapshot(collection(db,'eclipseProducts'),snap=>{
   products=snap.docs.map(d=>({id:d.id,...d.data()}));
   renderProducts();status('Catálogo sincronizado. Cambios guardados en Firebase.');
  },err=>status('Error leyendo productos: '+err.message)));
 });
}
$('loginForm').addEventListener('submit',async e=>{
 e.preventDefault();const button=e.target.querySelector('button');button.disabled=true;
 try{await signInWithEmailAndPassword(auth,$('email').value.trim(),$('password').value);}
 catch(err){alert('No se pudo iniciar sesión. Comprueba las credenciales.');}
 finally{button.disabled=false;$('password').value='';}
});
$('logout').addEventListener('click',()=>signOut(auth));
document.querySelectorAll('[data-view]').forEach(btn=>btn.addEventListener('click',()=>{
 document.querySelectorAll('[data-view]').forEach(x=>x.classList.toggle('active',x===btn));
 show('productsView',btn.dataset.view==='products');show('categoriesView',btn.dataset.view==='categories');
}));
function renderCategoryOptions(){
 const previous=$('category').value;
 const entries=categories.length?categories:initialCategories.map(([id,name],order)=>({id,name,order}));
 $('category').innerHTML=entries.map(c=>'<option value="'+escape(c.id)+'">'+escape(c.name)+'</option>').join('');
 if(entries.some(c=>c.id===previous))$('category').value=previous;
}
function renderCategories(){
 $('categoriesList').innerHTML=(categories.length?categories:initialCategories.map(([id,name],order)=>({id,name,order,seed:true}))).map(c=>
 '<div class="item"><div class="meta"><b>'+escape(c.name)+'</b><div class="muted">'+escape(c.id)+'</div></div><button class="secondary" data-edit-category="'+escape(c.id)+'">Editar</button>'+(c.seed?'':'<button class="danger" data-delete-category="'+escape(c.id)+'">Eliminar</button>')+'</div>').join('');
}
function renderProducts(){
 const q=$('filterProducts').value.toLowerCase();
 const rows=products.filter(p=>(p.name||'').toLowerCase().includes(q)).sort((a,b)=>(a.name||'').localeCompare(b.name||''));
 $('productCount').textContent='('+products.length+')';
 $('productsList').innerHTML=rows.map(p=>
 '<div class="item"><img src="'+escape(p.image||'')+'" alt="" onerror="this.style.opacity=.2"><div class="meta"><b>'+escape(p.name)+'</b><div class="muted">'+escape(p.categoryLabel||p.category)+' · '+(p.published===false?'Borrador':'Publicado')+'</div></div><button class="secondary" data-edit-product="'+escape(p.id)+'">Editar</button><button class="danger" data-delete-product="'+escape(p.id)+'">Eliminar</button></div>').join('')||'<p class="muted">No hay productos guardados en Firebase.</p>';
}
$('filterProducts').addEventListener('input',renderProducts);
$('photo').addEventListener('change',()=>{
 const f=$('photo').files[0];if(!f)return;
 if(!['image/jpeg','image/png','image/webp'].includes(f.type)||f.size>8*1024*1024){alert('Usa JPG, PNG o WebP de máximo 8 MB.');$('photo').value='';return;}
 $('preview').src=URL.createObjectURL(f);show('preview',true);
});
$('image').addEventListener('input',()=>{if($('image').value){$('preview').src=$('image').value;show('preview',true);}});
function resetProduct(){
 $('productForm').reset();$('productId').value='';$('formTitle').textContent='Nuevo producto';$('preview').removeAttribute('src');show('preview',false);renderCategoryOptions();
}
$('resetProduct').addEventListener('click',resetProduct);
$('productForm').addEventListener('submit',async e=>{
 e.preventDefault();const btn=$('saveProduct');btn.disabled=true;
 const id=$('productId').value||slug($('name').value)+'-'+Math.random().toString(36).slice(2,7);
 const old=products.find(p=>p.id===id)||{};
 const cat=categories.find(c=>c.id===$('category').value)||initialCategories.map(([id,name])=>({id,name})).find(c=>c.id===$('category').value);
 let image=$('image').value.trim()||old.image||'';
 let storagePath=old.storagePath||'';
 try{
  const f=$('photo').files[0];
  if(f){
   const path='eclipse-products/'+id+'/'+Date.now()+'-'+slug(f.name.replace(/\.[^.]+$/,''))+'.'+f.name.split('.').pop().toLowerCase();
   const target=ref(storage,path);await uploadBytes(target,f,{contentType:f.type});
   image=await getDownloadURL(target);storagePath=path;
  }
  if(!image)throw Error('Debes indicar una imagen o subir una fotografía.');
  const data={name:$('name').value.trim(),desc:$('desc').value.trim(),category:cat.id,categoryLabel:cat.name,tag:$('tag').value.trim()||'Personalizable',image,storagePath,pos:'center',imageType:'real',featured:$('featured').checked,published:$('published').checked,updatedAt:serverTimestamp()};
  await setDoc(doc(db,'eclipseProducts',id),data,{merge:true});
  status('Producto guardado: '+data.name);resetProduct();
 }catch(err){status('No se pudo guardar: '+err.message);}
 finally{btn.disabled=false;}
});
$('productsList').addEventListener('click',async e=>{
 const edit=e.target.closest('[data-edit-product]'),del=e.target.closest('[data-delete-product]');
 if(edit){
  const p=products.find(x=>x.id===edit.dataset.editProduct);if(!p)return;
  $('productId').value=p.id;$('formTitle').textContent='Editar producto';$('name').value=p.name||'';$('desc').value=p.desc||'';renderCategoryOptions();$('category').value=p.category||'';$('tag').value=p.tag||'';$('image').value=p.image||'';$('featured').checked=!!p.featured;$('published').checked=p.published!==false;
  $('preview').src=p.image||'';show('preview',!!p.image);$('productForm').scrollIntoView({behavior:'smooth'});
 }
 if(del){
  const p=products.find(x=>x.id===del.dataset.deleteProduct);if(!p||!confirm('¿Eliminar definitivamente "'+p.name+'"?'))return;
  try{await deleteDoc(doc(db,'eclipseProducts',p.id));status('Producto eliminado.');}
  catch(err){status('Error al eliminar: '+err.message);}
 }
});
function resetCategory(){$('categoryForm').reset();$('categoryId').value='';$('categorySlug').disabled=false;}
$('resetCategory').addEventListener('click',resetCategory);
$('categoryForm').addEventListener('submit',async e=>{
 e.preventDefault();const id=$('categoryId').value||slug($('categorySlug').value||$('categoryName').value);
 if(!id||id==='todos'||id==='destacados')return alert('Identificador inválido.');
 try{await setDoc(doc(db,'eclipseCategories',id),{name:$('categoryName').value.trim(),order:Number($('categoryOrder').value)||0,updatedAt:serverTimestamp()},{merge:true});status('Categoría guardada.');resetCategory();}
 catch(err){status('Error guardando categoría: '+err.message);}
});
$('categoriesList').addEventListener('click',async e=>{
 const edit=e.target.closest('[data-edit-category]'),del=e.target.closest('[data-delete-category]');
 if(edit){const c=categories.find(x=>x.id===edit.dataset.editCategory);if(!c)return;$('categoryId').value=c.id;$('categorySlug').value=c.id;$('categorySlug').disabled=true;$('categoryName').value=c.name;$('categoryOrder').value=c.order||0;$('categoryForm').scrollIntoView({behavior:'smooth'});}
 if(del){const id=del.dataset.deleteCategory;if(products.some(p=>p.category===id))return alert('Mueve primero los productos de esta categoría.');if(!confirm('¿Eliminar esta categoría?'))return;try{await deleteDoc(doc(db,'eclipseCategories',id));}catch(err){status(err.message);}}
});
renderCategoryOptions();renderCategories();

$('importProducts').addEventListener('click',async()=>{
 if(products.length)return alert('Ya existen productos en Firebase. La importación inicial solo está disponible cuando está vacío.');
 const source=window.ECLIPSE_PRODUCTS||[];
 if(!source.length)return alert('No se encontró el catálogo original.');
 if(!confirm('¿Importar los '+source.length+' productos actuales y sus categorías a Firebase?'))return;
 const btn=$('importProducts');btn.disabled=true;
 try{
  for(let i=0;i<initialCategories.length;i++){
   const [id,name]=initialCategories[i];
   await setDoc(doc(db,'eclipseCategories',id),{name,order:i});
  }
  for(const p of source){
   const {id,...data}=p;
   await setDoc(doc(db,'eclipseProducts',id),{...data,published:true});
  }
  status('Importación completada: '+source.length+' productos.');
 }catch(err){status('Importación incompleta: '+err.message+'. Revisa antes de volver a intentar.');}
 finally{btn.disabled=false;}
});
