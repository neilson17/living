<?php
  header("Access-Control-Allow-Origin: *");
  $arr=null;
  $conn = new mysqli("localhost", "hybrid_160419037","ubaya","hybrid_160419037");
  if($conn->connect_error) {
    $arr= ["result"=>"error","message"=>"unable to connect"];
  }

  $data=[];
  $sql= "SELECT * FROM motivation_living ORDER BY RAND() LIMIT 1";
  $stmt = $conn->prepare($sql);
  $stmt->execute();
  $result = $stmt->get_result();
  while($r=mysqli_fetch_assoc($result))
    array_push($data,$r);
  $arr=["result"=>"success","data"=>$data];

  echo json_encode($arr);
  $stmt->close();
  $conn->close();
?>
