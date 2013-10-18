import ui.View as View;
import ui.ImageView as ImageView;
import src.constants.gameConstants as gameConstants;
import ui.TextView as TextView;
import ui.widget.ButtonView as ButtonView;
import src.lib.parseUtil as ParseUtil;
import GCDataSource;
import ui.widget.List as ListView;
import device;
import ui.widget.Cell as CellView;

exports = Class(View, function (supr) {

	this.init = function(opts) {

		opts = merge(opts, {
			x: 0,
			y: 0,
			width: gameConstants.GAME_WIDTH,
			height: gameConstants.GAME_HEIGHT,
			backgroundColor: '#c69c6d'
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
		} else {
		    // show the signup or login page
		    
		}
	}

	this.onGamesLoaded = function(games) {


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
	}

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

		this.TitleText = new TextView({
			parent: this,
			x: gameConstants.GAME_WIDTH / 2 - 180,
			y: 150,
			width: 350,
			height: 150,
			text: "Current Games",
			fontFamily: "LuckiestGuyRegular",
			size: 50,
			strokeColor: 'white',
			strokeWidth: 4.5,
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

		      		this.gameModel.createGame('multiplayer');

		      		this.emit('StartGame');
				})		      
		    },
		    title: "Start a Game",
		    text: {
		      color: "#ffffff",
		      size: 36,
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
    this.parent.emit('StartGame');
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