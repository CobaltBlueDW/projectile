<?php

$config = (object)array(
    'dbinfo' => (object)array(
        'username' => 'projectile',
        'password' => 'password',
        'database' => 'projectile',
        'hostname' => 'localhost'
    ),
    'JIRA' => (object)array(
        'username' => 'dwipperfurth',
        'password' => base64_decode('TWFkbWFuMTMh'),    // resist the urge to decode this ;)
        'domain' => 'jira.mpi.local'
    )
);

