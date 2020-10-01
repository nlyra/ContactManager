<?php

  $inData = getRequest();

  $conn = new mysqli("localhost", "pedrocastano", "Qaz123wsx", "contactmanager_database");
  if ($conn->connect_error)
    returnError($conn->connect_error);
  else
  {
    $sql = "SELECT * FROM Contact WHERE userID = '" . $inData["userID"] . "' ORDER BY LastName";
    $result = $conn->query($sql);
    if ($result->num_rows > 0)
    {
      $jsonArr = array();
      for ($i = 0; $i < $result->num_rows; ++$i)
      {
        $row = $result->fetch_assoc();

        $arr = array("contactID" => $row["id"],
                     "firstName" => $row["FirstName"],
                     "lastName" => $row["LastName"],
                     "email" => $row["Email"],
                     "phoneNumber" => $row["PhoneNumber"]);

        array_push($jsonArr, $arr);
      }

      returnNormal($jsonArr);
    }
    else
    {
      $err = "No Contacts Found";
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

  function returnNormal($jsonArr)
  {
    $retVal = json_encode($jsonArr);
    sendResultAsJson($retVal);
  }

  function returnError($err)
  {
    $retVal = '{"contactID":0,"firstName":"","lastName":"","email":"","phoneNumber":"","error":"' . $err . '"}';
    sendResultAsJson($retVal);
  }

?>
