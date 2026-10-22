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
        contenedorCarrito.innerHTML = '<p class="text-zinc-500 text-sm">Tu carrito está vacío</p>';
        if (totalCarrito) totalCarrito.innerText = '$ 0';
        return;
    }

    let totalPrecio = 0;

    carrito.forEach((producto) => {
        const subtotal = producto.precio * producto.cantidad;
        totalPrecio += subtotal;

        contenedorCarrito.innerHTML += `
            <div class="flex justify-between items-center bg-zinc-800/40 p-2.5 rounded-lg text-sm border border-zinc-800">
                <div class="flex flex-col">
                    <span class="font-medium">${producto.nombre}</span>
                    <span class="text-xs text-zinc-400">$${producto.precio.toLocaleString('es-AR')} x ${producto.cantidad}</span>
                </div>
                <div class="flex items-center gap-2">
                    <div class="flex items-center bg-zinc-900 rounded border border-zinc-700">
                        <button class="btn-restar px-1.5 py-0.5 text-xs text-zinc-300 hover:text-white" data-id="${producto.id}">-</button>
                        <span class="px-1 text-xs">${producto.cantidad}</span>
                        <button class="btn-sumar px-1.5 py-0.5 text-xs text-zinc-300 hover:text-white" data-id="${producto.id}">+</button>
                    </div>
                    <span class="font-bold text-xs">$${subtotal.toLocaleString('es-AR')}</span>
                    <button class="btn-eliminar text-red-400 hover:text-red-300 text-xs font-bold px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-700" data-id="${producto.id}">✕</button>
                </div>
            </div>
        `;
    });

    if (totalCarrito) totalCarrito.innerText = `$ ${totalPrecio.toLocaleString('es-AR')}`;
}