<?php

require_once(dirname(__FILE__).'/Service.php');

class PopulateDB extends Service {
    
    public function __construct() {
        parent::__construct();
    }
    
    public function grabJIRATicket($project = null){
        require_once(dirname(__FILE__).'/ScrapeJIRA.php');
        $username = 'dwipperfurth';
        $password = base64_decode('TWFkbWFuMTEh');  // resist the urge to decode this ;)
        $domain = 'jira.mpi.local';
        
        $sJIRA = new ScrapeJIRA($username, $password, $domain);
        return $sJIRA->scrapeNewTicketPage($project);
    }
    
}

//test code
$test = new PopulateDB();
$test->_htmlRedirect($test->attemptCall(), "http://{$_SERVER['HTTP_HOST']}{$_SERVER['REQUEST_URI']}", 3);
die();