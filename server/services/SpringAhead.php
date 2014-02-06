<?php

require_once(dirname(__FILE__).'/Service.php');

class SpringAhead extends Service {
    
    public function __construct() {
        parent::__construct();
    }
    
    public function getShortTickets(){
        $sql = "
            SELECT ticketID, projectName, ticketNumber, description, revenueStream 
            FROM tickets
        ";
        $params = array();
        return $this->db->query($sql, $params);
    }
    
}

//serve code
$serve = new SpringAhead();
$serve->returnAjaxObj($serve->attemptCall());