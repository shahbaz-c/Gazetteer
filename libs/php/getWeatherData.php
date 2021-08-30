<?php

	$executionStartTime = microtime(true);

	$url='http://api.geonames.org/countryInfoJSON?formatted=true&country=' . $_REQUEST['isoCode'] . '&username=shahbaz&style=full';


	$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$url);

	$geonames=curl_exec($ch);

	curl_close($ch);

	$geonames = json_decode($geonames,true);

	$capital = $geonames['geonames'][0]['capital'];

    $url1='api.openweathermap.org/data/2.5/weather?q=' . $capital . '&appid=&units=metric';

	$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$url1);

	$weather=curl_exec($ch);

	curl_close($ch);

	$weather = json_decode($weather,true);	
	
	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
	$output['geonames'] = $geonames;
	$output['weather'] = $weather;
	
	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output); 

?>