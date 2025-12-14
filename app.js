
let productos = [];

let clientes = [];

let carritodecompras = [];

const contenedorProductos = document.getElementById("contenedordeproductos");
const contenedorCarrito = document.getElementById("contenedor_carrito");
const contenedorClientes = document.getElementById("clientes-list");
const pedidosDisplay = document.getElementById("pedidos_display");


async function cargarProductos() {
    try {
        const res = await fetch("products.json");
        if (!res.ok) throw new Error("No se pudo cargar products.json");
        productos = await res.json();
        mostrarProductos();
    } catch (err) {
        Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudieron cargar los productos.' });
    }
}

function mostrarProductos() {
    contenedorProductos.innerHTML = "";
    productos.forEach((producto) => {
        const card = document.createElement('div');
        card.className = 'card p-3 m-2';
        card.innerHTML = `
            <h3>${producto.tipo}</h3>
            <p>Precio: $${producto.precio}</p>
            <button class="btn btn-primary add-to-cart" data-id="${producto.id}">Agregar al carrito</button>
        `;
        contenedorProductos.appendChild(card);
    });

   
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.getAttribute('data-id'), 10);
            agregarAlCarrito(id);
        });
    });
}
// Carrito de compras
function guardarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(carritodecompras));
}

function cargarCarrito() {
    const saved = JSON.parse(localStorage.getItem('carrito')) || [];
    carritodecompras = saved;
    mostrarCarrito();
}

function agregarAlCarrito(idProducto) {
    const producto = productos.find(p => p.id === idProducto);
    if (!producto) return;
    carritodecompras.push(producto);
    guardarCarrito();
    mostrarCarrito();
    Swal.fire({ icon: 'success', title: 'Agregado', text: `${producto.tipo} agregado al carrito.` });
}

function mostrarCarrito() {
    contenedorCarrito.innerHTML = '';

    if (carritodecompras.length === 0) {
        contenedorCarrito.innerHTML = '<p>El carrito está vacío.</p>';
        return;
    }

    const list = document.createElement('div');
    carritodecompras.forEach((prod, index) => {
        const item = document.createElement('div');
        item.className = 'd-flex justify-content-between align-items-center mb-2';
        item.innerHTML = `
            <div>${index + 1}. ${prod.tipo} - $${prod.precio}</div>
            <div><button class="btn btn-sm btn-danger remove-item" data-index="${index}">Quitar</button></div>
        `;
        list.appendChild(item);
    });

    const total = carritodecompras.reduce((acc, item) => acc + item.precio, 0);
    const totalEl = document.createElement('h3');
    totalEl.textContent = `Total: $${total}`;

    contenedorCarrito.appendChild(list);
    contenedorCarrito.appendChild(totalEl);

    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', () => {
            const idx = parseInt(btn.getAttribute('data-index'), 10);
            quitarDelCarrito(idx);
        });
    });
}

function quitarDelCarrito(indice) {
    if (indice >= 0 && indice < carritodecompras.length) {
        const removed = carritodecompras.splice(indice, 1)[0];
        guardarCarrito();
        mostrarCarrito();
        Swal.fire({ icon: 'info', title: 'Eliminado', text: `${removed.tipo} eliminado del carrito.` });
    }
}

// Clientes
function mostrarClientes() {
    contenedorClientes.innerHTML = '';
    if (clientes.length === 0) return;
    clientes.forEach((cliente) => {
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.innerHTML = `
            <div class="d-flex justify-content-between align-items-center">
                <div><strong>${cliente.id}. ${cliente.nombre}</strong><br>Total: $${cliente.total}</div>
                <div>
                    <button class="btn btn-sm btn-success pay-order" data-id="${cliente.id}">Pagar</button>
                </div>
            </div>
        `;
        contenedorClientes.appendChild(li);
    });

    
    document.querySelectorAll('.pay-order').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.getAttribute('data-id'), 10);
            pagarPedido(id);
        });
    });
}

function cargarClientes() {
    clientes = JSON.parse(localStorage.getItem('pedidos')) || [];
    mostrarClientes();
}

