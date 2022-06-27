<?php
  header("Access-Control-Allow-Origin: *");
  $arr=null;
  $conn = new mysqli("localhost", "hybrid_160419037","ubaya","hybrid_160419037");
  if($conn->connect_error) {
    $arr= ["result"=>"error","message"=>"unable to connect"];
  }

  $data=[];
  if (isset($_POST['username'])) {
    $sql= "SELECT * FROM notebook_living nb inner join note_living n on nb.id = n.notebook_living_id where nb.user_living_username=? order by n.time desc";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $_POST['username']);
    $stmt->execute();
    $result = $stmt->get_result();
    while($r=mysqli_fetch_assoc($result))
      array_push($data,$r);
  }
  else if(isset($_POST['notebookid'])){
    $sql= "SELECT DISTINCT(nc.id) as catId, nc.name FROM note_living n inner join note_category_living nc on nc.id = n.note_category_living_id where n.notebook_living_id=?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $_POST['notebookid']);
    $stmt->execute();
    $result = $stmt->get_result();
    while($r=mysqli_fetch_assoc($result)){
      $arrtemp = [];
      $sql2 = "SELECT * FROM note_living where notebook_living_id=? and note_category_living_id=? order by time desc";
      $stmt2 = $conn->prepare($sql2);
      $stmt2->bind_param("ii", $_POST['notebookid'], $r['catId']);
      $stmt2->execute();
      $result2 = $stmt2->get_result();
      while($row=mysqli_fetch_assoc($result2)){
        array_push($arrtemp, $row);
      }
      array_push($data, ["idcategory"=>$r['catId'], "category"=>$r['name'], "note"=>$arrtemp]);
    }
  }
  else if (isset($_POST['noteid'])){
    $sql= "SELECT * FROM note_living where id=?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $_POST['noteid']);
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
