<?php

require_once(dirname(__FILE__).'/../config.php');
require_once(dirname(__FILE__).'/../db/DatabaseManager.php');

/**
 * This is the base class for all classes INSIDE the appilication, giving all
 * classes immediate access to application resources, like database access and
 * config settings.
 */
class Base {
    
    protected $db;
    protected $config;
    
    public function __construct() {
        global $config;
        
        $this->config = $config;
        $this->db = DatabaseManager::connectAs($this->config->dbinfo);
    }
    
}
