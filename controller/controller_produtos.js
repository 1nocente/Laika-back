const message = require('../modulo/config.js')
const categoriasDAO = require('../model/DAO/categorias.js')
const DAO = require('../model/DAO/produto.js')


const getAll = async function () {
    let resultJSON = {};
    let dados = await DAO.selectAll();
    
        if (dados) {
        if(dados.length > 0) {

            for (let index = 0; index < dados.length; index++) {
                if(dados[index].categorias){

                const listaIdsCategorias = dados[index].categorias.split('-')
                const listaCategorias = []
                for(let idCategoria of listaIdsCategorias){       
                    const categoria = (await categoriasDAO.selectById(parseInt(idCategoria)))[0]
                    listaCategorias.push(categoria)
                } 
                dados[index].categorias = listaCategorias                
            } else {
                delete dados[index].categorias
            }
        }
            
            resultJSON.produtos = dados;
            resultJSON.quantidade = dados.length;
            resultJSON.status_code = 200;
            return resultJSON;
        } else {
            return message.ERROR_NOT_FOUND //404
        }
    } else {
        return message.ERROR_INTERNAL_SERVER_DB //500
    }
}
const getId = async function (id) {
    let json = {};
    if (id == '' || id == undefined || isNaN(id)) {
        return message.ERROR_INVALID_ID; //400
    } else {
        let dados = await DAO.selectById(id);
        if (dados) {
            if (dados.length > 0) {
                if(dados[0].categorias){
                    const listaIdsCategorias = dados[0].categorias.split('-')
                    const listaCategorias = []
                    for(let idCategoria of listaIdsCategorias){       
                        const categoria = (await categoriasDAO.selectById(parseInt(idCategoria)))[0]
                        listaCategorias.push(categoria)
                    } 
                    dados[0].categorias = listaCategorias
                } else {
                    delete dados[0].categorias
                }
                
                json.dados = dados[0];
                json.status_code = 200;
                return json;
            } else {
                return message.ERROR_NOT_FOUND //404
            }
        } else {
            return message.ERROR_INTERNAL_SERVER_DB //500
        }

    }
}
const setExcluir = async function (id) {
    let json={}
    let result = await DAO.deletar(id)
    if(result){
        json.status = message.SUCCESS_ACCEPTED_ITEM.status
        json.status_code = message.SUCCESS_ACCEPTED_ITEM.status_code
        json.message = message.SUCCESS_ACCEPTED_ITEM.message
        return json //202
    } else {
        return message.ERROR_NOT_FOUND //404
    }
}

const setInserir = async function (dados, contentType) {
    try {
    if (String(contentType).toLowerCase() == 'application/json'){
    let json = {}
    if (
        dados.nome == ''|| dados.nome == undefined|| dados.nome == null||dados.nome.length > 100 ||
        dados.descricao == ''|| dados.descricao == undefined|| dados.descricao == null||dados.descricao.length > 65000 ||
        dados.img == ''|| dados.img == undefined|| dados.img == null||dados.img.length > 200 ||
        dados.quantidade_estoque == ''|| dados.quantidade_estoque == undefined|| dados.quantidade_estoque == null||isNaN(dados.quantidade_estoque)
        )
    {
       return message.ERROR_REQUIRED_FIELDS //400
    } else {
        
            let result = await DAO.insert(dados)
            let id = await DAO.pegarUltimoId()
            if(result && id) {
                if(dados.categorias){
                    (dados.categorias).forEach(element => {
                        const json = {
                            idProduto: id,
                            idCategoria: element
                        }
                        DAO.insertCategoriaProduto(json)
                    });
                }

                json.dados = dados
                json.status = message.SUCCESS_CREATED_ITEM.status
                json.status_code = message.SUCCESS_CREATED_ITEM.status_code
                json.message = message.SUCCESS_CREATED_ITEM.message
                json.id = parseInt(id)
                return json //201
            } else {
                return message.ERROR_INTERNAL_SERVER_DB //500
            }
    }
} else {
    return message.ERROR_CONTENT_TYPE // 415
}
    }catch(error){
        console.error(error);
        return message.ERROR_INTERNAL_SERVER //500 - Erro na controller
    }
}
const setAtualizar = async function (id, dados, contentType) {
    try{
        if(String(contentType).toLowerCase()== 'application/json'){
            let json = {}
            if (
                dados.nome == ''|| dados.nome == undefined|| dados.nome == null||dados.nome.length > 100 ||
                dados.descricao == ''|| dados.descricao == undefined|| dados.descricao == null||dados.descricao.length > 65000 ||
                dados.img == ''|| dados.img == undefined|| dados.img == null||dados.img.length > 65000 ||
                dados.quantidade_estoque == ''|| dados.quantidade_estoque == undefined|| dados.quantidade_estoque == null||isNaN(dados.quantidade_estoque)
                )
            {
               return message.ERROR_REQUIRED_FIELDS //400
            } else {
                let result = await DAO.update(id, dados)
                if(result) {
                    json.dados = dados
                    json.status = message.SUCCESS_ACCEPTED_ITEM.status
                    json.status_code = message.SUCCESS_ACCEPTED_ITEM.status_code
                    json.message = message.SUCCESS_ACCEPTED_ITEM.message
                    json.id = parseInt(id)
                    return json //201
                } else {
                    return message.ERROR_NOT_FOUND //404
                }
            }
        } else {
            return message.ERROR_CONTENT_TYPE // 415
        }
    } catch (error){
        console.error(error);
        return message.ERROR_INTERNAL_SERVER //500 - Erro na controller
    }
}

module.exports = {
    setInserir,
    setAtualizar,
    setExcluir,
    getAll,
    getId,
}