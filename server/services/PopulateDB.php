<?php

require_once(dirname(__FILE__).'/Service.php');

class PopulateDB extends Service {
    
    public function __construct() {
        parent::__construct();
    }
    
    public function grabJIRATicket($project){
        require_once(dirname(__FILE__).'/ScrapeJIRA.php');
        $username = 'dwipperfurth';
        $password = base64_decode('TWFkbWFuMTEh');  // resist the urge to decode this ;)
        $domain = 'jira.mpi.local';
        
        $sJIRA = new ScrapeJIRA($username, $password, $domain);
        $sJIRA->scrapeNewTicketPage($project);
    }
    
}

//test code
$test = new PopulateDB();
echo $test->grabJIRATicket('WCW');
die();