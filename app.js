(function () {
  'use strict';
  const PHONE = '584242573387';
  let products = window.ECLIPSE_PRODUCTS;
  const links = window.ECLIPSE_LINKS;
  const $ = (selector, root=document) => root.querySelector(selector);
  const $$ = (selector, root=document) => Array.from(root.querySelectorAll(selector));
  let dataById = Object.fromEntries(products.map(product=>[product.id,product]));
  function safeStorageGet(key,fallback) { try { const v=JSON.parse(localStorage.getItem(key)); return v===null?fallback:v; } catch(e) {return fallback;} }
  function save(key,obj) { try { localStorage.setItem(key,JSON.stringify(obj)); } catch(e) {} }
  let cart = safeStorageGet('eclipse_navidad_2026_lista', {});
  if (!cart || typeof cart !== 'object' || Array.isArray(cart)) cart = {};
  for (const id of Object.keys(cart)) {
    const qty = Number(cart[id]);
    if (!dataById[id] || !Number.isFinite(qty) || qty < 1) delete cart[id];
    else cart[id] = Math.min(99, Math.floor(qty));
  }
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
  const galleryIndex = Object.create(null);
  function currentImage(p) {
    const gallery=Array.isArray(p.gallery) && p.gallery.length>0 ? p.gallery : [p.image];
    const index=(galleryIndex[p.id]||0)%gallery.length;
    return gallery[index];
  }
  function mediaStyle(p) {
    const photo=currentImage(p);
    return '--img:url("'+photo+'");--pos:'+(p.pos||'center')+';--size:'+(p.imageType==='referencial' && !photo.endsWith('.svg')?'210% auto':'cover');
  }
  function render() {
    const normalize=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('es');
    const q=normalize(searchValue.trim());
    const visible=products.filter(p=>(activeCategory==='todos'||(activeCategory==='destacados'?p.featured===true:p.category===activeCategory))&&normalize(p.name+' '+p.desc+' '+p.categoryLabel).includes(q));
    $('#emptyState').hidden=visible.length!==0;
    grid.innerHTML=visible.map(p=>{
      const fav=favorites.includes(p.id);
      const gallery=Array.isArray(p.gallery) ? p.gallery : [];
      const idx=(galleryIndex[p.id]||0) % (gallery.length||1);
      const photoControls=gallery.length>1
        ? '<div class="product-photo-controls" role="group" aria-label="Fotos de '+sanitize(p.name)+'"><button type="button" data-photo-id="'+p.id+'" data-photo-step="-1" aria-label="Imagen anterior">‹</button><span aria-live="polite">'+(idx+1)+'/'+gallery.length+'</span><button type="button" data-photo-id="'+p.id+'" data-photo-step="1" aria-label="Siguiente imagen">›</button></div>'
        : '';
      return '<article class="product"><div class="product-figure"><button type="button" class="heart" aria-label="'+(fav?'Quitar de favoritos':'Guardar favorito')+'" aria-pressed="'+fav+'" data-favorite="'+p.id+'">'+(fav?'♥':'♡')+'</button><span class="product-badge">'+sanitize(p.tag)+'</span><a class="product-figure-link" href="'+links.product(p.id)+'" aria-label="Ver imagen y detalles de '+sanitize(p.name)+'"><div class="product-pic" style="'+mediaStyle(p)+'"></div></a><span class="source-label">'+(p.imageType==='editorial'?'Imagen ambientada':p.imageType==='real'?'Foto real':'Imagen referencial')+'</span>'+photoControls+'</div><div class="product-body"><span class="product-category">'+sanitize(label(p))+'</span><h3 class="product-title"><a href="'+links.product(p.id)+'">'+sanitize(p.name)+'</a></h3><p class="product-text">'+sanitize(p.desc)+'</p><span class="price-label">Consultar precio</span><div class="product-actions"><button class="btn btn-red" type="button" data-add="'+p.id+'">Agregar a mi lista +</button><button class="details-btn" type="button" title="Ver detalles" aria-label="Ver detalles de '+sanitize(p.name)+'" data-detail="'+p.id+'">↗</button></div></div></article>';
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
  function selectCategory(cat){
    const allowed=new Set(['todos','destacados',...products.map(p=>p.category)]);
    activeCategory=allowed.has(cat)?cat:'todos';
    $$('.cat').forEach(b=>{
      const active=b.dataset.cat===activeCategory;
      b.classList.toggle('active',active);
      b.setAttribute('aria-pressed',String(active));
    });
    render();
  }
  // Delegación: funciona aunque las tarjetas se reconstruyan o el navegador móvil
  // gestione el toque sobre la imagen/texto interno de cada colección.
  document.addEventListener('click',e=>{
    const tile=e.target.closest('.category-tile[data-select-cat]');
    if(tile){
      e.preventDefault();
      searchValue='';
      $('#searchInput').value='';
      selectCategory(tile.dataset.selectCat);
      const catalog=$('#catalogo');
      if(catalog){
        if(location.hash!=='#catalogo') history.replaceState(null,'','#catalogo');
        catalog.scrollIntoView({behavior:'smooth',block:'start'});
      }
      return;
    }
    const chip=e.target.closest('.cat[data-cat]');
    if(chip){e.preventDefault();selectCategory(chip.dataset.cat);}
  });
  $('#searchInput').addEventListener('input',e=>{searchValue=e.target.value;render();});
  $('#searchToggle').addEventListener('click',()=>{document.location.hash='catalogo';$('#searchInput').focus();});
  $('#menuToggle').addEventListener('click',()=>{const nav=$('#navLinks');const opened=nav.classList.toggle('open');$('#menuToggle').setAttribute('aria-expanded',String(opened));});
  $$('#navLinks a').forEach(a=>a.addEventListener('click',()=>$('#navLinks').classList.remove('open')));
  grid.addEventListener('click',e=>{
    const rotate=e.target.closest('[data-photo-step]');
    if(rotate){
      const p=dataById[rotate.dataset.photoId];
      if(p && Array.isArray(p.gallery) && p.gallery.length>1){
        galleryIndex[p.id]=((galleryIndex[p.id]||0)+Number(rotate.dataset.photoStep)+p.gallery.length)%p.gallery.length;
        const selector='[data-photo-id="'+p.id+'"][data-photo-step="'+rotate.dataset.photoStep+'"]';
        render();
        const control=grid.querySelector(selector);
        if(control)control.focus({preventScroll:true});
      }
      return;
    }
    const add=e.target.closest('[data-add]');if(add){addItem(add.dataset.add);return;}
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
  // En teléfonos, ocultar el botón flotante mientras el escaparate esté visible:
  // los botones de cada producto ya ofrecen la consulta sin tapar fotografías.
  if (typeof IntersectionObserver !== 'undefined' && typeof window.matchMedia === 'function') {
    const whatsapp = $('#floatingWhatsApp');
    const phoneView = window.matchMedia('(max-width: 760px)');
    let catalogInView = false;
    function syncWhatsApp() {
      const hide = phoneView.matches && catalogInView;
      whatsapp.classList.toggle('floating-wa--catalog-visible', hide);
      whatsapp.setAttribute('aria-hidden', String(hide));
      whatsapp.tabIndex = hide ? -1 : 0;
    }
    const observer = new IntersectionObserver(entries => {
      catalogInView = entries[0]?.isIntersecting || false;
      syncWhatsApp();
    }, { threshold: 0 });
    observer.observe(grid);
    if (phoneView.addEventListener) phoneView.addEventListener('change', syncWhatsApp);
  }
  selectCategory('todos');updateCount();renderCart();
  if(new URLSearchParams(location.search).get('lista')==='1') openCart();
})();