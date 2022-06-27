<?php
  header("Access-Control-Allow-Origin: *");
  $arr=null;
  $conn = new mysqli("localhost", "hybrid_160419037","ubaya","hybrid_160419037");
  if($conn->connect_error) {
    $arr= ["result"=>"error","message"=>"unable to connect"];
  }

  $data=[];
  if (isset($_POST['username'])) {
    $sql= "SELECT * FROM notebook_living where user_living_username=?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $_POST['username']);
    $stmt->execute();
    $result = $stmt->get_result();

    while($r=mysqli_fetch_assoc($result)){
      $id = $r['id'];
      $stmt2 = $conn->prepare("SELECT COUNT(*) as jml FROM note_living where notebook_living_id=?");
      $stmt2->bind_param("i", $id);
      $stmt2->execute();
      $result2 = $stmt2->get_result();
      $countResult = mysqli_fetch_assoc($result2)['jml'];
      array_push($data, ['id' => $id, 'title' => $r['title'], 'count' => $countResult]);
    }
  } else if (isset($_POST['notebookid'])) {
    $sql= "SELECT * FROM notebook_living where id=?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $_POST['notebookid']);
    $stmt->execute();
    $result = $stmt->get_result();
    while($r=mysqli_fetch_assoc($result))
      array_push($data,$r);
  }
  else{
    $sql= "SELECT * FROM note_living n inner join notebook_living nb on nb.id = n.notebook_living_id order by n.time desc";
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
