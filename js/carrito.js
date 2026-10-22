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
                Tu carrito está vacío
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
            <div class="bg-zinc-950/80 p-3 rounded-xl border border-zinc-800/80 flex flex-col gap-2">
                <div class="flex justify-between items-start gap-2">
                    <span class="font-semibold text-xs text-zinc-200 line-clamp-1">${producto.nombre}</span>
                </div>
                <div class="flex items-center justify-between mt-1">
                    <span class="text-[11px] text-zinc-400">$${producto.precio.toLocaleString('es-AR')} c/u</span>
                    <div class="flex items-center gap-3">
                        <div class="flex items-center bg-zinc-900 border border-zinc-800 rounded-lg px-1 py-0.5">
                            <button class="btn-restar px-2 py-0.5 text-zinc-400 hover:text-white text-xs" data-id="${producto.id}">-</button>
                            <span class="px-1.5 text-xs font-semibold text-zinc-200">${producto.cantidad}</span>
                            <button class="btn-sumar px-2 py-0.5 text-zinc-400 hover:text-white text-xs" data-id="${producto.id}">+</button>
                        </div>
                        <span class="font-bold text-xs text-white">$${subtotal.toLocaleString('es-AR')}</span>
                        <button class="btn-eliminar text-zinc-500 hover:text-red-400 text-xs ml-1" data-id="${producto.id}" title="Eliminar">🗑️</button>
                    </div>
                </div>
            </div>
        `;
    });

    if (totalCarrito) totalCarrito.innerText = `$ ${totalPrecio.toLocaleString('es-AR')}`;
}