<?php

require_once('../db/ProjectileModel.php');

$dbinfo = (object)array(
    'username' => 'projectile',
    'password' => 'password',
    'database' => 'projectile',
    'hostname' => 'localhost'
);
$db = DatabaseManager::connectAs($dbinfo);
$pm = new ProjectileModel($db);
$pm->install();