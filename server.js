// server.js
import express from "express";
import mysql from "mysql2/promise";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

dotenv.config();

// Configurações básicas
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Middlewares
app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);
app.use(express.static(path.join(__dirname)));

// Configuração do banco MySQL
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "123abc",
  database: process.env.DB_DATABASE || "makeup_site",
};

// Conexão com o banco
let pool;
async function conectarBanco() {
  try {
    pool = await mysql.createPool(dbConfig);
    console.log("✅ Conectado ao MySQL!");
  } catch (err) {
    console.error("❌ Erro ao conectar ao MySQL:", err);
  }
}
conectarBanco();

// Rota para exibir o cadastro.html
app.get("/cadastro", (req, res) => {
  res.sendFile(path.join(__dirname, "cadastro.html"));
});

// Rota para cadastro de cliente
app.post("/cadastro", async (req, res) => {
  const {
    nome,
    cpf,
    telefone,
    cep,
    endereco,
    numero,
    bairro,
    cidade,
    estado,
    email,
    senha,
  } = req.body;

  if (!nome || !email || !senha) {
    return res
      .status(400)
      .json({ erro: "Nome, email e senha são obrigatórios!" });
  }

  try {
    // Criptografar a senha
    const hashedSenha = await bcrypt.hash(senha, 10);

    // Inserir no banco
    const sqlInsert = `
      INSERT INTO clientes 
      (nome, cpf, telefone, cep, endereco, numero, bairro, cidade, estado, email, senha)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await pool.execute(sqlInsert, [
      nome,
      cpf,
      telefone,
      cep,
      endereco,
      numero,
      bairro,
      cidade,
      estado,
      email,
      hashedSenha,
    ]);

    res.status(201).json({ mensagem: "Cliente cadastrado com sucesso!" });
  } catch (err) {
    console.error("❌ Erro ao cadastrar cliente:", err);
    res.status(500).json({ erro: err.message });
  }
});

// Rota para login
app.post("/login", async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ erro: "Email e senha são obrigatórios!" });
  }

  try {
    // Buscar usuário no banco
    const [rows] = await pool.execute(
      "SELECT * FROM clientes WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ erro: "Email não cadastrado!" });
    }

    const cliente = rows[0];
    const senhaCorreta = await bcrypt.compare(senha, cliente.senha);

    if (!senhaCorreta) {
      return res.status(401).json({ erro: "Senha incorreta!" });
    }

    res.json({ sucesso: true, cliente });
  } catch (err) {
    console.error("❌ Erro no login:", err);
    res.status(500).json({ erro: err.message });
  }
});

// Inicialização do servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
