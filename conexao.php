<?php
$servidor = "localhost";
$usuario = "root";
$senha = ""; // sem senha
$banco = "makeup_site";

$conn = new mysqli($servidor, $usuario, $senha, $banco);

if ($conn->connect_error) {
    die("Erro na conexão: " . $conn->connect_error);
}
?>
