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

	$query = $conn->prepare('SELECT count(d.id) as dc FROM location l left join department d on (l.id = d.locationID) where l.id = ?');

	$query->bind_param("i", $_POST["id"]);

	$query->execute();
	
	if (!$query) {

		$output['status']['code'] = "400";
		$output['status']['name'] = "executed";
		$output['status']['description'] = "query failed";	
		$output['data'] = [];

		mysqli_close($conn);

		echo json_encode($output); 

		exit;

	}

	$result = $query->get_result();
   
   	$returnedRecords = [];

	while ($row = mysqli_fetch_assoc($result)) {

		array_push($returnedRecords, $row);

	}

	if ($returnedRecords[0]['dc'] <= 0) {

		$query = $conn->prepare('DELETE FROM location WHERE id = ?');
	
		$query->bind_param("i", $_POST['id']);

		$query->execute();
		
		if (false === $query) {

			$output['status']['code'] = "400";
			$output['status']['name'] = "executed";
			$output['status']['description'] = "query failed";	
			$output['data'] = [];

			mysqli_close($conn);

			echo json_encode($output); 

			exit;

		}

		$output['status']['code'] = "200";
		$output['status']['name'] = "ok";
		$output['status']['description'] = "success";
		$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
		$output['data'] = 'Recored Deleted!';
		
		mysqli_close($conn);

		echo json_encode($output);

		exit;
	}

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = $returnedRecords;
	
	mysqli_close($conn);

	echo json_encode($output); 

?>