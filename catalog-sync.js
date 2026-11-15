import {firebaseConfig} from '/firebase-config.js';
if(firebaseConfig.apiKey&&firebaseConfig.projectId){
 const [{initializeApp},{getFirestore,collection,onSnapshot}]=await Promise.all([
  import('https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js'),
  import('https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js')
 ]);
 const db=getFirestore(initializeApp(firebaseConfig));
 let products=null,categories=null;
 const emit=()=>{
  if(!products||!products.length)return; // conserva el catálogo estático hasta importar datos.
  window.dispatchEvent(new CustomEvent('eclipse:catalog-updated',{detail:{products,categories:categories||[]}}));
 };
 onSnapshot(collection(db,'eclipseProducts'),snap=>{products=snap.docs.map(d=>({id:d.id,...d.data()}));emit();},err=>console.error('No se pudo sincronizar el catálogo:',err));
 onSnapshot(collection(db,'eclipseCategories'),snap=>{categories=snap.docs.map(d=>({id:d.id,...d.data()})).sort((a,b)=>(a.order||0)-(b.order||0));emit();},err=>console.error('No se pudieron cargar categorías:',err));
}
