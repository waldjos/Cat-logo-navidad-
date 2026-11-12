# Eclipse · Catálogo Navideño 2026

Micrositio responsive tipo e-commerce para **Eclipse**. Sin precios publicados: cada ficha muestra **«Consultar precio»**.

## Funcionalidades

- 21 productos agrupados en destacados, corporativos, adornos, accesorios y colección navideña.
- Buscador, filtros, favoritos y lista de cotización con cantidades.
- Botones de WhatsApp enlazados al teléfono **+58 424-2573387**.
- Mensaje de cotización con productos, cantidades y observaciones.
- Instagram: [@somoseclipse.ve](https://www.instagram.com/somoseclipse.ve/).
- Logotipo Eclipse redibujado en una versión navideña en `assets/eclipse-navidad.svg`.
- Diseño en tonos crema, borgoña, rojo y dorado, sin pasarela de pago.

## Fotografías

El sitio funciona con recortes visuales de las páginas existentes `assets/*.webp` como ilustraciones referenciales mientras se incorporan fotografías originales de cada referencia. El logotipo SVG es una versión estilizada del original. Las fotografías que compartió la clienta pueden reemplazar estas ilustraciones sin cambiar la estructura.

## Despliegue

El sitio es estático: `index.html`, `styles.css`, `app.js`, `assets/`. No requiere instalación de dependencias ni compilación.

Importa `waldjos/Cat-logo-navidad-` desde **Vercel → Add New → Project**. Configuración: Framework Other, directorio raíz. En la conexión automatizada disponible, crear proyectos nuevos ha generado HTTP 403; la actualización en GitHub no confirma por sí sola un despliegue de Vercel.

## Notas de operación

El botón «Agregar a mi lista» no ejecuta compras. La lista es temporal y permanece en el navegador; se comunica por WhatsApp a Eclipse para confirmar precios y disponibilidad. No se incluyen importes ni promesas de inventario.
