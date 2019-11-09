//Tive que instalar o mssql e o msnodesqlv8 somente apos a instalação dos mesmos e que consegui fazer a conexão com banco de dados
// comandos de instalação dos mesmos segue abaixo
// npm install mssql
// npm install msnodesqlv8
var sql = require('mssql/msnodesqlv8');
var connStr = {
  connectionString: 'Driver=SQL Server;Server=GAB2;Database=testenode;Trusted_Connection=true;'
};

//Outro codigo que consegui para fazer a conexão com o banco de dados do SQL SERVER
//Tutorial neste site aqui 
//https://stackoverflow.com/questions/33709807/how-to-connect-to-sql-server-with-windows-authentication-from-node-js-using-mssq
/* sql.connect(config, err => {
  new sql.Request().query('SELECT * FROM dbo.usuarios', (err, result) => {
    console.log(".:The Good Place:.");
    if(err) { // SQL error, but connection OK.
      console.log("  Shirtballs: "+ err);
    } else { // All is rosey in your garden.
      console.dir(result);
    };
  });
});
sql.on('error', err => { // Connection borked.
  console.log(".:The Bad Place:.");
  console.log("  Fork: "+ err);
}); */

/* sql.connect(connStr)
   .then(conn => console.log("conectou!"))
   .catch(err => console.log("erro! " + err)); */

   sql.connect(connStr)
      .then(conn => createTable(conn))
      .catch(err => console.log("erro! " + err));

//Comando para criar uma tabela dentro do banco de dados e popular esta tabela
   function createTable(conn){
 
//parametros para criar os campos da tabela
// nao vi nenhuma preparação para o caso da tabela ja existir 
    const table = new sql.Table('Clientes');
    table.create = true;
    table.columns.add('ID', sql.Int, {nullable: false, primary: true});
    table.columns.add('Nome', sql.NVarChar(150), {nullable: false});
    table.columns.add('CPF', sql.NChar(11), {nullable: false});
//Apos a criação da tabela e feito o insert dos itens dentro da tabela
    table.rows.add(1, 'teste1', '12345678901');
    table.rows.add(2, 'teste2', '09876543210');
    table.rows.add(3, 'teste3', '12312312399');

//aqui e o comando que vai rodar o codigo acima dentro do banco de dados
// o comando bulk forca a inserção dos dados dentro do banco de dados
    const request = new sql.Request()
    request.bulk(table)
           .then(result => console.log('funcionou'))
           .catch(err => console.log('erro no bulk. ' + err));
}
