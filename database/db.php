<?php
$host = 'localhost'; 
$dbname = 'social_media_db'; 
$username = 'root'; 
$password = ''; 

try {
    // Set up the PDO connection
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    // If connection fails, display an error message
    die("Connection failed: " . $e->getMessage());
}
?>

