<?php 
    header("Access-Control-Allow-Origin: *");
    $arr=null;
    $conn = new mysqli("localhost", "hybrid_160419037","ubaya","hybrid_160419037");
    if($conn->connect_error) {
    $arr= ["result"=>"error","message"=>"unable to connect"];
    }

    extract($_POST);
    $sql="UPDATE notebook_living set title=? where id=?";
    $stmt=$conn->prepare($sql);
    $stmt->bind_param("si",$title,$id);
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