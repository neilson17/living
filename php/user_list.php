<?php
  header("Access-Control-Allow-Origin: *");
  $arr=null;
  $conn = new mysqli("localhost", "hybrid_160419037","ubaya","hybrid_160419037");
  if($conn->connect_error) {
    $arr= ["result"=>"error","message"=>"unable to connect"];
  }


  if (isset($_POST['username'])) {
    $sql= "SELECT * FROM user_living where username=?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $_POST['username']);
  }
  else {
    $sql= "SELECT * FROM user_living";
    $stmt = $conn->prepare($sql);
  }

  $stmt->execute();
  $result = $stmt->get_result();

  $data=[];
  if ($result->num_rows > 0) {
    while($r=mysqli_fetch_assoc($result))
      array_push($data,$r);
    $arr=["result"=>"success","data"=>$data];
  } else 
    $arr= ["result"=>"error","message"=>"sql error: $sql"];

  echo json_encode($arr);
  $stmt->close();
  $conn->close();
?>
