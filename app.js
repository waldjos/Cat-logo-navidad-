(function () {
  'use strict';
  const PHONE = '584242573387';
  const photos = {
    corporativos: '/assets/corporativos.webp',
    adornos: '/assets/adornos.webp',
    accesorios: '/assets/accesorios.webp',
    navidad: '/assets/coleccion.webp'
  };
  // Crops of the catalog's existing visual pages. Can be swapped for product photos without changing the design.
  const products = [
    {id:'mug-navideno',name:'Mug navideño personalizado',category:'destacados',categoryLabel:'Destacados Eclipse',desc:'Una taza con nombre, mensaje o diseño de temporada.',image:photos.corporativos,pos:'100% 30%',tag:'Idea de regalo'},
    {id:'termo-navideno',name:'Vaso térmico navideño',category:'destacados',categoryLabel:'Destacados Eclipse',desc:'Personaliza tu vaso con detalles para celebrar la temporada.',image:photos.corporativos,pos:'0% 66%',tag:'Personalizable'},
    {id:'boligrafos',name:'Bolígrafos personalizados',category:'corporativos',categoryLabel:'Corporativos',desc:'Un detalle práctico para regalar con tu identidad.',image:photos.corporativos,pos:'0% 30%',tag:'Corporativo'},
    {id:'vasos-cafe',name:'Vasos para café',category:'corporativos',categoryLabel:'Corporativos',desc:'Opciones para oficina, eventos y obsequios de marca.',image:photos.corporativos,pos:'100% 30%',tag:'Personalizable'},
    {id:'vaso-vinero',name:'Vaso vinero',category:'corporativos',categoryLabel:'Corporativos',desc:'Un regalo con estilo para ocasiones especiales.',image:photos.corporativos,pos:'0% 66%',tag:'Para regalar'},
    {id:'calendarios-imantados',name:'Calendarios imantados A5',category:'corporativos',categoryLabel:'Corporativos',desc:'Calendario práctico con diseño empresarial.',image:photos.corporativos,pos:'100% 66%',tag:'Para empresas'},
    {id:'pizarras-aluminio',name:'Calendarios y pizarras',category:'corporativos',categoryLabel:'Corporativos',desc:'Opciones con estructura de aluminio para organizarte.',image:photos.corporativos,pos:'0% 100%',tag:'Corporativo'},
    {id:'bolsas-pop',name:'Bolsas POP personalizadas',category:'corporativos',categoryLabel:'Corporativos',desc:'Presenta regalos y promociones con tu logotipo.',image:photos.corporativos,pos:'100% 100%',tag:'Con tu marca'},
    {id:'bambalinas-logo',name:'Bambalinas con logo',category:'adornos',categoryLabel:'Adornos',desc:'Lleva la imagen de tu empresa al árbol de Navidad.',image:photos.adornos,pos:'0% 33%',tag:'Navideño'},
    {id:'acrilicos-planos',name:'Ornamentos acrílicos',category:'adornos',categoryLabel:'Adornos',desc:'Figuras planas en acrílico para nombres o marcas.',image:photos.adornos,pos:'100% 33%',tag:'Personalizable'},
    {id:'burbujas',name:'Bambalinas tipo burbuja',category:'adornos',categoryLabel:'Adornos',desc:'Adornos transparentes con detalles en su interior.',image:photos.adornos,pos:'0% 71%',tag:'Especial'},
    {id:'saquitos',name:'Saquitos de cotillón',category:'adornos',categoryLabel:'Adornos',desc:'Presentaciones pequeñas para dulces y recuerdos.',image:photos.adornos,pos:'100% 71%',tag:'Para regalar'},
    {id:'banderines',name:'Banderines decorativos',category:'adornos',categoryLabel:'Adornos',desc:'Guirnaldas festivas para decorar tus espacios.',image:photos.adornos,pos:'50% 100%',tag:'Decoración'},
    {id:'mini-lanyards',name:'Mini lanyards',category:'accesorios',categoryLabel:'Accesorios',desc:'Cintas cortas con enganche para personalización.',image:photos.accesorios,pos:'0% 34%',tag:'Útil'},
    {id:'llaveros',name:'Llaveros acrílicos',category:'accesorios',categoryLabel:'Accesorios',desc:'Llaveros con diseños, nombres o marca.',image:photos.accesorios,pos:'100% 34%',tag:'Personalizable'},
    {id:'latas',name:'Latas para regalos',category:'accesorios',categoryLabel:'Accesorios',desc:'Empaques reutilizables para sorprender.',image:photos.accesorios,pos:'0% 91%',tag:'Detalle especial'},
    {id:'bolsos-drill',name:'Bolsos en drill',category:'accesorios',categoryLabel:'Accesorios',desc:'Bolsos de regalo con diseños personalizados.',image:photos.accesorios,pos:'100% 91%',tag:'Con tu marca'},
    {id:'vasos-bambu',name:'Vasos con tapa de bambú',category:'navidad',categoryLabel:'Colección navideña',desc:'Una opción moderna y reutilizable.',image:photos.navidad,pos:'0% 36%',tag:'Destacado'},
    {id:'tazas-espejo',name:'Tazas tipo espejo',category:'navidad',categoryLabel:'Colección navideña',desc:'Acabado brillante para regalos llamativos.',image:photos.navidad,pos:'100% 36%',tag:'Elegante'},
    {id:'franelas',name:'Franelas navideñas',category:'navidad',categoryLabel:'Colección navideña',desc:'Diseños festivos para lucir en familia o en equipo.',image:photos.navidad,pos:'0% 91%',tag:'Temporada'},
    {id:'sueteres',name:'Suéteres de Navidad',category:'navidad',categoryLabel:'Colección navideña',desc:'Un clásico de la temporada con personalidad.',image:photos.navidad,pos:'100% 91%',tag:'Temporada'}
  ];
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
  function productMessage(p) {return 'Hola Eclipse, quiero consultar el precio y disponibilidad de: '+p.name+'.\n¿Podrían indicarme las opciones de personalización?';}
  function mediaStyle(p) {return '--img:url("'+p.image+'");--pos:'+p.pos;}
  function render() {
    const q=searchValue.trim().toLocaleLowerCase('es');
    const visible=products.filter(p=>(activeCategory==='todos'||p.category===activeCategory)&&(p.name+' '+p.desc+' '+p.categoryLabel).toLocaleLowerCase('es').includes(q));
    $('#emptyState').hidden=visible.length!==0;
    grid.innerHTML=visible.map(p=>{
      const fav=favorites.includes(p.id);
      return '<article class="product"><div class="product-figure"><button type="button" class="heart" aria-label="'+(fav?'Quitar de favoritos':'Guardar favorito')+'" aria-pressed="'+fav+'" data-favorite="'+p.id+'">'+(fav?'♥':'♡')+'</button><span class="product-badge">'+sanitize(p.tag)+'</span><div class="product-pic" style="'+mediaStyle(p)+'"></div></div><div class="product-body"><span class="product-category">'+sanitize(label(p))+'</span><h3 class="product-title">'+sanitize(p.name)+'</h3><p class="product-text">'+sanitize(p.desc)+'</p><span class="price-label">Consultar precio</span><div class="product-actions"><button class="btn btn-red" type="button" data-add="'+p.id+'">Agregar a mi lista +</button><button class="details-btn" type="button" title="Ver detalles" aria-label="Ver detalles de '+sanitize(p.name)+'" data-detail="'+p.id+'">↗</button></div></div></article>';
    }).join('');
  }
  function toast(message){const el=$('#toast');el.textContent=message;el.classList.add('show');window.clearTimeout(toastTimer);toastTimer=window.setTimeout(()=>el.classList.remove('show'),2700);}
  function getCartItems(){return Object.entries(cart).filter(([id,q])=>dataById[id]&&q>0).map(([id,q])=>({...dataById[id],qty:q}));}
  function updateCount(){const total=getCartItems().reduce((sum,p)=>sum+p.qty,0);$('#cartCount').textContent=String(total);}
  function addItem(id){if(!dataById[id])return;cart[id]=Math.min(99,(cart[id]||0)+1);save('eclipse_navidad_2026_lista',cart);updateCount();renderCart();toast('Producto agregado a tu lista de cotización.');}
  function renderCart(){const items=getCartItems();$('#drawerItems').innerHTML=items.length?items.map(p=>'<div class="drawer-item"><div><b>'+sanitize(p.name)+'</b><small>Consultar precio</small></div><div class="qty"><button type="button" data-qty="'+p.id+'" data-change="-1" aria-label="Disminuir cantidad de '+sanitize(p.name)+'">−</button><strong>'+p.qty+'</strong><button type="button" data-qty="'+p.id+'" data-change="1" aria-label="Aumentar cantidad de '+sanitize(p.name)+'">+</button></div></div>').join(''):'<p style="text-align:center;padding:40px 15px;color:#806962">Tu lista está vacía.<br>Agrega productos desde el catálogo para solicitar precios.</p>';
    const button=$('#sendQuote');button.setAttribute('aria-disabled',String(!items.length));button.style.opacity=items.length?'1':'.5';
    const notes=$('#orderNotes').value.trim();
    const message='¡Hola Eclipse! Quisiera consultar el precio y disponibilidad de estos productos del Catálogo Navideño 2026:\n\n'+items.map(p=>'• '+p.name+' — Cantidad: '+p.qty).join('\n')+(notes?'\n\nObservaciones: '+notes:'')+'\n\n¿Podrían indicarme los precios y opciones de personalización?';
    button.href=items.length?quoteUrl(message):'#';
  }
  function setQty(id,delta){if(!dataById[id])return;cart[id]=Math.max(0,Math.min(99,(cart[id]||0)+delta));if(!cart[id])delete cart[id];save('eclipse_navidad_2026_lista',cart);renderCart();updateCount();}
  function openCart(){$('#drawerBackdrop').hidden=false;$('#drawer').classList.add('open');$('#drawer').setAttribute('aria-hidden','false');document.body.style.overflow='hidden';renderCart();$('#closeDrawer').focus();}
  function closeCart(){$('#drawer').classList.remove('open');$('#drawer').setAttribute('aria-hidden','true');$('#drawerBackdrop').hidden=true;document.body.style.overflow='';}
  function detail(id){const p=dataById[id];if(!p)return;$('#productDetails').innerHTML='<div class="detail-inner"><div class="detail-art" style="'+mediaStyle(p)+'"></div><div class="detail-copy"><small>'+sanitize(p.categoryLabel).toUpperCase()+'</small><h2>'+sanitize(p.name)+'</h2><p>'+sanitize(p.desc)+'</p><p>Selecciona la cantidad y cuéntanos qué nombre, imagen o logo te gustaría agregar. Opciones sujetas a confirmación.</p><span class="price-label">Consultar precio</span><a class="btn btn-red" href="'+quoteUrl(productMessage(p))+'" target="_blank" rel="noopener noreferrer">Consultar por WhatsApp ↗</a><button type="button" class="btn btn-outline" style="width:100%;margin-top:9px" data-detail-add="'+p.id+'">+ Agregar a mi lista</button></div></div>';
    const dialog=$('#productDialog');if(dialog.showModal)dialog.showModal();else dialog.setAttribute('open','');}
  function closeDetail(){const d=$('#productDialog');if(d.close)d.close();else d.removeAttribute('open');}
  $$('.cat').forEach(btn=>btn.addEventListener('click',()=>{activeCategory=btn.dataset.cat;$$('.cat').forEach(b=>b.classList.toggle('active',b===btn));render();}));
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
})();