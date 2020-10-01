<?php

  $indata = getRequest();

  $id = 0;
  $firstName = "";
  $lastName = "";

  $conn = new mysqli("localhost", "pedrocastano", "Qaz123wsx", "contactmanager_database");
  if($conn->connect_error)
  {
    returnError($conn->connect_error);
  }
  else
  {
    $sql = "SELECT userID,FirstName,LastName FROM user WHERE Email = '" . $indata["email"] . "' and Password = '" . $indata["password"] . "'";
    $result = $conn->query($sql);
    if ($result->num_rows > 0)
    {
      $row = $result->fetch_assoc();
      $firstName = $row["FirstName"];
      $lastName = $row["LastName"];
      $id = $row["userID"];

      returnNormal($firstName, $lastName, $id);
    }
    else
    {
      returnError("No Records Found");
    }
    $conn->close();
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

  function returnNormal($firstName, $lastName, $id)
  {
    $retVal = '{"id":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","error":""}';
    sendResultAsJson($retVal);
  }

  function returnError($err)
  {
    $retVal = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
    sendResultAsJson($retVal);
  }

?>
