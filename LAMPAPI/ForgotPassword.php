<?php

  $inData = getRequestInfo();
  $conn = new mysqli("localhost", "pedrocastano", "Qaz123wsx", "contactmanager_database");

  $email = $inData["email"];
  $question1 = $inData["question1"];
  $question2 = $inData["question2"];
  $password = $inData["password"];

  if ($conn->connect_error)
	{
		returnWithError( $conn->connect_error );
	}
  else
  {
    $sql = "SELECT userID, securityQAnswer1, securityQAnswer2 FROM user WHERE Email = '$email'";
    $result = $conn->query($sql);

    if ($result->num_rows < 1)
    {
      returnWithError('No user found');
    }
    else
    {
      $row = $result->fetch_assoc();

      if ($row["securityQAnswer1"] != $question1 || $row["securityQAnswer2"] != $question2)
      {
        returnWithError('Question answers do not match');
      }
      else
      {
        $id = $row["userID"];
        $sql = "UPDATE user SET Password = '$password' WHERE userID = $id";

        if ($conn->query($sql) != TRUE)
        {
          returnWithError($conn->error);
        }
        else
        {
          returnNormal();
        }
      }
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
