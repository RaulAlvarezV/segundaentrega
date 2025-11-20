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


const contenedorProductos = document.getElementById("contenedordeproductos");

function mostrarProductos() {
    contenedorProductos.innerHTML = "";
    productos.forEach((producto) => {
        contenedorProductos.innerHTML += `
            <div class="card p-3 m-2">
                <h3>${producto.tipo}</h3>
                <p>Precio: $${producto.precio}</p>
                <button class="btn btn-primary" onclick="agregarAlCarrito(${producto.id})">Agregar al carrito</button>
            </div>
        `;
    });
}
mostrarProductos();


const contenedorCarrito = document.getElementById("contenedor_carrito");

function agregarAlCarrito(idProducto) {
    let producto = productos.find(p => p.id === idProducto);
    carritodecompras.push(producto);
    mostrarCarrito();
}

function mostrarCarrito() {
    contenedorCarrito.innerHTML = "";

    carritodecompras.forEach((prod, index) => {
        contenedorCarrito.innerHTML += `<p>${index + 1}. ${prod.tipo} - $${prod.precio}</p>`;
    });

    let total = carritodecompras.reduce((acc, item) => acc + item.precio, 0);
    contenedorCarrito.innerHTML += `<h3>Total: $${total}</h3>`;
}

function quitarDelCarrito(indice) {
    if (indice >= 0 && indice < carritodecompras.length) {
        carritodecompras.splice(indice, 1);
        mostrarCarrito();
    }
}


const contenedorClientes = document.getElementById("clientes-list");

function mostrarClientes() {
    contenedorClientes.innerHTML = "";

    clientes.forEach((cliente) => {
        contenedorClientes.innerHTML += `
            <li class="list-group-item">${cliente.id}. ${cliente.nombre}</li>
        `;
    });
}
mostrarClientes();


const formCliente = document.getElementById("form_agregar_cliente");

formCliente.addEventListener("submit", (e) => {
    e.preventDefault();

    let nuevoNombre = document.getElementById("cliente_nombre").value;

    clientes.push({
        id: clientes.length + 1,
        nombre: nuevoNombre,
        
        pedidos: []
    });

    mostrarClientes();
    formCliente.reset();
});

function seleccionarCliente() {
    let lista = clientes.map(c => `${c.id}. ${c.nombre}`).join("\n");
    let seleccion = prompt("Seleccione cliente:\n" + lista);

    let cliente = clientes.find(c => c.id == seleccion);

    if (!cliente) {
        alert("Cliente inválido");
        return null;
    }

    
    carritodecompras.forEach(productos => {
        cliente.pedidos.push({
            producto: productos.tipo,
            precio: productos.precio
        });
    });

    
    carritodecompras = [];
    mostrarCarrito();

    alert(`Se agregaron ${cliente.pedidos.length} pedidos al cliente ${cliente.nombre}`);

    return cliente;
}


const contenedorPedidos = document.getElementById("contenedor_pedidos");

function actualizarContenedorPedidos() {
    let cliente = seleccionarCliente();
    if (!cliente) return;

    contenedorPedidos.innerHTML = `<h2>Pedidos de ${cliente.nombre}</h2>`;

    cliente.pedidos.forEach((p, i) => {
        contenedorPedidos.innerHTML += `<p>${i + 1}. ${p.producto} - $${p.precio}</p>`;
    });
}

document.getElementById("btnSeleccionarCliente").addEventListener("click", seleccionarCliente);
document.getElementById("btnQuitarCarrito").addEventListener("click", () => {
    let indice = prompt("Producto a quitar:");
    quitarDelCarrito(indice - 1);
});
document.getElementById("btnMostrarPedidos").addEventListener("click", actualizarContenedorPedidos);

