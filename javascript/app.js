const API_PRODUCTS = "http://10.0.0.153/wp-json/wc/store/v1/products";

document.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-carrinho")) {
        const idProduto = e.target.dataset.id;
        window.addToCart(idProduto);
    }
});

async function carregarProdutos() {
    try {
        const resposta = await fetch(API_PRODUCTS);

        if (!resposta.ok) {
            throw new Error("Erro ao buscar produtos");
        }

        const produtos = await resposta.json();

        const container = document.getElementById("produtos");
        const qtd = document.getElementById("quantidade-produtos");

        if (qtd) {
            qtd.textContent = `Mostrando todos os ${produtos.length} resultados`;
        }

        container.innerHTML = "";

        produtos.forEach(produto => {
            const imagem = produto.images?.[0]?.src || "";
            const preco = (produto.prices.price / 100)
                .toFixed(2)
                .replace(".", ",");

            container.innerHTML += `
                <article class="card">
                    <div class="card-img">
                        <img src="${imagem}" alt="${produto.name}">
                    </div>

                    <h3>${produto.name}</h3>
                    <p class="preco">R$ ${preco}</p>

                    <button class="btn-carrinho" data-id="${produto.id}">
                        Adicionar ao carrinho
                    </button>
                </article>
            `;
        });

    } catch (erro) {
        console.error("Erro produtos:", erro);
    }
}

carregarProdutos();