import ui.View as View;
import ui.ImageView as ImageView;
import src.constants.gameConstants as gameConstants;
import ui.TextView as TextView;
import ui.widget.ButtonView as ButtonView;
import src.lib.parseUtil as ParseUtil;
import GCDataSource;
import ui.widget.ListView as ListView;
import device;
import ui.widget.CellView as CellView;
import ui.ScrollView as ScrollView;
import src.views.GameItemView as GameItemView;

exports = Class(ScrollView, function (supr) {

	this.init = function(opts) {

		opts = merge(opts, {
			x: 0,
			y: 0,
			scrollX: false,
			useLayoutBounds: true,
			bounceRadius: 150,
			width: gameConstants.GAME_WIDTH,
			height: gameConstants.GAME_HEIGHT,
			//backgroundColor: '#c69c6d'
			backgroundColor: '#000000'
		});

		this.gameModel = opts.gameModel;

		supr(this, 'init', [opts]);

		this.buildView();
	};

	this.load = function() {
		this.parseUtil = new ParseUtil();

		this.parseUtil.on('GamesLoaded', bind(this, 'onGamesLoaded'));

		this.currentUser = this.parseUtil.currentUser();
		
		if (this.currentUser) {
		    this.parseUtil.getGames(this.currentUser);
		    this.currentUserText.setText('Current User: ' + this.currentUser.attributes.username);
		} else {
		    // show the signup or login page
		    
		}
	}

	this.onGamesLoaded = function(games) {

		for (var i = 0; i<games.length;i++) {

			var game = games[i];
			var gameItemText = '';
			var gameItemOpponent = '';

			if (this.currentUser.attributes.username == game.player1) {
				if (game.winner != 0) {
					gameItemText = 'Game Over';
				} else if (game.currentPlayer == gameConstants.PLAYER_1) {
					gameItemText = 'Your Turn';
				} else {
					gameItemText = 'Waiting For Turn';
				}
				if (game.player2 != undefined) {
					gameItemOpponent = game.player2;	
				} else {
					gameItemText = 'Waiting For Opponent';
				}
				
			} else if (this.currentUser.attributes.username == game.player2) {
				if (game.winner != 0) {
					gameItemText = 'Game Over';
				} else if (game.currentPlayer == gameConstants.PLAYER_2) {
					gameItemText = 'Your Turn';
				} else {
					gameItemText = 'Waiting For Turn';
				}
				gameItemOpponent = game.player1;

			} else {
				gameItemText = 'Error loading game';
			}

			var gameItem = new GameItemView({parent: this, gameId: game.objectId, gameItemText: gameItemText, gameItemOpponent: gameItemOpponent});
			gameItem.style.x = 40;
			gameItem.style.y = i * 140 + 300;
			this.addSubview(gameItem);
		}
	}

	/*this.onGamesLoaded = function(games) {


		this._gameData = new GCDataSource({
      		key: "objectId",
      		sorter: function (data) { return data.currentPlayer; }
    	});

    	this._gameData.add(games);

	    var gameList = new ListView({
	      superview: this,
	      x: 40,
	      y: 300,
	      width: gameConstants.GAME_WIDTH - 80,
	      height: 400,
	      backgroundColor: "#D0D0D0",
	      dataSource: this._gameData,
	      selectable: "single",
	      maxSelections: 10,
	      scrollX: false,
	      getCell: bind(this, "getCell")
	    });
	    this._gameList = gameList;
	}*/

	this.getCell = function () {
		var gameList = this._gameList;

		return new GameCell({superview: gameList, parent: this, height: 50});
	};

	this.buildView = function() {

		/*this.background = new ImageView({
			parent: this,
			x: 0,
			y: 0,
			width: gameConstants.GAME_WIDTH,
			height: gameConstants.GAME_HEIGHT,
			image: "resources/images/backgrounds/home.png",
			opacity: 1
		});*/
		this.currentUserText = new TextView({
			parent: this,
			x: gameConstants.GAME_WIDTH / 2 - 220,
			y: 100,
			width: 450,
			height: 150,
			text: "Current User: Not signed in",
			fontFamily: gameConstants.MAIN_FONT,
			size: 28,
			color: 'white',
			canHandleEvents: false
		});

		this.TitleText = new TextView({
			parent: this,
			x: gameConstants.GAME_WIDTH / 2 - 150,
			y: 150,
			width: 350,
			height: 150,
			text: "Current Games",
			fontFamily: gameConstants.MAIN_FONT,
			color: 'white',
			size: 50,
			canHandleEvents: false
		});

		this.StartGameButton = new ButtonView({
		    superview: this,
		    width: 250,
		    height: 80,
		    x: gameConstants.GAME_WIDTH / 2 - 120,
		    y: 50,
		    images: {
		      up: "resources/images/buttons/brown_button_up.png",
		      down: "resources/images/buttons/brown_button_down.png"
		    },
		    scaleMethod: "9slice",
		    sourceSlices: {
		      horizontal: {left: 80, center: 116, right: 80},
		      vertical: {top: 10, middle: 80, bottom: 10}
		    },
		    destSlices: {
		      horizontal: {left: 40, right: 40},
		      vertical: {top: 4, bottom: 4}
		    },
		    on: {
		      up: bind(this, function () {
		      		this.emit('StartGame');
				})		      
		    },
		    title: "Start a Game",
		    text: {
		      color: "#ffffff",
		      size: 36,
		      autoFontSize: true,
		      autoSize: false
		    }
    	});

		this.logoutButton = new ButtonView({
		    superview: this,
		    width: 120,
		    height: 40,
		    x: 5,
		    y: 5,
		    images: {
		      up: "resources/images/buttons/brown_button_up.png",
		      down: "resources/images/buttons/brown_button_down.png"
		    },
		    scaleMethod: "9slice",
		    sourceSlices: {
		      horizontal: {left: 80, center: 116, right: 80},
		      vertical: {top: 10, middle: 80, bottom: 10}
		    },
		    destSlices: {
		      horizontal: {left: 40, right: 40},
		      vertical: {top: 4, bottom: 4}
		    },
		    on: {
		      up: bind(this, function () {
		 
		      		this.parseUtil.logout();
		      		this.currentUserText.setText('Current User: Not signed in');
				})		      
		    },
		    title: "Logout",
		    text: {
		      color: "#ffffff",
		      size: 24,
		      autoFontSize: false,
		      autoSize: false
		    }
    	});
	};

	this.close = function() {

	};
});

var GameCell = Class(CellView, function (supr) {
  this.init = function (opts) {
    opts.width = gameConstants.GAME_WIDTH - 80;
    opts.height = 80;
    this.parent = opts.parent;

    supr(this, "init", [opts]);
	this.style.backgroundColor = '#754c24';
    this._title = new TextView({
      superview: this,
      y: 17,
      width: opts.width,
      height: 34
    });
  };

  this._onSelect = function () {
    this._title.updateOpts({color: "#FF0000"});
    this.parent.gameModel.loadGame(this._title.getText());
    this.parent.emit('LoadGame');
  };

  this._onDeselect = function () {
    this._title.updateOpts({color: "#000000"});
  };

  this.setData = function (data) {
    this._data = data; // Store it for the input event handler

    this._title.setText(data.objectId);
    this._title.updateOpts({color: this.isSelected(this._data) ? "#FF0000" : "#000000"});
  };
});
