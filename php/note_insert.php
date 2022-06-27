<?php 
    header("Access-Control-Allow-Origin: *");
    $arr=null;
    $conn = new mysqli("localhost", "hybrid_160419037","ubaya","hybrid_160419037");
    if($conn->connect_error) {
    $arr= ["result"=>"error","message"=>"unable to connect"];
    }

    extract($_POST);
    $sql="INSERT INTO note_living(title, content, time, note_category_living_id, notebook_living_id) VALUES(?,?,DATE(CONVERT_TZ(CURRENT_TIMESTAMP(), '+00:00','+07:00')),?,?)";
    $stmt=$conn->prepare($sql);
    $stmt->bind_param("ssii", $title, $content, $category, $notebook);
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