const url = "http://10.0.0.153/wp-json/wc/store/v1/products";

iniciarAPI();

document.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-carrinho")) {
        const idProduto = e.target.dataset.id;
        adicionarAoCarrinho(idProduto);
    }
});

async function carregarProdutos() {
    try {
        const resposta = await fetch(url);

        if (!resposta.ok) {
            throw new Error("Erro ao buscar produtos");
        }

        const produtos = await resposta.json();

        document.getElementById("quantidade-produtos").textContent =
            `Mostrando todos os ${produtos.length} resultados`;

        const container = document.getElementById("produtos");
        container.innerHTML = "";

        produtos.forEach(produto => {

            const imagem = produto.images.length > 0
                ? produto.images[0].src
                : "";

            const preco = (produto.prices.price / 100).toFixed(2).replace(".", ",");

            container.innerHTML += `
                <article class="card">
                    <div class="card-img">
                    <img src="${imagem}" alt="${produto.name}">
                    </div>
                    <h3>${produto.name}</h3>
                    <p class="preco">R$ ${preco}</p>
                    <button class="btn-carrinho" data-id="${produto.id}">Adicionar ao carrinho</button>
                </article>
            `;
        });

    } catch (erro) {
        console.error(erro);
    }
}

carregarProdutos();