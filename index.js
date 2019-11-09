const express = require('express');
const app = express();         
const bodyParser = require('body-parser');
const port = 3000; //porta padrão
const sql = require('mssql/msnodesqlv8');
var connStr = {
    connectionString: 'Driver=SQL Server;Server=GAB2;Database=testenode;Trusted_Connection=true;'
  };

//Incluindo o ejs no codigo
app.set('view engine', 'ejs');

//fazendo a conexão global
sql.connect(connStr)
   .then(conn => GLOBAL.conn = conn)
   .catch(err => console.log(err));

//configurando o body parser para pegar POSTS mais tarde
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//definindo as rotas
const router = express.Router();
router.get('/', (req, res) => res.json({ message: 'Funcionando!' }));
app.use('/', router);

//inicia o servidor
app.listen(port);
console.log('API funcionando!');

//Este e o comando responsavel por executar a query  
function execSQLQuery(sqlQry, res){
    GLOBAL.conn.request()
               .query(sqlQry)
               .then(result => res.json(result.recordset))
               .catch(err => res.json(err));
}

//#######################################CONSULTA REGISTROS NO BANCO DE DADOS#######################################

//Criando a rota para a pagina Clientes  neste caso sera apresentados todos os clientes
//Em seguida e chamado a função que ira executar a consulta dentro do banco de dados
router.get('/clientes', (req, res) =>{
    execSQLQuery('SELECT * FROM Clientes', res);
})

//Criando a rota para a pagina clientes neste caso estamos passando como parametro o id do cliente
// Em seguida e chamada a função para pesquisar o cliente dentro do banco de dados
router.get('/clientes/:id?', (req, res) =>{
    let filter = '';
    if(req.params.id) filter = ' WHERE ID=' + parseInt(req.params.id);
    execSQLQuery('SELECT * FROM Clientes' + filter, res);
})

//#######################################EXCLUI REGISTRO DO BANCO DE DADOS#######################################

//Criando a rota para a pagina para exclusão do cliente estamos novamente passando o ID como parametro para executar a query
//o processo e bem parecido com o de pesquisa porem a query e outra
router.delete('/clientes/:id', (req, res) =>{
    execSQLQuery('DELETE Clientes WHERE ID=' + parseInt(req.params.id), res);
})

//#######################################ADICIONA REGISTRO NO BANCO DE DADOS#######################################

//Criando a rota para a pagina para adicionar um novo registro, neste caso serão passados parametros via URL para 
//executar a adição do novo usuario dentro do banco de dados
//o processo e bem parecido com todos os demais porem agora estaremos utilizando a clausula INSERT

router.post('/clientes', (req, res) =>{
    const id = parseInt(req.body.id);
    const nome = req.body.nome.substring(0,150);
    const cpf = req.body.cpf.substring(0,11);
    execSQLQuery(`INSERT INTO Clientes(ID, Nome, CPF) VALUES(${id},'${nome}','${cpf}')`, res);
})

//#######################################ALTERANDO REGISTRO NO BANCO DE DADOS#######################################

//Criando a rota para a pagina para alterar um registro no banco de dados 
//o comando e bem similar a o do delete e neste caso vamos utilizar o PUT
router.put('/clientes', (req, res) =>{
    const id = parseInt(req.body.id);
    const nome = req.body.nome.substring(0,150);
    const cpf = req.body.cpf.substring(0,11); 
    execSQLQuery(`UPDATE  dbo.Clientes SET Nome = '${nome}' ,CPF ='${cpf}' WHERE ID =${id}`, res);
})