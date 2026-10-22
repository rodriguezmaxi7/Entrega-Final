export function mostrarProductos(listaProductos) {
    const contenedorCatalogo = document.getElementById('contenedor-catalogo');
    if (!contenedorCatalogo) return;

    contenedorCatalogo.innerHTML = '';

    if (listaProductos.length === 0) {
        contenedorCatalogo.innerHTML = `
            <div class="col-span-full text-center py-12 text-zinc-500 text-sm bg-zinc-900/30 rounded-xl border border-zinc-800">
                No se encontraron productos que coincidan con tu búsqueda.
            </div>
        `;
        return;
    }

    listaProductos.forEach(({ id, nombre, precio, imagen, categoria, stock }) => {
        const categoriaTexto = (categoria || 'COMPONENTES').toUpperCase();

        contenedorCatalogo.innerHTML += `
            <article data-id="${id}" class="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-4 flex flex-col justify-between gap-3">
                <div class="w-full h-44 bg-zinc-950/80 rounded-xl flex items-center justify-center p-3 border border-zinc-800/40">
                    <img src="${imagen}" alt="${nombre}" class="max-h-full max-w-full object-contain">
                </div>
                <div class="flex flex-col gap-1 mt-1">
                    <span class="text-[10px] font-bold tracking-wider text-zinc-500 uppercase">${categoriaTexto}</span>
                    <h3 class="text-sm font-semibold text-zinc-200 leading-snug line-clamp-2">${nombre}</h3>
                    <p class="text-base font-bold text-white mt-1">$ ${precio.toLocaleString('es-AR')}</p>
                </div>
                ${stock > 0
                    ? `<button class="btn-agregar w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl py-2 text-xs transition shadow-md shadow-indigo-600/20 mt-1" data-id="${id}">Agregar al carrito</button>`
                    : `<div class="w-full bg-zinc-950 text-red-400/80 text-center font-medium rounded-xl py-2 text-xs border border-red-950/40 mt-1">Sin stock</div>`}
            </article>
        `;
    });
}
