<?php
$db = new SQLite3('makeup.sqlite');

$db->exec("
CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    senha TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS marcas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS categorias (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS produtos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    descricao TEXT,
    preco REAL NOT NULL,
    imagem TEXT,
    categoria_id INTEGER,
    marca_id INTEGER,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id),
    FOREIGN KEY (marca_id) REFERENCES marcas(id)
);

CREATE TABLE IF NOT EXISTS pedidos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER,
    data_pedido TEXT DEFAULT CURRENT_TIMESTAMP,
    total REAL,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);
");

$db->exec("INSERT INTO categorias (nome) VALUES 
('Gloss'), ('Batom'), ('Máscaras'), ('Esponja'), 
('Para Pele'), ('Plush'), ('Pó'), ('Base'), ('Serum')");

$db->exec("INSERT INTO marcas (nome) VALUES 
('Boca Rosa'), ('Bruna Tavares'), ('Franciny Ehlke'), ('Mari Maria')");

$db->exec("INSERT INTO produtos (nome, descricao, preco, imagem, categoria_id, marca_id) VALUES 
('Hidra lábios', 'Gloss labial hidratante da linha Boca Rosa', 29.90, 'imagens/hidra_labios.png', 1, 1),
('BT Plush Mauve', 'Produto híbrido entre blush e batom na cor Mauve', 36.90, 'imagens/bt_plush.png', 6, 2)
");

$db->exec("INSERT INTO usuarios (nome, email, senha) VALUES 
('Maria', 'fernandesclara256@gmail.com', 'senha123'),
('Beatriz', 'beatriz@email.com', 'senha456'),
('Livia', 'livia@email.com', 'senha789')
");

echo "Banco SQLite criado com sucesso!";
?>
