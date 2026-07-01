const API = "http://10.0.0.153/wp-json/wc/store/v1";

let cartToken = localStorage.getItem("cartToken") || null;

async function iniciarAPI() {

    const resposta = await fetch(`${API}/cart`, {
        credentials: "include",
        headers: cartToken ? {
            "Cart-Token": cartToken
        } : {}
    });

    const novoToken = resposta.headers.get("Cart-Token");

    if (novoToken) {
        cartToken = novoToken;
        localStorage.setItem("cartToken", novoToken);
    }

}

async function adicionarAoCarrinho(idProduto) {

    if (!cartToken) {
        await iniciarAPI();
    }

    const resposta = await fetch(`${API}/cart/add-item`, {

        method: "POST",

        credentials: "include",

        headers: {
            "Content-Type": "application/json",
            "Cart-Token": cartToken
        },

        body: JSON.stringify({
            id: Number(idProduto),
            quantity: 1
        })

    });

    if (!resposta.ok) {

        console.error(await resposta.text());
        return;

    }

    const novoToken = resposta.headers.get("Cart-Token");

    if (novoToken) {
        cartToken = novoToken;
        localStorage.setItem("cartToken", novoToken);
    }

    const carrinho = await resposta.json();

    console.log(carrinho);

    alert("Produto adicionado ao carrinho!");

}