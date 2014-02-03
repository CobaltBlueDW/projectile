<?php

require_once(dirname(__FILE__).'/../lib/Base.php');

class Service extends Base{
    
    public function __construct() {
        parent::__construct();
    }
    
    /**
     * grabs the contents of the AJAX(JSON) call that prompted this execution
     * 
     * @return mixed
     */
    function getAjaxObj(){
        return json_decode($GLOBALS['HTTP_RAW_POST_DATA']);
    }

    /**
     * Send a return to the AJAX(JSON) call that prompted this execution
     * 
     * @param mixed $object
     */
    function returnAjaxObj($object){
        header("Content-type: application/x-json");
        print json_encode($object);
    }
    
}
