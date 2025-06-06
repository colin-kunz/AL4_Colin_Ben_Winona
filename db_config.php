<?php
$host = 'localhost'; // Oder der Hostname deines Datenbankservers
$db_name = 'al4_db';   // Ersetze dies mit deinem Datenbanknamen
$username = 'al4';     // Dein Datenbankbenutzername (aus dem JS-Code)
$password = 'gfvw4zju7yq7m861'; // Dein Datenbankpasswort (aus dem JS-Code)
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db_name;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $username, $password, $options);
} catch (\PDOException $e) {
    // Im Produktionsbetrieb solltest du hier eine generische Fehlermeldung anzeigen
    // und den detaillierten Fehler loggen, anstatt ihn direkt auszugeben.
    error_log("Datenbankverbindungsfehler: " . $e->getMessage());
    die("Entschuldigung, es ist ein Problem mit der Datenbankverbindung aufgetreten. Bitte versuchen Sie es später erneut.");
}
