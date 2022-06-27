var $$ = Dom7;

var device = Framework7.getDevice();
var app = new Framework7({
  name: '160419037_ProjectUTS', // App name
  theme: 'auto', // Automatic theme detection
  el: '#app', // App root element

  id: 'io.framework7.myapp', // App bundle ID
  // App store
  store: store,
  // App routes
  routes: routes,


  // Input settings
  input: {
    scrollIntoViewOnFocus: device.cordova && !device.electron,
    scrollIntoViewCentered: device.cordova && !device.electron,
  },
  // Cordova Statusbar settings
  statusbar: {
    iosOverlaysWebView: true,
    androidOverlaysWebView: false,
  },
  on: {
    init: function () {
      var f7 = this;
      if (f7.device.cordova) {
        // Init cordova APIs (see cordova-app.js)
        cordovaApp.init(f7);
      }
    },
  },
});

app.request.post("http://ubaya.fun/hybrid/160419037/uts/motivation_list.php", { }, function(data) { 
  var arr = JSON.parse(data);
  var motivation_api = arr['data'];
  $$("#textmotivation").html("<i>\"" + motivation_api[0]["quote"] + "\"</i>");
  $$("#textquoteby").html("<i>-" + motivation_api[0]["quote_by"] + "</i>");
});

setTimeout(function(){
  $$("#preloaderhome").remove();
}, 4000);

//#region Filling Up Data Index

// Update Date
var today = new Date();
weekday = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday');
dayOfMonth = today + ( today.getDate() < 10) ? '0' + today.getDate() : today.getDate();
months = new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December');
$$("#textdategreet").html(weekday[today.getDay()] + ", " + months[today.getMonth()] + " " + dayOfMonth + ", " + today.getFullYear());

// Update Data for User
if(localStorage.username) {
  // Fill in User Name
  app.request.post("http://ubaya.fun/hybrid/160419037/uts/user_list.php", { "username": localStorage.username }, function(data) { 
    var arr = JSON.parse(data);
    var user_api = arr['data'];
    $$("#textusernamegreet").html("Hi, " + user_api[0].name+"!");
  });

  // Changing Menu Display
  $$('#menulogin').attr('href', '/home/2');
  $$('#iconmenulogin').html('square_arrow_left');
  $$('#textmenulogin').html('Logout');

  app.request.post("http://ubaya.fun/hybrid/160419037/uts/note_list.php", { "username": localStorage.username }, function(data) { 
    var arr = JSON.parse(data);
    var note_list = arr['data'];
    if (note_list != null){
      $$("#notelisthome").html("");
      var header = "<div class='swiper-slide' style='width:42vw !important;'><a style='width:100%; height:100%; display: flex; justify-content: center; align-items: center;' href='/addnote/-1'>Add Note</a></div>";
      var htmlTemp = [];
      note_list.forEach((t, index) => {
        temp = `
          <div class="swiper-slide">
            <a style='color: black; width:100%; height:100%;' href="/note/${t.id}/-1">
              <h5 style='margin: 7px 7px 3px 7px; overflow: hidden; line-height: 1.2em; max-height: 2.4em;'>${t.title}</h5>
              <p style='margin: 3px 7px 7px 7px; overflow: hidden; font-size: 12px; line-height: 1.5em; max-height:9em;'>${t.content}</p>
            </a> 
          </div>
        `;
        htmlTemp.push(temp);
      });
      htmlTemp.push(header);
     
      var swiper = app.swiper.create('.swipernotelist', {
        // speed: 1000,
        // observer: true,
        pagination: {el: ".swiperpagenotelist", type: "bullets" },
        spaceBetween:20,
        slidesPerView:2,
        // loop: true,
        speed: 500,
        // loop: true,
        loopedSlides: note_list.length + 1,
        observer: true
      });
      swiper.appendSlide(htmlTemp);
    }
  });

  app.request.post("http://ubaya.fun/hybrid/160419037/uts/task_list.php", { "username": localStorage.username, "mode":"1" }, function(data) { 
    var arr = JSON.parse(data);
    var task_list = arr['data'];
    var htmlTemp = "<li><label class='item-content'><i style='color:#50be2e;margin-left: -5px; margin-right: 10px;' class='icon f7-icons'>plus_app</i><div class='item-inner'><div class='item-title'><a href='/addtask'><b>Add New Task</b></a></div></div></label></li>";
    if (task_list != null){
      task_list.forEach((t, index) => {
        var checked = (t.done == 1) ? "checked" : "";
        htmlTemp = `
          <li>
            <label class="item-checkbox item-content">
              <input id='${t.id}' type="checkbox" class='checkboxtask' name="demo-checkbox" ${checked} />
              <i class="icon icon-checkbox"></i>
              <div class="item-inner">
                <div class="item-title">${t.task}</div>
              </div>
            </label>
          </li>
        ` + htmlTemp;
      });
    }
    $$("#todolisthome").html(htmlTemp);
  });
}

