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
    
}

//serve code
$serve = new SpringAhead();
$serve->returnAjaxObj($serve->attemptCall());