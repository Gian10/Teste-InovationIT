
// API DESENVOLVIDA COM APENAS UM ENDPOINT DIFERENCIANDO O BOLETO COM O CODIGO DE BARRA PELA CONDIÇÃO
const express = require('express')
const app = express()

const bodyParser = require('body-parser')

app.use(bodyParser.json())


app.get('/boleto/:boleto', (req, res) => {
    try {
        const array = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
        let soma = 0

        let barraBoletoBancario = req.params

        // VERIFICANDO SE A LINHA DIGITAVEL É ACEITA
        const regExp = /^\d+$/;
        if(!regExp.test(barraBoletoBancario.boleto)){
           return res.status(400).send('ERRO NO BOLETO DIGITADO, SÓ É ACEITAVEL NÚMEROS!')
        }

        if(barraBoletoBancario.boleto.length == 47) {

            let vencimento = barraBoletoBancario.boleto.slice(33, 37)
            var date = new Date('10/08/1997');

            date.setTime(date.getTime() + (vencimento * 24 * 60 * 60 * 1000));
            let dataVencimento = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + (date.getDate())).slice(-2);

            // RETIRANDO OS ZEROS COM PARSEFLOAT
            let valor = parseFloat(barraBoletoBancario.boleto.substring(barraBoletoBancario.boleto.length - 10, barraBoletoBancario.boleto.length)).toString()

            let valorFinal = valor.substring(0, valor.length - 2) + "." + valor.substring(valor.length - 2, valor.length);


            //FÓRMULA DE CÁLCULO DO DÍGITO VERIFICADOR DO CÓDIGO DE BARRA UTLIZANDO O MÓDULO 11 DE BOLETO BANCARIO

            for (let i = 43; i >= 0; i--) {
                if (i != 5) {
                    soma += barraBoletoBancario.boleto[i] * array[i]
                }
            }

            let div = soma / 11
            let resto = div % 11
            let resultado = Math.round(11 - resto)


            if (resultado == 0 || resultado == 10 || resultado == 11) {
                resultado = 1
            }

            // CALCULANDO O FATOR DE VENCIMENTO
            let dataInicial = +new Date(1997, 10, 07)
            let dataVencimentotimeStamp = +new Date(date.getFullYear(), date.getMonth(), ("0" + (date.getDate())).slice(-2))
        
            let calculoDias = Math.round((dataVencimentotimeStamp - dataInicial)/1000/60/60/24)

            // CRIANDO O CODIGO DE BARRA
            let codigoBarra = ""
            codigoBarra += barraBoletoBancario.boleto.substring(0, 4)
            codigoBarra += resultado
            codigoBarra += calculoDias
            codigoBarra += barraBoletoBancario.boleto.substring(37, 47)
            codigoBarra += barraBoletoBancario.boleto.substring(4, 9)
            codigoBarra += barraBoletoBancario.boleto.substring(10, 20)
            codigoBarra += barraBoletoBancario.boleto.substring(21, 31)


            const response = {
                títulosBancarios: {
                    barCode: codigoBarra,
                    amount: valorFinal,
                    expirationDate: dataVencimento
                }
            }
            return res.status(200).send(response)
        }
        if(barraBoletoBancario.boleto.length == 48){
            let barra = req.params

            let valorCodigo = ""

            valorCodigo += barra.boleto.substring(4, 11)
            valorCodigo += barra.boleto.substring(12, 16)

            let valor = parseFloat(valorCodigo.substring(valorCodigo.length - 10, valorCodigo.length)).toString()
            let valorFinal = valor.substring(0, valor.length - 2) + "." + valor.substring(valor.length - 2, valor.length);


            let dataVencimento = barra.boleto.substring(34, 42)
           // dataVencimento = barra.boleto.substring(34, 42)

           //MONTANDO A DATA DE VENCIMENTO DO CODIGO DE BARRA
            let dia = dataVencimento.substring(0, 2)
            let mes = dataVencimento.substring(2, 4)
            let ano = dataVencimento.substring(4, 8)
            let data = new Date(ano, mes - 1, dia)

            let dataVencimentoCodigoBarra = data.getFullYear() + "-" + (data.getMonth() + 1) + "-" + dia

            //FÓRMULA DE CÁLCULO DO DÍGITO VERIFICADOR GERAL UTLIZANDO O MÓDULO 10 DE PAGAMENTO CONCESSIONÁRIAS.

            const array2 = [2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2]

            for (let i = 42; i >= 0; i--) {
                if (i != 5) {
                    soma += barra.boleto[i] * array2[i]
                }
            }
            let div = soma / 10
            let resto = div % 10
            let resultado = Math.round(10 - resto)

            // MONTANDO O CODIGO DE BARRA
            let codigoBarra = ""

            codigoBarra += barra.boleto.substring(0, 3)
            codigoBarra += resultado
            codigoBarra += barra.boleto.substring(4, 11)
            codigoBarra += barra.boleto.substring(12, 23)
            codigoBarra += barra.boleto.substring(24, 33)
            codigoBarra += barra.boleto.substring(38, 42)
            codigoBarra += barra.boleto.substring(36, 38)
            codigoBarra += barra.boleto.substring(34, 36)
            codigoBarra += barra.boleto.substring(42, 47)


            const dados = {
                concessionarias: {
                    barCode: codigoBarra,
                    amount: valorFinal,
                    expirationDate: dataVencimentoCodigoBarra
                }
            }
            return res.status(200).send(dados)
        } 
        else{
            return res.status(400).send('LINHA DIGITAVEL INCORRETA!')
        }
    } catch (e) {
        return res.status(500).send('ERRO NO SERVIDOR!')
    }
})

app.listen(8080, () => {
    console.log("executando!!")
})