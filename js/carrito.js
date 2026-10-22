let carrito = [];
try {
    carrito = JSON.parse(localStorage.getItem('carritoStock')) || [];
} catch (error) {
    console.error("Error al leer el localStorage, reiniciando carrito:", error);
    localStorage.removeItem('carritoStock');
    carrito = [];
}

function persistirCarrito() {
    if (carrito.length === 0) {
        localStorage.removeItem('carritoStock');
    } else {
        localStorage.setItem('carritoStock', JSON.stringify(carrito));
    }
}

export function agregarAlCarrito(idProducto, catalogoProductos) {
    const productoEnCatalogo = catalogoProductos.find((producto) => producto.id === idProducto);
    if (!productoEnCatalogo || productoEnCatalogo.stock <= 0) return;

    const productoEnCarrito = carrito.find((item) => item.id === idProducto);

    if (productoEnCarrito) {
        productoEnCarrito.cantidad++;
    } else {
        carrito.push({
            id: productoEnCatalogo.id,
            nombre: productoEnCatalogo.nombre,
            precio: productoEnCatalogo.precio,
            cantidad: 1
        });
    }

    productoEnCatalogo.stock--;
    sincronizarYActualizar();
}

export function cambiarCantidad(idProducto, delta, catalogoProductos) {
    const indiceCarrito = carrito.findIndex((item) => item.id === idProducto);
    if (indiceCarrito === -1) return;

    const productoEnCarrito = carrito[indiceCarrito];
    const productoEnCatalogo = catalogoProductos.find((producto) => producto.id === idProducto);

    if (delta > 0) {
        if (productoEnCatalogo && productoEnCatalogo.stock > 0) {
            productoEnCarrito.cantidad++;
            productoEnCatalogo.stock--;
        }
    } else if (delta < 0) {
        productoEnCarrito.cantidad--;
        if (productoEnCatalogo) {
            productoEnCatalogo.stock++;
        }
        if (productoEnCarrito.cantidad <= 0) {
            carrito.splice(indiceCarrito, 1);
        }
    }

    sincronizarYActualizar();
}

export function eliminarDelCarrito(idProducto, catalogoProductos) {
    const indice = carrito.findIndex((item) => item.id === idProducto);
    if (indice === -1) return;

    const productoEnCarrito = carrito[indice];
    const productoEnCatalogo = catalogoProductos.find((producto) => producto.id === idProducto);

    if (productoEnCatalogo) {
        productoEnCatalogo.stock += productoEnCarrito.cantidad;
    }

    carrito.splice(indice, 1);
    sincronizarYActualizar();
}

export function vaciarCarrito(catalogoProductos) {
    carrito.forEach((itemCarrito) => {
        const productoEnCatalogo = catalogoProductos.find((producto) => producto.id === itemCarrito.id);
        if (productoEnCatalogo) {
            productoEnCatalogo.stock += itemCarrito.cantidad;
        }
    });

    carrito = [];
    localStorage.clear();
    actualizarVistaCarrito();
}

function sincronizarYActualizar() {
    persistirCarrito();
    actualizarVistaCarrito();
}

export function obtenerCarrito() {
    return carrito;
}

export function sincronizarStockConCarrito(catalogoProductos) {
    carrito.forEach((itemCarrito) => {
        const productoEnCatalogo = catalogoProductos.find((producto) => producto.id === itemCarrito.id);
        if (productoEnCatalogo) {
            productoEnCatalogo.stock -= itemCarrito.cantidad;
        }
    });
    actualizarVistaCarrito();
}

export function inicializarVistaCarrito() {
    actualizarVistaCarrito();
}

function actualizarVistaCarrito() {
    const contenedorCarrito = document.getElementById('contenedor-carrito');
    const totalCarrito = document.getElementById('total-carrito');

    if (!contenedorCarrito) return;

    contenedorCarrito.innerHTML = '';

    if (carrito.length === 0) {
        contenedorCarrito.innerHTML = `
            <div class="text-center py-8 text-zinc-500 text-xs">
                🛒 Tu carrito está vacío
            </div>
        `;
        if (totalCarrito) totalCarrito.innerText = '$ 0';
        return;
    }

    let totalPrecio = 0;

    carrito.forEach((producto) => {
        const subtotal = producto.precio * producto.cantidad;
        totalPrecio += subtotal;

        contenedorCarrito.innerHTML += `
            <div class="flex justify-between items-center bg-zinc-950/60 p-3 rounded-xl text-xs border border-zinc-800/60 gap-2">
                <div class="flex flex-col gap-0.5 overflow-hidden">
                    <span class="font-medium text-zinc-200 truncate">${producto.nombre}</span>
                    <span class="text-[11px] text-zinc-400">$${producto.precio.toLocaleString('es-AR')} c/u</span>
                </div>
                <div class="flex items-center gap-3 shrink-0">
                    <div class="flex items-center bg-zinc-900 rounded-lg border border-zinc-700 overflow-hidden">
                        <button class="btn-restar px-2 py-1 text-zinc-400 hover:text-white hover:bg-zinc-800 transition" data-id="${producto.id}">-</button>
                        <span class="px-2 font-semibold text-zinc-200">${producto.cantidad}</span>
                        <button class="btn-sumar px-2 py-1 text-zinc-400 hover:text-white hover:bg-zinc-800 transition" data-id="${producto.id}">+</button>
                    </div>
                    <span class="font-bold text-indigo-300 w-16 text-right">$${subtotal.toLocaleString('es-AR')}</span>
                    <button class="btn-eliminar text-zinc-500 hover:text-red-400 p-1 transition" data-id="${producto.id}" title="Eliminar producto">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
            </div>
        `;
    });

    if (totalCarrito) totalCarrito.innerText = `$ ${totalPrecio.toLocaleString('es-AR')}`;
}