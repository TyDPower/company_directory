<?php

	$executionStartTime = microtime(true);

	include("../common/config.php");

	header('Content-Type: application/json; charset=UTF-8');

	$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

	if (mysqli_connect_errno()) {
		
		$output['status']['code'] = "300";
		$output['status']['name'] = "failure";
		$output['status']['description'] = "database unavailable";
		$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
		$output['data'] = [];

		mysqli_close($conn);

		echo json_encode($output);

		exit;

	}	

	$dep = $_POST["obj"];

	$query = $conn->prepare('UPDATE department SET name = ?, locationID = ? WHERE id = ?');
	
	$query->bind_param("sii", $dep["name"], $dep["locID"], $dep["id"]);


	$query->execute();
	
	if (false === $query) {

		$output['status']['code'] = "400";
		$output['status']['name'] = "executed";
		$output['status']['description'] = "query failed";	

		echo json_encode($output);

		mysqli_close($conn); 

		exit;

	}

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	
	mysqli_close($conn);

	echo json_encode($output); 

?>