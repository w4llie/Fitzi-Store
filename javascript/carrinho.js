const API_BASE = "http://10.0.0.153/wp-json/pwa/v1";

let cart = [];

async function getCart() {
    const res = await fetch(`${API_BASE}/cart/get`, {
        credentials: "include"
    });

    const data = await res.json();

    cart = data.items || [];
    renderCart();
}

async function addToCart(productId, quantity = 1) {
    const res = await fetch(`${API_BASE}/cart/add`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            id: productId,
            quantity
        })
    });

    const data = await res.json();

    console.log("Adicionado:", data);

    await getCart();
}

function renderCart() {
    const container = document.getElementById("cart");

    if (!container) return;

    if (!cart.length) {
        container.innerHTML = "<p>Carrinho vazio</p>";
        return;
    }

    container.innerHTML = cart.map(item => `
        <div class="cart-item">
            <h4>${item.data?.name || "Produto"}</h4>
            <p>Qtd: ${item.quantity}</p>
        </div>
    `).join("");
}

window.addToCart = addToCart;

getCart();