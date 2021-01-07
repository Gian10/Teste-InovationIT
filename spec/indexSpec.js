const request = require('request')

const endpoint = 'http://localhost:8080'

const boletoBancario = '21290001192110001210904475617405975870000002000'
const codigoBarra =    '826100000007379100101094072060700019122020100030'


// ERROS TANTO NO BOLETO QUANTO NO CÓDIGO DE BARRA
const codigoBarraComLetra = '826100000007379100101094072060700019122020100030yu'
const boletoErroComLetra =       '21290001192110001210904475617405975870000002000abcde'
const boletoTamanhoAcimaNormal = '212900011921100012109044756174059758700000020001234'
const boletoTamanhoAbaixoNormal = '212900011921100012109044756174059758700000020'



describe('GET BOLETO BANCARIO OU CODIGO DE BARRA', ()=>{
    // BUSCAR DADOS DE RESPOSTA BASEADO DO BOLETO INSERIDO
    it('deve retornar 200 código de resposta', (done)=> {
    request.get(`${endpoint}/boleto/${boletoBancario}`, (erro, response)=>{
        expect(response.statusCode).toEqual(200)
        done();
        console.log(response.body)
        })
    })

    // ERRO DE LINHA DIGITAVEL CONTENDO LETRAS
    it('deve retornar 200 código de resposta', (done)=> {
        request.get(`${endpoint}/boleto/${boletoErroComLetra}`, (erro, response)=>{
            expect(response.statusCode).toEqual(200)
            done();
            console.log(response.body)
            })
        })

    // ERRO DE QUANTIDADE ACIMA DO NORMAL DIGITADA NA LINHA 
    it('deve retornar 200 código de resposta', (done)=> {
        request.get(`${endpoint}/boleto/${boletoTamanhoAcimaNormal}`, (erro, response)=>{
            expect(response.statusCode).toEqual(200)
            done();
            console.log(response.body)
            })
        })

    // ERRO DE QUANTIDADE ABAIXO DO NORMAL DIGITADA NA LINHA 
    it('deve retornar 200 código de resposta', (done)=> {
        request.get(`${endpoint}/boleto/${boletoTamanhoAbaixoNormal}`, (erro, response)=>{
            expect(response.statusCode).toEqual(200)
            done();
            console.log(response.body)
            })
        })
})