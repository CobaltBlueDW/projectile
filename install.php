<?php

require_once(dirname(__FILE__).'/server/db/ProjectileModel.php');

$dbinfo = (object)array(
    'username' => 'projectile',
    'password' => 'password',
    'database' => 'projectile',
    'hostname' => 'localhost'
);
$db = DatabaseManager::connectAs($dbinfo);
$pm = new ProjectileModel($db);
$pm->install();