const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

var tabela = "tbl_funcionarios"
var tabelaCargos = "tbl_cargos"
var tabelaCargosFuncionarios = "tbl_cargos_funcionarios"

const insert = async function(dados){
    try {
        let sql = `INSERT INTO ${tabela} (nome, telefone, email, senha, endereco_id) VALUES (?, ?, ?, ?, ?);`;

        let result = await prisma.$executeRawUnsafe(sql,
            dados.nome,
            dados.telefone,
            dados.email,
            dados.senha,
            dados.endereco_id);
        if (result) {
            return true
        } else {
            return false
        }
    } catch (error) {
        console.error(error);
        return false
    }
}

const update = async function (id, dados) {
    try{
        let sql = `
            UPDATE ${tabela}
            SET 
                nome = '${dados.nome}',
                telefone = '${dados.telefone}',
                email = '${dados.email}',
                senha = '${dados.senha}'
            WHERE id = ${id};
        `;
        let result = await prisma.$executeRawUnsafe(sql)
        if(result) {
            return true
        } else {
            return false
        }
    } catch (error){
        console.error(error);
        return false
    }
}
const deletar = async function (id) {
    try {
        const sql = `DELETE FROM ${tabela} WHERE id = ${id}`;
        let result = await prisma.$executeRawUnsafe(sql)
        if (result) {
            return true
        } else {
            return false
        }
    } catch (error) {
        console.error(error);
        return false
    }
}
const selectAll = async function (){
    try {
        let sql = 
        `SELECT 
        f.id,
        f.nome,
        f.telefone,
        f.email,
        f.senha,
        f.endereco_id,
        (SELECT 
            GROUP_CONCAT(c.id SEPARATOR '-') 
         FROM 
            ${tabelaCargos} c 
         INNER JOIN 
            ${tabelaCargos}_funcionarios cf 
         ON 
            c.id = cf.cargo_id 
         WHERE 
            cf.funcionario_id = f.id
        ) AS cargos
    FROM 
        ${tabela} f`
        let result = await prisma.$queryRawUnsafe(sql);
        return result;
    } catch (error) {
        console.error(error);
        return false
    }
}
const selectById = async function (search) {
    try {
        const sql = 
        `SELECT 
        f.id,
        f.nome,
        f.telefone,
        f.email,
        f.senha,
        f.endereco_id,
        (SELECT 
            GROUP_CONCAT(c.id SEPARATOR '-') 
         FROM 
            ${tabelaCargos} c 
         INNER JOIN 
            ${tabelaCargos}_funcionarios cf 
         ON 
            c.id = cf.cargo_id 
         WHERE 
            cf.funcionario_id = f.id
        ) AS cargos
    FROM 
        ${tabela} f 
        WHERE id = ${search}`;
        let result = await prisma.$queryRawUnsafe(sql);
        return result
    } catch (error) {
        console.error(error);
        return false
    }
}
const pegarUltimoId = async function() {
    try {
        let sql = `SELECT CAST(LAST_INSERT_ID() AS DECIMAL) AS id FROM ${tabela} limit 1;`
    let result = await prisma.$queryRawUnsafe(sql)
    if(result){
        return result[0].id
    } else {
         return false
    }
    } catch (error) {
        console.error(error);
        return false    
    }
}
const selectAllVeterinarios = async function (){
    try {
        const sql = `select ${tabela}.id,${tabela}.nome from ${tabela} join ${tabelaCargosFuncionarios} on ${tabela}.id = ${tabelaCargosFuncionarios}.funcionario_id where cargo_id = 1`
        let result = await prisma.$queryRawUnsafe(sql);
        return result;
    } catch (error) {
        console.error(error);
        return false
    }
}
const insertCargoFuncionario = async function (dados) {
    try {

        let sql = `INSERT INTO ${tabelaCargosFuncionarios} (cargo_id, funcionario_id) VALUES (?, ?)`;
        let result = await prisma.$executeRawUnsafe(sql,
            dados.idCargo,
             dados.idFuncionario);             
        return result ? true : false;
    } catch (error) {
        console.error(error);
        return false;
    }
};



module.exports= {
    insert,
    update,
    deletar,
    pegarUltimoId,
    selectAll,
    selectById,
    selectAllVeterinarios,
    insertCargoFuncionario
}