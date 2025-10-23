// server.js
import express from "express";
import sql from "mssql";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));
app.use(express.static(path.join(__dirname)));


const dbConfig = {
  user: process.env.DB_USER || "sa",
  password: process.env.DB_PASSWORD || "",
  server: process.env.DB_SERVER || "localhost\\SQLEXPRESS",
  database: process.env.DB_DATABASE || "makeup_site",
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
};


let pool;
async function conectarBanco() {
  try {
    pool = await sql.connect(dbConfig);
    console.log("✅ Conectado ao SQL Server!");
  } catch (err) {
    console.error("❌ Erro ao conectar ao SQL Server:", err);
  }
}
conectarBanco();


app.get("/cadastro", (req, res) => {
  res.sendFile(path.join(__dirname, "cadastro.html"));
});


app.post("/cadastro", async (req, res) => {
  const { nome, cpf, telefone, cep, endereco, numero, bairro, cidade, estado, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ erro: "Nome, email e senha são obrigatórios!" });
  }

  try {
    
    const hashedSenha = await bcrypt.hash(senha, 10);

    const result = await pool.request()
      .input("nome", sql.VarChar, nome)
      .input("cpf", sql.VarChar, cpf)
      .input("telefone", sql.VarChar, telefone)
      .input("cep", sql.VarChar, cep)
      .input("endereco", sql.VarChar, endereco)
      .input("numero", sql.VarChar, numero)
      .input("bairro", sql.VarChar, bairro)
      .input("cidade", sql.VarChar, cidade)
      .input("estado", sql.VarChar, estado)
      .input("email", sql.VarChar, email)
      .input("senha", sql.VarChar, hashedSenha)
      .query(`
        INSERT INTO clientes 
        (nome, cpf, telefone, cep, endereco, numero, bairro, cidade, estado, email, senha)
        VALUES (@nome, @cpf, @telefone, @cep, @endereco, @numero, @bairro, @cidade, @estado, @email, @senha)
      `);

    res.status(201).json({ mensagem: "Cliente cadastrado com sucesso!" });
  } catch (err) {
    console.error("❌ Erro ao cadastrar cliente:", err);
    res.status(500).json({ erro: err.message });
  }
});


app.post("/login", async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ erro: "Email e senha são obrigatórios!" });
  }

  try {
    const result = await pool.request()
      .input("email", sql.VarChar, email)
      .query("SELECT * FROM clientes WHERE email = @email");

    if (result.recordset.length === 0) {
      return res.status(401).json({ erro: "Email não cadastrado!" });
    }

    const cliente = result.recordset[0];
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


app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
