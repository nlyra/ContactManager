<?php

    $inData = getRequestInfo();

    $firstName = $inData["firstName"];
    $lastName = $inData["lastName"];
    $email = $inData["email"];
    $password = $inData["password"];

    $conn = new mysqli("localhost", "nathaniellyra", "hello123", "contactmanager_database");

    if ( $conn->connect_error )
    {
        returnWithError( $conn->connect_error );
    }
    else
    {
        $sql = "INSERT into user (FirstName, LastName, Password, Email) VALUES (' $firstName ', ' $lastName ', ' $password ', ' $email ')";

        if ( $result = $conn->query($sql) != TRUE )
        {
            returnWithError( $conn->error );
        }

        returnNormal();
        $conn->close();
    }

    function getRequestInfo()
    {
        return json_decode(file_get_contents('php://input'), true);
    }

    function returnWithError( $err )
    {
        $retValue = '{"error : "' . $err . '"}';
        sendResultInfoAsJson( $retValue );
    }

    function returnNormal()
    {
        $retValue = '{"error" : "none"}';
        sendResultInfoAsJson( $retValue );
    }

    function sendResultInfoAsJson( $obj )
    {
        header('Content-Type : application/json');
        echo $obj;
    }
?>
