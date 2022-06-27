<?php
  header("Access-Control-Allow-Origin: *");
  $arr=null;
  $conn = new mysqli("localhost", "hybrid_160419037","ubaya","hybrid_160419037");
  if($conn->connect_error) {
    $arr= ["result"=>"error","message"=>"unable to connect"];
  }

  $data=[];
  if (isset($_POST['courseid'])){
    $sql= "SELECT * FROM course_living where id=?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $_POST['courseid']);
  }
  else {
    $sql= "SELECT * FROM course_living";
    $stmt = $conn->prepare($sql);
  }
  
  $stmt->execute();
  $result = $stmt->get_result();
  while($r=mysqli_fetch_assoc($result))
    array_push($data,$r);
  $arr=["result"=>"success","data"=>$data];

  echo json_encode($arr);
  $stmt->close();
  $conn->close();
?>
