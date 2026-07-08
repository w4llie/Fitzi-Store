const URL_BASE = "http://10.0.0.153/wp-json/wc/v3/products";
const CK = "ck_1bee9d3f1ca8905c34e171a4f379b645211c0a95";
const CS = "cs_f00f72cada131081f6de494a50b670a8b3f2572a";

const API_PRODUCTS = `${URL_BASE}?consumer_key=${CK}&consumer_secret=${CS}`;

let listaProdutos = [];

async function carregarProdutos() {
    const container = document.getElementById("produtos");
    const qtd = document.getElementById("quantidade-produtos");

    try {
        if (container) container.innerHTML = "<p>Carregando produtos...</p>";

        const resposta = await fetch(API_PRODUCTS);

        if (!resposta.ok) {
            throw new Error(`Erro na requisição: ${resposta.status} ${resposta.statusText}`);
        }

        listaProdutos = await resposta.json();

        if (qtd) {
            qtd.textContent = `Mostrando todos os ${listaProdutos.length} resultados`;
        }

        if (container) {
            container.innerHTML = "";
            
            if (listaProdutos.length === 0) {
                container.innerHTML = "<p>Nenhum produto encontrado.</p>";
                return;
            }

            listaProdutos.forEach(produto => {
                const imagem = produto.images && produto.images.length > 0 ? produto.images[0].src : "https://via.placeholder.com/300x180?text=Sem+Imagem"; 
                
                const preco = parseFloat(produto.price || 0)
                    .toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

                container.innerHTML += `
                    <article class="card">
                        <div class="card-img">
                            <img src="${imagem}" alt="${produto.name}">
                        </div>
                        <h3><a href="produto.html?id=${produto.id}" style="text-decoration: none; color: #000; font-weight: bold;"">${produto.name}</a></h3>
                        <p class="preco">${preco}</p>
                        <button class="btn-carrinho" onclick="adicionarAoCarrinho(${produto.id})">
                            Adicionar ao carrinho
                        </button>
                    </article>
                `;
            });
        }

    } catch (erro) {
        console.error("Erro ao carregar produtos:", erro);
        if (container) {
            container.innerHTML = `
                <div style="color: red; padding: 20px; text-align: center;">
                    <p>Erro ao carregar produtos.</p>
                    <small>Verifique se o servidor XAMPP está ligado.</small>
                    <br><br>
                    <button onclick="carregarProdutos()" style="width: auto;">Tentar Novamente</button>
                </div>
            `;
        }
    }
}

function adicionarAoCarrinho(id) {
    const produto = listaProdutos.find(p => p.id === id);
    if (!produto) return;

    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

    const itemExistente = carrinho.find(item => item.id === id);

    if (itemExistente) {
        itemExistente.quantidade += 1;
    } else {
        carrinho.push({
            id: produto.id,
            nome: produto.name,
            preco: parseFloat(produto.price || 0),
            imagem: produto.images?.[0]?.src || "https://via.placeholder.com/100",
            quantidade: 1
        });
    }

    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    
    alert(`${produto.name} foi adicionado ao carrinho!`);
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById("produtos")) {
        carregarProdutos();
    }
});

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./service-worker.js')
            .then(reg => console.log('Service Worker registrado com sucesso'))
            .catch(err => console.error('Falha ao registrar o Service Worker', err));
    });
}
