<?php

require_once(dirname(__FILE__).'/DatabaseModel.php');

class ProjectileModel extends DatabaseModel{
    
    public function __construct(DatabaseManager $db) {
        parent::__construct($db);
    }
    
    public function upgrade(){
        // create ticket table
    }
}