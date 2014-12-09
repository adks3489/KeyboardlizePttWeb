$(document).ready(function(){
  var articleCount = $(".r-ent").length;
  $searchaction = null;
  if(articleCount > 0){
    var articlePtr = parseInt($(".r-ent").length - 1);
    if(window.localStorage.getItem("KPW_setPtr") == 1){
      articlePtr = window.localStorage.getItem("KPW_articlePtr");
      window.localStorage.setItem("KPW_setPtr", 0);
    }
    $(".r-ent:eq("+articlePtr+")").css("background-color", "#FFFFFF");
    var baseTop = $(".r-ent:eq(0)").position().top;
    var entHeight = ($(".r-ent:eq(0)").outerHeight(true)+$(".r-ent:eq(0)").height())/2;
    $(window).scrollTop(baseTop+articlePtr*entHeight);

    $(document).keypress(ListKeyListener);
    $(document).keydown(ListSKeyListener);
    $(document).keyup(function(event){
      if(event.ctrlKey){
        bCtrlDown = false;
      }
    });
  }
  else{
    $(document).keydown(function(event){
      if(event.keyCode == 37){//LEFT
        Leave();
      }
    });
    $(document).keypress(function(event){
      switch(event.keyCode){
        case 113:
          Leave();
          break;
      }
    });
  }

  function ListKeyListener(event){
    switch(event.keyCode){
      case 112:
      case 107://p, k
        MoveToPrevArticle();
        break;
      case 82://r
        ReadArticle();
        break;
      case 110:
      case 106://n, j
        MoveToNextArticle();
        break;
      case 80://P
        PageUp();
        break;
      case 78://N
        PageDown();
        break;
      case 48://0
        FirstPage();
        break;
      case 36://$
        LastPage();
        break;
      case 122://z
        window.localStorage.setItem("KPW_listURL", document.URL);
        window.localStorage.setItem("KPW_articlePtr", articlePtr);
        location.href = $(".btn-group a:contains('精華區')")[0].href;
        break;
      case 115://s
        event.preventDefault();
        $searchaction = $("<span style='color:#FFFFFF;font-size:20px'>請輸入看板名稱:</span><input id='txt_bname' type='text' style='font-size:20px'>").insertAfter(".action-bar div:eq(0)");
        $(document).unbind('keypress', ListKeyListener);
        $(document).unbind('keydown', ListSKeyListener);
        $(document).keydown(SearchBoardKeyListener);
        document.getElementById("txt_bname").focus();
        break;
    }
  }
  var bCtrlDown = false;
  function ListSKeyListener(event){
    if(event.ctrlKey){
      bCtrlDown = true;
    }
    if(bCtrlDown){
      switch(event.keyCode){
        case 66:
          PageUp();
          break;
        case 70:
          PageDown();
          break;
      }
    }
    switch(event.keyCode){
      case 38:
        event.preventDefault();
        MoveToPrevArticle();
        break;
      case 39:
        ReadArticle();
        break;
      case 40:
        event.preventDefault();
        MoveToNextArticle();
        break;
      case 33://PageUp
        PageUp();
        break;
      case 34://PageDown
        PageDown();
        break;
      case 36://Home
        FirstPage();
        break;
      case 35://End
        LastPage();
        break;
    }
  }

  function SearchBoardKeyListener(event){
    if(event.keyCode == 13){//Enter
      event.preventDefault();
      var board_name = $("#txt_bname").val();
      $searchaction.remove();
      $(document).unbind('keydown', SearchBoardKeyListener);
      $(document).keypress(ListKeyListener);
      $(document).keydown(ListSKeyListener);
      if( board_name != ""){
        var url = "https://www.ptt.cc/bbs/"+board_name+"/index.html";
        $.ajax({
          url: url,
          type: "HEAD",
          statusCode: {
            404: function() {
            },
            200: function(){
              location.href = url;
            }
          }
        });
      }
    }
  }

  function MoveToPrevArticle(){
    if(articlePtr == 0){
      MoveToPrevPage();
    }
    else{
      $(".r-ent:eq("+articlePtr+")").css("background-color", "#000000");
      articlePtr = parseInt(articlePtr) - Number(1);
      $(".r-ent:eq("+articlePtr+")").css("background-color", "#FFFFFF");
      $(window).scrollTop(baseTop+articlePtr*entHeight);
    }
  }
  function MoveToNextArticle(){
    if(articlePtr == articleCount-1){
      window.localStorage.setItem("KPW_setPtr", 1);
      window.localStorage.setItem("KPW_articlePtr", 0);
      MoveToNextPage();
    }
    else{
      $(".r-ent:eq("+articlePtr+")").css("background-color", "#000000");
      articlePtr = parseInt(articlePtr) + Number(1);
      $(".r-ent:eq("+articlePtr+")").css("background-color", "#FFFFFF");
      $(window).scrollTop(baseTop+articlePtr*entHeight);
    }
  }
  function ReadArticle(){
    window.localStorage.setItem("KPW_listURL", document.URL);
    window.localStorage.setItem("KPW_articlePtr", articlePtr);
    location.href = $(".r-ent:eq("+articlePtr+") a")[0].href;
  }
  function PageUp(){
    window.localStorage.setItem("KPW_setPtr", 1);
    window.localStorage.setItem("KPW_articlePtr", 0);
    MoveToPrevPage();
  }
  function PageDown(){
    window.localStorage.setItem("KPW_setPtr", 1);
    window.localStorage.setItem("KPW_articlePtr", 0);
    MoveToNextPage();
  }
  function FirstPage(){
    window.localStorage.setItem("KPW_setPtr", 1);
    window.localStorage.setItem("KPW_articlePtr", 0);
    location.href = $(".btn-group a:contains('最舊')")[0].href;
  }
  function LastPage(){
    location.href = $(".btn-group a:contains('最新')")[0].href;
  }
  function MoveToPrevPage(){
    location.href = $(".btn-group a:contains('‹ 上頁')")[0].href;
  }
  function MoveToNextPage(){
    //TODO: detect has next page
    location.href = $(".btn-group a:contains('下頁')")[0].href;
  }
  function Leave(){
    window.localStorage.setItem("KPW_setPtr", 1);
    var url = window.localStorage.getItem("KPW_listURL");
    window.localStorage.setItem("KPW_listURL", "");
    if(url == null || url == ""){
      location.href = $(".board")[0].href;
    }
    else{
      location.href = url;
    }
  }
});