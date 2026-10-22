export function mostrarProductos(listaProductos) {
    const contenedorCatalogo = document.getElementById('contenedor-catalogo');
    if (!contenedorCatalogo) return;

    contenedorCatalogo.innerHTML = '';

    if (listaProductos.length === 0) {
        contenedorCatalogo.innerHTML = `
            <div class="col-span-full text-center py-12 text-zinc-400 text-sm">
                No se encontraron productos que coincidan con tu búsqueda.
            </div>
        `;
        return;
    }

    listaProductos.forEach(({ id, nombre, precio, imagen, stock }) => {
        contenedorCatalogo.innerHTML += `
            <article data-id="${id}" class="bg-zinc-800/60 border border-zinc-700 rounded-xl p-4 flex flex-col gap-2">
                <img src="${imagen}" alt="${nombre}" class="w-full h-40 object-contain">
                <h3 class="text-sm font-medium">${nombre}</h3>
                <p class="text-lg font-bold">$ ${precio.toLocaleString('es-AR')}</p>
                ${stock > 0
                    ? `<button class="btn-agregar bg-indigo-600 hover:bg-indigo-700 rounded-lg py-2 text-sm text-white transition" data-id="${id}">Agregar</button>`
                    : `<p class="text-sm text-red-400 font-medium">Sin stock</p>`}
            </article>
        `;
    });
}
