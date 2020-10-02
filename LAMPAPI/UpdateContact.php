<?php
  $inData = getRequestInfo();
  $conn = new mysqli("localhost", "pedrocastano", "Qaz123wsx", "contactmanager_database");


  if ($conn->connect_error)
	{
		returnWithError( $conn->connect_error );
	}
  else
  {
    $contactID = $inData["contactID"];
    $firstName = $inData["firstName"];
    $lastName = $inData["lastName"];
    $email = $inData["email"];
    $phoneNumber = $inData["phoneNumber"];

    $sql = "UPDATE Contact SET FirstName = '$firstName', LastName = '$lastName', Email = '$email', PhoneNumber = '$phoneNumber' WHERE id = $contactID";
    $result = $conn->query($sql);

    if ($conn->affected_rows == 0)
    {
      returnWithError('Contact could not be updated.');
    }
    else
    {
      returnNormal();
    }

    $conn->close();
  }

  function getRequestInfo()
  {
    return json_decode(file_get_contents('php://input'), true);
  }

  function sendResultInfoAsJson( $obj )
  {
    header('Content-type: application/json');
    echo $obj;
  }

  function returnWithError( $err )
  {
    $retValue = '{"error":"' . $err . '"}';
    sendResultInfoAsJson( $retValue );
  }

  function returnNormal()
  {
    $retValue = '{"error": "none"}';
    sendResultInfoAsJson( $retValue );
  }

?>
