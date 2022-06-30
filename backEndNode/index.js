// ######################################################( CONFIGURAÇÕES )##########################################################################################################
    const express = require('express') ; // ... Importa a biblioteca Express, responsavel pelos recursos WEBService.
    const   app   =     express()      ; // ... Cria um estância do express;
    const  mysql  =  require('mysql')  ; // ... Importa a biblioteca do MySQL.
    const router  =  express.Router()  ; // ... Estância uma nova rota express;
    const  cors   =  require('cors') ; // ..... Responsável por controlar o acesso a API.

    app.use   (     cors()     ) ; // ......... Configura a API para aceitar requisições de qualquer origem com o cors.
    app.use   ( express.json() ) ; // ......... Configura a API para trabalhar com JSON.
    app.listen(      3333      ) ; // ......... Faz a API escutar a porta '3000' do servidor da API.
// ##################################################################################################################################################################################


// ###########################################################( ROTAS )##############################################################################################################

// ==============( ROTA - RAIZ )
router.get('/', (req, res) => { // ...................... Define uma rota raiz;
    return res.json( { message: 'Funcionando' } ); // ... Retorna uma mensagem ao acessar essa rota com o metodo get.
});

// ==============( ROTA - PEGAR LISTA DE PRODUTOS )
router.get('/produtos', (req, res) => { // ............ Define uma rota GET para 'produtos', onde será solicitado todos os dados.
    execSQLQuery('SELECT * FROM produtos', res); // ... Chama a função que irá executar a query e retornara os valores.
}); 

// ==============( ROTA - PEGAR UNICO PRODUTO )
router.get('/produto/:codigoBarras?', (req, res) => { // ............................. Define uma rota GET para 'produtos', onde será solicitado apenas um produto pelo codigo.
    let filter = ''; // .............................................................. String que irá receber a query que fará o filtro.

    if(req.params.codigoBarras) 
        filter = ' WHERE codigo_barras = ' + parseInt(req.params.codigoBarras); // ... Se tiver o codigo, cria a string com a query para fazer o filtro.

    execSQLQuery('SELECT * FROM produtos ' + filter, res); // ........................ Chama a função que irá executar a query e retornara o valor solicitado, caso ele exista.
});

// ==============( ROTA - SALVAR UNICO PRODUTO )
router.post('/produto', (req, res) => { // .............................................. Define uma rota POST, onde será passado dados para criar o cadastro de um novo produto.
    let dados = { 
        descricao:    req.body.descricao,
        codigoBarras: req.body.codigoBarras,
        precoAtual:   req.body.precoAtual
    }; // ............................................................................... Variável que recebe dados enviado no corpo da requisição. 

    let query = 
        `INSERT INTO produtos 
            (descricao, codigo_barras, preco_atual) 
        VALUES 
            ('${dados.descricao}', '${dados.codigoBarras}', ${dados.precoAtual})`; // ... Variável que monta a query para inserção.

    execSQLQuery(query, res); // ........................................................ Chama a função que irá executar a query e salvará o novo produto.
});


// ==============( ROTA - ALTERAR UNICO PRODUTO )
/*OBS:
    Para fazer updates podemos utilizar os verbos PUT ou PATCH. 
    O Protocolo diz que devemos utilizar PUT se pretendemos passar
    todos os os parâmetros da entidade que está sendo atualizada,
    mas aqui jamais será atualizado o ID, então esta sendo utilizado
    o PATCH.
*/

router.patch('/produto/:codigo', (req, res) => { // ... Define uma rota PATCH, que receberá no corpo da requisição os dados a serem alterados.
    let dados = {
        codigo: parseInt(req.params.codigo),
        descricao: req.body.descricao,
        codigoBarras: req.body.codigoBarras,
        precoAtual: req.body.precoAtual
    }; // ............................................. Variável que recebe dados enviado no corpo da requisição. 

    execSQLQuery(
        `UPDATE produtos SET 
            descricao     = '${dados.descricao}', 
            codigo_barras = '${dados.codigoBarras}', 
            preco_atual   = '${dados.precoAtual}' 
        WHERE 
            codigo = ${dados.codigo};`, res
    ); // ............................................. Chama a função que irá executar a query e irá alterar os dados no banco de dados.
});

// ==============( ROTA - SALVAR VENDA )
router.post('/venda', (req, res) => { // ................................................. Define uma rota POST, onde será passado dados para criar o cadastro de uma nova venda.
    let dados = { 
        dataVenda:    req.body.dataVenda,
        tipoPagamento: req.body.tipoPagamento,
        valorTotal:   req.body.valorTotal
    }; // ................................................................................ Variável que recebe dados enviado no corpo da requisição. 

    let query = 
        `INSERT INTO vendas 
            (data_venda, tipo_pagamento, valor_total) 
        VALUES 
            ('${dados.dataVenda}', '${dados.tipoPagamento}', ${dados.valorTotal})`; // ... Variável que monta a query para inserção.

    execSQLQuery(query, res); // ......................................................... Chama a função que irá executar a query e salvará a nova venda.
});

// ==============( ROTA - SALVAR PRODUTO VENDA )
router.post('/produtosVenda', (req, res) => { // ... Define uma rota POST, onde será passado dados para criar o cadastro de um novo produto vinculado a uma venda.
    let produtosQuery = '';
    
    for (let produto of req.body.produtos){
        produtosQuery += `(${req.body.codigoVenda}, '${produto.codigoProduto}', ${produto.valorProdutoVenda}),`;
    }

    produtosQuery =  produtosQuery.split(',').slice(0, -1).join(',');
    
    let query = 
        `INSERT INTO produtos_venda 
            (codigo_venda, codigo_produto, valor_produto_venda) 
        VALUES 
            ${produtosQuery};`; // ................. Variável que monta a query para inserção.

    execSQLQuery(query, res); // ................... Chama a função que irá executar a query e salvará o novo produto vinculado a uma venda.
});

app.use('/', router); // .............................. Faz a aplicação definir as rotas.
// ##################################################################################################################################################################################

function execSQLQuery(sqlQry, res) { // ......................... Função que cria a conexão com o banco de ddados e recebe a query a ser executa.
    const connection = mysql.createConnection({
        host: 'localhost',
        port: 3306,
        user: '<seu usuario do banco de dados aqui>',
        password: '<sua senha do banco de dados aqui>',
        database: 'FECAF_sistema_vendas'
    }); // ...................................................... String para conexão com o banco de dados.

    connection.query(sqlQry, (error, results, fields) => { // ... Tenta fazer a conexão com o banco de dados, passando a string de conexão.
        if(error){ res.json(error); } // ........................ Se houve erro na conexão, ele retorna o erro.
        else{ res.json(results); } // ........................... Se houve sucesso ele retorna os dados referente ao sucesso.

        connection.end(); // .................................... Finaliza a conexão.
    });
}