import event.Emitter as Emitter;
import src.constants.gameConstants as gameConstants;
import src.lib.parse as Parse;
import src.lib.parseUtil as ParseUtil;

exports = Class(Emitter, function (supr) {
	
	this.init = function (opts) {
		
		supr(this, 'init', [opts]);
		
		this.lastcol = null;
		this.lastrow = null;
		this.winningPositions = [];
		this.parseUtil = new ParseUtil();
		this.currentUser = this.parseUtil.currentUser();
		this.setup();

		//this.gridData = this.grid.slice(0);
	};

	this.getCurrentUser = function() {
		this.currentUser = this.parseUtil.currentUser();
	}

	this.setGameType = function(gameType) {
		this.gameType = gameType;
	}

	this.finishMove = function() {
		this.checkForWinner();
		this.switchPlayer();
		this.emit('MoveCompleted');

		if (this.gameType == gameConstants.MULTIPLAYER) {
			this.updateGame();	
			this.setCurrentPlayerState();
		}
	}

	this.setPiecePosition = function(row, column, gamePieceModel) {
		this.grid[row][column] = gamePieceModel;
		this.lastcol = column;
		this.lastrow = row;
	}

	this.checkForWinner = function() {
		this.winningPositions = [];

		this.winner = this.checkRowForWinner();
		if (this.winner != 0) {
			this.emit('EndGame', {winner: this.winner, winningPositions: this.winningPositions});
		} else {
			this.winner = this.checkColumnForWinner();
			if (this.winner != 0) {
				this.emit('EndGame', {winner: this.winner, winningPositions: this.winningPositions});
			} else { 
				this.winner = this.checkDiagonalForWinner();
				if (this.winner != 0) {
					this.emit('EndGame', {winner: this.winner, winningPositions: this.winningPositions});
				}
			}
		}
	}

	this.resetGame = function() {
		this.grid = [];
		this.setup();
	}

	this.onInputRelease = function(event, pt) {
		var x = pt.x;
		var y = pt.y;
		var rowsize = 60;
		var colsize = 60;
		var tapAreaWidth = 78;

		if (this.canMakeMove == true) {
			var tapArea = event.target.getTag().split(':')[1];

			if (tapArea == 'top' || tapArea == 'bottom') {
				col = Math.floor(x / colsize);
			} else if (tapArea == 'left' || tapArea == 'right') {
				row = Math.floor(y / rowsize);
			}

			var destRow;
			var destCol;
			var validMove = true;

			if (tapArea == 'top') {
				// check if col and row 0 has a piece
				if (this.grid[0][col] != '0') {
					validMove = false;
				} else {
				// if not piece then display highlight in col until a piece is found
					destRow = 6;
					for (var i = 1; i<this.grid.length;i++) {
						if (this.grid[i][col] != '0') {
							destRow = i - 1;	
							break;
						}
					}	
				}

			} else if (tapArea == 'bottom') {
				if (this.grid[gameConstants.GRID_ROWS - 1][col] != '0') {
					validMove = false;
				} else {
					destRow = 0;
					for (var i = gameConstants.GRID_ROWS - 2; i>=0;i--) {
						if (this.grid[i][col] != '0') {
							destRow = i + 1;	
							break;
						}
					}	
				}
			} else if (tapArea == 'left') {
				if (this.grid[row][0] != '0') {
					validMove = false;
				} else {
					destCol = 6;
					for (var i = 1; i<this.grid[row].length;i++) {
						if (this.grid[row][i] != '0') {
							destCol = i - 1;	
							break;
						}
					}	
				}
			} else if (tapArea == 'right') {
				if (this.grid[row][gameConstants.GRID_COLUMNS - 1] != '0') {
					validMove = false;
				} else {
					destCol = 0;
					for (var i = gameConstants.GRID_COLUMNS -2; i>=0;i--) {
						if (this.grid[row][i] != '0') {
							destCol = i + 1;
							break;	
						}
					}	
				}
			}

			if (validMove == true) {
				this.emit('PlacePiece', {tapArea: tapArea, col: col,row: row, destCol: destCol, destRow: destRow});		
			}
		}
	}

	this.setup = function() {
		this.grid = null;
		this.currentPlayer = gameConstants.PLAYER_1;
		this.winner = 0;
		this.turnNumber = 0;
		this.initGameGrid();
	}

	this.setCurrentPlayerState = function() {
		if (this.currentUser.attributes.username == this.player1) {
			if (this.currentPlayer == gameConstants.PLAYER_1) {
				this.canMakeMove = true;
				this.emit('EnableMove')
			} else {
				this.canMakeMove = false;
				this.emit('DisableMove');
			}
		} else if (this.currentUser.attributes.username == this.player2) {
			if (this.currentPlayer == gameConstants.PLAYER_2) {
				this.canMakeMove = true;
				this.emit('EnableMove');
			} else {
				this.canMakeMove = false;
				this.emit('DisableMove');
			}
		} else {
			this.canMakeMove = false;
			this.emit('DisableMove');
		}
	}

	this.updateGame = function() {
		var gridData = this.getGridData();

		this.game.set("gridData", gridData);
		this.game.set("currentPlayer", this.currentPlayer);
		this.game.set("winner", this.winner);
		this.game.set("turnNumber", this.turnNumber + 1);

		this.parseUtil.saveGame(this.game);
	}

	this.loadGame = function(objectId) {
		this.setGameType(gameConstants.MULTIPLAYER);

		var Game = Parse.Parse.Object.extend("Game");
		//var User1 = Parse.Parse.Object.extend("User");
		//var User2 = Parse.Parse.Object.extend("User");

		var gameQuery = new Parse.Parse.Query(Game);
		gameQuery.get(objectId, {
		  success: bind(this, function(game) {
		    // The object was retrieved successfully.
			this.game = game;

		    var gridData = game.get("gridData").split(',');
		    this.grid = this.loadGrid(gridData);
		    this.player1 = game.get("player1");
		    this.player2 = game.get("player2");
		    this.currentPlayer = game.get("currentPlayer");
		    this.winner = game.get("winner");
		    this.turnNumber = game.get("turnNumber");

		    this.emit('Update');
		    if (this.winner == 0) {
		    	this.setCurrentPlayerState();
			} else {
				this.emit('DisableMove');
			}
		  }),
		  error: function(game, error) {
		    // The object was not retrieved successfully.
		    // error is a Parse.Error with an error code and description.
		    alert('Failed to get game with error code: ' + error.description);
		  }
		});
	}

	this.refreshGame = function() {
		this.game.fetch({
		  success: function(game) {
		    // The object was refreshed successfully.
		    var gridData = game.get("gridData");
		    this.grid = this.loadGrid(gridData);
		    this.currentPlayer = game.get("currentPlayer");
		    this.winner = game.get("winner");
		    this.turnNumber = game.get("turnNumber");
		  },
		  error: function(game, error) {
		    // The object was not refreshed successfully.
		    // error is a Parse.Error with an error code and description.
		    alert('Failed to refresh game with error code: ' + error.description);
		  }
		});
	}

	this.createGame = function(gameType) {
		this.gameType = gameType;

		if (this.gameType == gameConstants.MULTIPLAYER) {

			this.canMakeMove = false;

			if (this.currentUser == null) {
		 		this.currentUser = this.parseUtil.currentUser();
		 	}

		 	var Game = Parse.Parse.Object.extend("Game");
			var query = new Parse.Parse.Query(Game);
			query.equalTo("player2", undefined);

			query.first().then(bind(this,function(result) {
				if (result) {
					this.game = result;
					this.game.set("player2", this.currentUser.attributes.username);
					this.currentPlayer = this.game.attributes.currentPlayer;
					this.player1 = this.game.attributes.player1;
					this.player2 = this.game.attributes.player2;				
		    		var gridData = this.game.get("gridData").split(',');
		    		this.grid = this.loadGrid(gridData);
		    		this.turnNumber = this.game.get("turnNumber");
				} else {
					this.game = new Game();
					this.initGameGrid();
					var gridData = this.getGridData();
					this.game.set("gridData", gridData);

					this.player1 = this.currentUser.attributes.username;
					this.game.set("player1", this.player1);
					this.game.set("currentPlayer", this.currentPlayer);
					this.game.set("winner", 0);
					this.game.set("turnNumber", 0);
				}
				this.parseUtil.saveGame(this.game);

				this.emit('Update');
				this.setCurrentPlayerState();	
			}), function(error) {
  				alert("Error: " + error.code + " " + error.message);
			});




			/*var Game = Parse.Parse.Object.extend("Game");
			this.game = new Game();
			this.initGameGrid();
			var gridData = this.getGridData();

			this.game.set("gridData", gridData);

			this.player1 = this.currentUser.attributes.username;
			this.game.set("player1", this.player1);
			this.game.set("currentPlayer", this.currentPlayer);
			this.game.set("winner", 0);
			this.game.set("turnNumber", 0);

			var User = Parse.Parse.Object.extend("User");
			var query = new Parse.Parse.Query(User);
			query.notEqualTo("username", this.currentUser.attributes.username);

			query.first().then(bind(this,function(result) {
				this.player2 = result.attributes.username;
				this.game.set("player2", this.player2);

				this.parseUtil.saveGame(this.game);

				this.emit('Update');
				this.setCurrentPlayerState();	
			}), function(error) {
  				alert("Error: " + error.code + " " + error.message);
			});*/
			
		} else if (this.gameType == gameConstants.PASSANDPLAY) {
			this.canMakeMove = true;
			this.emit('EnableMove');
		}
	}

	this.getCurrentPlayer = function() {
		return this.currentPlayer;
	}

	this.switchPlayer = function() {
		if (this.currentPlayer == 1) {
			this.currentPlayer = gameConstants.PLAYER_2;
		} else {
			this.currentPlayer = gameConstants.PLAYER_1;
		}
	}

	this.getGrid = function() {
		return this.grid;
	}

	this.getGridData = function() {

		var gridData = "";

		for (row = 0; row < gameConstants.GRID_ROWS; row++) {
			//gridData.push(this.grid[row]);

		  for (col = 0; col < gameConstants.GRID_COLUMNS; col++) {
		    if (this.grid[row][col] != '0') {
		    	gridData += this.grid[row][col].player;
		    } else {
		    	gridData += '0';
		    }
		    //if (row == gameConstants.GRID_ROWS -1 && col != gameConstants.GRID_COLUMNS -1) {
		    gridData += ',';
		    //}
		  }
		}

		return gridData;
	}

	this.loadGrid = function(gridData) {
		var grid = new Array(gameConstants.GRID_ROWS);

		for (row = 0; row < gameConstants.GRID_ROWS; row++) {
			grid[row] = new Array(gameConstants.GRID_COLUMNS);

			for (col = 0; col < gameConstants.GRID_COLUMNS; col++) {
		  		grid[row][col] = gridData[(row * gameConstants.GRID_COLUMNS) + col];
		  	}
		}

		return grid;
	}

	this.initGameGrid = function() {

		this.grid = new Array(gameConstants.GRID_ROWS);

		for (row = 0; row < gameConstants.GRID_ROWS; row++) {
		  this.grid[row] = new Array(gameConstants.GRID_COLUMNS);

		  for (col = 0; col < gameConstants.GRID_COLUMNS; col++) {
		    this.grid[row][col] = '0';
		  }
		}
	}

	this.updateWinCounter = function(row, col, player, winCounter) {
		if (this.grid[row][col] != '0') {
			if (this.grid[row][col].player == player) {
				winCounter++;
			} else {
				winCounter = 0;
			}
		} else {
			winCounter = 0;
		}

		return winCounter;
	}

	this.checkRowForWinner = function() {
		var winCounterP1 = 0;
		var winCounterP2 = 0;

		for (var col = 0; col < gameConstants.GRID_COLUMNS; col++) {
			winCounterP1 = this.updateWinCounter(this.lastrow, col, gameConstants.PLAYER_1, winCounterP1);

			if (winCounterP1 > 0) {
				this.winningPositions.push(this.lastrow + ',' + col);
			} 

			if (winCounterP1 >= 4) {
				//Player 1 wins
				return gameConstants.PLAYER_1;
			}

			winCounterP2 = this.updateWinCounter(this.lastrow, col, gameConstants.PLAYER_2, winCounterP2);

			if (winCounterP2 > 0) {
				this.winningPositions.push(this.lastrow + ',' + col);
			} 

			if (winCounterP2 >= 4) {
				//Player 2 wins
				return gameConstants.PLAYER_2;
			}

			if (winCounterP1 == 0 && winCounterP2 == 0) {
				this.winningPositions = [];
			}
		}

		return 0;
	}

	this.checkColumnForWinner = function() {
		winCounterP1 = 0;
		winCounterP2 = 0;

		for (var row = 0; row < gameConstants.GRID_ROWS; row++) {

			winCounterP1 = this.updateWinCounter(row, this.lastcol, gameConstants.PLAYER_1, winCounterP1);

			if (winCounterP1 > 0) {
				this.winningPositions.push(row + ',' + this.lastcol);
			}

			if (winCounterP1 >= 4) {
				//Player 1 wins
				return gameConstants.PLAYER_1;
			}

			winCounterP2 = this.updateWinCounter(row, this.lastcol, gameConstants.PLAYER_2, winCounterP2);

			if (winCounterP2 > 0) {
				this.winningPositions.push(row + ',' + this.lastcol);
			}

			if (winCounterP2 >= 4) {
				//Player 2 wins
				return gameConstants.PLAYER_2;
			}

			if (winCounterP1 == 0 && winCounterP2 == 0) {
				this.winningPositions = [];
			}
		}

		return 0;
	}

	this.checkDiagonalForWinner = function() {

		var rows = gameConstants.GRID_ROWS;
		var cols = gameConstants.GRID_COLUMNS;

		var startingRow, startingCol;

		winCounterP1 = 0;
		winCounterP2 = 0;

		for (var row = this.lastrow, col = this.lastcol; row >= 0 && col >= 0;row--,col--) {
			startingRow = row;
			startingCol = col;
		}

		for (var row = startingRow, col = startingCol; row < rows && col < cols;row++,col++) {
			winCounterP1 = this.updateWinCounter(row, col, gameConstants.PLAYER_1, winCounterP1);

			if (winCounterP1 > 0) {
				this.winningPositions.push(row + ',' + col);
			}

			if (winCounterP1 >= 4) {
				//Player 1 wins
				return gameConstants.PLAYER_1;
			}

			winCounterP2 = this.updateWinCounter(row, col, gameConstants.PLAYER_2, winCounterP2);

			if (winCounterP2 > 0) {
				this.winningPositions.push(row + ',' + col);
			}

			if (winCounterP2 >= 4) {
				//Player 2 wins
				return gameConstants.PLAYER_2;
			}

			if (winCounterP1 == 0 && winCounterP2 == 0) {
				this.winningPositions = [];
			}
		}

		winCounterP1 = 0;
		winCounterP2 = 0;

		for (var row = this.lastrow, col = this.lastcol; row < rows && col >= 0;row++,col--) {
			startingRow = row;
			startingCol = col;
		}

		for (var row = startingRow, col = startingCol; row >= 0 && col < cols;row--,col++) {
			winCounterP1 = this.updateWinCounter(row, col, gameConstants.PLAYER_1, winCounterP1);

			if (winCounterP1 > 0) {
				this.winningPositions.push(row + ',' + col);
			}

			if (winCounterP1 >= 4) {
				//Player 1 wins
				return gameConstants.PLAYER_1;
			}

			winCounterP2 = this.updateWinCounter(row, col, gameConstants.PLAYER_2, winCounterP2);

			if (winCounterP2 > 0) {
				this.winningPositions.push(row + ',' + col);
			}

			if (winCounterP2 >= 4) {
				//Player 2 wins
				return gameConstants.PLAYER_2;
			}

			if (winCounterP1 == 0 && winCounterP2 == 0) {
				this.winningPositions = [];
			}
		}

		return 0;
	}
});
