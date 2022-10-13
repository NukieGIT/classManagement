<?php 

    function cors() {
        // Allow from any origin
        if (isset($_SERVER['HTTP_ORIGIN'])) {
            header("Access-Control-Allow-Origin: *");
            header("Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS");
            header("Access-Control-Allow-Headers: Origin, Authorization, X-Requested-With, Content-Type, Accept");
            header('Access-Control-Allow-Credentials: true');
            header('Access-Control-Max-Age: 86400');    // cache for 1 day
        }

        // Access-Control headers are received during OPTIONS requests
        if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {

            if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
                // may also be using PUT, PATCH, HEAD etc
                header("Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS");

            if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
                header("Access-Control-Allow-Headers: Origin, Authorization, X-Requested-With, Content-Type, Accept");

            exit(0);
        }
    }
    cors();


    try {

        $host = "localhost";
        $dbname = "classManagement";
        $user = "root";
        $dbPass = "";

        $conn = new PDO("mysql:host=$host;dbname=$dbname", $user, $dbPass);

        $out = ["error" => false];

        $username = $_POST["user"];
        $password = $_POST["password"];

        if ((!isset($username)) || $username == "") {
            $out["error"] = true;
            $out["message"] = "Wybierz poprawne konto";
        } else if ((!isset($password)) || $password == "") {
            $out["error"] = true;
            $out["message"] = "Błędne hasło";
        } else {
            $out["message"] = "Zalogowano";
        }


        $conn = null;

        header("Content-type: application/json");
        echo json_encode($out);
        die();

    } catch (PDOException $err) {
        echo $err;
    }

?>