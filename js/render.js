export function mostrarProductos(listaProductos) {
    const contenedorCatalogo = document.getElementById('contenedor-catalogo');
    if (!contenedorCatalogo) return;

    contenedorCatalogo.innerHTML = '';

    if (listaProductos.length === 0) {
        contenedorCatalogo.innerHTML = `
            <div class="col-span-full text-center py-16 text-zinc-500 text-sm bg-zinc-900/30 rounded-xl border border-zinc-800/80">
                🔍 No se encontraron productos que coincidan con tu búsqueda.
            </div>
        `;
        return;
    }

    listaProductos.forEach(({ id, nombre, precio, imagen, stock }) => {
        contenedorCatalogo.innerHTML += `
            <article data-id="${id}" class="bg-zinc-900/80 border border-zinc-800/80 rounded-2xl p-4 flex flex-col justify-between gap-3 shadow-lg">
                <div class="w-full h-44 bg-zinc-950/50 rounded-xl p-2 flex items-center justify-center overflow-hidden">
                    <img src="${imagen}" alt="${nombre}" class="w-full h-full object-contain hover:scale-105 transition-transform duration-300">
                </div>
                <div class="flex flex-col gap-1">
                    <h3 class="text-sm font-semibold text-zinc-200 line-clamp-2">${nombre}</h3>
                    <p class="text-lg font-bold text-indigo-400">$ ${precio.toLocaleString('es-AR')}</p>
                </div>
                ${stock > 0
                    ? `<button class="btn-agregar w-full bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-medium rounded-xl py-2.5 text-xs tracking-wide shadow-md shadow-indigo-600/20" data-id="${id}">Agregar al carrito</button>`
                    : `<div class="w-full bg-zinc-950 text-red-400/90 text-center font-medium rounded-xl py-2 text-xs border border-red-950/50">Sin stock disponible</div>`}
            </article>
        `;
    });
}
