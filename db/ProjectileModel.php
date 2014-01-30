<?php

require_once('DatabaseModel.php');

class ProjectileModel extends DatabaseModel{
    
    public function __construct(\DatabaseManager $db) {
        parent::__construct($db);
    }
    
    public function upgrade(){
        $ticketExists = $this->db->query();
    }
}