$$("body").on('click', '.deletetask', function(){
  app.request.post('http://ubaya.fun/hybrid/160419037/uts/task_delete.php', 
    {"id":$$(this).attr('taskiddeleted')} , 
    function (data) {
      var arr = JSON.parse(data); 
      var result=arr['result'];
      if(result=='success'){
        app.dialog.alert('Success Deleting Task!');
      }   
      else app.dialog.alert('Fail Deleting Task!');
    }
  );
});

$$("body").on('change', '.checkboxtask', function(){
  var done = $$(this).is(":checked") ? 1 : 0;
  app.request.post('http://ubaya.fun/hybrid/160419037/uts/task_edit.php', 
    { "mode":"1", "editedtaskid":$$(this).attr('id'), "editeddone": done } , 
    function (data) {
      var arr = JSON.parse(data); 
      var result=arr['result'];
      if(result!='success') app.dialog.alert('Error finishing task!');
    }
  );
});

$$("body").on('click', '.likepost1', function(){
  var likedpost = parseInt($$(this).attr('liked'));
  if (likedpost == 1) $$(this).html("heart_fill");
  else $$(this).html("heart");
  if (likedpost == 1) $$(this).attr("liked", "2");
  else $$(this).attr("liked", "1");
  app.request.post('http://ubaya.fun/hybrid/160419037/uts/post_like_edit.php', 
    { "like": likedpost, "postid":$$(this).attr('postid'), "username": localStorage.username } , 
    function (data) {
      var arr = JSON.parse(data); 
      var result=arr['result'];
      if(result!='success') app.dialog.alert('Error Liking Post!');
    }
  );
  $$("#tab-2-content").html("");
  app.request.post('http://ubaya.fun/hybrid/160419037/uts/social_list.php', { "username":localStorage.username, "mode":"1" } , 
          function (data) {
            var arr = JSON.parse(data); 
            var post=arr['post'];
            if (post != null){
              post.forEach((t, index) => {
                $$('#tab-2-content').append(`
                  <div class="card demo-facebook-card">
                      <div class="card-header">
                        <div class="demo-facebook-name" style='font-size: 12px; margin-left: 5px;'>${t.name}</div>
                        <div class="demo-facebook-date" style='font-size: 12px; margin-left: 5px;'>${t.time}</div>
                      </div>
                      <div class="card-content card-content-padding">
                        <p style='font-size:12px;'>${t.content}</p>
                      </div>
                      <div class="card-footer"><i postid='${t.id}' liked='2' style='font-size: 30px;' class='likepost f7-icons'>heart_fill</i><a style='font-size: 12px;' href="/post/${t.id}" class="link"></a></div>
                  </div>
                `);
              });
            }
          }
      );
});


