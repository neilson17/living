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

  $data=[];
  $likeJSON= "";
  if (isset($_POST['socialid'])){
    $sql= "SELECT * FROM post_living where id=?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $_POST['courseid']);
    $stmt->execute();
    $result = $stmt->get_result();
    while($r=mysqli_fetch_assoc($result))
      array_push($data,$r);
  }
  else if (isset($_POST['username']) && $mode == "0") {
    $sql= "SELECT * from post_living p inner join user_living u on p.user_living_username = u.username where u.username != ? order by p.time desc";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $_POST['username']);
    $stmt->execute();
    $result = $stmt->get_result();
    while($r=mysqli_fetch_assoc($result))
      array_push($data,$r);
    
    $like=[];
    $sql2= "SELECT post_living_id as postid from post_like_living where user_living_username=?";
    $stmt2 = $conn->prepare($sql2);
    $stmt2->bind_param("s", $_POST['username']);
    $stmt2->execute();
    $result2 = $stmt2->get_result();
    while($r2=mysqli_fetch_assoc($result2))
      array_push($like,$r2);

    $likeJSON=json_encode($like);
  }
  else if (isset($_POST['username']) && $mode == "1") {
    $sql= "SELECT * FROM post_like_living pl inner join post_living p on p.id=pl.post_living_id inner join user_living u on p.user_living_username = u.username where pl.user_living_username=? and u.username != ? order by p.time desc";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ss", $_POST['username'], $_POST['username']);
    $stmt->execute();
    $result = $stmt->get_result();
    while($r=mysqli_fetch_assoc($result))
      array_push($data,$r);
  }
  else if (isset($_POST['username']) && $mode == "2") {
    $sql= "SELECT * from post_living p inner join user_living u on p.user_living_username = u.username where u.username = ? order by p.time desc";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $_POST['username']);
    $stmt->execute();
    $result = $stmt->get_result();
    while($r=mysqli_fetch_assoc($result))
      array_push($data,$r);
  }
  
  $arr=["result"=>"success","post"=>$data, "like"=>$likeJSON];

  echo json_encode($arr);
  $stmt->close();
  $conn->close();
?>
