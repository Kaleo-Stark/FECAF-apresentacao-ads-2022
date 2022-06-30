CREATE DATABASE IF NOT EXISTS FECAF_sistema_vendas;

USE FECAF_sistema_vendas;

CREATE TABLE IF NOT EXISTS produtos (
	codigo        INT PRIMARY KEY AUTO_INCREMENT,
    descricao     VARCHAR(200) NOT NULL,
    codigo_barras VARCHAR(15) NOT NULL UNIQUE,
    preco_atual   DECIMAL(6,2)
);

CREATE TABLE IF NOT EXISTS vendas (
	codigo         INT PRIMARY KEY AUTO_INCREMENT,
    data_venda     DATETIME NOT NULL,
    tipo_pagamento VARCHAR(8) NOT NULL, -- CARTAO, DINHEIRO
    valor_total    DECIMAL(6,2) NOT NULL
);

CREATE TABLE IF NOT EXISTS produtos_venda (
	codigo INT PRIMARY KEY AUTO_INCREMENT,
    codigo_venda INT,
    codigo_produto INT,
    valor_produto_venda DECIMAL(6,2) NOT NULL,
    FOREIGN KEY (codigo_venda) REFERENCES vendas(codigo),
    FOREIGN KEY (codigo_produto) REFERENCES produtos(codigo)
);