const formCliente = document.getElementById('form_agregar_cliente');
formCliente.addEventListener('submit', (e) => {
    e.preventDefault();

    if (carritodecompras.length === 0) {
        Swal.fire({ icon: 'warning', title: 'Carrito vacío', text: 'Agregá productos antes de asignar un cliente.' });
        return;
    }

    const nuevoNombre = document.getElementById('cliente_nombre').value.trim();
    if (nuevoNombre === '') {
        Swal.fire({ icon: 'warning', title: 'Nombre requerido', text: 'Debe ingresar un nombre.' });
        return;
    }

    const totalPedido = carritodecompras.reduce((acc, p) => acc + p.precio, 0);
    clientes.push({ id: clientes.length + 1, nombre: nuevoNombre, pedidos: [...carritodecompras], total: totalPedido });

    localStorage.setItem('pedidos', JSON.stringify(clientes));

    carritodecompras = [];
    guardarCarrito();
    mostrarCarrito();
    mostrarClientes();
    formCliente.reset();

    Swal.fire({ icon: 'success', title: 'Cliente agregado', text: 'Cliente agregado con su pedido.' });
});

// Ver órdenes
function verOrdenesDePedido() {
    pedidosDisplay.innerHTML = '';
    if (clientes.length === 0) {
        pedidosDisplay.innerHTML = '<p>No hay clientes aún.</p>';
        return;
    }

    clientes.forEach((cliente) => {
        const cont = document.createElement('div');
        cont.className = 'mb-3';
        const title = document.createElement('h4');
        title.textContent = `${cliente.nombre} (Total: $${cliente.total})`;
        cont.appendChild(title);

        const payBtn = document.createElement('button');
        payBtn.className = 'btn btn-sm btn-success mb-2';
        payBtn.textContent = 'Pagar';
        payBtn.setAttribute('data-id', cliente.id);
        payBtn.addEventListener('click', () => pagarPedido(cliente.id));
        cont.appendChild(payBtn);

        cliente.pedidos.forEach((p, i) => {
            const pEl = document.createElement('p');
            pEl.textContent = `${i + 1}. ${p.tipo} - $${p.precio}`;
            cont.appendChild(pEl);
        });

        cont.appendChild(document.createElement('hr'));
        pedidosDisplay.appendChild(cont);
    });
}

function pagarPedido(clienteId) {
    const idx = clientes.findIndex(c => c.id === clienteId);
    if (idx === -1) return;

    
    const [pago] = clientes.splice(idx, 1);

    
    carritodecompras = [];
    guardarCarrito();
    localStorage.setItem('pedidos', JSON.stringify(clientes));

    mostrarCarrito();
    mostrarClientes();
    verOrdenesDePedido();

    Swal.fire({ icon: 'success', title: 'Pedido pagado con éxito!', text: 'Gracias por tu compra!' });
}

// Confirmar pedidos (genera factura)
function confirmarPedidos() {
    if (clientes.length === 0) {
        Swal.fire({ icon: 'info', title: 'Sin facturas', text: 'No hay pedidos para confirmar.' });
        return;
    }

    let pedidoconfirm = 'FACTURAS GENERADAS:\n\n';
    clientes.forEach(cliente => {
        pedidoconfirm += `Cliente: ${cliente.nombre}\n`;
        cliente.pedidos.forEach(p => { pedidoconfirm += ` - ${p.tipo} $${p.precio}\n`; });
        pedidoconfirm += `TOTAL FACTURADO: $${cliente.total}\n\n`;
    });

    localStorage.setItem('pedidos', JSON.stringify(clientes));

    Swal.fire({ title: 'Facturas', text: pedidoconfirm, icon: 'success', width: 600 });
}


document.getElementById('btnSeleccionarCliente').innerText = 'Confirmar Pedidos';
document.getElementById('btnSeleccionarCliente').addEventListener('click', confirmarPedidos);

document.getElementById('btnVerPedidos').addEventListener('click', verOrdenesDePedido);

document.getElementById('vaciarcarrito').addEventListener('click', () => {
    Swal.fire({ title: 'Vaciar carrito', text: '¿Desea vaciar el carrito y los pedidos?', icon: 'warning', showCancelButton: true }).then(result => {
        if (result.isConfirmed) {
            localStorage.removeItem('carrito');
            localStorage.removeItem('pedidos');
            carritodecompras = [];
            clientes = [];
            mostrarCarrito();
            mostrarClientes();
            pedidosDisplay.innerHTML = '';
            Swal.fire({ icon: 'success', title: 'Eliminado', text: 'Carrito y pedidos eliminados.' }).then(() => location.reload());
        }
    });
});

// Inicialización
cargarProductos();
cargarCarrito();
cargarClientes();
