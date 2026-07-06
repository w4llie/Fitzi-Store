const URL_BASE_DETALHES = "http://10.0.0.153/wp-json/wc/v3/products";
const CK_DETALHES = "ck_1bee9d3f1ca8905c34e171a4f379b645211c0a95"; 
const CS_DETALHES = "cs_f00f72cada131081f6de494a50b670a8b3f2572a";

async function carregarDetalhesProduto() {
    const urlParams = new URLSearchParams(window.location.search);
    const produtoId = urlParams.get('id');
    const container = document.getElementById("detalhe-produto");

    if (!produtoId) {
        container.innerHTML = "<p>Produto não encontrado.</p>";
        return;
    }

    try {
        container.innerHTML = "<p>Carregando detalhes...</p>";

        const resposta = await fetch(`${URL_BASE_DETALHES}/${produtoId}?consumer_key=${CK_DETALHES}&consumer_secret=${CS_DETALHES}`);

        if (!resposta.ok) throw new Error("Erro ao buscar detalhes do produto");

        const produto = await resposta.json();

        const imagem = produto.images?.[0]?.src || "https://via.placeholder.com/600x400";
        const preco = parseFloat(produto.price || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

        container.innerHTML = `
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-top: 30px;">
                <div>
                    <img src="${imagem}" alt="${produto.name}" style="width: 100%; border-radius: 8px;">
                </div>
                <div>
                    <h1>${produto.name}</h1>
                    <p style="font-size: 24px; font-weight: bold; margin: 20px 0;">${preco}</p>
                    <div style="margin-bottom: 30px; line-height: 1.6;">
                        ${produto.description || "Sem descrição disponível."}
                    </div>
                    <button class="btn-finalizar" onclick="adicionarAoCarrinhoDetalhes(${JSON.stringify(produto).replace(/"/g, '&quot;')})" style="width: 250px;">
                        Adicionar ao Carrinho
                    </button>
                    <br><br>
                    <a href="index.html" style="color: #666; text-decoration: none;">← Voltar para a loja</a>
                </div>
            </div>
        `;

    } catch (erro) {
        console.error(erro);
        container.innerHTML = "<p>Erro ao carregar o produto. Verifique sua conexão.</p>";
    }
}

function adicionarAoCarrinhoDetalhes(produto) {
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    const itemExistente = carrinho.find(item => item.id === produto.id);

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
    alert(`${produto.name} adicionado ao carrinho!`);
}

document.addEventListener('DOMContentLoaded', carregarDetalhesProduto);
