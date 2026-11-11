# Catálogo Navideño 2026 — versión web

Sitio estático y adaptable a móviles para mostrar el catálogo de 19 artículos distribuidos en cuatro colecciones.

## Contenido
- `index.html` y `styles.css`: sitio y su diseño.
- `app.js`: navegación ampliada y función de compartir.
- `assets/*.webp`: las cinco páginas ilustradas.
- `catalogo-navideno-2026.pdf`: PDF descargable.
- `GENERAR-QR.html`: generador que convierte el enlace definitivo en QR descargable.
- `vercel.json`: configuración para Vercel.

## Publicación
1. Crear un repositorio vacío, público y nuevo en GitHub con el nombre `catalogo-navidad-2026` bajo la cuenta `waldjos`.
2. Subir **el contenido de esta carpeta** a la raíz del repositorio, conservando nombres y carpeta `assets`.
3. En Vercel, importar el repositorio nuevo. El proyecto es estático: Framework Preset: `Other`, Root Directory: `./`, Build Command: vacío y Output Directory: vacío.
4. Seleccionar `Production` y desplegar. Verificar que se carguen las imágenes y que funcione el botón "Descargar PDF".
5. Abrir `GENERAR-QR.html`, pegar la URL definitiva proporcionada por Vercel y pulsar «Crear QR».

Este paquete no representa un despliegue publicado hasta que Vercel confirme una URL en estado Ready.

## Aviso sobre las fotografías
Las imágenes son representaciones ilustrativas de diseño y no fotografías verificadas de stock o inventario físico. Es necesario confirmar los modelos y acabados antes de cotizar.