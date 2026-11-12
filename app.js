(function () {
  'use strict';
  const PHONE = '584242573387';
  const products = window.ECLIPSE_PRODUCTS;
  const links = window.ECLIPSE_LINKS;
  const $ = (selector, root=document) => root.querySelector(selector);
  const $$ = (selector, root=document) => Array.from(root.querySelectorAll(selector));
  const dataById = Object.fromEntries(products.map(product=>[product.id,product]));
  function safeStorageGet(key,fallback) { try { const v=JSON.parse(localStorage.getItem(key)); return v===null?fallback:v; } catch(e) {return fallback;} }
  function save(key,obj) { try { localStorage.setItem(key,JSON.stringify(obj)); } catch(e) {} }
  const cart = safeStorageGet('eclipse_navidad_2026_lista', {});
  let favorites = safeStorageGet('eclipse_navidad_2026_favoritos',[]);
  if (!Array.isArray(favorites)) favorites=[];
  let activeCategory = 'todos';
  let searchValue = '';
  let toastTimer = 0;
  const grid=$('#productGrid'), count=$('#totalProducts');
  count.textContent=String(products.length);
  function sanitize(s) {return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
  function label(p) {return p.categoryLabel;}
  function quoteUrl(message) {return 'https://wa.me/'+PHONE+'?text='+encodeURIComponent(message);}
  function productMessage(p) {return 'Hola Eclipse, deseo consultar el precio y personalización de '+p.name+'.\n📷 Foto y detalles: '+new URL(links.product(p.id),location.origin).href+'\n¿Me indican disponibilidad y opciones?';}
  function mediaStyle(p) {return '--img:url('+p.image+');--pos:'+p.pos+';--size:'+(p.imageType==='referencial'?'210% auto':'cover');}
  function render() {
    const q=searchValue.trim().toLocaleLowerCase('es');
    const visible=products.filter(p=>(activeCategory==='todos'||(activeCategory==='destacados'?p.featured===true:p.category===activeCategory))&&(p.name+' '+p.desc+' '+p.categoryLabel).toLocaleLowerCase('es').includes(q));
    $('#emptyState').hidden=visible.length!==0;
    grid.innerHTML=visible.map(p=>{
      const fav=favorites.includes(p.id);
      return '<article class="product"><div class="product-figure"><button type="button" class="heart" aria-label="'+(fav?'Quitar de favoritos':'Guardar favorito')+'" aria-pressed="'+fav+'" data-favorite="'+p.id+'">'+(fav?'♥':'♡')+'</button><span class="product-badge">'+sanitize(p.tag)+'</span><a class="product-figure-link" href="'+links.product(p.id)+'" aria-label="Ver imagen y detalles de '+sanitize(p.name)+'"><div class="product-pic" style="'+mediaStyle(p)+'"></div></a><span class="source-label">'+(p.imageType==='editorial'?'Imagen ambientada':p.imageType==='real'?'Foto real':'Imagen referencial')+'</span></div><div class="product-body"><span class="product-category">'+sanitize(label(p))+'</span><h3 class="product-title"><a href="'+links.product(p.id)+'">'+sanitize(p.name)+'</a></h3><p class="product-text">'+sanitize(p.desc)+'</p><span class="price-label">Consultar precio</span><div class="product-actions"><button class="btn btn-red" type="button" data-add="'+p.id+'">Agregar a mi lista +</button><button class="details-btn" type="button" title="Ver detalles" aria-label="Ver detalles de '+sanitize(p.name)+'" data-detail="'+p.id+'">↗</button></div></div></article>';
    }).join('');
  }
  function toast(message){const el=$('#toast');el.textContent=message;el.classList.add('show');window.clearTimeout(toastTimer);toastTimer=window.setTimeout(()=>el.classList.remove('show'),2700);}
  function getCartItems(){return Object.entries(cart).filter(([id,q])=>dataById[id]&&q>0).map(([id,q])=>({...dataById[id],qty:q}));}
  function updateCount(){const total=getCartItems().reduce((sum,p)=>sum+p.qty,0);$('#cartCount').textContent=String(total);}
  function addItem(id){if(!dataById[id])return;cart[id]=Math.min(99,(cart[id]||0)+1);save('eclipse_navidad_2026_lista',cart);updateCount();renderCart();toast('Producto agregado a tu lista de cotización.');}
  function renderCart(){const items=getCartItems();$('#drawerItems').innerHTML=items.length?items.map(p=>'<div class="drawer-item"><div><b>'+sanitize(p.name)+'</b><small>Consultar precio</small></div><div class="qty"><button type="button" data-qty="'+p.id+'" data-change="-1" aria-label="Disminuir cantidad de '+sanitize(p.name)+'">−</button><strong>'+p.qty+'</strong><button type="button" data-qty="'+p.id+'" data-change="1" aria-label="Aumentar cantidad de '+sanitize(p.name)+'">+</button></div></div>').join(''):'<p style="text-align:center;padding:40px 15px;color:#806962">Tu lista está vacía.<br>Agrega productos desde el catálogo para solicitar precios.</p>';
    const button=$('#sendQuote');button.setAttribute('aria-disabled',String(!items.length));button.style.opacity=items.length?'1':'.5';
    const notes=$('#orderNotes').value.trim();
    const summaryUrl=items.length?links.summary(items,notes):'#';
    const preview=$('#previewQuote'); preview.href=summaryUrl; preview.setAttribute('aria-disabled',String(!items.length));
    const message='🎄 Hola Eclipse, deseo consultar precios para estos productos de su Catálogo Navideño 2026:\n\n'+items.map((p,i)=>(i+1)+'. '+p.name+' — '+p.qty+' unidad(es)').join('\n')+'\n\n📷 *Ver fotos y resumen visual:*\n'+summaryUrl+(items.length<=4?'\n\n*Fichas de los productos:*\n'+items.map(p=>'• '+new URL(links.product(p.id),location.origin).href).join('\n'):'')+(notes?'\n\n*Personalización / observaciones:* '+notes:'')+'\n\n¿Me podrían confirmar precio, disponibilidad y tiempo de elaboración?';
    button.href=items.length?quoteUrl(message):'#';
  }
  function setQty(id,delta){if(!dataById[id])return;cart[id]=Math.max(0,Math.min(99,(cart[id]||0)+delta));if(!cart[id])delete cart[id];save('eclipse_navidad_2026_lista',cart);renderCart();updateCount();}
  function openCart(){$('#drawerBackdrop').hidden=false;$('#drawer').classList.add('open');$('#drawer').setAttribute('aria-hidden','false');document.body.style.overflow='hidden';renderCart();$('#closeDrawer').focus();}
  function closeCart(){$('#drawer').classList.remove('open');$('#drawer').setAttribute('aria-hidden','true');$('#drawerBackdrop').hidden=true;document.body.style.overflow='';}
  function detail(id){const p=dataById[id];if(!p)return;$('#productDetails').innerHTML='<div class="detail-inner"><div class="detail-art" style="'+mediaStyle(p)+'"></div><div class="detail-copy"><small>'+sanitize(p.categoryLabel).toUpperCase()+'</small><h2>'+sanitize(p.name)+'</h2><p>'+sanitize(p.desc)+'</p><p>Selecciona la cantidad y cuéntanos qué nombre, imagen o logo te gustaría agregar. Opciones sujetas a confirmación.</p><span class="price-label">Consultar precio</span><a class="btn btn-red" href="'+quoteUrl(productMessage(p))+'" target="_blank" rel="noopener noreferrer">Consultar por WhatsApp ↗</a><button type="button" class="btn btn-outline" style="width:100%;margin-top:9px" data-detail-add="'+p.id+'">+ Agregar a mi lista</button></div></div>';
    const dialog=$('#productDialog');if(dialog.showModal)dialog.showModal();else dialog.setAttribute('open','');}
  function closeDetail(){const d=$('#productDialog');if(d.close)d.close();else d.removeAttribute('open');}
  function selectCategory(cat){activeCategory=cat;$('.cat').forEach(b=>b.classList.toggle('active',b.dataset.cat===cat));render();}
  $('.cat').forEach(btn=>btn.addEventListener('click',()=>selectCategory(btn.dataset.cat)));
  // Las tarjetas de colección deben filtrar y llevar al usuario directamente a los productos.
  $('.category-tile[data-select-cat]').forEach(tile=>tile.addEventListener('click',e=>{
    e.preventDefault();
    const category=tile.dataset.selectCat;
    selectCategory(category);
    const catalog=$('#catalogo');
    if(catalog){
      history.replaceState(null,'','#catalogo');
      catalog.scrollIntoView({behavior:'smooth',block:'start'});
      catalog.setAttribute('tabindex','-1');
      window.setTimeout(()=>catalog.focus({preventScroll:true}),450);
    }
  }));
  $('#searchInput').addEventListener('input',e=>{searchValue=e.target.value;render();});
  $('#searchToggle').addEventListener('click',()=>{document.location.hash='catalogo';$('#searchInput').focus();});
  $('#menuToggle').addEventListener('click',()=>{const nav=$('#navLinks');const opened=nav.classList.toggle('open');$('#menuToggle').setAttribute('aria-expanded',String(opened));});
  $$('#navLinks a').forEach(a=>a.addEventListener('click',()=>$('#navLinks').classList.remove('open')));
  grid.addEventListener('click',e=>{const add=e.target.closest('[data-add]');if(add){addItem(add.dataset.add);return;}
    const details=e.target.closest('[data-detail]');if(details){detail(details.dataset.detail);return;}
    const fav=e.target.closest('[data-favorite]');if(fav){const id=fav.dataset.favorite;favorites=favorites.includes(id)?favorites.filter(x=>x!==id):[...favorites,id];save('eclipse_navidad_2026_favoritos',favorites);render();toast(favorites.includes(id)?'Guardado en favoritos.':'Eliminado de favoritos.');}});
  $('#cartButton').addEventListener('click',openCart);$('#closeDrawer').addEventListener('click',closeCart);$('#drawerBackdrop').addEventListener('click',closeCart);
  $('#drawerItems').addEventListener('click',e=>{const b=e.target.closest('[data-qty]');if(b)setQty(b.dataset.qty,Number(b.dataset.change));});
  $('#orderNotes').addEventListener('input',renderCart);
  $('#clearCart').addEventListener('click',()=>{Object.keys(cart).forEach(k=>delete cart[k]);save('eclipse_navidad_2026_lista',cart);renderCart();updateCount();});
  $('#sendQuote').addEventListener('click',e=>{if(getCartItems().length===0){e.preventDefault();toast('Agrega al menos un producto a la consulta.');}});
  $('#closeProduct').addEventListener('click',closeDetail);$('#productDialog').addEventListener('click',e=>{if(e.target===$('#productDialog'))closeDetail();});
  $('#productDetails').addEventListener('click',e=>{const b=e.target.closest('[data-detail-add]');if(b){addItem(b.dataset.detailAdd);closeDetail();openCart();}});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeCart();});
  async function shareSite(){const url=location.href.split('#')[0];if(navigator.share){try{await navigator.share({title:'Eclipse · Catálogo Navideño 2026',text:'Descubre productos personalizados para regalar esta Navidad.',url});return;}catch(e){}}
    if(navigator.clipboard&&navigator.clipboard.writeText){try{await navigator.clipboard.writeText(url);toast('Enlace copiado para compartir.');return;}catch(e){}}
    window.prompt('Copia el enlace del catálogo:',url);}
  $('#shareSite').addEventListener('click',shareSite);
  $('#floatingWhatsApp').addEventListener('click',()=>window.open(quoteUrl('Hola Eclipse, quisiera hacer una consulta sobre el Catálogo Navideño 2026.'),'_blank','noopener'));
  render();updateCount();renderCart();
  if(new URLSearchParams(location.search).get('lista')==='1') openCart();
})();