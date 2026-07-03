const meuCarrinho = [
    { nome: "Notebook", preco: 3000 },
    { nome: "Mouse", preco: 150 },
    { nome: "Teclado", preco: "cem reais" }, 
    { nome: "Monitor", preco: 800 }
];

function calcularImposto(produto) {
    if(typeof produto.preco !== "number"){
     return {nome : produto.nome, preco: 0, status: "Erro no preço"};
    } else {
       const precoComImposto = produto.preco * 1.10 ;
        return{ nome: produto.nome, preco: precoComImposto, status: "ok"};
    }
}

function finalizarCompra(carrinho) {
    if (!carrinho|| carrinho.length === 0)
    throw new Error("Operação negada: Carrinho vazio.");
    const numeroPedido = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
    const recibo = carrinho.map(calcularImposto);

    return {
        numeroPedido,
        recibo
    }
}

try {
    const gerarRecebo = finalizarCompra(meuCarrinho)
    console.log(gerarRecebo);
} catch (error) {
    console.error();
}