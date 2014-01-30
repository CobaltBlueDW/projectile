<?php

class DatabaseManager {

    private static $preConns;        //presistant connection list

    /** 
     * Connect As:  Attempts to establish a new MySQLi connection the main database as a specific type of 'user'.
     * If the type of connection you are trying to make already exists, it will return that connectino to you.
     *
     * @param string $type The type of 'user' to connect as, e.g. default, widget, admin, custom, etc.
     */

    public static function connectAs($args) {
        if (!$args)
            return false;
        if ($preConns[$args->username])
            return $preConns[$args->username];

        $connection = @new mysqli($args->hostname, $args->username, $args->password, $args->database);
        if ($connection->connect_errno)
            throw new Exception($args->username + " failed to connect: " . $connection->connect_error);
        $preConns[$args->username] = @new DatabaseManager($connection, $args->username);

        return $preConns[$args->username];
    }

    public $insertID;                //The ID of the last inserted record
    public $affectedRows;        //The number of affected rows by the last operation
    protected $connection;        //MySQLi connection handle
    protected $type;                //The 'type' of connection, which defines the connections permissions with the MySQL DB

    /**        Constructor:  creates a DatabaseManager to be used for interfacing with the database.
     *        This function should not be used directly.  Use the Factory function 'connectAs' to
     *        actually create a DatabaseManager.
     *        Note:  The default constructor will throw an exception
     *        
     *        @param        mysqli        $connection        A MySQLi connection.
     */

    function __construct($connection = null, $type = 'custom') {
        if (!$connection)
            throw new Exception("Failed to create a DatabaseManager.  Try using 'DatabaseManager::connectAs(<type>)' to create an instance.");
        $this->connection = $connection;
        $this->type = $type;
    }

    /**        Query:  Attempts to execute a single query with variables 
     *        sanitized/sterilized and inserted.
     *
     *        @param        string        $queryString        A query to execute, with all variables
     *                                                                        denoted using printf style formating.
     *        @param        array or variable list        A list of values to be inserted into the
     *                                                                        query string, using printf rules for order
     *                                                                        and formating.
     */
    public function query($queryString, $vars = null) {
        if (!$queryString)
            throw new Exception($this->type . " failed a query: " . "No Query String Given.");

        if (!is_array($vars)) {
            $vars = func_get_args();
            array_shift($vars);
        }
        if (count($vars) > 0) {
            foreach ($vars as $key => $value) {
                $vars[$key] = $this->connection->real_escape_string($value);
            }
            $queryString = vsprintf($queryString, $vars);
        }

        $resource = $this->connection->query($queryString);
        if (!$resource)
            throw new Exception($this->type . " failed query(" . $queryString . "): " . $this->connection->error);

        $result = true;
        if (is_Object($resource)) {
            $result = $this->resultToArray($resource);
            $resource->free();
        }

        $this->insertID = $this->connection->insert_id;
        $this->affectedRows = $this->connection->affected_rows;
        return $result;
    }

    /**        Query To String:  returns the actual SQL string that would be executed if this query request was run.
     *
     *        @param        string        $queryString        A query to execute, with all variables
     *                                                                        denoted using printf style formating.
     *        @param        array or variable list        A list of values to be inserted into the
     *                                                                        query string, using printf rules for order
     *                                                                        and formating.
     */
    public function queryToString($queryString, $vars) {
        if (!$queryString)
            throw new Exception("queryToString failed:  No Query String Given.");

        if (!is_array($vars)) {
            $vars = func_get_args();
            array_shift($vars);
        }
        if (count($vars) > 0) {
            foreach ($vars as $key => $value) {
                $vars[$key] = $this->connection->real_escape_string($value);
            }
            $queryString = vsprintf($queryString, $vars);
        }

        return $queryString;
    }

    /** Query List:  Attemps to execute a list of queries.
     *
     *        @param        string        $queryString        A list of one or more queries.
     *        @return        resource                                The results set from the last query.
     */
    public function queryList($queryString) {
        $result = $this->connection->multi_query($queryString);
        if (!$result)
            throw new Exception($this->type . " failed a query: " . $this->connection->error);
        while ($this->connection->more_results() && $result = $this->connection->next_result()) {
            if (!$result)
                throw new Exception($this->type . " failed a query: " . $this->connection->error);
        }

        $this->insertID = $this->connection->insert_id;
        $this->affectedRows = $this->connection->affected_rows;
        return $result;
    }

    /** Query Batch:  Attemps to execute a list of queries from a file.
     *
     *        @param        string        $fileName        The name of an sql file to execute
     *        @return        resource                        The results set from the last query.
     */
    public function queryBatch($fileName) {
        return $this->queryList(file_get_contents($fileName, FILE_USE_INCLUDE_PATH));
    }

    public function resultToArray($resource) {
        $result;
        while ($temp = $resource->fetch_assoc()) {
            $result[] = $temp;
        }
        return $result;
    }

}