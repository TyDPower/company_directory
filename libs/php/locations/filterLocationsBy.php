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

	$azArr = array('DESC', 'ASC');
	$orderArr = array('name', 'id', 'location');
	
	if ($_POST['filter']['locations'] > 0 && $_POST['filter']['departments'] > 0) {
		$locs = $_POST['filter']['locations'];
		$locsCount = str_repeat('?, ', count($locs) - 1) . '?';
		$az = $_POST['filter']['ascOrDsc'];
		if (!in_array($az, $azArr)) {
			$az = 'ASC';
		};
		$order = $_POST['filter']['orderBy'];
		if (!in_array($order, $orderArr)) {
			$order = 'lastName';
		};
		$query = null;

		$query = $conn->prepare("SELECT * FROM location where id in ($locsCount) ORDER BY $order $az");

		$types = str_repeat('i', count($locs));
		$query->bind_param($types, ...$locs);
		$query->execute();
	}

	
	if (false === $query) {

		$output['status']['code'] = "400";
		$output['status']['name'] = "executed";
		$output['status']['description'] = "query failed";	
		$output['data'] = [];

		echo json_encode($output); 
	
		mysqli_close($conn);
		exit;

	}

	$result = $query->get_result();

   	$data = [];

	while ($row = mysqli_fetch_assoc($result)) {

		array_push($data, $row);

	}

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = $data;

	header('Content-Type: application/json; charset=UTF-8');
	
	echo json_encode($output); 

	mysqli_close($conn);

?>