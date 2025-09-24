<?php
// Mostrar erros para debug
error_reporting(E_ALL);
ini_set('display_errors', 1);

include 'conexao.php';

$sql = "SELECT * FROM produtos";
$result = $conn->query($sql);
?>

<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <title>Produtos</title>
    <style>
        .produto {
            border: 1px solid #ddd;
            border-radius: 10px;
            padding: 10px;
            margin: 10px;
            width: 250px;
            text-align: center;
        }
    </style>
</head>
<body>

<h1>Lista de Produtos</h1>

<div style="display: flex; flex-wrap: wrap;">
    <?php if ($result && $result->num_rows > 0): ?>
        <?php while ($row = $result->fetch_assoc()): ?>
            <div class="produto">
                <img src="<?php echo htmlspecialchars($row['imagem']); ?>" alt="<?php echo htmlspecialchars($row['nome']); ?>" width="200px">
                <h3><?php echo htmlspecialchars($row['nome']); ?></h3>
                <p>R$<?php echo number_format($row['preco'], 2, ',', '.'); ?></p>
                <button>Comprar</button>
            </div>
        <?php endwhile; ?>
    <?php else: ?>
        <p>Nenhum produto encontrado.</p>
    <?php endif; ?>
</div>

</body>
</html>

<?php $conn->close(); ?>



