let currState = "Storytelling";

$(document).ready(function(){
  
  // selecting a card from the hand for storytelling/voting
  $(".hand-card").click(function(event) {
    
    console.log("clicked card div: " + event.target.id);
    const card = $(this).find("img");
    
    if (currState == "Storytelling" || currState == "Guessing") {
      $(".picked").empty();
      $(".picked").append("<img id=\"" + card.attr('id') + "\" src=\"" + card.attr('src') + "\"></img>");
    
    }
    
  });
  
  console.log(document.cookie);
  
  // submitting a story, with its associated card
	$('#promptForm').on('submit', function(e) {
		console.log("prompt in storytellingjs called");
		console.log("form is submitted!!")
		e.preventDefault();
    const pickedId = $(".picked").find("img").attr("id");
    const prompt = $("#promptField").val();
    if(pickedId == undefined) {
      $("#board-error-message").text("Please pick a card.");
    } else if (prompt == "") {
      $("#board-error-message").text("Please submit a prompt.");
    } else {
      submitPrompt(prompt, pickedId, $(".picked").find("img").attr("src")); 
      // remove the selected card
      $(".hand").find("#" + pickedId).parent().remove();
    }
		
    
    
    
	});
  
  $(".picked-cards").click(function(event) {
    
    //
    if($(event.target).attr("class") == undefined){
      $(".picked").each(function() {
        $(this).removeClass("vote-selected");
      });
      $(event.target).parent().toggleClass("vote-selected");
    } else if ($(event.target).attr("class") == "card picked") {
      $(".picked").each(function() {
        $(this).removeClass("vote-selected");
      });
      $(event.target).toggleClass("vote-selected");
    }
  });
  
  // submitting a guessed card
  $("#guessForm").on('submit', function (e) {
    console.log("guessed");
    e.preventDefault();
    
    if (currState == "Guessing") {
      const pickedId = $(".picked").find("img").attr("id");
      if (pickedId != undefined) {
        sendGuess(pickedId);
        $(".hand").find("#" + pickedId).parent().remove();
        $("#guesser-button").val("Vote");  
      }
    } else if (currState == "Voting") {
      
      const votedId = $(".vote-selected").find('img') .attr("id");
      if (votedId != undefined) {
        sendVote(votedId);
      }
      console.log(votedId);
    }
    
  });
  
  $(document).click(function (){
    console.log(currState);
  })
    
});


function submitPrompt(inputPrompt, card_id, card_url) {
	const promptMessage = {
		type: MESSAGE_TYPE.ST_SUBMIT,
		payload: {
			prompt: inputPrompt,
			card_id: card_id,
      card_url: card_url
		}
	}
  console.log("story: " + promptMessage.toString());
	conn.send(JSON.stringify(promptMessage));
}

function sendGuess(card_id) {
  const guess = {
    type: MESSAGE_TYPE.GS_SUBMIT,
    payload: {
      card_id: card_id
    }
  }
  conn.send(JSON.stringify(guess));
}


function sendVote(card_id) {
  const vote = {
    type: MESSAGE_TYPE.VOTING,
    payload: {
      card_id: card_id
    }
  }
  conn.send(JSON.stringify(vote));
}