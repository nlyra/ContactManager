<?php

	$inData = getRequestInfo();
	$jsonArr = array();

	$conn = new mysqli("localhost", "pedrocastano", "Qaz123wsx", "contactmanager_database");
	if ($conn->connect_error)
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		$sql = "SELECT * FROM Contact WHERE (FirstName LIKE '%" . $inData["search"] . "%'"
					 . "OR LastName LIKE '%" . $inData["search"] . "%' OR PhoneNumber LIKE '%" . $inData["search"] . "%'"
					 . "OR Email LIKE '%" . $inData["search"] . "%') and userID = " . $inData["userID"];
		$result = $conn->query($sql);
		if ($result->num_rows > 0)
		{
			while($row = $result->fetch_assoc())
			{
				$arr = array("contactID" => $row["id"],
										 "firstName" => $row["FirstName"],
                     "lastName" => $row["LastName"],
                     "email" => $row["Email"],
                     "phoneNumber" => $row["PhoneNumber"]);

				array_push($jsonArr, $arr);
			}
			returnNormal( $jsonArr );
		}
		else
		{
			returnWithError( "No Records Found" );
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
		$retValue = '{"id": 0,"firstName": "","lastName": "","error": "' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}

	function returnNormal( $jsonArr )
	{
		$retValue = json_encode($jsonArr);
		sendResultInfoAsJson( $retValue );
	}

?>
