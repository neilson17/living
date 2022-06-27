<?php 
    header("Access-Control-Allow-Origin: *");
    $arr=null;
    $conn = new mysqli("localhost", "hybrid_160419037","ubaya","hybrid_160419037");
    if($conn->connect_error) {
    $arr= ["result"=>"error","message"=>"unable to connect"];
    }

    extract($_POST);
    $sql = "UPDATE user_living set name=?, password=? where username=?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sss", $name, $password, $username);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($stmt->affected_rows > 0) {
        $arr=["result"=>"success"];
    } else {
        $arr= ["result"=>"error","message"=>"sql error: $sql"];
    }
    echo json_encode($arr);
    $stmt->close();
    $conn->close();
?>