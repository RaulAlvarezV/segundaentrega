// ---------------------------
// ARRAYS PRINCIPALES
// ---------------------------

let productos = [
    { id: 1, tipo: "Café Brasil", precio: 4500 },
    { id: 2, tipo: "Café Colombia", precio: 5000 },
    { id: 3, tipo: "Café Perú", precio: 4800 }
];

let clientes = [
    { id: 1, nombre: "Juan Perez", pedidos: [] },
    { id: 2, nombre: "Ana Martinez", pedidos: [] },
];

let carritodecompras = [];


// ---------------------------
// MOSTRAR PRODUCTOS EN CARDS
// ---------------------------

const contenedorProductos = document.getElementById("contenedor_productos");

function mostrarProductos() {
    contenedorProductos.innerHTML = "";
    productos.forEach((producto) => {
        contenedorProductos.innerHTML += `
            <div class="card">
                <h3>${producto.tipo}</h3>
                <p>Precio: $${producto.precio}</p>
                <button class="btn" onclick="agregarAlCarrito(${producto.id})">Agregar al carrito</button>
            </div>
        `;
    });
}
mostrarProductos();


// ---------------------------
// CARRITO
// ---------------------------

const contenedorCarrito = document.getElementById("contenedor_carrito");

function agregarAlCarrito(idProducto) {
    let producto = productos.find(p => p.id === idProducto);
    carritodecompras.push(producto);
    mostrarCarrito();
}

function mostrarCarrito() {
    contenedorCarrito.innerHTML = "<h2>Carrito</h2>";

    carritodecompras.forEach((prod, index) => {
        contenedorCarrito.innerHTML += `<p>${index + 1}. ${prod.tipo} - $${prod.precio}</p>`;
    });

    let total = carritodecompras.reduce((acc, item) => acc + item.precio, 0);
    contenedorCarrito.innerHTML += `<h3>Total: $${total}</h3>`;
}

function quitarDelCarrito(indice) {
    carritodecompras.splice(indice, 1);
    mostrarCarrito();
}


// ---------------------------
// LISTADO CLIENTES
// ---------------------------

const contenedorClientes = document.getElementById("listado_clientes");

function mostrarClientes() {
    contenedorClientes.innerHTML = "<h2>Clientes</h2>";

    clientes.forEach((cliente, index) => {
        contenedorClientes.innerHTML += `
            <p>${cliente.id}. ${cliente.nombre}</p>
        `;
    });
}
mostrarClientes();


// ---------------------------
// FORM PARA AGREGAR CLIENTES
// ---------------------------

const formCliente = document.getElementById("form_agregar_cliente");

formCliente.addEventListener("submit", (e) => {
    e.preventDefault();

    let nuevoNombre = document.getElementById("cliente_nombre").value;

    let nuevoCliente = {
        id: clientes.length + 1,
        nombre: nuevoNombre,
        pedidos: []
    };

    clientes.push(nuevoCliente);
    mostrarClientes();
    formCliente.reset();
});


// ---------------------------
// SELECCIONAR CLIENTE (PROMPT)
// ---------------------------

function seleccionarCliente() {
    let lista = clientes.map(c => `${c.id}. ${c.nombre}`).join("\n");

    let clienteSeleccionado = prompt(
        "Ingrese el número del cliente:\n\n" + lista
    );

    let cliente = clientes.find(c => c.id == clienteSeleccionado);

    if (!cliente) {
        alert("Número inválido.");
        return null;
    }

    return cliente;
}


// ---------------------------
// AGREGAR PEDIDO A CLIENTE
// ---------------------------

function agregarPedidoACliente() {
    const cliente = seleccionarCliente();
    if (!cliente) return;

    const listaProductos = productos.map(p => `${p.id}. ${p.tipo}`).join("\n");
    const productoElegido = prompt("Seleccione el producto:\n\n" + listaProductos);

    let producto = productos.find(p => p.id == productoElegido);
    if (!producto) return alert("Producto inválido");

    cliente.pedidos.push({ producto: producto.tipo, precio: producto.precio });

    alert(`Pedido agregado a ${cliente.nombre}`);
}


// ---------------------------
// MOSTRAR PEDIDOS DEL CLIENTE
// ---------------------------

const contenedorPedidos = document.getElementById("contenedor_pedidos");

function actualizarContenedorPedidos() {
    const cliente = seleccionarCliente();
    if (!cliente) return;

    contenedorPedidos.innerHTML = `<h2>Órdenes de Pedido de ${cliente.nombre}</h2>`;

    cliente.pedidos.forEach((pedido, index) => {
        contenedorPedidos.innerHTML += `
            <p>${index + 1}. ${pedido.producto} - $${pedido.precio}</p>
        `;
    });
}


// ---------------------------
// EVENTOS DE LOS BOTONES
// ---------------------------

document.getElementById("btnSeleccionarCliente").addEventListener("click", () => {
    const cliente = seleccionarCliente();
    if (cliente) alert("Cliente seleccionado: " + cliente.nombre);
});

document.getElementById("btnQuitarCarrito").addEventListener("click", () => {
    const indice = prompt("Ingrese el número del producto a quitar:");
    quitarDelCarrito(indice - 1);
});

document.getElementById("btnMostrarPedidos").addEventListener("click", () => {
    actualizarContenedorPedidos();
});

document.getElementById("btnAgregarPedido").addEventListener("click", () => {
    agregarPedidoACliente();
});
