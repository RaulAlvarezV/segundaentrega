
let productos = [
    { id: 1, tipo: "Café Brasil", precio: 4500 },
    { id: 2, tipo: "Café Colombia", precio: 5000 },
    { id: 3, tipo: "Café Perú", precio: 4800 }
];

let clientes = [];

let carritodecompras = [];

const carritostorage = JSON.parse(localStorage.getItem("pedidos")) || [];

// mostrarProductos()


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



// agregarAlCarrito(), mostrarCarrito(), quitarDelCarrito()


const contenedorCarrito = document.getElementById("contenedor_carrito");

if (localStorage.getItem("pedidos">=0)) {
    carritodecompras = JSON.parse(localStorage.getItem("carrito"));
    mostrarCarrito();
}

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



// mostrarClientes(), agregarCliente()


const contenedorClientes = document.getElementById("clientes-list");

function mostrarClientes() {
    contenedorClientes.innerHTML = "";

    clientes.forEach((cliente) => {
        contenedorClientes.innerHTML += `
            <li class="list-group-item">
                <strong>${cliente.id}. ${cliente.nombre}</strong><br>
                Total: $${cliente.total}
            </li>
        `;
    });
}

if (carritostorage.length > 0) {
    clientes = carritostorage;
    mostrarClientes();
}
mostrarClientes();



const formCliente = document.getElementById("form_agregar_cliente");

formCliente.addEventListener("submit", (e) => {
    e.preventDefault();

    if (carritodecompras.length === 0) {
        alert("El carrito está vacío. Agregá productos antes de asignar un cliente.");
        return;
    }

    let nuevoNombre = document.getElementById("cliente_nombre").value.trim();

    if (nuevoNombre === "") {
        alert("Debe ingresar un nombre.");
        return;
    }

    let totalPedido = carritodecompras.reduce((acc, p) => acc + p.precio, 0);

    clientes.push({
        id: clientes.length + 1,
        nombre: nuevoNombre,
        pedidos: [...carritodecompras],
        total: totalPedido
    });

    carritodecompras = [];
    mostrarCarrito();
    mostrarClientes();
    formCliente.reset();

    alert("Cliente agregado con su pedido.");
});


// verOrdenesDePedido()


const contenedorPedidos = document.getElementById("contenedor_pedidos");

function verOrdenesDePedido() {
    contenedorPedidos.innerHTML = "<h2>Órdenes de Pedido</h2>";

    if (clientes.length === 0) {
        contenedorPedidos.innerHTML += "<p>No hay clientes aún.</p>";
        return;
    }

    clientes.forEach((cliente) => {
        contenedorPedidos.innerHTML += `
            <h4>${cliente.nombre} (Total: $${cliente.total})</h4>
        `;

        cliente.pedidos.forEach((p, i) => {
            contenedorPedidos.innerHTML += `
                <p>${i + 1}. ${p.tipo} - $${p.precio}</p>
            `;
        });

        contenedorPedidos.innerHTML += `<hr>`;

    });

    
}



// confirmarPedidos()


function confirmarPedidos() {
    let pedidoconfirm = "FACTURAS GENERADAS:\n\n";

    clientes.forEach(cliente => {
        pedidoconfirm += `Cliente: ${cliente.nombre}\n`;
        cliente.pedidos.forEach(p => {
            pedidoconfirm += ` - ${p.tipo} $${p.precio}\n`;
        });
        pedidoconfirm += `TOTAL FACTURADO: $${cliente.total}\n\n`;
    });

    localStorage.setItem("pedidos", JSON.stringify(clientes));



    alert(pedidoconfirm);
}


// Botones y eventos


document.getElementById("btnQuitarCarrito").addEventListener("click", () => {
    let indice = prompt("Indique el número de producto a quitar:");
    quitarDelCarrito(indice - 1);
});

document.getElementById("contenedor_pedidos").addEventListener("click", verOrdenesDePedido);

document.getElementById("btnSeleccionarCliente").innerText = "Confirmar Pedidos";

document.getElementById("btnSeleccionarCliente").addEventListener("click", confirmarPedidos);

document.getElementById("vaciarcarrito").addEventListener("click", () => {
    localStorage.clear();
    location.reload();
});