$$("body").on('click', '.likepost', function(){
  var likedpost = parseInt($$(this).attr('liked'));
  if (likedpost == 1) $$(this).html("heart_fill");
  else $$(this).html("heart");
  if (likedpost == 1) $$(this).attr("liked", "2");
  else $$(this).attr("liked", "1");
  app.request.post('http://ubaya.fun/hybrid/160419037/uts/post_like_edit.php', 
    { "like": likedpost, "postid":$$(this).attr('postid'), "username": localStorage.username } , 
    function (data) {
      var arr = JSON.parse(data); 
      var result=arr['result'];
      if(result!='success') app.dialog.alert('Error Liking Post!');
    }
  );
  $$("#tab-1-content").html("");
  app.request.post('http://ubaya.fun/hybrid/160419037/uts/social_list.php', { "username":localStorage.username, "mode":"0" } , 
          function (data) {
            var arr = JSON.parse(data); 
            var post=arr['post'];
            var data2=arr['like'];
            var like=JSON.parse(data2);
            var likepostid = [];
            for(var i = 0; i < like.length; i++) likepostid.push(like[i]['postid']);
            if (post != null){
              post.forEach((t, index) => {
                var liked = ((likepostid.includes(t.id)) ? "heart_fill" : "heart");
                var likedValue = ((likepostid.includes(t.id)) ? "2" : "1");
                $$('#tab-1-content').append(`
                  <div class="card demo-facebook-card">
                      <div class="card-header">
                        <div class="demo-facebook-name" style='font-size: 12px; margin-left: 5px;'>${t.name}</div>
                        <div class="demo-facebook-date" style='font-size: 12px; margin-left: 5px;'>${t.time}</div>
                      </div>
                      <div class="card-content card-content-padding">
                        <p style='font-size:12px;'>${t.content}</p>
                      </div>
                      <div class="card-footer"><i postid='${t.id}' liked='${likedValue}' style='font-size: 30px;' class='likepost1 f7-icons'>${liked}</i><a style='font-size: 12px;' href="/post/${t.id}" class="link"></a></div>
                  </div>
                `);
              });
            }
          }
      );
});

//#endregion

$$(document).on('page:afterin', function (e, page) { 
  if(page.name != "home" && page.name!="signup"){
    if(!localStorage.username) { 
      page.router.navigate('/login');
    }
  }
});

