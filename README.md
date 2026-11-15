# Eclipse · Catálogo Navideño 2026

Tienda visual para solicitar cotizaciones por WhatsApp, sin precios numéricos ni pasarela de pagos.

## Funciones

- **27 referencias** en categorías, con fotografías reales e imágenes ilustrativas identificadas.
- Fichas compartibles en `/producto/<id>/`, cada una con título, imagen, descripción, cantidad, nota y consulta por WhatsApp.
- Mi lista: el comprador selecciona productos, cambia cantidades e indica personalización.
- Resumen visual en `/consulta/?p=<id>:<cantidad>,...` con fotografías que se abren en cualquier dispositivo. Las notas opcionales se incluyen en el parámetro `n`.
- WhatsApp recibe la lista y el enlace al resumen visual. El enlace `wa.me` **no adjunta imágenes automáticamente como archivos**.
- El perfil de Instagram es [@somoseclipse.ve](https://www.instagram.com/somoseclipse.ve/) y el teléfono de cotización es **0424-2573387**.

## Archivo central

`catalog-data.js` define todas las referencias con identificador, categoría, imagen, tipo de imagen y descripción. El listado principal, las páginas de producto y el resumen consultan esos mismos datos.

## Despliegue

Proyecto estático HTML/CSS/JS en la rama `main`, repositorio `waldjos/Cat-logo-navidad-`. Configuración `vercel.json` con rutas limpias y barra final para servir correctamente las fichas bajo directorios. No requiere dependencias.

## Avisos

La URL del resumen puede verla cualquier persona que la reciba, por lo que no debe incluir datos sensibles. No se almacenan pedidos en servidores; la selección está en el navegador y se transfiere mediante enlace y texto a WhatsApp. Confirmar precios, inventario, acabados y tiempos de producción directamente con Eclipse. Las fotografías reales provienen de las imágenes aportadas por el cliente; otras son ilustraciones referenciales.



## Ampliación de catálogo — noviembre 2026

Colecciones visuales: Tazas y mugs, Vasos y termos, Ropa navideña, Empaques y regalos, Adornos, Corporativos y Accesorios. Los destacados funcionan como filtro independiente. Nuevas tazas, franelas infantiles, franelas con lazos, bolsos tipo tula; actualizadas franelas Grinch, hoodie blanco y saquitos rojos. Cada producto con imagen editorial y fotografía original alternables cuando están disponibles.

El video de personalización con estampados de cascanueces se presenta en la sección «Así creamos tus detalles» mediante un reproductor HTML5 nativo. Formato H.264 MP4 comprimido y portada WebP.

## Publicación sin Firebase — 15 de noviembre de 2026

El catálogo no carga Firebase, no solicita cuentas y no escribe en servicios remotos. `/admin/` muestra un aviso sin formularios ni SDK. Los archivos de reglas y configuración vacía se conservan como referencia; no se modificó ningún servicio remoto ni se relajaron reglas de acceso. Para actualizar productos, editar `catalog-data.js`, las fichas estáticas correspondientes y las imágenes, y publicar por GitHub/Vercel.

Se retiraron las referencias de vaso térmico, mate y vaso vinero; se corrigieron las fotografías de bolígrafos, vasos con tapa de bambú y banderines, y se añadió la taza con base de corcho y se corrigió la ficha de la taza de vidrio glaseado Grinch.
