<?php

require_once(dirname(__FILE__).'/DatabaseManager.php');

class DatabaseModel{
    protected $db;
    
    /**
     * Creates a DatabaseModel class
     * 
     * @param DatabaseManager $db   A connection to a DB where the model should reside
     */
    public function __construct(DatabaseManager $db){
        $this->db = $db;
    }
    
    /**
     * Attempts to install the DatabaseModel
     * 
     * @return boolean  true on success, false on soft failure
     */
    public function install(){
        return $this->upgrade();
    }
    
    /**
     * Attempts to upgrade the data model on the DB
     * 
     * @return boolean  true on success, false on soft failure
     */
    public function upgrade(){
        return false;
    }
}
