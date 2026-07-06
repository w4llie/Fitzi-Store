const ESTADOS_BR = [
    { sigla: "AC", nome: "Acre" }, { sigla: "AL", nome: "Alagoas" }, { sigla: "AP", nome: "Amapá" },
    { sigla: "AM", nome: "Amazonas" }, { sigla: "BA", nome: "Bahia" }, { sigla: "CE", nome: "Ceará" },
    { sigla: "DF", nome: "Distrito Federal" }, { sigla: "ES", nome: "Espírito Santo" }, { sigla: "GO", nome: "Goiás" },
    { sigla: "MA", nome: "Maranhão" }, { sigla: "MT", nome: "Mato Grosso" }, { sigla: "MS", nome: "Mato Grosso do Sul" },
    { sigla: "MG", nome: "Minas Gerais" }, { sigla: "PA", nome: "Pará" }, { sigla: "PB", nome: "Paraíba" },
    { sigla: "PR", nome: "Paraná" }, { sigla: "PE", nome: "Pernambuco" }, { sigla: "PI", nome: "Piauí" },
    { sigla: "RJ", nome: "Rio de Janeiro" }, { sigla: "RN", nome: "Rio Grande do Norte" }, { sigla: "RS", nome: "Rio Grande do Sul" },
    { sigla: "RO", nome: "Rondônia" }, { sigla: "RR", nome: "Roraima" }, { sigla: "SC", nome: "Santa Catarina" },
    { sigla: "SP", nome: "São Paulo" }, { sigla: "SE", nome: "Sergipe" }, { sigla: "TO", nome: "Tocantins" }
];

function inicializarCheckout() {
    const estadoSelect = document.getElementById("estado");
    const billingEstadoSelect = document.getElementById("billing_estado");
    
    ESTADOS_BR.forEach(estado => {
        const opt = document.createElement("option");
        opt.value = estado.sigla;
        opt.textContent = estado.nome;
        estadoSelect.appendChild(opt);
        
        const optBilling = opt.cloneNode(true);
        billingEstadoSelect.appendChild(optBilling);
    });

    document.getElementById("trigger-apto").addEventListener("click", function() {
        document.getElementById("group-apto").classList.toggle("hidden");
        this.classList.add("hidden");
    });

    document.getElementById("trigger-nota").addEventListener("change", function() {
        document.getElementById("group-nota").classList.toggle("hidden", !this.checked);
    });

    document.getElementById("mesmo-endereco").addEventListener("change", function() {
        document.getElementById("sessao-cobranca").classList.toggle("hidden", this.checked);
        const inputs = document.querySelectorAll("#sessao-cobranca input, #sessao-cobranca select");
        inputs.forEach(input => input.required = !this.checked);
    });

    carregarResumo();
}

function carregarResumo() {
    const container = document.getElementById("checkout-itens");
    const subtotalEl = document.getElementById("subtotal-val");
    const totalEl = document.getElementById("total-val");
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

    if (carrinho.length === 0) {
        container.innerHTML = "<p>Carrinho vazio.</p>";
        return;
    }

    container.innerHTML = "";
    let subtotal = 0;

    carrinho.forEach(item => {
        subtotal += item.preco * item.quantidade;
        container.innerHTML += `
            <div class="item-resumo">
                <img src="${item.imagem}" alt="${item.nome}">
                <div class="item-badge">${item.quantidade}</div>
                <div class="item-info">
                    <h4>${item.nome}</h4>
                    <p>R$ ${item.preco.toFixed(2).replace('.', ',')}</p>
                </div>
                <div style="font-weight: 500; font-size: 14px;">
                    R$ ${(item.preco * item.quantidade).toFixed(2).replace('.', ',')}
                </div>
            </div>
        `;
    });

    const taxa = 10.00;
    const total = subtotal + taxa;

    subtotalEl.textContent = subtotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    totalEl.textContent = total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

async function finalizarPedido(e) {
    e.preventDefault();
    
    const btn = document.getElementById("btn-submit");
    btn.disabled = true;
    btn.textContent = "Processando...";

    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    if (carrinho.length === 0) {
        alert("Seu carrinho está vazio!");
        btn.disabled = false;
        return;
    }

    const mesmoEndereco = document.getElementById("mesmo-endereco").checked;

    const dadosPedido = {
        payment_method: "cod",
        payment_method_title: "Pagamento na entrega",
        set_paid: false,
        billing: {
            first_name: mesmoEndereco ? document.getElementById("nome").value : document.getElementById("billing_nome").value,
            last_name: mesmoEndereco ? document.getElementById("sobrenome").value : document.getElementById("billing_sobrenome").value,
            address_1: mesmoEndereco ? document.getElementById("endereco").value : document.getElementById("billing_endereco").value,
            address_2: mesmoEndereco ? document.getElementById("apartamento").value : "",
            city: mesmoEndereco ? document.getElementById("cidade").value : document.getElementById("billing_cidade").value,
            state: mesmoEndereco ? document.getElementById("estado").value : document.getElementById("billing_estado").value,
            postcode: mesmoEndereco ? document.getElementById("cep").value : document.getElementById("billing_cep").value,
            country: "BR",
            email: document.getElementById("email").value,
            phone: document.getElementById("telefone").value
        },
        shipping: {
            first_name: document.getElementById("nome").value,
            last_name: document.getElementById("sobrenome").value,
            address_1: document.getElementById("endereco").value,
            address_2: document.getElementById("apartamento").value,
            city: document.getElementById("cidade").value,
            state: document.getElementById("estado").value,
            postcode: document.getElementById("cep").value,
            country: "BR"
        },
        line_items: carrinho.map(item => ({
            product_id: item.id,
            quantity: item.quantidade
        })),
        shipping_lines: [
            {
                method_id: "flat_rate",
                method_title: "Taxa fixa",
                total: "10.00"
            }
        ],
        customer_note: document.getElementById("trigger-nota").checked ? document.getElementById("nota").value : ""
    };

    try {
        const URL_ORDERS = "https://sturdy-putdown-raking.ngrok-free.dev/wp-json/wc/v3/orders";
        const CK = "ck_1bee9d3f1ca8905c34e171a4f379b645211c0a95";
        const CS = "cs_f00f72cada131081f6de494a50b670a8b3f2572a";
        
        const resposta = await fetch(`${URL_ORDERS}?consumer_key=${CK}&consumer_secret=${CS}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dadosPedido)
        });

        if (!resposta.ok) throw new Error("Erro ao criar pedido no WooCommerce");

        const pedidoCriado = await resposta.json();
        
        localStorage.removeItem('carrinho');
        window.location.href = `confirmacao.html?id=${pedidoCriado.id}`;

    } catch (erro) {
        console.error(erro);
        alert("Erro ao finalizar pedido. Verifique sua conexão com o servidor.");
        btn.disabled = false;
        btn.textContent = "Finalizar pedido";
    }
}

document.addEventListener('DOMContentLoaded', () => {
    inicializarCheckout();
    document.getElementById("form-checkout").addEventListener("submit", finalizarPedido);
});