$$(document).on('page:init', function (e, page) {
  if (page.name == "home"){
    // Logout
    var id=page.router.currentRoute.params.id;
    if (id == 2){
      localStorage.removeItem("username");
    }

    // Update Date
    var today = new Date();
    weekday = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday');
    dayOfMonth = today + ( today.getDate() < 10) ? '0' + today.getDate() : today.getDate();
    months = new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December');
    $$("#textdategreet").html(weekday[today.getDay()] + ", " + months[today.getMonth()] + " " + dayOfMonth + ", " + today.getFullYear());

    if(localStorage.username) {
      // Fill in User Name
      app.request.post("http://ubaya.fun/hybrid/160419037/uts/user_list.php", { "username": localStorage.username }, function(data) { 
        var arr = JSON.parse(data);
        var user_api = arr['data'];
        $$("#textusernamegreet").html("Hi, " + user_api[0].name +"!");
      });

      // Changing Menu Display
      $$('#menulogin').attr('href', '/home/2');
      $$('#iconmenulogin').html('square_arrow_left');
      $$('#textmenulogin').html('Logout');

      app.request.post("http://ubaya.fun/hybrid/160419037/uts/note_list.php", { "username": localStorage.username }, function(data) { 
        var arr = JSON.parse(data);
        var note_list = arr['data'];
        if (note_list != null){
          $$("#notelisthome").html("");
          var header = "<div class='swiper-slide' style='width:42vw !important;'><a style='width:100%; height:100%; display: flex; justify-content: center; align-items: center;' href='/addnote/-1'>Add Note</a></div>";
          var htmlTemp = [];
          note_list.forEach((t, index) => {
            temp = `
              <div class="swiper-slide">
                <a style='color: black; width:100%; height:100%;' href="/note/${t.id}/-1">
                  <h5 style='margin: 7px 7px 3px 7px; overflow: hidden; line-height: 1.2em; max-height: 2.4em;'>${t.title}</h5>
                  <p style='margin: 3px 7px 7px 7px; overflow: hidden; font-size: 12px; line-height: 1.5em; max-height:9em;'>${t.content}</p>
                </a> 
              </div>
            `;
            htmlTemp.push(temp);
          });
          htmlTemp.push(header);
        
          var swiper = app.swiper.create('.swipernotelist', {
            pagination: {el: ".swiperpagenotelist", type: "bullets" },
            spaceBetween:20,
            slidesPerView:2,
            speed: 500,
            // loop: true,
            loopedSlides: note_list.length + 1,
            observer: true
          });
          swiper.appendSlide(htmlTemp);
        }
      });

      app.request.post("http://ubaya.fun/hybrid/160419037/uts/task_list.php", { "username": localStorage.username, "mode":"1" }, function(data) { 
        var arr = JSON.parse(data);
        var task_list = arr['data'];
        var htmlTemp = "<li><label class='item-content'><i style='color:#50be2e;margin-left: -5px; margin-right: 10px;' class='icon f7-icons'>plus_app</i><div class='item-inner'><div class='item-title'><a href='/addtask'><b>Add New Task</b></a></div></div></label></li>";
        if (task_list != null){
          task_list.forEach((t, index) => {
            var checked = (t.done == 1) ? "checked" : "";
            htmlTemp = `
              <li>
                <label class="item-checkbox item-content">
                  <input id='${t.id}' type="checkbox" class='checkboxtask' name="demo-checkbox" ${checked} />
                  <i class="icon icon-checkbox"></i>
                  <div class="item-inner">
                    <div class="item-title">${t.task}</div>
                  </div>
                </label>
              </li>
            ` + htmlTemp;
          });
          $$("#todolisthome").html(htmlTemp);
        }
      });
    } else {
      $$('#menulogin').attr('href', '/login');
      $$('#iconmenulogin').html('square_arrow_right');
      $$('#textmenulogin').html('Login');
      $$("#textnamegreet").html("Hi, Awesome People!");
      $$("#notelisthome").html("<div class='swiper-slide'><a style='width:100%; height:100%; display: flex; justify-content: center; align-items: center;' href='/addnote/-1'>Add Note</a></div>")
      $$("#todolisthome").html(`<li>
                                  <label class="item-content">
                                    <i style="color:#50be2e;margin-left: -5px; margin-right: 10px;" class="icon f7-icons">plus_app</i>
                                    <div class="item-inner">
                                      <div class="item-title"><a href="/addtask"><b>Add New Task</b></a></div>
                                    </div>
                                  </label>
                                </li>`);
    }
  }  
  else if (page.name == "login"){
    
    $$("#btnsignin").on('click', function(){
      app.request.post('http://ubaya.fun/hybrid/160419037/uts/login.php', {
        "username" : $$("#username").val(),
        "password" : $$("#password").val()
      }, function(data){
        var arr = JSON.parse(data);
        var result = arr['result'];
        if (result == "success"){
          localStorage.username = $$("#username").val();
          page.router.navigate('/home/1');
        } else {
          app.dialog.alert("Username or Password is inccorect!");
        }
      })
    });
  }
  else if (page.name == "signup"){
    $$("#btnsignup").on('click', function(){
      app.request.post('http://ubaya.fun/hybrid/160419037/uts/signup.php', {
        "username" : $$("#usernamesignup").val(),
        "name" : $$("#namesignup").val(),
        "password" : $$("#passwordsignup").val()
      }, function(data){
        var arr = JSON.parse(data);
        var result = arr['result'];
        if (result == "success"){
          localStorage.username = $$("#usernamesignup").val();
          page.router.navigate('/home/1');
        } else {
          app.dialog.alert("Username is taken!");
        }
      })
    });
  }
  else if (page.name == "notebook"){
    if (localStorage.username){
      app.request.post("http://ubaya.fun/hybrid/160419037/uts/notebook_list.php", { "username": localStorage.username }, function(data) { 
        var arr = JSON.parse(data);
        var notebook_list = arr['data'];
        notebook_list.forEach((t, index) => {
          $$("#listnotebook").append(`
              <li>
                  <a href="/notelist/${t.id}" class="item-link item-content">
                      <div class="item-inner">
                          <div class="item-title-row">
                              <div class="item-title"><b>${t.title}</b></div>
                          </div>
                          <div class="item-subtitle">${t.count} Notes</div>
                          <div class="item-text"></div>
                      </div>
                  </a>
              </li>
            `);
        });
      });
    }
  }
  else if (page.name == "addnotebook"){
    $$('#btnsubmit').on('click', function() {
      app.request.post('http://ubaya.fun/hybrid/160419037/uts/notebook_insert.php', 
        {"title":$$("#tx_title").val(),"username":localStorage.username } , 
        function (data) {
          var arr = JSON.parse(data); 
          var result=arr['result'];
          if(result=='success'){
            app.dialog.alert('Success Adding Notebook!');
            app.view.main.router.navigate('/notebook',
            {
              reloadCurrent: true,
              pushState: false
            });
          }   
          else app.dialog.alert('Fail Adding Notebook!');
        }
      );
    });
  }
  else if (page.name == "notelist"){
    var id=page.router.currentRoute.params.id;
    $$("#linkeditnotebook").attr("href", "/editnotebook/"+id.toString());
    $$("#addnotebutton").attr('href', ('/addnote/' + id.toString()));
    app.request.post("http://ubaya.fun/hybrid/160419037/uts/notebook_list.php", { "notebookid": id }, function(data) { 
        var arr = JSON.parse(data);
        var notebook_list = arr['data'];
        $$("#notebooktitle").html("<b>" + notebook_list[0]['title'] + "</b>");
    });

    app.request.post("http://ubaya.fun/hybrid/160419037/uts/note_list.php", { "notebookid": id }, function(data) { 
        var arr = JSON.parse(data);
        var note_category_list = arr['data'];
        note_category_list.forEach((t, index) => {
          $$("#listnotelist").append(`<li class="item-divider">${t.category}</li>`);
          t.note.forEach((t1, index1) => {
            $$("#listnotelist").append(`
                    <li>
                      <a href="/note/${t1.id}/${id}" style='padding:0 !important;' class="item-link item-content">
                          <div class="card" style='width:100%'>
                              <div class="card-header"><b>${t1.title}</b></div>
                              <div class="card-content card-content-padding"><p style='font-size:0.8em; max-height: 4em;'>${t1.content}</p></div>
                              <div style='font-size:16px;' class="card-footer"><p style='font-size:0.8em;'>${t1.time}</p></div>
                          </div>
                      </a>
                    </li>
                        `);
          });
        });
    });

    $$("#linkdeletenotebook").on('click', function(){
      app.request.post('http://ubaya.fun/hybrid/160419037/uts/notebook_delete.php', {"id":id}, function(data){
        var arr = JSON.parse(data); 
        var result=arr['result'];
        if(result=='success'){
          app.dialog.alert('Success Deleting Notebook!');
        }   
        else app.dialog.alert('Fail Deleting Notebook!');
        app.view.main.router.navigate('/notebook',
          {
            reloadCurrent: true,
            pushState: false
          });
      });
    });
  }
  else if (page.name == "addnote"){
    var notebookid=page.router.currentRoute.params.id;

    app.request.post("http://ubaya.fun/hybrid/160419037/uts/notebook_list.php", { "username": localStorage.username }, function(data) { 
        var arr = JSON.parse(data);
        var notebook_list = arr['data'];
        notebook_list.forEach((t, index) => {
          var selected = "";
          if (notebookid != -1) selected = ((notebookid == t.id) ? " selected" : "");
          else selected = ((t.id == 1) ? " selected" : "");
          $$("#sel_notebook").append("<option value='" + t.id +"'"+selected + ">" + t.title +"</option>");
        });
      });

    app.request.post("http://ubaya.fun/hybrid/160419037/uts/note_category_list.php", {}, function(data) {
        var arr = JSON.parse(data);
        var category=arr['data'];
        category.forEach((t, index) => {
          $$('#sel_category').append("<option value='" + t.id +"'>" + t.name +"</option>");
        });
    });

    $$('#btnsubmit').on('click', function() {
      app.request.post('http://ubaya.fun/hybrid/160419037/uts/note_insert.php', 
        {"title":$$("#tx_title").val(), "content": $$("#tx_content").val(), "category": $$('#sel_category').val(), "notebook":$$('#sel_notebook').val() } , 
        function (data) {
          var arr = JSON.parse(data); 
          var result=arr['result'];
          if(result=='success'){
            app.dialog.alert('Success Adding Note!');
            if (notebookid != -1){
              app.view.main.router.navigate('/notelist/'+ notebookid,
              {
                reloadCurrent: true,
                pushState: false
              });
            }
            else page.router.navigate('/home/1');
          }   
          else app.dialog.alert('Fail Adding Note!');
        }
      );
    });
  }
  else if (page.name == "note"){
    var noteid=page.router.currentRoute.params.id;
    var notebookid=page.router.currentRoute.params.notebookid;

    var chosenCategory = 0;
    app.request.post("http://ubaya.fun/hybrid/160419037/uts/note_list.php", {"noteid":noteid}, function(data) {
        var arr = JSON.parse(data);
        var notes=arr['data'];
        $$("#tx_title").val(notes[0]["title"]);
        $$("#tx_content").val(notes[0]["content"]);
        app.input.resizeTextarea("#tx_content");
        chosenCategory = notes[0]["note_category_living_id"];
    });

    app.request.post("http://ubaya.fun/hybrid/160419037/uts/note_category_list.php", {}, function(data) {
        var arr = JSON.parse(data);
        var category=arr['data'];
        category.forEach((t, index) => {
          var selected = ((chosenCategory == t.id) ? " selected" : "");
          $$('#sel_category').append("<option value='" + t.id +"'"+ selected+">" + t.name +"</option>");
        });
    });

    $$('#btnsubmit').on('click', function() {
      app.request.post('http://ubaya.fun/hybrid/160419037/uts/note_edit.php', 
        {"title":$$("#tx_title").val(), "content": $$("#tx_content").val(), "category": $$('#sel_category').val(), "id":noteid } , 
        function (data) {
          var arr = JSON.parse(data); 
          var result=arr['result'];
          if(result=='success'){
            app.dialog.alert('Success Editing Note!');
          }   
          else app.dialog.alert('Fail Editing Note!');
          app.view.main.router.navigate('/notelist/' + notebookid,
          {
            reloadCurrent: true,
            pushState: false
          });
        }
      );
    });

    $$("#delete-note").on('click', function() {
      app.request.post('http://ubaya.fun/hybrid/160419037/uts/note_delete.php', {"id":noteid}, function(data){
        var arr = JSON.parse(data); 
        var result=arr['result'];
        if(result=='success'){
          app.dialog.alert('Success Deleting Note!');
        }   
        else app.dialog.alert('Fail Deleting Note!');
        app.view.main.router.navigate('/notelist/' + notebookid,
        {
          reloadCurrent: true,
          pushState: false
        });
      });
    });

    // $$("#noteback").on('click', function() {
    //   app.view.main.router.back('/notelist/'+ notebookid,
    //   {
    //     reloadCurrent: true,
    //     pushState: false
    //   });
    // });
  }
  else if (page.name == "editnotebook"){
    var notebookid=page.router.currentRoute.params.id;

    app.request.post("http://ubaya.fun/hybrid/160419037/uts/notebook_list.php", { "notebookid": notebookid }, function(data) { 
      var arr = JSON.parse(data);
      var notebook_list = arr['data'];
      $$("#tx_title").val(notebook_list[0]['title']);
    });

    $$('#btnsubmit').on('click', function() {
      app.request.post('http://ubaya.fun/hybrid/160419037/uts/notebook_edit.php', 
        {"title":$$("#tx_title").val(),"id" : notebookid } , 
        function (data) {
          var arr = JSON.parse(data); 
          var result=arr['result'];
          if(result=='success'){
            app.dialog.alert('Success Editing Notebook!');
            app.view.main.router.navigate('/notelist/' + notebookid,
            {
              reloadCurrent: true,
              pushState: false
            });
          }   
          else app.dialog.alert('Fail Editing Notebook!');
        }
      );
    });
  }
  else if (page.name == "task"){
    if (localStorage.username){
      app.request.post("http://ubaya.fun/hybrid/160419037/uts/task_list.php", { "username": localStorage.username, "mode": "0" }, function(data) { 
          var arr = JSON.parse(data);
          var task_list = arr['data'];
          if (task_list != null){
            task_list.forEach((t, index) => {
              $$("#listtasklist").append(`<li class="item-divider">${t.date}</li>`);
              if (t.task !=null){
                t.task.forEach((t1, index1) => {
                  var checked = (t1.done == 1) ? "checked" : "";
                  $$("#listtasklist").append(`
                        <li class="swipeout">
                          <div class="item-content swipeout-content">
                              <div class="item-media">
                                  <label class="item-checkbox item-content">
                                      <input id='${t1.id}' type="checkbox" class='checkboxtask' name="demo-checkbox"
                                          ${checked} />
                                      <i class="icon icon-checkbox"></i>
                                  </label>
                              </div>
                              <div class="item-inner">
                                  <div class="item-title">${t1.task}</div>
                              </div>
                          </div>
                          <div class="swipeout-actions-right">
                              <a href="/edittask/${t1.id}">Edit</a>
                              <a taskiddeleted='${t1.id}' href="#" class="deletetask swipeout-delete">Delete</a>
                          </div>
                        </li>
                              `);
                });
              }
            });
          }
      });
    }
  }
  else if (page.name == "addtask"){
    app.calendar.create({
      inputEl: '#tx_date',
      closeOnSelect : true,
      dateFormat: "yyyy-mm-dd"      
    });

    $$('#btnsubmit').on('click', function() {
      app.request.post('http://ubaya.fun/hybrid/160419037/uts/task_insert.php', 
        {"task":$$("#tx_task").val(), "date":$$("#tx_date").val(),
        "done":0, "username":localStorage.username } , 
        function (data) {
          var arr = JSON.parse(data); 
          var result=arr['result'];
          if(result=='success'){
            app.dialog.alert('Success Adding Task');
            app.view.main.router.navigate('/task',
            {
              reloadCurrent: true,
              pushState: false
            });
          }   
          else app.dialog.alert('Fail Adding Task');
        }
      );
    });
  }
  else if (page.name == "courselist"){
    if (localStorage.username){
      app.request.post('http://ubaya.fun/hybrid/160419037/uts/course_list.php', {  } , 
          function (data) {
            var arr = JSON.parse(data); 
            var course=arr['data'];
            if (course != null){
              course.forEach((t, index) => {
                $$('#listcourse').append(`
                  <li>
                    <a href="/course/${t.id}" class="item-link item-content">
                    <div class="item-media"><img src="${t.imagelink}"
                        width="80" /></div>
                    <div class="item-inner">
                        <div class="item-title-row">
                        <div class="item-title">${t.name}</div>
                        <div class="item-after">$${t.price}</div>
                        </div>
                        <div style='font-size: 12px;' class="item-subtitle"><i style='font-size: 12px; margin-right:5px;' class='f7-icons'>timer</i>${t.learning_time}</div>
                        <div style='font-size: 12px;' class="item-text">${t.description}</div>
                    </div>
                    </a>
                  </li>
                `);
              });
            }
          }
      );
    }
  }
  else if (page.name == "course"){
    var id=page.router.currentRoute.params.id;

    app.request.post('http://ubaya.fun/hybrid/160419037/uts/course_list.php', { "courseid":id } , 
        function (data) {
          var arr = JSON.parse(data); 
          var course=arr['data'];
          if (course != null){
            $$('#imagecourse').attr('src', course[0].imagelink);
            $$('#titlecourse').html(course[0].name);
            $$('#timecourse').html("<i style='font-size: 12px; margin-right:5px;' class='f7-icons'>timer</i>" + course[0].learning_time);
            $$('#pricecourse').html("$" + course[0].price);
            $$('#descriptioncourse').html(course[0].description);
            $$('#linkcourse').attr('href', course[0].link);
          }
        }
    );
  }
  else if (page.name == "social"){
    if (localStorage.username){
      app.request.post('http://ubaya.fun/hybrid/160419037/uts/social_list.php', { "username":localStorage.username, "mode":"0" } , 
          function (data) {
            var arr = JSON.parse(data); 
            var post=arr['post'];
            var data2=arr['like'];
            var like=JSON.parse(data2);
            var likepostid = [];
            for(var i = 0; i < like.length; i++) likepostid.push(like[i]['postid']);
            if (post != null){
              post.forEach((t, index) => {
                var liked = ((likepostid.includes(t.id)) ? "heart_fill" : "heart");
                var likedValue = ((likepostid.includes(t.id)) ? "2" : "1");
                $$('#tab-1-content').append(`
                  <div class="card demo-facebook-card">
                      <div class="card-header">
                        <div class="demo-facebook-name" style='font-size: 12px; margin-left: 5px;'>${t.name}</div>
                        <div class="demo-facebook-date" style='font-size: 12px; margin-left: 5px;'>${t.time}</div>
                      </div>
                      <div class="card-content card-content-padding">
                        <p style='font-size:12px;'>${t.content}</p>
                      </div>
                      <div class="card-footer"><i postid='${t.id}' liked='${likedValue}' style='font-size: 30px;' class='likepost1 f7-icons'>${liked}</i><a style='font-size: 12px;' href="/post/${t.id}" class="link"></a></div>
                  </div>
                `);
              });
            }
          }
      );
      
      app.request.post('http://ubaya.fun/hybrid/160419037/uts/social_list.php', { "username":localStorage.username, "mode":"1" } , 
          function (data) {
            var arr = JSON.parse(data); 
            var post=arr['post'];
            if (post != null){
              post.forEach((t, index) => {
                $$('#tab-2-content').append(`
                  <div class="card demo-facebook-card">
                      <div class="card-header">
                        <div class="demo-facebook-name" style='font-size: 12px; margin-left: 5px;'>${t.name}</div>
                        <div class="demo-facebook-date" style='font-size: 12px; margin-left: 5px;'>${t.time}</div>
                      </div>
                      <div class="card-content card-content-padding">
                        <p style='font-size:12px;'>${t.content}</p>
                      </div>
                      <div class="card-footer"><i postid='${t.id}' liked='2' style='font-size: 30px;' class='likepost f7-icons'>heart_fill</i><a style='font-size: 12px;' href="/post/${t.id}" class="link"></a></div>
                  </div>
                `);
              });
            }
          }
      );

      app.request.post('http://ubaya.fun/hybrid/160419037/uts/social_list.php', { "username":localStorage.username, "mode":"2" } , 
          function (data) {
            var arr = JSON.parse(data); 
            var post=arr['post'];
            if (post != null){
              post.forEach((t, index) => {
                $$('#tab-3-content').append(`
                  <div class="card demo-facebook-card">
                      <div class="card-header">
                        <div class="demo-facebook-name" style='font-size: 12px; margin-left: 5px;'>${t.name}</div>
                        <div class="demo-facebook-date" style='font-size: 12px; margin-left: 5px;'>${t.time}</div>
                      </div>
                      <div class="card-content card-content-padding">
                        <p style='font-size:12px;'>${t.content}</p>
                      </div>
                      <div class="card-footer"><i></i><a style='font-size: 12px;' href="/post/${t.id}" class="link"></a></div>
                  </div>
                `);
              });
            }
          }
      );
    }
  }
  else if (page.name == "addpost"){
    $$('#btnsubmit').on('click', function() {
      app.request.post('http://ubaya.fun/hybrid/160419037/uts/post_insert.php', 
        {"content": $$("#tx_content").val(), "username": localStorage.username } , 
        function (data) {
          var arr = JSON.parse(data); 
          var result=arr['result'];
          if(result=='success'){
            app.dialog.alert('Success Adding Post!');
            app.view.main.router.navigate('/social',
            {
              reloadCurrent: true,
              pushState: false
            });
          }   
          else app.dialog.alert('Fail Adding Post!');
        }
      );
    });
  }
  else if (page.name == "edittask"){
    var id=page.router.currentRoute.params.id;

    app.request.post("http://ubaya.fun/hybrid/160419037/uts/task_list.php", { "taskid": id }, function(data) { 
      var arr = JSON.parse(data);
      var task = arr['data'];
      $$("#tx_task").val(task[0]['task']);
      $$("#tx_date").val(task[0]['date']);
    });

    $$('#btnsubmit').on('click', function() {
      app.request.post('http://ubaya.fun/hybrid/160419037/uts/task_edit.php', 
        {"task":$$("#tx_task").val(), "date":$$("#tx_date").val(), "id":id} , 
        function (data) {
          var arr = JSON.parse(data); 
          var result=arr['result'];
          if(result=='success'){
            app.dialog.alert('Success Editing Task!');
            app.view.main.router.navigate('/task',
            {
              reloadCurrent: true,
              pushState: false
            });
          }   
          else app.dialog.alert('Fail Editing Task!');
        }
      );
    });
  }
  else if (page.name == "settings"){
    if(localStorage.username){
      app.request.post("http://ubaya.fun/hybrid/160419037/uts/user_list.php", { "username": localStorage.username }, function(data) { 
        var arr = JSON.parse(data);
        var user_api = arr['data'];
        $$("#usernamesettings").val(user_api[0].username);
        $$("#namesettings").val(user_api[0].name);
        $$("#passwordsettings").val(user_api[0].password);
      });

      $$("#btnsubmit").on('click', function(){
        app.request.post('http://ubaya.fun/hybrid/160419037/uts/user_edit.php', {
          "username" : localStorage.username,
          "name" : $$("#namesettings").val(),
          "password" : $$("#passwordsettings").val()
        }, function(data){
          var arr = JSON.parse(data);
          var result = arr['result'];
          if (result == "success"){
            page.router.navigate('/home/1');
          } else {
            app.dialog.alert("Fail Editing Profile!");
          }
        })
      });
    } 
  }
});