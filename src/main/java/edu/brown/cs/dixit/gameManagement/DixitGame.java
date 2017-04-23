package edu.brown.cs.dixit.gameManagement;

public class DixitGame implements MultiplayerGame{

	private final int id;
	private final int num_players;
	
	//wrapper for all the information 
	//needs to contain the players & deck & referee & turn
	
	public DixitGame(int ID, int player_number) {
		id = ID;
		num_players = player_number;
	}
	
	@Override
	public int getId() {
		return id;
	}
	
	@Override
	public int getNumPlayers() {
		return num_players;
	}
	
}
