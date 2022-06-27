<?php
  header("Access-Control-Allow-Origin: *");
  $arr=null;
  $conn = new mysqli("localhost", "hybrid_160419037","ubaya","hybrid_160419037");
  if($conn->connect_error) {
    $arr= ["result"=>"error","message"=>"unable to connect"];
  }

  $data=[];

  $mode = "0";
  if (isset($_POST['mode'])){
      $mode = $_POST['mode'];
  }

  if (isset($_POST['username']) && $mode == "1") {
    $sql= "SELECT * FROM `task_living` where user_living_username=? and date=DATE(CONVERT_TZ(CURRENT_TIMESTAMP(), '+00:00','+07:00'))";
    $stmt = $conn->prepare($sql);
    $username = $_POST['username'];
    $stmt->bind_param("s", $username); 
    $stmt->execute();
    $result = $stmt->get_result();
    while($r=mysqli_fetch_assoc($result))
      array_push($data,$r);
  }
  else if (isset($_POST['username']) && $mode == "0"){
    $sql= "SELECT DISTINCT(date) as distinctdate FROM task_living where user_living_username=? order by distinctdate desc";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $_POST['username']);
    $stmt->execute();
    $result = $stmt->get_result();
    while($r=mysqli_fetch_assoc($result)){
      $arrtemp = [];
      $sql2 = "SELECT * FROM task_living where user_living_username=? and date=?";
      $stmt2 = $conn->prepare($sql2);
      $stmt2->bind_param("ss", $_POST['username'], $r['distinctdate']);
      $stmt2->execute();
      $result2 = $stmt2->get_result();
      while($row=mysqli_fetch_assoc($result2)){
        array_push($arrtemp, $row);
      }
      array_push($data, ["date"=>$r['distinctdate'], "task"=>$arrtemp]);
    }
  }
  else if (isset($_POST['taskid'])){
    $sql= "SELECT * FROM `task_living` where id=?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $_POST['taskid']);
    $stmt->execute();
    $result = $stmt->get_result();
    while($r=mysqli_fetch_assoc($result))
      array_push($data,$r);
  }
  else {
    $sql= "SELECT * FROM `task_living` order by date desc";
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $result = $stmt->get_result();
    while($r=mysqli_fetch_assoc($result))
      array_push($data,$r);
  }

  $arr=["result"=>"success","data"=>$data];

  echo json_encode($arr);
  $stmt->close();
  $conn->close();
?>
