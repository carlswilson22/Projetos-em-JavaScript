const precosBrutos = [100, "duzentos", null, 50, 300];

function aplicarDesconto(preco) {
    if (typeof preco  !== "number")
        return "Operação inválida";
    const desconto = preco * 0.10;
    return preco - desconto;
}

const precosComDesconto = precosBrutos.map(aplicarDesconto);
console.log(precosComDesconto);

function processarDados(input) {
    if (input === ""){
        throw new Error("Dados não podem ser vazios!");
    }
}

try {
    processarDados("")
} catch (erro) {
    console.log(erro.message)
}