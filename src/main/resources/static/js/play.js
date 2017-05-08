let currState = "Storytelling";

$(document).ready(function(){

  // selecting a card from the hand for storytelling/voting
  $(".hand").on("click", "div.image", function(event) {
    
    const cardInfo = getCardInfo($(this));
    let myId = getElementFromCookies("userid");
      $(".modal-body").append("<div class = \"image bigimg mag\" id=\"" + cardInfo.id + "\" style = \"background-image: url(" + cardInfo.url + "); background-size: cover; background-repeat: no-repeat;\"></div>")
  });
  
  //submitting chatform when submitted
  $("#messageForm").on('submit', function(e) {
	  e.preventDefault();
	  const body = $("#messageField").val();
	  const time = new Date().getTime();
	  sendChat(body, time);	  
	  $("#messageForm")[0].reset();

  });

  // submitting a story, with its associated card
	$('#player-submit').on('click', function(e) {
    e.preventDefault();
    myId = getElementFromCookies("userid");
    if (currState == "Storytelling" && myId == storyteller) {
      const cardInfo = getCardInfo($(".picked-cards").find(".bigimg"));
      const pickedId = cardInfo.id;
      const prompt = $("#promptField").val();
      if(pickedId == undefined) {
        $("#board-error-message").text("Please pick a card.");
      } else if (prompt == "") {
        $("#board-error-message").text("Please submit a prompt.");
      } else {
        const url = cardInfo.url;
        submitPrompt(prompt, pickedId, url); 
        // remove the selected card
        $(".hand").find("#" + pickedId).parent().remove();
        $("#board-error-message").text("");
        $("#promptField").toggleClass("hidden");
      } 

    } else if (currState == "Guessing") {
      const pickedId = $(".picked-cards").find(".bigimg").attr("id");
      if (pickedId != undefined) {
        sendGuess(pickedId);
      }
    } else if (currState == "Voting") {
      
      const votedId = $(".vote-selected").attr("id");
      if (votedId != undefined) {
        sendVote(votedId);
        $("#guesser-button").toggleClass("hidden");
      }
    } 
    
	});
  
  $(".picked-cards").click(function(event) {
    console.log("clicking");
    let myId = getElementFromCookies("userid");
    if (currState == "Voting" && myId != storyteller ) {
      if($(event.target).attr("class") == undefined){
        $(".picked").each(function() {
          $(this).removeClass("vote-selected");
        });
        $(event.target).parent().toggleClass("vote-selected");
      } else if ($(event.target).attr("class") == "image bigimg") {
        $(".image").each(function() {
          $(this).removeClass("vote-selected");
        });
        $(event.target).toggleClass("vote-selected");
      }
    } 
  });
  
   $("#play-again-button").click(function(event) {
     sendRestartIntent();
   });
  
  
//  $(document).click(function (){
//    console.log("me: " + myId + "; st: " + storyteller + "; current state: " + currState);
//  })
    
});

function allowDrop(event) {
	event.preventDefault();
}

function drag(event) {
	console.log("dragging");
	console.log($(event.target));
	let cardInfo = null;
	if ($(event.target).attr('class') == "image") {
		cardInfo = getCardInfo($(event.target));
	} else {
		cardInfo = getCardInfo($(event.target).find("div"));
	}
    event.dataTransfer.setData("text", cardInfo.id);

}

function drop(event) {
    event.preventDefault();
    const id = event.dataTransfer.getData("text");
    const url = "../img/img" +id + ".jpg";
    
    let myId = getElementFromCookies("userid");
    console.log("drop event id + url " + id + url);
    if ((currState == "Storytelling" && myId == storyteller) || (currState == "Guessing" && myId != storyteller)) {
      $(".picked-cards").html("<div class=\"card\"><div class = \"image bigimg\" id=\"" + id + "\" style = \"background-image: url(" + url + "); background-size: cover; background-repeat: no-repeat;\"></div></div>") ;
    }
}


function submitPrompt(inputPrompt, card_id, card_url) {
	const promptMessage = {
		type: MESSAGE_TYPE.ST_SUBMIT,
		payload: {
			prompt: inputPrompt,
			card_id: card_id,
      card_url: card_url
		}
	}
	conn.send(JSON.stringify(promptMessage));
}

function sendGuess(card_id) {
  const guess = {
    type: MESSAGE_TYPE.GS_SUBMIT,
    payload: {
      user_id: getElementFromCookies("userid"),
      card_id: card_id
    }
  }
  conn.send(JSON.stringify(guess));
  $(".hand").find("#" + card_id).parent().remove();
  $(".formSubmit").val("Vote");
  
  stopTimer();
  $("#stopwatchvalue").html("Guessed!");
}


function sendVote(card_id) {
  const vote = {
    type: MESSAGE_TYPE.VOTE,
    payload: {
      user_id: getElementFromCookies("userid"),
      card_id: card_id
    }
  }
  conn.send(JSON.stringify(vote));
  stopTimer();
  $(".formSubmit").val("Guess");
  $("#stopwatchvalue").html("Voted!");
}


function getCardInfo(card) {
  const id = card.attr("id");
  console.log("card id");
  const img = card.attr("style");

  const url = img.replace(/.*\s?url\([\'\"]?/, '').replace(/[\'\"]?\).*/, '');
  return {id: id, url: url};
}


function sendChat(message, inputTime) {
  const chat = {
    type: MESSAGE_TYPE.CHAT_MSG,
    payload: {
      body: message,
      time: inputTime
    }
  }
  conn.send(JSON.stringify(chat));
}

