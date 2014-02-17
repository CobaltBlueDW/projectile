<?php

require_once(dirname(__FILE__) . '/../lib/Base.php');

class Service extends Base {

    public function __construct() {
        parent::__construct();
    }

    /**
     * grabs the contents of the AJAX(JSON) call that prompted this execution
     * 
     * @return mixed
     */
    function getAjaxObj() {
        $data = file_get_contents("php://input");
        if (isset($data)) {
            return json_decode($data);
        } else {
            return null;
        }
    }

    /**
     * Send a return to the AJAX(JSON) call that prompted this execution
     * 
     * @param mixed $object
     */
    function returnAjaxObj($object) {
        header("Content-type: application/x-json");
        print json_encode($object);
    }
    
    function attemptCall(){
        if ($_GET['func'] && substr($_GET['func'], 0, 1) != '_' && method_exists($this, $_GET['func'])) {
            return $this->{$_GET['func']}($this->getAjaxObj());
        }
    }

    function _htmlRedirect($message = null, $url = null, $wait = 0) {
        if (!$url)
            $url = '/page/load/list';
        if (!$message)
            $message = "Redirecting to <a href='" . $url . "'>this page</a>.";
        $html = "<!DOCTYPE HTML PUBLIC '-//W3C//DTD HTML 4.0 Transitional//EN'><html><head>"
                . "<title>Your Page Title</title>"
                . "<meta http-equiv='REFRESH' content='$wait;url=" . $url . "'>"
                . "</head><body>"
                . $message
                . "</body></html>";
        die($html);
    }

    function _redirect($url) {
        global $config;
        header('Location: http://' . $_SERVER['HTTP_HOST'] . '/' . $config->paths->publicURL . '/' . $url);
        exit;
    }

    function _send404() {
        header("HTTP/1.0 404 Not Found");
        header("Status: 404 Not Found");
        die('Error 404: File Not Found.');
    }

    function _send500() {
        header("HTTP/1.0 500 Internal Server Error");
        header("Status: 500 Internal Server Error");
        die('Error 500: Internal Server Error.');
    }

}
