<?php

    $inData = getRequestInfo();

    $firstName = $inData["firstName"];
    $lastName = $inData["lastName"];
    $email = $inData["email"];
    $password = $inData["password"];
    $question1 = $inData["question1"];
    $question2 = $inData["question2"];

    $conn = new mysqli("localhost", "nathaniellyra", "hello123", "contactmanager_database");

    if ( $conn->connect_error )
    {
        returnWithError( $conn->connect_error );
    }
    else
    {
        $sql = "INSERT into user (FirstName, LastName, Password, Email, securityQAnswer1, securityQAnswer2) VALUES ('$firstName', '$lastName', '$password', '$email', '$question1', '$question2')";

        if ( $result = $conn->query($sql) != TRUE )
        {
            returnWithError( $conn->error );
        }

        $conn->close();
        returnNormal();
    }

    function getRequestInfo()
    {
        return json_decode(file_get_contents('php://input'), true);
    }

    function returnWithError( $err )
    {
        $retValue = '{"error" : "' . $err . '"}';
        sendResultInfoAsJson( $retValue );
    }

    function returnNormal()
    {
        $retValue = '{"error":"none"}';
        sendResultInfoAsJson( $retValue );
    }

    function sendResultInfoAsJson( $obj )
    {
        header('Content-Type: application/json');
        echo $obj;
    }
?>
