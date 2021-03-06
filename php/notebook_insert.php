<?php 
    header("Access-Control-Allow-Origin: *");
    $arr=null;
    $conn = new mysqli("localhost", "hybrid_160419037","ubaya","hybrid_160419037");
    if($conn->connect_error) {
    $arr= ["result"=>"error","message"=>"unable to connect"];
    }

    extract($_POST);
    $sql="INSERT INTO notebook_living(title,user_living_username) VALUES(?,?)";
    $stmt=$conn->prepare($sql);
    $stmt->bind_param("ss",$title,$username);
    $stmt->execute();
    if ($stmt->affected_rows > 0){
        $arr=["result"=>"success","id"=>$conn->insert_id]; 
    } else {
        $arr=["result"=>"fail","Error"=>$conn->error];
    }
    echo json_encode($arr);
    $stmt->close();
    $conn->close();
?>