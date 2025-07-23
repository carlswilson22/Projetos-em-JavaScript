alert("Boas vindas ao site do numero secreto");
let numeroSecreto = parseInt(Math.random() * 100 + 1) ;
console.log(numeroSecreto);
let chute;
let tentativas = 1;

// enquanto chute não for igual ao numero Secreto
while (chute != numeroSecreto){
chute = prompt("Digite um numero de 1 a 100");
// se o chute for igual ao numero Secreto

if (chute == numeroSecreto) {
// para não continua
break;
} else {
if (chute > numeroSecreto) {
alert(O numero secreto é menor que ${chute});
} else {
alert(O numero secreto é maior que ${chute});
}
//Tentativas = Tentativas + 1;
tentativas++;
}
}
let palavraTentativa = tentativas > 1 ? "tentativas" : "tentativa";
alert(Nice voce acertou o numero secreto ${numeroSecreto} com ${tentativas} ${palavraTentativa}.);

//if (Tentativas > 1) {
//alert(Nice voce acertou o numero secreto ${numeroSecreto} com ${tentativas} tentativas.);
//} else {
// alert(Nice voce acertou o numero secreto ${numeroSecreto} com ${tentativas} tentativa.);
//}
