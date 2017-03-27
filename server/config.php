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
        'password' => base64_decode('TWFkbWFuMjEh'),    // resist the urge to decode this ;)
        'domain' => 'jira.mpi.local'
    )
);

