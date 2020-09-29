<?php

    $duplicate = 'Duplicate contact';
    $insertErr = 'Contact was not inserted properly';
    $inData = getRequestInfo();

    $userID = $inData["userID"];
    $firstName = $inData["firstName"];
    $lastName = $inData["lastName"];
    $email = $inData["email"];
    $phoneNumber = $inData["phoneNumber"];

    $conn = new mysqli("localhost", "nathaniellyra", "hello123", "contactmanager_database");

    if ($conn->connect_error)
    {
        returnWithError( $conn->connect_error );
    }
    else
    {
        $result = $conn->query("SELECT * from Contact WHERE userID = $userID AND FirstName = '$firstName' AND LastName = '$lastName' AND Email = '$email' AND PhoneNumber = '$phoneNumber'");

        if( $conn->affected_rows > 0 )
        {
            returnWithError( $duplicate );
            $conn->close();
            exit();
        }

        $sql = "INSERT into Contact (userID, FirstName, LastName, Email, PhoneNumber) VALUES ( $userID , '$firstName' , '$lastName' , '$email' , '$phoneNumber')";

        if ( $result = $conn->query($sql) != TRUE )
        {
            returnWithError( $conn->error );
        }

        $result = $conn->query("SELECT * from Contact WHERE userID = $userID AND FirstName = '$firstName' AND LastName = '$lastName' AND Email = '$email' AND PhoneNumber = '$phoneNumber'");

        if( $result->num_rows < 1)
        {
            returnWithError( $insertErr );
            $conn->close();
            exit();
        }

        $row = $result->fetch_assoc();
        $id = $row["id"];

        $conn->close();
        returnNormal( $id );
    }


    function getRequestInfo()
    {
        return json_decode(file_get_contents('php://input'), true);
    }

    function returnWithError( $err )
    {
        $retValue = '{"Error" : "' . $err . '"}';
        sendResultInfoAsJson( $retValue );
    }

    function returnNormal( $id )
    {
        $retVal = '{"contactID" : ' . $id . '}';
        sendResultInfoAsJson( $retVal );
    }

    function sendResultInfoAsJson( $obj )
    {
        header('Content-Type: application/json');
        echo $obj;
    }

?>
