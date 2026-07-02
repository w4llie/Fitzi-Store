await fetch(`${API_BASE}/cart`, {
  credentials: "include"
});

const API_BASE = "http://10.0.0.153/wp-json/wc/store/v1";

let cart = [];

async function getCart() {
    try {
        const res = await fetch(`${API_BASE}/cart`, {
            credentials: "include",
        });

        if (!res.ok) throw new Error("Erro ao buscar carrinho");

        const data = await res.json();

        cart = data.items || [];
        renderCart();

        return cart;

    } catch (err) {
        console.error("Erro carrinho:", err);
    }
}

async function addToCart(productId, quantity = 1) {
    try {
        const res = await fetch(`${API_BASE}/cart/add-item`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id: productId,
                quantity: quantity,
            }),
        });

        if (!res.ok) throw new Error("Erro ao adicionar");

        const data = await res.json();

        console.log("✔ Adicionado:", data);

        await getCart();

        return data;

    } catch (err) {
        console.error("Erro add:", err);
    }
}

async function updateQuantity(key, quantity) {
    try {
        if (quantity <= 0) return removeItem(key);

        const res = await fetch(`${API_BASE}/cart/update-item`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                key,
                quantity,
            }),
        });

        if (!res.ok) throw new Error("Erro update");

        await res.json();

        await getCart();

    } catch (err) {
        console.error("Erro update:", err);
    }
}

async function removeItem(key) {
    try {
        const res = await fetch(`${API_BASE}/cart/remove-item`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ key }),
        });

        if (!res.ok) throw new Error("Erro remove");

        await res.json();

        await getCart();

    } catch (err) {
        console.error("Erro remove:", err);
    }
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
            <h4>${item.name}</h4>

            <p>Qtd: ${item.quantity}</p>

            <button onclick="window.updateCartQty('${item.key}', ${item.quantity - 1})">-</button>

            <button onclick="window.updateCartQty('${item.key}', ${item.quantity + 1})">+</button>

            <button onclick="window.removeFromCart('${item.key}')">Remover</button>
        </div>
    `).join("");
}

window.addToCart = addToCart;
window.updateCartQty = updateQuantity;
window.removeFromCart = removeItem;

getCart();