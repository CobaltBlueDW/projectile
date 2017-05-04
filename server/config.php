<?php

$config = (object)array(
    'dbinfo' => (object)array(
        'username' => 'projectile',
        'password' => 'password',
        'database' => 'projectile',
        'hostname' => '127.0.0.1'
    ),
    'JIRA' => (object)array(
        'username' => 'dwipperfurth',
        'password' => base64_decode('dGhpcyBpcyBub3QgYSByZWFsIHBhc3N3b3Jk'),    // resist the urge to decode this ;)
        'domain' => 'jira.mpi.local'
    )
);

