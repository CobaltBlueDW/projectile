<?php

require_once(dirname(__FILE__).'/Service.php');

class ScrapeJIRA extends Service{

    const TICKET_URL = 'browse';
    
    public $username;
    public $password;
    public $domain;
    public $projects = array(
        'CSTAGE' => 3000,
        'SCP' => 1000,
        'AHIP' => 1500,
        'ACRP' => 1,
        'WCW' => 400,
        'CHEC' => 100,
        'ACA' => 1
    );
    
    public function __construct($username, $password, $domain){
        parent::__construct();
        
        $this->username = $username;
        $this->password = $password;
        $this->domain = $domain;
    }
    
    function scrapeNewTicketPage($projectName = null, $ticketNumber = null){
        //format input
        if (!empty($projectName)) {
            $projectName = strtoupper($projectName);
        }
        
        //choose project to scrape from/for
        if (empty($projectName)) {
            $keys = array_keys($this->projects);
            $randIndex = mt_rand(0, count($keys)-1);
            $projectName = $keys[$randIndex];
        }
        
        //get which page we should scrape for
        if (empty($ticketNumber)) {
            $sql = '
                SELECT tickets.ticketNumber
                FROM tickets
                WHERE tickets.projectName = "%1$s"
                ORDER BY (tickets.ticketNumber * 1) DESC
                LIMIT 1
            ';
            $result = $this->db->query($sql, array($projectName));
            if (empty($result) || empty($result[0])) {
                if ($this->projects[$projectName] > 1) {
                    $ticketNumber = $this->projects[$projectName];
                } else {
                    $ticketNumber = 1;
                }
            } else {
                $ticketNumber = $result[0]['ticketNumber'] + 1;
            }
        }
        
        //grab the page
        $curl = curl_init();
        curl_setopt_array($curl, array(
            CURLOPT_USERPWD => "{$this->username}:{$this->password}",
            CURLOPT_URL => "http://{$this->domain}/".self::TICKET_URL."/{$projectName}-{$ticketNumber}",
            CURLOPT_RETURNTRANSFER => 1,
            CURLOPT_FOLLOWLOCATION => 1,
            CURLOPT_SSL_VERIFYPEER => 0,
            CURLOPT_SSL_VERIFYHOST => 0
        ));
        $page = curl_exec($curl);
        //echo $page;
        if (empty($page)) return false;
        
        //scrape the page
        require_once(dirname(__FILE__).'/../lib/simple_html_dom.php');
        $page = str_get_html($page);
        
        $ticket = new stdClass();
        $ticket->projectName = $projectName;
        $ticket->ticketNumber = $ticketNumber;
        $ticket->description = null;
        $ticket->priority = null;
        $ticket->status = null;
        $ticket->resolution = null;
        $ticket->revenueStream = null;
        $ticket->data = new stdClass();
        
        // handle fields normally
        if (count($page->find('#summary-val')) > 0) {
            $ticket->description = trim($page->find('#summary-val', 0)->plaintext);
        }
        if (count($page->find('#status-val')) > 0){
            $ticket->status = trim($page->find('#status-val', 0)->plaintext);
        }
        if (count($page->find('#priority-val')) > 0){
            $ticket->priority = trim($page->find('#priority-val', 0)->plaintext);
        }
        if (count($page->find('#resolution-val')) > 0){
            $ticket->resolution = trim($page->find('#resolution-val', 0)->plaintext);
        }
        
        //  Handle empty page
        // this selector doesn't work for some reason:  title:contains("Issue Does Not Exist")
        $emptyPage = stripos($page->find('title', 0)->plaintext, "Issue Does Not Exist") !== False;
        if ($emptyPage){
            $ticket->status = "undefined";
        }
        
        //  Handle redirected issues
        if(count($page->find('#key-val')) > 0){
            $fullkey = trim($page->find('#key-val', 0)->plaintext);
            if($projectName.'-'.$ticketNumber != $fullkey){
                $ticket->data->redirect = $fullkey;
            }
        }
        
        //put result
        $sql = '
            INSERT tickets(`projectName`, `ticketNumber`, `status`, `priority`, `resolution`, `description`, `revenueStream`, `data`)
            VALUES ("%1$s", "%2$s", "%3$s", "%4$s", "%5$s", "%6$s", "%7$s", "%8$s")
        ';
        $params = array(
            $ticket->projectName,
            $ticket->ticketNumber,
            $ticket->status,
            $ticket->priority,
            $ticket->resolution,
            $ticket->description,
            $ticket->revenueStream,
            json_encode($ticket->data)
        );
        
        $result = $this->db->query($sql, $params);
        
        return $result;
    }
}

