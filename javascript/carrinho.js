const API = "http://10.0.0.153/wp-json/wc/store/v1";

async function carregarCarrinho() {

    const cartToken = localStorage.getItem("cartToken");

    const resposta = await fetch(`${API}/cart`, {

        credentials: "include",

        headers: cartToken ? {
            "Cart-Token": cartToken
        } : {}

    });

    const carrinho = await resposta.json();

    console.log(carrinho);

    const lista = document.getElementById("lista-carrinho");

    lista.innerHTML = "";

    if (!carrinho.items || carrinho.items.length === 0) {

        lista.innerHTML = "<p>Carrinho vazio.</p>";

        return;

    }

    carrinho.items.forEach(item => {

        const imagem =
            item.images.length
                ? item.images[0].src
                : "";

        const preco =
            (item.prices.price / 100)
            .toFixed(2)
            .replace(".", ",");

        lista.innerHTML += `

        <div class="item">

            <img src="${imagem}" width="100">

            <h3>${item.name}</h3>

            <p>Quantidade: ${item.quantity}</p>

            <p>R$ ${preco}</p>

        </div>

        <hr>

        `;

    });

}

carregarCarrinho();