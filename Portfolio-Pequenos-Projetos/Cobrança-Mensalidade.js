const cliente1 = { nome: "Alice", saldo: 100 };
const cliente2 = { nome: "Bob", saldo: 50 };

function cobrarMensalidade(cliente, valor) {
    cliente.saldo = cliente.saldo - valor; 
    return `Cobrança feita. O novo saldo de ${cliente.nome} é R$ ${cliente.saldo}`;
}

console.log(cobrarMensalidade(cliente1));
console.log(cobrarMensalidade(cliente2));