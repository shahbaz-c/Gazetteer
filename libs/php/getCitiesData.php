<?php

	$executionStartTime = microtime(true);

    $headers=array('x-rapidapi-key: ');

    $url='https://spott.p.rapidapi.com/places?country=' . $_REQUEST['isoCode'] . '&limit=10&skip=0&type=CITY&limit=' . $_REQUEST['limit'];

	$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$url);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    

	$result=curl_exec($ch);

	curl_close($ch);

	$decode = json_decode($result,true);
		

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
	$output['data'] = $decode;
	
	
	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output); 

?>