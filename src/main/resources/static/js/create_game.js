let prevSelected;
let currSelected;
let gameCount = 1;
let newGameId = 1;
let username;

$(document).ready(function(){
    
    // user enters a username
    $("#username-form").on("submit", function(event) {
      event.preventDefault();
      if($(".username").val() != "") {
        username = $(".username").val();
        $("#username-form").toggleClass("hidden");
        $(".start-game").removeClass("hidden");
      }
      sendLoad();
    });
  
    $("#create-form").on("submit", function(event) {
      
      event.preventDefault();
      $(".create-error-message").empty();
      if($(".lobby-name").val() == "") {
        $(".create-error-message").append("<p style=\"color:red;margin-top:30px;margin-left:30px;\">Please provide a lobby name.</p>")
      } else {
        let gameInit = {
          type: MESSAGE_TYPE.CREATE,
          payload: {
            game_id: newGameId,
            user_name: username,
            lobby_name: $(".lobby-name").val(),
            num_players: Number($(".num-players").val()),
            victory_pts: $(".victory-points").val(),
            cards: $(".configure-cards.active").text().trim(),
            story_types: {
              text: $("#story-text").attr("class").includes("active"),
              audio: $("#story-audio").attr("class").includes("active"),
              video: $("#story-video").attr("class").includes("active")  
            }
          }
        }
        console.log("whehfei")
        // send new game information to backend
        conn.send(JSON.stringify(gameInit));
        newGameId++;

        // display new available game to allow joining
        //window.location = window.location.href + "storytelling";
      }
      
    });

    $('table.table-hover tbody').on('click', function() {
      currSelected = $(event.target);
      currSelected.parent().toggleClass('selected-row');
      console.log(currSelected.attr("id"));
      if (prevSelected != undefined) {
        prevSelected.toggleClass('selected-row');
      }
      prevSelected = currSelected;
    });
    
    $("#join-form").on("submit", function(event) {
      event.preventDefault();
      $(".join-error-message").empty();
      if(currSelected == undefined ) {
        $(".join-error-message").append("<p style=\"color:red;margin-top:30px;margin-left:30px;\">Please select an available lobby.</p>");
      } else {
        console.log(currSelected.attr('id'));
        
        window.location = window.location.href + "play";
        const joinMessage = {
                type: MESSAGE_TYPE.JOIN,
                payload: {
                  user_name: $(".username").val(),
                  game_id: currSelected.attr('id')  
                }
              }
        conn.send(JSON.stringify(joinMessage));

      }
      
    });
      
});

function sendLoad(){
  let gameLoad = {
          type: MESSAGE_TYPE.LOAD,
          payload: {
          }
      }
  conn.send(JSON.stringify(gameLoad));
}


