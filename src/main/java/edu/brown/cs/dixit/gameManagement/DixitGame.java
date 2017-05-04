package edu.brown.cs.dixit.gameManagement;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import edu.brown.cs.dixit.setting.Deck;
import edu.brown.cs.dixit.setting.GamePlayer;
import edu.brown.cs.dixit.setting.Referee;
import edu.brown.cs.dixit.setting.Turn;

public class DixitGame {

	private final int id;
	private final int capacity;
	private final Deck deck;
	private Map<String, GamePlayer> players;
	private Referee referee;
	private Map<String, String> playerStatus;
	private GamePlayer storyTeller;
	
	//wrapper for all the information 
	//needs to contain the players & deck & referee & turn
	
	public DixitGame(int gameID, int cap, int victPoint) {
		id = gameID;
		capacity = cap;
		deck = new Deck();
		players = new HashMap<>();
		referee = new Referee(cap, victPoint, new Turn(cap));
		playerStatus = new HashMap<>();
	}
	
	public int getId() {
		return id;
	}
	
	public int getCapacity() {
		return capacity;
	}
	
	public int getNumPlayers() {
		return players.size();
	}
	
	public Deck getDeck() {
	    return deck;
	}
	
	public GamePlayer addPlayer(String id, String name) {
	    GamePlayer new_player = new GamePlayer(id, name, deck);
	    players.put(id, new_player);
	    return new_player;
	}
	
	public GamePlayer getPlayer(String id) {
		return players.get(id);
	}
	
	public Collection<GamePlayer> getPlayers() {
		return players.values();
	}
	
	public Referee getRefree() {
	    return referee;
	}
	
	public void setST(String id) {
	  referee.setTeller(id);
	}
	
	public String getST() {
	  return referee.getStoryTeller();
	}
	
	public void nextTurn() {
	  referee.incrementTurn();
	}
	
	public void addStatus(String id, String status) {
	  playerStatus.put(id, status);
	}
	
	public String getStatus(String id) {
	  return playerStatus.get(id);
	}
}
