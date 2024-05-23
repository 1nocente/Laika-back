const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


const insert = async function(dados){
    try {
        let sql = `INSERT INTO tbl_endereco (rua, bairro, cidade, estado, complemento) VALUES (?, ?, ?, ?, ?);`;

        let result = await prisma.$executeRawUnsafe(sql, 
            dados.rua,
            dados.bairro,
            dados.cidade,
            dados.estado,
            dados.complemento);
        if (result) {
            return true
        } else {
            return false
        }
    } catch (error) {
        return false
    }
}

const deletar = async function (id) {
    try {
        const sql = `DELETE FROM tbl_endereco WHERE id = ${id}`;
        let result = await prisma.$executeRawUnsafe(sql)
        if (result) {
            return true
        } else {
            return false
        }
    } catch (error) {
        return false
    }
}

// Selecionar todos os endereços
const selectAll = async function (){
    try {
        const sql = `SELECT * FROM TBL_ENDERECO`;
        let result = await prisma.$queryRawUnsafe(sql);
        return result;
    } catch (error) {
        return false
    }
}
const selectById = async function (search) {
    try {
        const sql = `select * from tbl_endereco WHERE id = ${search}`;
        let result = await prisma.$queryRawUnsafe(sql);
        return result
    } catch (error) {
        return false
    }
}

const pegarUltimoId = async function() {
    try {
        let sql = `SELECT CAST(LAST_INSERT_ID() AS DECIMAL) AS id FROM TBL_ENDERECO limit 1;`
    let result = await prisma.$queryRawUnsafe(sql)
    if(result){
        return parseInt(result[0].id)
    } else {
         return false
    }
    } catch (error) {
        return false    
    }
}



module.exports= {
    insert,
    deletar,
    pegarUltimoId,
    selectById,
    selectAll
}