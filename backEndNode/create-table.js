const  fs   =  require('fs')   ; // ... Importa funções do sistema operacional.
const mysql = require('mysql') ; // ... Importa a biblioteca responsável por gerenciar o MySQL.

const connection = mysql.createConnection({ // ... Atribui a variável uma string de conexão.
      host   : '127.0.0.1'  ,
      port   :    3306      ,
      user   : 'kaleostark' ,
    password :     ''       ,
    database :  'apiNode'   ,
});

connection.connect( (err) => { // ...... Tenta fazer a conexão com o banco de dados, e retorna se houve erro.
    if(err) { 
        return console.log(err) ; // ... Retorna e imprime no console se houve erro.
    } else {
        console.log('Conectou!'); // ... Imprime no console que conectou com o banco de dados.

        createTable(connection) ; // ... Chama a função responsável por criar a tabela.
    
        addRows(connection); // ........ Chama a função responsável por adicionar dados ao banco de dados.
    }
});

function createTable(conn) { // .................................................... Função responsável por criar a tabela caso ela não exista.
    fs.readFile('./scriptsSQL/tableClientes.sql', 'utf8', (err, query) => { // ..... Lê o arquivo com a query de criação da tabela.
        if(err) { // ............................................................... Verifica se houve erro na leitura.
            console.log('Erro ao ler script!'); // ................................. Imprime que houve erro na leitura.
        } else { // ................................................................ Se não houve erro na leitura, executa o codigo abaixo.
            conn.query(query, (error, results, fields) => { // ..................... Chama a função na variável de conexão responsável por executar o script SQL.
                (error) ? console.log(error): console.log('Criou a tabela!'); // ... Imprime no terminal se houve sucesso ou erro.
            });
        }
    });
}

function addRows(conn){ // ....................................................... Função responsável por adicionar dados na tabela.
    const values = [ 
        ['teste1', '12345678901'],
        ['teste2', '12345678902'],
        ['teste3', '12345678903'],
    ]; // ........................................................................ Variável com dados para teste.

    fs.readFile('./scriptsSQL/insertClient.sql', 'utf8', (err, query) => {  // ... Lê o arquivo com a query de inserção na tabela.
        if(err) { // ............................................................. Verifica se houve erro na leitura.
            console.log('Erro ao ler script!'); // ............................... Imprime no terminal que houve erro.
        } else { // .............................................................. Se não houve erro ...
            conn.query(query, [values], (error, results, fields) => { // ......... Chama a função na variável de conexão responsável por executar o script SQL, passando os valores.
                (error) ? console.log(error): // ................................. Verifica se houve erro e imprime no terminal, ou se der certo ...
                console.log('Adicionou registros!'), // .......................... Imprime que deu certo e ...
                conn.end() // .................................................... Fecha a conexão.
            });
        }
    });
}