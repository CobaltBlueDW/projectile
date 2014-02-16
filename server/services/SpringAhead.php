<?php

require_once(dirname(__FILE__).'/Service.php');

class SpringAhead extends Service {
    
    public function __construct() {
        parent::__construct();
    }
    
    public function getShortTickets($queryObj = null){
        $sql = "
            SELECT ticketID, projectName, ticketNumber, description, revenueStream 
            FROM tickets
        ";
        $params = array();
        
        if($queryObj){
            $sql .= ' WHERE 1=1 ';
            if($queryObj->projectName){
                $sql .= ' AND projectName LIKE "%%%1$s%%" ';
                $params []= trim($queryObj->projectName);
            }
            if($queryObj->ticketNumber){
                $sql .= ' AND ticketNumber LIKE "%%%2$s%%" ';
                $params []= trim($queryObj->ticketNumber);
            }
        }
        $sql .= "
            ORDER BY ticketNumber ASC
            LIMIT 25
        ";
        
        return $this->db->query($sql, $params);
    }
    
}

//serve code
$serve = new SpringAhead();
$serve->returnAjaxObj($serve->attemptCall());