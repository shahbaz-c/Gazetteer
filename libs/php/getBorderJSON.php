<?php

    $executionStartTime = microtime(true);

    $borderData = json_decode(file_get_contents('../../countryBorders.geo.json'), true);

    $border = [];

    foreach ($borderData['features'] as $feature) {

        $temp = null;
        $temp['code'] = $feature["properties"]['iso_a2'];
        $temp['border'] = $feature['geometry'];
        

        array_push($border, $temp);
    }

    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "success";
    $output['status']['executedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
    $output['data'] = $border;

    header('Content-Type: application/json; charset=UTF-8');

    echo json_encode($output);

?>