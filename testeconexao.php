<?php
$serverName = "localhost"; // localhost ou IP
$database = "makeup_site";
$username = "";
$password = "";

try {
    $conn = new PDO("sqlsrv:server=$serverName;Database=$database", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "Conexão com o SQL Server funcionando!";
} catch (PDOException $e) {
    echo "Erro na conexão: " . $e->getMessage();
}
?>
