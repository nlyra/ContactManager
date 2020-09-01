<?php

    $inData = getRequestInfo();

    $userID = $inData["userID"];
    $firstName = $inData["firstName"];
    $lastName = $inData["lastName"];
    $email = $inData["email"];
    $phoneNumber = $inData["phoneNumber"];

    $conn = new mysqli("localhost", "nathaniellyra", "hello123", "contactmanager_database");

    if ($conn->connect_error)
    {
        returnWithError( $conn->connect_error);
    }
    else
    {
        $sql = "INSERT into Contact (userID, FirstName, LastName, Email, PhoneNumber) VALUES (' $userID ', ' $firstName ', ' $lastName ', ' $email ', ' $phoneNumber ')";

        if ( $result = $conn->query($sql) != TRUE )
        {
            returnWithError($conn->error);
        }

        $conn.close();
    }


    function getRequestInfo()
    {
        return json_decode(file_get_contents('php://input'), true);
    }

    function returnWithError( $err )
    {
        $retValue = '{"Error:"' . $err . '"}';
        sendResultInfoAsJson( $retValue );
    }

    function sendResultInfoAsJson( $obj )
    {
        header('Content-Type: application/json');
        echo $obj;
    }

?>
