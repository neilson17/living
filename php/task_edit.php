<?php
  header("Access-Control-Allow-Origin: *");
  $arr=null;
  $conn = new mysqli("localhost", "hybrid_160419037","ubaya","hybrid_160419037");
  if($conn->connect_error) {
    $arr= ["result"=>"error","message"=>"unable to connect"];
  }

  $mode = "0";
  if (isset($_POST['mode'])){
      $mode = $_POST['mode'];
  }

  if (isset($_POST['editedtaskid']) && isset($_POST['editeddone']) && $mode == "1") {
    $sql= "UPDATE task_living set done=? where id=?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ii", $_POST['editeddone'], $_POST['editedtaskid']);
  }
  else {
    extract($_POST);
    $sql="UPDATE task_living set task=?,date=? where id = ?";
    $stmt=$conn->prepare($sql);
    $stmt->bind_param("ssi",$task,$date,$id);
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