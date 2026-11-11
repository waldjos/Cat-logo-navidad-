const catalogPages=[
  {src:'/assets/portada.webp',title:'Portada'},
  {src:'/assets/corporativos.webp',title:'Regalos corporativos'},
  {src:'/assets/adornos.webp',title:'Adornos navideños'},
  {src:'/assets/accesorios.webp',title:'Accesorios y empaques'},
  {src:'/assets/coleccion.webp',title:'Colección navideña'}
];
let current=0, lastFocused=null;
const lb=document.getElementById('lightbox');
const lbi=document.getElementById('lightboxImg');
const cap=document.getElementById('lightboxCaption');
function openPage(index){
  if(!lb.classList.contains('open'))lastFocused=document.activeElement;
  current=(index+catalogPages.length)%catalogPages.length;
  const p=catalogPages[current];lbi.src=p.src;lbi.alt=p.title;
  cap.textContent=`${current+1} / ${catalogPages.length} · ${p.title}`;
  lb.classList.add('open');document.body.style.overflow='hidden';
  document.getElementById('lightboxClose').focus();
}
function closePage(){lb.classList.remove('open');document.body.style.overflow='';lbi.src='';lastFocused?.focus()}
for(const el of document.querySelectorAll('.zoomPage')){
  el.addEventListener('click',()=>{const index=catalogPages.findIndex(p=>p.src===el.dataset.src);if(index>=0)openPage(index)})
}
document.getElementById('lightboxClose').addEventListener('click',closePage);
document.getElementById('lightboxPrev').addEventListener('click',()=>openPage(current-1));
document.getElementById('lightboxNext').addEventListener('click',()=>openPage(current+1));
lb.addEventListener('click',e=>{if(e.target===lb)closePage()});
document.addEventListener('keydown',e=>{if(!lb.classList.contains('open'))return;
  if(e.key==='Escape')closePage();if(e.key==='ArrowLeft')openPage(current-1);if(e.key==='ArrowRight')openPage(current+1)});
const cover=document.querySelector('.coverImg');
if(cover){cover.style.cursor='zoom-in';cover.tabIndex=0;cover.setAttribute('role','button');cover.setAttribute('aria-label','Ampliar portada');cover.addEventListener('click',()=>openPage(0));cover.addEventListener('keydown',e=>{if(e.key==='Enter')openPage(0)})}
async function share(){
 const data={title:'Catálogo Navideño 2026',text:'Descubre regalos corporativos y productos personalizados para esta Navidad.',url:window.location.href.split('#')[0]};
 if(navigator.share){try{await navigator.share(data);return}catch(e){if(e.name==='AbortError')return}}
 try{await navigator.clipboard.writeText(data.url);document.querySelectorAll('[data-share]').forEach(x=>{x.textContent='✓ Enlace copiado';setTimeout(()=>x.textContent='↗ Compartir catálogo',2300)})}catch(e){window.prompt('Copia el enlace del catálogo:',data.url)}
}
document.querySelectorAll('[data-share]').forEach(x=>x.addEventListener('click',share));