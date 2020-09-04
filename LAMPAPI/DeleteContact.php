<?php

  $inData = getRequest();

  $conn = new mysqli("localhost", "pedrocastano", "Qaz123wsx", "contactmanager_database");
  if($conn->connect_error)
  {
    returnError($conn->connect_error);
  }
  else
  {
    $sql = "DELETE FROM Contact WHERE userID = " . $inData["userID"] . " and FirstName = '"
            . $inData["firstName"] . "' and LastName = '" . $inData["lastName"] . "' and Email = '"
            . $inData["email"] . "' and PhoneNumber = '" . $inData["phoneNumber"] . "'";

    mysqli_query($conn, $sql);
    if (mysqli_affected_rows($conn) > 0)
      returnNormal();
    else
    {
      $err = "No Contact Found";
      returnError($err);
    }
  }

  function getRequest()
  {
    return json_decode(file_get_contents('php://input'), true);
  }

  function sendResultAsJson($obj)
  {
    header('Content-type: application/json');
    echo $obj;
  }

  function returnNormal()
  {
    $jsonObj = '{"error":"none"}';
    sendResultAsJson($jsonObj);
  }

  function returnError($err)
  {
    $jsonObj = '{"error":"' . $err . '"}';
    sendResultAsJson($jsonObj);
  }

?>
