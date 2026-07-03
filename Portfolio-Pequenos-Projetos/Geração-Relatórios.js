const funcionario = { nome: "Ricardo", cargo: "Desenvolvedor" };
const cliente = { nome: "Beatriz", pontos: 1500 };
const pedido = { id: 9982, total: 250.50 };

function gerarResumo(entidade, tipo) {
    // Validação Defensiva:
    if (!entidade || typeof entidade !== 'object' || !tipo) {
        throw new Error("Dados inválidos ou tipo não informado");
    }

    //Switch case para os 3 casos
    switch (tipo) {
        case 'funcionario':
            return `Funcionário: ${entidade.nome}, Cargo: ${entidade.cargo}`;
        case 'cliente':
            return `Cliente: ${entidade.nome}, Pontos: ${entidade.pontos}`;
        case 'pedido':
            return `Pedido: #${entidade.id}, Total: R$ ${entidade.total}`;
        default:
            throw new Error("Tipo de entidade desconhecido");
    }
}

// Execução com Sucesso
try {
    console.log(gerarResumo(funcionario, 'funcionario'));
    console.log(gerarResumo(cliente, 'cliente'));
    console.log(gerarResumo(pedido, 'pedido'));
} catch (error) {
    console.log("Falha no sistema:", error.message);
}

// Tratamento de Erros (Tipo errado)
console.log("\n--- TRATAMENTO DE ERROS (TIPO DESCONHECIDO) ---");
try {
    console.log(gerarResumo(cliente, 'cachorro')); 
} catch (error) {
    console.log("Falha capturada:", error.message);
}
