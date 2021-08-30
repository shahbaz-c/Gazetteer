<?php

	$executionStartTime = microtime(true);

    $url='http://api.worldbank.org/v2/country/' . $_REQUEST['isoCode'] . '?format=json';

	$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$url);

	$capitalCity=curl_exec($ch);

	curl_close($ch);

	$capitalCityDecode = json_decode($capitalCity,true);

    
    $lat = $capitalCityDecode[1][0]['latitude'];
    $lng = $capitalCityDecode[1][0]['longitude'];

    $headers=array('x-rapidapi-host: trueway-places.p.rapidapi.com','x-rapidapi-key: ');

    $url1='https://trueway-places.p.rapidapi.com/FindPlacesNearby?location=' . $lat . ',' . $lng . '&language=en&radius=10000&type=museum';

	$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$url1);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    
	$poi=curl_exec($ch);

	curl_close($ch);

	$poiDecode = json_decode($poi,true);
		
	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
	$output['capitalCity'] = $capitalCityDecode;
    $output['poi'] = $poiDecode;
	
	
	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output); 

?>