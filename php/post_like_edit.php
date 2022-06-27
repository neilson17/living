<?php
    header("Access-Control-Allow-Origin: *");
    $arr=null;
    $conn = new mysqli("localhost", "hybrid_160419037","ubaya","hybrid_160419037");
    if($conn->connect_error) {
        $arr= ["result"=>"error","message"=>"unable to connect"];
    }

    $mode = $_POST['like'];
    if ($mode == 1) {
        $sql= "INSERT INTO post_like_living (post_living_id, user_living_username) VALUES (?,?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("is", $_POST['postid'], $_POST['username']);
    }
    else{
        $sql= "DELETE FROM post_like_living where post_living_id=? and user_living_username=?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("is", $_POST['postid'], $_POST['username']);
    }

    $stmt->execute();
    if ($stmt->affected_rows > 0)
        $arr=["result"=>"success"];
    else 
        $arr=["result"=>"fail","Error"=>$conn->error];

    echo json_encode($arr);
    $stmt->close();
    $conn->close();
?>