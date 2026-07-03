const funcionarios = [
    { nome: "Carlos", salarioBase: 3000 },
    { nome: "Ana", salarioBase: 4500 },
    { nome: "Júlio", salarioBase: "dois mil" }, 
    { nome: "Marina", salarioBase: null }      
];

function avaliacaoSalarioFuncionario(funcionario) {
    if (typeof funcionario.salarioBase !== "number") {
        return {
            nome: funcionario.nome,
            salario: 0, 
            status: "Revisão RH" 
        };
    } else {
       
        const salarioCalculado = funcionario.salarioBase + 500;
        return {
            nome: funcionario.nome,
            salario: salarioCalculado,
            status: "Pago"
        };
    }
} 

function processarFolhaDePagamento(listaDeFuncionarios) {
    if (!listaDeFuncionarios || listaDeFuncionarios.length === 0) {
        throw new Error("Operação negada: Não há dados para processar.");
    }
    
    const codigoLote = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
    const pagamentosProcessados = listaDeFuncionarios.map(avaliacaoSalarioFuncionario);
    
    return {
        lote: codigoLote,
        pagamentos: pagamentosProcessados
    };
}

try {
    const relatorioFinal = processarFolhaDePagamento(funcionarios);
    console.log("Folha processada com sucesso!", relatorioFinal);
} catch (error) {
    console.log("Falha no sistema:", error.message);
}

console.log("--- TESTE DE SEGURANÇA ---");
try {
    processarFolhaDePagamento([]);
} catch (error) {
    console.log("Falha capturada e sistema salvo:", error.message);
}