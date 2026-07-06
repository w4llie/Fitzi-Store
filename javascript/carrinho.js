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
            <div class="item-carrinho" style="display: flex; align-items: center; justify-content: space-between; padding: 15px; border-bottom: 1px solid #eee;">
                <img src="${item.imagem}" alt="${item.nome}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px;">
                <div style="flex-grow: 1; margin-left: 15px;">
                    <h4 style="margin: 0; font-size: 16px;">${item.nome}</h4>
                    <p style="margin: 5px 0; color: #666;">R$ ${item.preco.toFixed(2).replace('.', ',')} cada</p>
                </div>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <button onclick="alterarQuantidade(${index}, -1)" style="width: 30px; height: 30px; padding: 0; display: flex; align-items: center; justify-content: center;">-</button>
                    <span style="min-width: 20px; text-align: center;">${item.quantidade}</span>
                    <button onclick="alterarQuantidade(${index}, 1)" style="width: 30px; height: 30px; padding: 0; display: flex; align-items: center; justify-content: center;">+</button>
                    <button onclick="removerItem(${index})" style="background: #ff4444; width: auto; padding: 5px 10px; margin-left: 10px; font-size: 12px;">Remover</button>
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
