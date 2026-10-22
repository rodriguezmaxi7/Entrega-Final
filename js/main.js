import { mostrarProductos } from './render.js';
import { 
    agregarAlCarrito, 
    eliminarDelCarrito, 
    vaciarCarrito, 
    obtenerCarrito, 
    inicializarVistaCarrito, 
    sincronizarStockConCarrito,
    cambiarCantidad 
} from './carrito.js';

let todosLosProductos = [];

async function cargarCatalogo() {
    try {
        const response = await fetch('data/productos.json');
        if (!response.ok) {
            throw new Error('Error al cargar el archivo JSON');
        }
        todosLosProductos = await response.json();
        
        sincronizarStockConCarrito(todosLosProductos);
        mostrarProductos(todosLosProductos);
        inicializarVistaCarrito();
        
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'No pudimos cargar los productos',
            text: 'Por favor, inténtalo de nuevo más tarde.'
        });
    } finally {
        console.info("Intento de carga de catálogo finalizado.");
    }
}

function filtrarProductos() {
    const inputBuscar = document.getElementById('input-buscar');
    const selectCategoria = document.getElementById('select-categoria');

    const textoBusqueda = inputBuscar ? inputBuscar.value.toLowerCase().trim() : '';
    const categoriaSeleccionada = selectCategoria ? selectCategoria.value : 'todas';

    const productosFiltrados = todosLosProductos.filter(({ nombre, categoria }) => {
        const coincideNombre = nombre.toLowerCase().includes(textoBusqueda);
        const coincideCategoria = categoriaSeleccionada === 'todas' || categoria === categoriaSeleccionada;

        return coincideNombre && coincideCategoria;
    });

    mostrarProductos(productosFiltrados);
}

function actualizarPantalla() {
    filtrarProductos();
}

async function confirmarVaciadoCarrito() {
    if (obtenerCarrito().length === 0) return;

    const { isConfirmed } = await Swal.fire({
        icon: 'warning',
        title: '¿Vaciar el carrito?',
        text: 'Se van a quitar todos los productos.',
        showCancelButton: true,
        confirmButtonText: 'Sí, vaciar',
        cancelButtonText: 'Cancelar'
    });

    if (isConfirmed) {
        vaciarCarrito(todosLosProductos);
        actualizarPantalla();
    }
}

function iniciarCheckout() {
    const carrito = obtenerCarrito();
    
    if (carrito.length === 0) {
        Swal.fire({
            icon: 'info',
            title: 'El carrito está vacío',
            text: 'Agregá productos antes de proceder al pago.'
        });
        return;
    }

    const seccionCheckout = document.getElementById('section-checkout');
    if (seccionCheckout) {
        seccionCheckout.classList.remove('hidden');
        seccionCheckout.scrollIntoView({ behavior: 'smooth' });
    }
}

async function validarCheckout(event) {
    event.preventDefault();

    const nombre = document.getElementById('checkout-nombre').value.trim();
    const email = document.getElementById('checkout-email').value.trim();
    const direccion = document.getElementById('checkout-direccion').value.trim();

    if (!nombre || !email || !direccion) {
        Swal.fire({
            icon: 'error',
            title: 'Campos incompletos',
            text: 'Por favor, completá todos los datos para continuar.'
        });
        return;
    }

    const carritoActual = obtenerCarrito();
    const totalCompra = carritoActual.reduce((acumulador, item) => acumulador + (item.precio * item.cantidad), 0);

    await Swal.fire({
        icon: 'success',
        title: '¡Compra confirmada!',
        html: `
            <div style="text-align: left; font-size: 14px;">
                <p><b>Cliente:</b> ${nombre}</p>
                <p><b>Email:</b> ${email}</p>
                <p><b>Dirección:</b> ${direccion}</p>
                <hr style="margin: 10px 0;">
                <p><b>Total abonado:</b> $ ${totalCompra.toLocaleString('es-AR')}</p>
                <p style="color: #10b981; margin-top: 8px;">¡Gracias por elegir Quantum Componentes!</p>
            </div>
        `,
        confirmButtonText: 'Aceptar'
    });

    vaciarCarrito(todosLosProductos);
    actualizarPantalla();
    
    const seccionCheckout = document.getElementById('section-checkout');
    if (seccionCheckout) {
        seccionCheckout.classList.add('hidden');
    }
    const formCheckout = document.getElementById('form-checkout');
    if (formCheckout) {
        formCheckout.reset();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const inputBuscar = document.getElementById('input-buscar');
    const selectCategoria = document.getElementById('select-categoria');
    const btnVaciar = document.getElementById('btn-vaciar');
    const btnPagar = document.getElementById('btn-pagar');
    const formCheckout = document.getElementById('form-checkout');

    if (inputBuscar) inputBuscar.addEventListener('input', filtrarProductos);
    if (selectCategoria) selectCategoria.addEventListener('change', filtrarProductos);
    if (btnVaciar) btnVaciar.addEventListener('click', confirmarVaciadoCarrito);
    if (btnPagar) btnPagar.addEventListener('click', iniciarCheckout);
    if (formCheckout) formCheckout.addEventListener('submit', validarCheckout);

    document.addEventListener('click', ({ target }) => {
        const idProducto = Number(target.dataset.id);

        if (target.classList.contains('btn-agregar')) {
            agregarAlCarrito(idProducto, todosLosProductos);
            actualizarPantalla();
        }

        if (target.classList.contains('btn-eliminar')) {
            eliminarDelCarrito(idProducto, todosLosProductos);
            actualizarPantalla();
        }

        if (target.classList.contains('btn-sumar')) {
            cambiarCantidad(idProducto, 1, todosLosProductos);
            actualizarPantalla();
        }

        if (target.classList.contains('btn-restar')) {
            cambiarCantidad(idProducto, -1, todosLosProductos);
            actualizarPantalla();
        }
    });

    cargarCatalogo();
});