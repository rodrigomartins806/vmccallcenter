const express = require('express');
const app = express();         
const bodyParser = require('body-parser');
const port = 3000; //porta padrão
const sql = require('mssql/msnodesqlv8');
var connStr = {
    connectionString: 'Driver=SQL Server;Server=GAB2;Database=testenode;Trusted_Connection=true;'
  };

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