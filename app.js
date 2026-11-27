const STORAGE_KEY = 'inventario_productos';

const productForm = document.getElementById('product-form');
const nombreInput = document.getElementById('nombre');
const categoriaInput = document.getElementById('categoria');
const precioInput = document.getElementById('precio');
const cantidadInput = document.getElementById('cantidad');
const productsTbody = document.getElementById('products-tbody');
const alertBox = document.getElementById('alert-box');

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

function renderizarTabla() {
  const productos = obtenerProductos();
  productsTbody.innerHTML = '';

  if (productos.length === 0) {
    productsTbody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align: center; color: #64748b;">
          No hay productos registrados en el inventario.
        </td>
      </tr>
    `;
    return;
  }

  productos.forEach((prod) => {
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

productForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const nuevoProducto = {
    id: Date.now().toString(),
    nombre: nombreInput.value.trim(),
    categoria: categoriaInput.value.trim(),
    precio: parseFloat(precioInput.value),
    cantidad: parseInt(cantidadInput.value, 10)
  };

  const productos = obtenerProductos();
  productos.push(nuevoProducto);
  guardarProductos(productos);

  productForm.reset();
  renderizarTabla();
  mostrarAlerta('Producto registrado correctamente.', 'success');
});

document.addEventListener('DOMContentLoaded', renderizarTabla);