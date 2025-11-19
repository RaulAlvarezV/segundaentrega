let conteinerProductos = document.getElementById("products_container");

const clientes = [
    {id: 1, nombre: "Juan Perez", cuit: "30-12345678-9", telefono: "1234567890"},
    {id: 2, nombre: "Carlos Gomez", cuit: "30-23456789-0", telefono: "2345678901"},
    {id: 3, nombre: "Rosa Lopez", cuit: "30-34567890-1", telefono: "3456789012"},
    {id: 4, nombre: "Tomas Rodriguez", cuit: "30-45678901-2", telefono: "4567890123"},
    {id: 5, nombre: "Gabriel Fernandez", cuit: "30-56789012-3", telefono: "5678901234"}
];

const productoscafe = [
    {id: 1,tipo: "Molido Suave", precio: 1000, caracteristica: "Suave y cremoso", imagen: "☕", pedido: []},
    {id: 2,tipo: "Molido Medio", precio: 1250, caracteristica: "Equilibrio entre suavidad y intensidad", imagen: "🍵", pedido: []},
    {id: 3,tipo: "Molido Intenso", precio: 1500, caracteristica: "Intenso y fuerte", imagen: "⚡️", pedido: []},
    {id: 4,tipo: "Clásico Brasilero", precio: 800, caracteristica: "Sabor tradicional y equilibrado", imagen: "🔥", pedido: []},
    {id: 5,tipo: "Café Medio", precio: 1000, caracteristica: "Sabor medio y versátil", imagen: "🍴", pedido: []},
    {id: 6,tipo: "Café Premium", precio: 1500, caracteristica: "Sabor intenso y de alta calidad", imagen: "👑", pedido: []}
];

const carritodecompras = [];

const contenedordeproductos = document.getElementById("products_container");

productoscafe.forEach((producto) => {
   let cardProducto = document.createElement("article");
   cardProducto.classList.add("producto-card");
   
   cardProducto.innerHTML = `
      <h2>${producto.tipo}</h2>
      <p>$${producto.precio}</p>
      <p>${producto.caracteristica}</p>
      <p>${producto.imagen}</p>
      <button id="agregarpedido${producto.id}">Agregar al carrito</button>

   `;

   contenedordeproductos.appendChild(cardProducto);
    
   const botonAgregarAlCarrito = document.getElementById(`agregarpedido${producto.id}`);

    botonAgregarAlCarrito.addEventListener("click", () => {
        alert(`${producto.tipo} agregado al pedido.`);
        
        carritodecompras.push({producto: producto.tipo, precio: producto.precio});
        console.log(carritodecompras);
        seleccionarCliente().pedidos.push({ producto: producto.tipo, precio: producto.precio });
        actualizarContenedorPedidos();
        mostrarCarrito();
    });

});
function actualizarContenedorPedidos() {
    const contenedorPedidos = document.getElementById("contenedor_pedidos");
    contenedorPedidos.innerHTML = "<h2>Órdenes de Pedido</h2>";
    seleccionarCliente().pedidos.forEach((pedido, index) => {
        contenedorPedidos.innerHTML += `<p>${index + 1}. ${pedido.producto} - $${pedido.precio}</p>`;
    });
}
function mostrarCarrito() {
    const contenedorCarrito = document.getElementById("contenedor_carrito");
    contenedorCarrito.innerHTML = "<h2>Carrito de Compras</h2>";
    carritodecompras.forEach((item, index) => {
        contenedorCarrito.innerHTML += `<p>${index + 1}. ${item.producto} - $${item.precio}</p>`;
    });
    let total = carritodecompras.reduce((acc, item) => acc + item.precio, 0);
    contenedorCarrito.innerHTML += `<h3>Total: $${total}</h3>`;
}

function seleccionarCliente() {
    let clienteSeleccionado = prompt("Ingrese el número del cliente:\n${clientes}\n1. Cliente 1\n2. Cliente 2\n3. Cliente 3\n4. Cliente 4\n5. Cliente 5");
    let cliente = clientes.find(c => c.id == clienteSeleccionado);
    return cliente;
}


// function quitarDelCarrito(indice) { 
//     carritodecompras.splice(indice, 1);
//     mostrarCarrito();
// }

// const botonquitardelcarrito = document.getElementById("quitarcarrito");
// botonquitardelcarrito.addEventListener("click", () => {
//     const indice = prompt("Ingrese el número del producto a quitar del carrito:");
//     quitarDelCarrito(indice - 1);
// });