<?php

	$executionStartTime = microtime(true);
    
    $url = '../../countryBorders.geo.json';

    // Get contents of JSON file
    $result = file_get_contents($url);

    // Decode JSON file
    $decodeData = json_decode($result, true);
    $border = json_decode($result,true);


    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "success";
    $output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";

    $output['data'] = $decodeData;


    header('Content-Type: application/json; charset=UTF-8');

    
    echo json_encode($output);
    
?>