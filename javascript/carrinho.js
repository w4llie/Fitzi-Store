function exibirCarrinho() {
    const container = document.getElementById("itens-carrinho");
    const totalElemento = document.getElementById("total-carrinho");
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

    if (!container) return;

    if (carrinho.length === 0) {
        container.innerHTML = "<p style='text-align:center; padding: 20px;'>Seu carrinho está vazio.</p>";
        if (totalElemento) totalElemento.textContent = "R$ 0,00";
        return;
    }

    container.innerHTML = "";
    let total = 0;

    carrinho.forEach((item, index) => {
        const subtotal = item.preco * item.quantidade;
        total += subtotal;

        container.innerHTML += `
            <div class="item-carrinho">
                <img src="${item.imagem}" alt="${item.nome}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px;">
                <div class="item-detalhes">
                    <h4>${item.nome}</h4>
                    <p>R$ ${item.preco.toFixed(2).replace('.', ',')} cada</p>
                </div>
                <div class="item-acoes">
                    <div class="qtd-controles">
                        <button class="btn-qtd" onclick="alterarQuantidade(${index}, -1)">-</button>
                        <span class="qtd-numero">${item.quantidade}</span>
                        <button class="btn-qtd" onclick="alterarQuantidade(${index}, 1)">+</button>
                    </div>
                        <button class="btn remover" onclick="removerItem(${index})">Remover</button>
                </div>
            </div>
        `;
    });

    if (totalElemento) {
        totalElemento.textContent = total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }
}

function alterarQuantidade(index, delta) {
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    carrinho[index].quantidade += delta;

    if (carrinho[index].quantidade <= 0) {
        carrinho.splice(index, 1);
    }

    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    exibirCarrinho();
}

function removerItem(index) {
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    carrinho.splice(index, 1);
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    exibirCarrinho();
}

function finalizarCompra() {
    window.location.href = "finalizar_compra.html";
}

document.addEventListener('DOMContentLoaded', exibirCarrinho);
