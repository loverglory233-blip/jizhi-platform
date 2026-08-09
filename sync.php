<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit(0); }
header('Content-Type: application/json');

$dir = __DIR__ . '/data';
if (!file_exists($dir)) {
    @mkdir($dir, 0777, true);
}

$groupId = isset($_GET['groupId']) ? preg_replace('/[^a-zA-Z0-9_-]/', '', $_GET['groupId']) : 'group_1';
$filePath = $dir . "/sync_data_{$groupId}.json";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = file_get_contents('php://input');
    if (!empty($input)) {
        @file_put_contents($filePath, $input);
        $res = json_encode(['success' => true, 'timestamp' => time()]);
        header("Content-Length: " . strlen($res));
        echo $res;
        exit(0);
    } else {
        $res = json_encode(['success' => false, 'error' => 'empty body']);
        header("Content-Length: " . strlen($res));
        echo $res;
        exit(0);
    }
} else {
    if (file_exists($filePath) && filesize($filePath) > 0) {
        $content = @file_get_contents($filePath);
        if ($content) {
            header("Content-Length: " . strlen($content));
            echo $content;
            exit(0);
        }
    }
    $res = json_encode(['timestamp' => 0]);
    header("Content-Length: " . strlen($res));
    echo $res;
    exit(0);
}
