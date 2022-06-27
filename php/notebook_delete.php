<?php 
    header("Access-Control-Allow-Origin: *");
    $arr=null;
    $conn = new mysqli("localhost", "hybrid_160419037","ubaya","hybrid_160419037");
    if($conn->connect_error) {
    $arr= ["result"=>"error","message"=>"unable to connect"];
    }

    extract($_POST);
    $sql="DELETE FROM note_living where notebook_living_id=?";
    $stmt=$conn->prepare($sql);
    $stmt->bind_param("i", $id);
    $stmt->execute();

    $sql2="DELETE FROM notebook_living where id=?";
    $stmt2=$conn->prepare($sql2);
    $stmt2->bind_param("i", $id);
    $stmt2->execute();

    $arr=["result"=>"success"]; 
    echo json_encode($arr);
    $stmt->close();
    $conn->close();
?>