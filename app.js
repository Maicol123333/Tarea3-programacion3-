const STORAGE_KEY = 'inventario_productos';

const productForm = document.getElementById('product-form');
const nombreInput = document.getElementById('nombre');
const categoriaInput = document.getElementById('categoria');
const precioInput = document.getElementById('precio');
const cantidadInput = document.getElementById('cantidad');
const searchInput = document.getElementById('search-input') || document.querySelector('.search-bar');
const productsTbody = document.getElementById('products-tbody');
const alertBox = document.getElementById('alert-box');
const submitBtn = document.getElementById('submit-btn') || productForm.querySelector('button[type="submit"]');
const cancelBtn = document.getElementById('cancel-btn') || productForm.querySelector('.btn-secondary');

let editingProductId = null;

function obtenerProductos() {
  const datos = localStorage.getItem(STORAGE_KEY);
  return datos ? JSON.parse(datos) : [];
}

function guardarProductos(productos) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(productos));
}

function mostrarAlerta(mensaje, tipo = 'success') {
  alertBox.textContent = mensaje;
  alertBox.className = `alert alert-${tipo}`;
  setTimeout(() => {
    alertBox.classList.add('hidden');
  }, 3000);
}

function renderizarTabla(filtro = '') {
  const productos = obtenerProductos();
  const termino = filtro.trim().toLowerCase();

  const productosFiltrados = termino
    ? productos.filter(
        (prod) =>
          prod.nombre.toLowerCase().includes(termino) ||
          prod.categoria.toLowerCase().includes(termino)
      )
    : productos;

  productsTbody.innerHTML = '';

  if (productosFiltrados.length === 0) {
    const mensajeVacio = termino
      ? 'No se encontraron productos que coincidan con la búsqueda.'
      : 'No hay productos registrados en el inventario.';

    productsTbody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align: center; color: #64748b;">
          ${mensajeVacio}
        </td>
      </tr>
    `;
    return;
  }

  productosFiltrados.forEach((prod) => {
    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td>${prod.nombre}</td>
      <td>${prod.categoria}</td>
      <td>RD$ ${Number(prod.precio).toFixed(2)}</td>
      <td>${prod.cantidad}</td>
      <td>
        <button type="button" class="btn-edit" data-id="${prod.id}">Editar</button>
        <button type="button" class="btn-delete" data-id="${prod.id}">Eliminar</button>
      </td>
    `;
    productsTbody.appendChild(fila);
  });
}

function iniciarEdicion(id) {
  const productos = obtenerProductos();
  const producto = productos.find((prod) => prod.id === id);
  if (!producto) return;

  editingProductId = producto.id;
  nombreInput.value = producto.nombre;
  categoriaInput.value = producto.categoria;
  precioInput.value = producto.precio;
  cantidadInput.value = producto.cantidad;

  if (submitBtn) submitBtn.textContent = 'Actualizar Producto';
  if (cancelBtn) cancelBtn.classList.remove('hidden');
  nombreInput.focus();
}

function cancelarEdicion() {
  editingProductId = null;
  productForm.reset();
  if (submitBtn) submitBtn.textContent = 'Guardar Producto';
  if (cancelBtn) cancelBtn.classList.add('hidden');
}

function eliminarProducto(id) {
  const productos = obtenerProductos().filter((prod) => prod.id !== id);
  guardarProductos(productos);

  if (editingProductId === id) {
    cancelarEdicion();
  }

  const filtroActual = searchInput ? searchInput.value : '';
  renderizarTabla(filtroActual);
  mostrarAlerta('Producto eliminado correctamente.', 'success');
}

productForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const datosProducto = {
    nombre: nombreInput.value.trim(),
    categoria: categoriaInput.value.trim(),
    precio: parseFloat(precioInput.value),
    cantidad: parseInt(cantidadInput.value, 10)
  };

  const productos = obtenerProductos();
  const filtroActual = searchInput ? searchInput.value : '';

  if (editingProductId) {
    const index = productos.findIndex((prod) => prod.id === editingProductId);
    if (index !== -1) {
      productos[index] = { id: editingProductId, ...datosProducto };
      guardarProductos(productos);
    }
    cancelarEdicion();
    renderizarTabla(filtroActual);
    mostrarAlerta('Producto actualizado correctamente.', 'success');
    return;
  }

  productos.push({
    id: Date.now().toString(),
    ...datosProducto
  });

  guardarProductos(productos);
  productForm.reset();
  renderizarTabla(filtroActual);
  mostrarAlerta('Producto registrado correctamente.', 'success');
});

productsTbody.addEventListener('click', (e) => {
  const id = e.target.dataset.id;
  if (!id) return;

  if (e.target.classList.contains('btn-edit')) {
    iniciarEdicion(id);
  } else if (e.target.classList.contains('btn-delete')) {
    eliminarProducto(id);
  }
});

if (cancelBtn) {
  cancelBtn.addEventListener('click', cancelarEdicion);
}

if (searchInput) {
  searchInput.addEventListener('input', (e) => {
    renderizarTabla(e.target.value);
  });
}

document.addEventListener('DOMContentLoaded', () => renderizarTabla());