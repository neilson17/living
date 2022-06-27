<?php 
    header("Access-Control-Allow-Origin: *");
    $arr=null;
    $conn = new mysqli("localhost", "hybrid_160419037","ubaya","hybrid_160419037");
    if($conn->connect_error) {
    $arr= ["result"=>"error","message"=>"unable to connect"];
    }

    extract($_POST);
    $sql="DELETE FROM note_living where id=?";
    $stmt=$conn->prepare($sql);
    $stmt->bind_param("i", $id);
    $stmt->execute();
    if ($stmt->affected_rows > 0){
        $arr=["result"=>"success"]; 
    } else {
        $arr=["result"=>"fail"];
    }
    echo json_encode($arr);
    $stmt->close();
    $conn->close();
?>