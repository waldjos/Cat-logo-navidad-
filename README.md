# Eclipse · Catálogo Navideño 2026

Tienda visual para solicitar cotizaciones por WhatsApp, sin precios numéricos ni pasarela de pagos.

## Funciones

- **23 referencias** en categorías; 10 con fotografías reales y las demás con imágenes ilustrativas identificadas.
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

