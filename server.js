// server.js
import express from "express";
import mysql from "mysql2";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors({
  origin: "*", // permite qualquer origem
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));
app.use(express.static(path.join(__dirname)));

// Conexão MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "root",                 // troque pelo seu usuário
  password: "mariaclara1201", // troque pela sua senha
  database: "Makeup_site"
});

db.connect(err => {
  if (err) console.error("Erro ao conectar ao MySQL:", err);
  else console.log("Conectado ao MySQL!");
});

// Serve HTML
app.get("/cadastro", (req, res) => {
  res.sendFile(path.join(__dirname, "cadastro.html"));
});

// Rota POST de cadastro com logs detalhados
app.post("/cadastro", (req, res) => {
  console.log("=== Novo cadastro recebido ===");
  console.log("Dados do frontend:", req.body); // mostra tudo que chegou

  const { nome, cpf, telefone, cep, endereco, numero, bairro, cidade, estado, email, senha } = req.body;

  if (!nome || !email || !senha) {
    console.log("Campos obrigatórios faltando!");
    return res.status(400).json({ erro: "Nome, email e senha são obrigatórios!" });
  }

  const sql = `
    INSERT INTO clientes 
    (nome, cpf, telefone, cep, endereco, numero, bairro, cidade, estado, email, senha)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [nome, cpf, telefone, cep, endereco, numero, bairro, cidade, estado, email, senha], (err, result) => {
    if (err) {
      console.error("Erro ao cadastrar cliente no MySQL:", err);
      return res.status(500).json({ erro: err.message });
    }

    console.log("Cadastro realizado com sucesso!", result);
    res.status(201).json({ mensagem: "Cliente cadastrado com sucesso!" });
  });
});

// Rodar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
