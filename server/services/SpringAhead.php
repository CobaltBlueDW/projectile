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
        
        $result = $this->db->query($sql, $params);
        
        // if a full/semi-full ticket is specified and no results are returned
        // make an attempt to scrape the JIRA page for it
        if (empty($result) && !empty($queryObj->projectName) && !empty($queryObj->ticketNumber)){
            global $config;
            require_once(dirname(__FILE__).'/ScrapeJIRA.php');
            $scraper = new ScrapeJIRA($config->JIRA->username, $config->JIRA->password, $config->JIRA->domain);
            $result = $scraper->scrapeNewTicketPage($queryObj->projectName, $queryObj->ticketNumber);
            if ($result) {
                return $this->db->query($sql, $params);
            }
        }
        
        return $result;
    }
    
    public function submitTimeLog($queryObj = null){
        
        // attempt to grab an associated ticket
        $projectName = null;
        $ticketNumber = null;
        if (!empty($queryObj->description)) {
            preg_match('/(\w{3,}-\d+)[\: ]/i', $queryObj->description, $matches);
            if (!empty($matches[1])) {
                list($projectName, $ticketNumber) = explode('-', strtoupper($matches[1]));
            }
        }
        
        $ticket = null;
        if (!empty($projectName) && !empty($ticketNumber)) {
            $sql = '
                SELECT * 
                FROM tickets
                WHERE projectName = "%1$s" AND ticketNumber = "%2$s"
            ';
            $params = array($projectName, $ticketNumber);
            $result = $this->db->query($sql, $params);
            if (!empty($result[0])) {
                $ticket = $result[0];
            }
        }
        
        // update revenueStream field
        if (!empty($ticket) && !empty($queryObj->projID)) {
            $ticket['revenueStream'] = $queryObj->projID;
            $sql = '
                UPDATE tickets 
                SET revenueStream = "%1$s"
                WHERE ticketID = %2$d
            ';
            $params = array($ticket['revenueStream'], $ticket['ticketID']);
            $result = $this->db->query($sql, $params);
        }
        
        //TODO: stuff
        return true;
    }
    
    public function getUserPreferences($queryObj = null){
        if(empty($queryObj->username)) return false;
        
        $sql = '
            select *
            from users
            where username = "%1$s"
        ';
        $params = array($queryObj->username);
        $user = $this->db->query($sql, $params);
        if(empty($user)) return false;
        
        return json_decode($user[0]['preferences']);
    }
    
    public function setUserPreferences($queryObj = null){
        if(empty($queryObj->username)) return false;
        if(empty($queryObj->preferences)) return false;
        
        //check if the user already exists
        $sql = '
            select *
            from users
            where username = "%1$s"
        ';
        $params = array($queryObj->username);
        $user = $this->db->query($sql, $params);
        
        //insert or update
        $result = false;
        if(empty($user)){
            $sql = '
                insert users(`username`,`preferences`)
                values ("%1$s", "2$s")
            ';
            $params = array($queryObj->username, json_encode($queryObj->preferences));
            $result = $this->db->query($sql, $params);
        }else{
            $sql = '
                update users
                set preferences = "%2$s"
                where username = "%1$s"
            ';
            $params = array($queryObj->username, json_encode($queryObj->preferences));
            $result = $this->db->query($sql, $params);
        }
        
        return $result;
    }
    
}

//serve code
$serve = new SpringAhead();
$serve->returnAjaxObj($serve->attemptCall());
