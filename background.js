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
    $(document).keydown(ListKeyListener);
  }
  else{
    $(document).keydown(function(event){
      if(event.keyCode == 37){//LEFT
        window.localStorage.setItem("KPW_setPtr", 1);
        location.href = window.localStorage.getItem("KPW_listURL");
      }
    });
  }

  function ListKeyListener(event){
    if(event.keyCode == 38){//UP
      event.preventDefault();
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
    else if(event.keyCode == 39){//RIGHT
      window.localStorage.setItem("KPW_listURL", document.URL);
      window.localStorage.setItem("KPW_articlePtr", articlePtr);
      location.href = $(".r-ent:eq("+articlePtr+") a")[0].href;
    }
    else if(event.keyCode == 40){//DOWN
      event.preventDefault();
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
    else if(event.keyCode == 33){//PageUP
      window.localStorage.setItem("KPW_setPtr", 1);
      window.localStorage.setItem("KPW_articlePtr", 0);
      MoveToPrevPage();
    }
    else if(event.keyCode == 34){//PageDown
      window.localStorage.setItem("KPW_setPtr", 1);
      window.localStorage.setItem("KPW_articlePtr", 0);
      MoveToNextPage();
    }
    else if(event.keyCode == 36){//Home
      window.localStorage.setItem("KPW_setPtr", 1);
      window.localStorage.setItem("KPW_articlePtr", 0);
      location.href = $(".btn-group a:contains('最舊')")[0].href;
    }
    else if(event.keyCode == 35){//End
      location.href = $(".btn-group a:contains('最新')")[0].href;
    }
    else if(event.keyCode == 90){//z
      window.localStorage.setItem("KPW_listURL", document.URL);
      window.localStorage.setItem("KPW_articlePtr", articlePtr);
      location.href = $(".btn-group a:contains('精華區')")[0].href;
    }
    else if(event.keyCode == 83){//s
      event.preventDefault();
      $searchaction = $("<span style='color:#FFFFFF;font-size:20px'>請輸入看板名稱:</span><input id='txt_bname' type='text' style='font-size:20px'>").insertAfter(".action-bar div:eq(0)");
      $(document).unbind('keydown', ListKeyListener);
      $(document).keydown(SearchBoardKeyListener);
      document.getElementById("txt_bname").focus();
    }
  }

  function SearchBoardKeyListener(event){
    if(event.keyCode == 13){//Enter
      event.preventDefault();
      var board_name = $("#txt_bname").val();
      $searchaction.remove();
      $(document).unbind('keydown', SearchBoardKeyListener);
      $(document).keydown(ListKeyListener);
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

  function MoveToPrevPage(){
    location.href = $(".btn-group a:contains('‹ 上頁')")[0].href;
  }
  function MoveToNextPage(){
    //TODO: detect has next page
    location.href = $(".btn-group a:contains('下頁')")[0].href;
  }
});