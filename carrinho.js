const CARRINHO_KEY = 'carrinhoDeCompras';



const getCarrinho = () => {
    const carrinhoJson = localStorage.getItem(CARRINHO_KEY);
    return carrinhoJson ? JSON.parse(carrinhoJson) : [];
};

const salvarCarrinho = (carrinho) => {
    localStorage.setItem(CARRINHO_KEY, JSON.stringify(carrinho));
};



const formatarPreco = (valor) => {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

const calcularTotal = (carrinho) => {
    let total = 0;
    carrinho.forEach(item => {
        total += item.preco * item.quantidade;
    });
    return total;
};



const removerItem = (idDoItem) => {
    let carrinho = getCarrinho();
    carrinho = carrinho.filter(item => item.id !== idDoItem);

    salvarCarrinho(carrinho);
    renderizarCarrinho(); 
};

const atualizarQuantidade = (idDoItem, novaQuantidade) => {
    if (novaQuantidade <= 0) return removerItem(idDoItem);

    let carrinho = getCarrinho();
    const item = carrinho.find(i => i.id === idDoItem);

    if (item) {
        item.quantidade = novaQuantidade;
        salvarCarrinho(carrinho);
        renderizarCarrinho(); 
    }
};



const criarItemHTML = (item) => {
    const divItem = document.createElement('div');
    divItem.classList.add('carrinho-item');
    
    const subtotal = item.preco * item.quantidade;

    divItem.innerHTML = `
        <img src="${item.imagem}" alt="${item.nome}">
        <div class="detalhes">
            <h3>${item.nome}</h3>
            <p>Preço unitário: ${formatarPreco(item.preco)}</p>
            <p>Subtotal: ${formatarPreco(subtotal)}</p>
            
            <div class="quantidade-controle">
                <button class="mudar-qtd-btn" data-id="${item.id}" data-acao="diminuir">-</button>
                <span class="quantidade-valor">Qtd: ${item.quantidade}</span>
                <button class="mudar-qtd-btn" data-id="${item.id}" data-acao="aumentar">+</button>
            </div>
        </div>
        <button class="remover-item-btn" data-id="${item.id}">Remover</button>
    `;

   
    divItem.querySelector('.remover-item-btn').addEventListener('click', (e) => {
        const idParaRemover = parseInt(e.target.dataset.id);
        removerItem(idParaRemover);
    });

   
    divItem.querySelectorAll('.mudar-qtd-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const idItem = parseInt(e.target.dataset.id);
            const itemAtual = getCarrinho().find(i => i.id === idItem);
            
            if (itemAtual) {
                let novaQuantidade = itemAtual.quantidade;
                if (e.target.dataset.acao === 'aumentar') {
                    novaQuantidade += 1;
                } else if (e.target.dataset.acao === 'diminuir') {
                    novaQuantidade -= 1;
                }
                atualizarQuantidade(idItem, novaQuantidade);
            }
        });
    });

    return divItem;
};

const finalizarCompra = () => {
    const carrinho = getCarrinho();
    if (carrinho.length > 0) {
        alert(`🎉 Compra Finalizada! O total foi de ${formatarPreco(calcularTotal(carrinho))}. Obrigado!`);
        
      
        salvarCarrinho([]);
        renderizarCarrinho(); 
        
    } else {
        alert('Seu carrinho está vazio. Adicione itens antes de finalizar.');
    }
}

const renderizarCarrinho = () => {
    const carrinho = getCarrinho();
    const container = document.getElementById('itens-do-carrinho-container');
    const totalElement = document.getElementById('carrinho-total-valor');

    container.innerHTML = '';

    if (carrinho.length === 0) {
        container.innerHTML = '<p>Seu carrinho está vazio. Adicione alguns produtos em nossa <a href="produtosbrunatavares.html">página de produtos</a>!</p>';
    } else {
        carrinho.forEach(item => {
            const itemElemento = criarItemHTML(item);
            container.appendChild(itemElemento);
        });
    }

    const total = calcularTotal(carrinho);
    totalElement.textContent = formatarPreco(total);
};



document.addEventListener('DOMContentLoaded', () => {
    
   
    renderizarCarrinho();

   
    const finalizarBtn = document.getElementById('finalizar-compra-btn');
    if (finalizarBtn) {
        finalizarBtn.addEventListener('click', finalizarCompra);
    }
});