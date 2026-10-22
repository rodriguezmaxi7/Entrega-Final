# Quantum Componentes

Simulador de tienda online desarrollado en JavaScript vainilla como proyecto final para el curso. La aplicación simula el circuito completo de compra de un e-commerce de hardware y periféricos gaming.

## Tecnologías utilizadas
- **HTML5 y Tailwind CSS** (vía CDN) para la maquetación y diseño visual.
- **JavaScript (ES6 Modules):** Organización del código en módulos (`main.js`, `render.js`, `carrito.js`).
- **Fetch API & Asincronismo:** Carga de productos desde un archivo JSON local usando `async/await`, `try/catch` y `finally`.
- **LocalStorage:** Persistencia completa del carrito (`setItem`, `getItem`, `removeItem` y `clear`) con manejo de errores.
- **SweetAlert2:** Librería externa para alertas, modales de confirmación y emisión del ticket de compra.

## Funcionalidades principales
- **Catálogo y Filtros:** Búsqueda en tiempo real por texto y filtrado por categorías usando funciones de orden superior (`filter`, `find`, `reduce`).
- **Gestión de Stock:** El stock de los productos se actualiza dinámicamente al agregarlos, modificarlos o eliminarlos del carrito.
- **Carrito interactivo:** Permite sumar o restar cantidades de a uno, borrar ítems individuales o vaciar el carrito por completo devolviendo el stock al catálogo.
- **Checkout:** Validación de datos del comprador y generación de un resumen de compra final con el total calculado.

## Estructura del proyecto
```text
/
├── assets/
│   ├── css/
│   │   └── styles.css
│   └── logo.png
├── data/
│   └── productos.json
├── js/
│   ├── carrito.js
│   ├── main.js
│   └── render.js
├── index.html
└── README.md