<?php

require_once(dirname(__FILE__).'/Service.php');

class ScrapeJIRA extends Service{

    const TICKET_URL = 'browse';
    
    public $username;
    public $password;
    public $domain;
    public $projects = array(
        'CSTAGE' => true,
        'SCP' => true,
        'AHIP' => true,
        'ACRP' => true,
        'WCW' => true
    );
    
    public function __construct($username, $password, $domain){
        parent::__construct();
        
        $this->username = $username;
        $this->password = $password;
        $this->domain = $domain;
    }
    
    function scrapeNewTicketPage($projectName = null){
        //choose project to scrape from/for
        if (empty($projectName) || empty($this->projects[$projectName])) {
            $keys = array_keys($this->projects);
            $randIndex = mt_rand(0, count($keys)-1);
            $projectName = $keys[$randIndex];
        }
        
        //get which page we should scrape for
        $sql = '
            SELECT tickets.ticketNumber
            FROM tickets
            WHERE tickets.projectName = "%1$s"
            ORDER BY tickets.ticketNumber DESC
            LIMIT 1
        ';
        $result = $this->db->query($sql, array($projectName));
        if (empty($result) || empty($result[0])) {
            $ticketNumber = 1;
        } else {
            $ticketNumber = $result[0]['ticketNumber'];
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
        echo $page;
        if (empty($page)) return false;
        
        //scrape the page
        require_once(dirname(__FILE__).'/../lib/simple_html_dom.php');
        $page = str_get_html($page);
        
        //  Handle empty page
        // this selector doesn't work for some reason:  title:contains("Issue Does Not Exist")
        $emptyPage = stripos($page->find('title', 0)->plaintext, "Issue Does Not Exist") !== False;
        if ($emptyPage){
            echo 'empty page';
        }
        
        
        //put result
        
    }
}

