<?php 
    header("Access-Control-Allow-Origin: *");
    $arr=null;
    $conn = new mysqli("localhost", "hybrid_160419037","ubaya","hybrid_160419037");
    if($conn->connect_error) {
    $arr= ["result"=>"error","message"=>"unable to connect"];
    }

    extract($_POST);
    $sql="UPDATE note_living set title=?, content=?, time=DATE(CONVERT_TZ(CURRENT_TIMESTAMP(), '+00:00','+07:00')), note_category_living_id=? where id=?";
    $stmt=$conn->prepare($sql);
    $stmt->bind_param("ssii", $title, $content, $category, $id);
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