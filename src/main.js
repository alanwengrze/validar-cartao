import "./css/index.css"
import iMask from "imask"
//puxando o seletor do html pelo caminho até onde quero alterar
//o caminho tem a classe .cc-bg, a tag svg, o > para acessar a tag filha g, g:nth-child(1) para acessar o primeiro filho e por ultimo a tag acessada
const ccBgColor01 = document.querySelector(".cc-bg svg > g g:nth-child(1) path")
//fazendo a mesma coisa para o próximo elemento g
const ccBgColor02 = document.querySelector(".cc-bg svg > g g:nth-child(2) path")
//buscando a logo
//acessamos a classe .cc-logo, na tag span temos 3 tags filhas, img, span e outra img, queremos acessar a terceira, então nth-child(2) e dps o nome da tag
const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img")




//criando uma função para trocar a cor conforme o tipo de cartão 
function setCardType(type){
//criando uma estrutura de dados para conter cada uma das cores
//será um array de cores para cada tipo de cartão
const colors = {
    visa: ["#2D57F2","#436D99"],
    mastercard: ["#C69347", "#DF6F29"],
    default: ["black", "gray"],
    elo: ["#3C00E9", "#D22C2C"],
}
//alterando o valor com o setAttribute, seguido do atributo que queremos alterar e o novo valor
ccBgColor01.setAttribute("fill", colors[type][0])//colors é o array, type é o parametro (poderia ser colors.visa) e o 0 é a posição da primeira cor do array visa
ccBgColor02.setAttribute("fill", colors[type][1])

//alterando a logo
ccLogo.setAttribute("src", `cc-${type}.svg`)
}
//chamando a função setCardType
//setCardType("mastercard")

//deixando a função global, para poder ser alterada no console do navegador
globalThis.setCardType = setCardType 

//security code (CVC do cartão)
const securityCode = document.querySelector("#security-code")
//fazendo a formatação da mascara do CVC
const securityCodePattern = {
    mask:"0000"
}

//adicionando o IMask para CVC com a const que puxa do do id do html e o segundo parametro é const que aplica a mascara
const securityCodeMasked = IMask(securityCode, securityCodePattern)

//expiration date (data de expiração)
const expirationDate = document.querySelector("#expiration-date")
//para fazer a data de expiração, usamos os blocks, e dentro dele o mask:IMask.MaskedRange para definir de quando até quando queremos
const expirationDatePattern = {
    mask:"MM{/}YY",
    blocks: {
        YY:{
            //instanciamos um objeto Date e pegamos o parametro fullYear, transformamos em String e usamos o .slice(2) para pegar os dois ultimos numeros do ano
            mask: IMask.MaskedRange,
            from: String(new Date().getFullYear()).slice(2),
            to:String(new Date().getFullYear() + 10).slice(2),
        },

        MM:{
            mask:IMask.MaskedRange,
            from:1,
            to:12,
        }
    }
}
const expirationDateMasked = IMask(expirationDate, expirationDatePattern)

//criando mascara para os numeros de cartões
const cardNumber = document.querySelector("#card-number")
const cardNumberPattern ={
    mask:[
        {
            mask: "0000 0000 0000 0000",
            regex:/^4011(78|79)|^43(1274|8935)|^45(1416|7393|763(1|2))|^50(4175|6699|67[0-6][0-9]|677[0-8]|9[0-8][0-9]{2}|99[0-8][0-9]|999[0-9])|^627780|^63(6297|6368|6369)|^65(0(0(3([1-3]|[5-9])|4([0-9])|5[0-1])|4(0[5-9]|[1-3][0-9]|8[5-9]|9[0-9])|5([0-2][0-9]|3[0-8]|4[1-9]|[5-8][0-9]|9[0-8])|7(0[0-9]|1[0-8]|2[0-7])|9(0[1-9]|[1-6][0-9]|7[0-8]))|16(5[2-9]|[6-7][0-9])|50(0[0-9]|1[0-9]|2[1-9]|[3-4][0-9]|5[0-8]))/,
            cardtype:"elo",

            
        },
        {
            mask: "0000 0000 0000 0000",
            regex:/(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
            cardtype:"mastercard",
        },
        {
            mask: "0000 0000 0000 0000",
            regex:/^4\d{0,15}/,
            cardtype:"visa",
        },
        {
            mask: "0000 0000 0000 0000",
            cardtype:"default",
        },
    ],
    dispatch: function(appended, dynamicMasked){
        const number = (dynamicMasked.value + appended).replace(/\D/g, "")
        const foundMask = dynamicMasked.compiledMasks.find(function(item){
            return number.match(item.regex)
        })
        console.log(foundMask)

        return foundMask
    },
}
const cardNumberMasked = IMask(cardNumber, cardNumberPattern)

//criando os eventos do botão
//click é o evento, () => {} é uma arrow function anonima
const addButton = document.querySelector("#add-card")
addButton.addEventListener("click",() =>{
    alert("Cartão adicionado!")
})

//estamos falando para pegar o form, e quando algum evento de submit acontecer no form, o evento não vai acontecer
document.querySelector("form").addEventListener("submit",(event) =>{
    event.preventDefault()
})

//puxando o conteudo do nome do titular e colocando na const cardHolder
const cardHolder = document.querySelector("#card-holder")

//observar quando o nome do titular for digitado
cardHolder.addEventListener("input", () =>{
    //selecionando a classe value dentro da div cc-holder
    const ccHolder = document.querySelector(".cc-holder .value")

    ccHolder.innerText = cardHolder.value.length === 0 ? "FULANO DA SILVA" : cardHolder.value
})

//quando o conteudo do CVC for aceito, definimos o que vai acontecer com ele
securityCodeMasked.on("accept", () =>{
    updateSecurityCode(securityCodeMasked.value)
})

function updateSecurityCode(code){
    const ccSecurity = document.querySelector(".cc-security .value")
    ccSecurity.innerText = code.length === 0 ? "123" : code
}

cardNumberMasked.on("accept", () => {
    //quando colocarmos o número de cartão, agora queremos que ele diga qual é o tipo do cartão também, então usamos uma const para pegar o que tem no cardNumberMasked, dps entramos na mask, pegamos o cartao que corresponde os numeros digitados com o currentMask, e ele retorna o tipo do cartão com o cardType
    const cardType = cardNumberMasked.masked.currentMask.cardtype
    //passamos o cardType para a função, para atualizar o setCardType (tipo do)
    setCardType(cardType)
    updateCardNumber(cardNumberMasked.value)
    
})

function updateCardNumber(number){
    const ccNumber = document.querySelector(".cc-number")
    ccNumber.innerText = number.length === 0 ? "1234 5678 9012 3456" : number
}

expirationDateMasked.on("accept", () =>{
    updateExpirationDate(expirationDateMasked.value)
})

function updateExpirationDate(date){
    const ccExpiration = document.querySelector(".cc-extra .value")
    ccExpiration.innerText = date.length === 0 ? "02/32" : date
}


    