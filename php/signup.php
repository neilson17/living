<?php 
    header("Access-Control-Allow-Origin: *");
    $arr=null;
    $conn = new mysqli("localhost", "hybrid_160419037","ubaya","hybrid_160419037");
    if($conn->connect_error) {
    $arr= ["result"=>"error","message"=>"unable to connect"];
    }

    extract($_POST);
    $sql = "INSERT INTO user_living (username, name, password) VALUES (?,?,?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sss", $username, $name, $password);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($stmt->affected_rows > 0) {
        $arr=["result"=>"success","data"=>$data];
    } else {
        $arr= ["result"=>"error","message"=>"sql error: $sql"];
    }
    echo json_encode($arr);
    $stmt->close();
    $conn->close();
?>