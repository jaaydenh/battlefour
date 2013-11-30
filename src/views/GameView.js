import animate;
import ui.View as View;
import ui.TextView as TextView;
import ui.resource.Image as Image;
import menus.constants.menuConstants as menuConstants;
import src.constants.gameConstants as gameConstants;
import ui.ViewPool as ViewPool;
import ui.ImageView as ImageView;
import src.views.GamePieceView as GamePieceView;
import src.models.GamePieceModel as GamePieceModel;
import ui.widget.ButtonView as ButtonView;
import src.models.GameModel as GameModel;
import src.views.EndGameView as EndGameView;

exports = Class(View, function (supr) {
	this.init = function (opts) {
		opts = merge(opts, {
			x: 0,
			y: 0,
			width: gameConstants.GAME_WIDTH,
			height: gameConstants.GAME_HEIGHT,
			backgroundColor: '#000000'
		});

		//this.style.backgroundColor = '#30B040';

		this.gameModel = opts.gameModel;

		supr(this, 'init', [opts]);

		this.currentPieceModel = null;

		this.designView();

		this.initUI();
	}

	this.designView = function() {

        this.gamePieceViewPool = new ViewPool({
            ctor: GamePieceView,
            initCount: 55,
            initOpts: {
                gameView: this,
                gameModel: this.gameModel
            }
        });

		this._topInputArea = new View({
			superview: this,
			clip: false,
			tag: 'top',
			x: gameConstants.GRID_X_OFFSET,
			y: 0,
			width: gameConstants.GAME_GRID_WIDTH,
			height: gameConstants.GRID_Y_OFFSET,
			zIndex: 5
		})

		this._bottomInputArea = new View({
			superview: this,
			clip: false,
			tag: 'bottom',
			x: gameConstants.GRID_X_OFFSET,
			y: gameConstants.GRID_Y_OFFSET + gameConstants.GAME_GRID_HEIGHT,
			width: gameConstants.GAME_GRID_WIDTH,
			height: gameConstants.GRID_Y_OFFSET,
			zIndex: 5
		})

		this._leftInputArea = new View({
			superview: this,
			clip: false,
			tag: 'left',
			x: 0,
			y: gameConstants.GRID_Y_OFFSET,
			width: gameConstants.GRID_X_OFFSET,
			height: gameConstants.GAME_GRID_HEIGHT,
			zIndex: 5
		})

		this._rightInputArea = new View({
			superview: this,
			clip: false,
			tag: 'right',
			x: gameConstants.GRID_X_OFFSET + gameConstants.GAME_GRID_WIDTH,
			y: gameConstants.GRID_Y_OFFSET,
			width: gameConstants.GRID_X_OFFSET,
			height: gameConstants.GAME_GRID_HEIGHT,
			zIndex: 5
		})

		this._topInputArea.on('InputSelect', bind(this.gameModel, 'onInputRelease'));
		this._bottomInputArea.on('InputSelect', bind(this.gameModel, 'onInputRelease'));
		this._leftInputArea.on('InputSelect', bind(this.gameModel, 'onInputRelease'));
		this._rightInputArea.on('InputSelect', bind(this.gameModel, 'onInputRelease'));

		this._topTapAreaView = new ImageView({
			superview: this,
			image: "resources/images/tap_area.png",
			x: gameConstants.GRID_X_OFFSET,
			y: 0,
			width: gameConstants.GAME_GRID_WIDTH,
			height: gameConstants.GRID_Y_OFFSET
		})

		this._bottomTapAreaView = new ImageView({
			superview: this,
			image: "resources/images/tap_area.png",
			x: gameConstants.GRID_X_OFFSET,
			y: gameConstants.GRID_Y_OFFSET + gameConstants.GAME_GRID_HEIGHT,
			width: gameConstants.GAME_GRID_WIDTH,
			height: gameConstants.GRID_Y_OFFSET
		})

		this._leftTapAreaView = new ImageView({
			superview: this,
			image: "resources/images/tap_area.png",
			x: 0,
			y: gameConstants.GRID_Y_OFFSET,
			width: gameConstants.GRID_X_OFFSET,
			height: gameConstants.GAME_GRID_HEIGHT
		})

		this._rightTapAreaView = new ImageView({
			superview: this,
			image: "resources/images/tap_area.png",
			x: gameConstants.GRID_X_OFFSET + gameConstants.GAME_GRID_WIDTH,
			y: gameConstants.GRID_Y_OFFSET,
			width: gameConstants.GRID_X_OFFSET,
			height: gameConstants.GAME_GRID_HEIGHT
		})

		this._highlight = new ImageView({
			superview: this,
			image: "resources/images/tap_area.png",
			x: 0,
			y: 0,
			opacity: 0.3,
			visible: false
		})

		this.winHighlight1 = new ImageView({
			superview: this,
			image: "resources/images/tap_area.png",
			x: 0,
			y: 0,
			width: gameConstants.GAME_PIECE_WIDTH,
			height: gameConstants.GAME_PIECE_HEIGHT,
			opacity: 0.5,
			visible: false
		})

		this.winHighlight2 = new ImageView({
			superview: this,
			image: "resources/images/tap_area.png",
			x: 0,
			y: 0,
			width: gameConstants.GAME_PIECE_WIDTH,
			height: gameConstants.GAME_PIECE_HEIGHT,
			opacity: 0.5,
			visible: false
		})

		this.winHighlight3 = new ImageView({
			superview: this,
			image: "resources/images/tap_area.png",
			x: 0,
			y: 0,
			width: gameConstants.GAME_PIECE_WIDTH,
			height: gameConstants.GAME_PIECE_HEIGHT,
			opacity: 0.5,
			visible: false
		})

		this.winHighlight4 = new ImageView({
			superview: this,
			image: "resources/images/tap_area.png",
			x: 0,
			y: 0,
			width: gameConstants.GAME_PIECE_WIDTH,
			height: gameConstants.GAME_PIECE_HEIGHT,
			opacity: 0.5,
			visible: false
		})

		// Grid 
		this._gridBackground = new ImageView({
			superview: this,
			image: "resources/images/grid_background.png",
			x: gameConstants.GRID_X_OFFSET,
			y: gameConstants.GRID_Y_OFFSET,
			width: gameConstants.GAME_GRID_WIDTH,
			height: gameConstants.GAME_GRID_HEIGHT
		});

		this.endGameView = new EndGameView({
			gameModel: this.gameModel,
			gameView: this
		})
		this.addSubview(this.endGameView);
	}

	this.showTapAreas = function() {
		this._topTapAreaView.style.visible = true;
		this._bottomTapAreaView.style.visible = true;
		this._leftTapAreaView.style.visible = true;
		this._rightTapAreaView.style.visible = true;
	}

	this.hideTapAreas = function() {
		this._topTapAreaView.style.visible = false;
		this._bottomTapAreaView.style.visible = false;
		this._leftTapAreaView.style.visible = false;
		this._rightTapAreaView.style.visible = false;	
	}

	this.onMoveCompleted = function() {
		this.currentPieceModel = null;
		//this._highlight.style.visible = false;
	}

	this.onEnableMoveCompleted = function() {
		this.showTapAreas();
	}

	this.onDisableMoveCompleted = function() {
		this.hideTapAreas();
	}

	this.createNewPiece = function(player) {
		this.currentPieceModel = new GamePieceModel({
			gameModel: this.gameModel,
			player: player
		})
		
		var currentPieceView = this.gamePieceViewPool.obtainView();
		currentPieceView.removeAllListeners();
		currentPieceView.setPlayer(player);

		currentPieceView.on('InputSelect', bind(this.currentPieceModel, 'onInputRelease'));
			//on('FinishMove', bind(this.gameModel, 'onFinishMove'));

		this.currentPieceModel.on('Move', bind(currentPieceView, 'onMove')).
			on('UpdatePosition', bind(currentPieceView, 'onUpdatePosition'));	

		this.addSubview(currentPieceView);
		currentPieceView.style.visible = true;
	}

	this.onPlacePiece = function(opts) {
		var player = this.gameModel.getCurrentPlayer();

		if (this.currentPieceModel == null) {
			this.createNewPiece(player);
		}
		
		var col = opts.col;
		var row = opts.row;
		var destRow = opts.destRow;
		var destCol = opts.destCol;
		var x,y;
		
		if (opts.tapArea == 'top') {
			x = col * gameConstants.COLUMN_SIZE + gameConstants.GRID_X_OFFSET;
			y = 9;

			this.currentPieceModel.setPosition(x,y);

			this._highlight.style.x = col * gameConstants.COLUMN_SIZE + gameConstants.GRID_X_OFFSET;
			this._highlight.style.width = gameConstants.GAME_PIECE_WIDTH;
			this._highlight.style.y = gameConstants.GRID_Y_OFFSET;
			this._highlight.style.height = (destRow + 1) * 60;
			this._highlight.style.visible = true;

		} else if (opts.tapArea == 'bottom') {
			x = col * gameConstants.COLUMN_SIZE + gameConstants.GRID_X_OFFSET;
			y = 9 + gameConstants.GAME_GRID_HEIGHT + gameConstants.GRID_X_OFFSET;

			this.currentPieceModel.setPosition(x,y);

			this._highlight.style.x = col * gameConstants.COLUMN_SIZE + gameConstants.GRID_X_OFFSET;
			this._highlight.style.width = gameConstants.GAME_PIECE_WIDTH;
			this._highlight.style.y = destRow * 60 + gameConstants.GRID_Y_OFFSET;
			this._highlight.style.height = gameConstants.GAME_GRID_HEIGHT - destRow * 60;
			this._highlight.style.visible = true;
			
		} else if (opts.tapArea == 'left') {
			x = 9;
			y = row * gameConstants.ROW_SIZE + gameConstants.GRID_Y_OFFSET;

			this.currentPieceModel.setPosition(x,y);

			this._highlight.style.x = gameConstants.GRID_X_OFFSET;
			this._highlight.style.width = (destCol + 1) * gameConstants.GAME_PIECE_WIDTH;
			this._highlight.style.y = row * gameConstants.ROW_SIZE + gameConstants.GRID_X_OFFSET;
			this._highlight.style.height = gameConstants.GAME_PIECE_HEIGHT;
			this._highlight.style.visible = true;
			
		} else if (opts.tapArea == 'right') {
			x = 9 + gameConstants.GAME_GRID_WIDTH + gameConstants.GRID_X_OFFSET;
			y = row * gameConstants.ROW_SIZE + gameConstants.GRID_Y_OFFSET;

			this.currentPieceModel.setPosition(x,y);

			this._highlight.style.x = destCol * 60 + gameConstants.GRID_X_OFFSET;
			this._highlight.style.width = gameConstants.GAME_GRID_WIDTH - destCol * 60;
			this._highlight.style.y = row * gameConstants.ROW_SIZE + gameConstants.GRID_X_OFFSET;
			this._highlight.style.height = gameConstants.GAME_PIECE_HEIGHT;
			this._highlight.style.visible = true;
		}

		if (destRow == null) {
			this.currentPieceModel.setColumn(destCol);
			this.currentPieceModel.setRow(row);
		} else if (destCol == null){
			this.currentPieceModel.setColumn(col);
			this.currentPieceModel.setRow(destRow);	
		}
	}

	this.onUpdate = function() {
		this.gamePieceViewPool.releaseAllViews();

		for (row = 0; row < gameConstants.GRID_ROWS; row++) {
			for (col = 0; col < gameConstants.GRID_COLUMNS; col++) {
				var piecePlayer = this.gameModel.grid[row][col];
		  		if (piecePlayer != 0) {
		  			this.createNewPiece(piecePlayer);
		  			var x = col * gameConstants.COLUMN_SIZE + gameConstants.GRID_X_OFFSET;
					var y = row * gameConstants.ROW_SIZE + gameConstants.GRID_Y_OFFSET;

					this.currentPieceModel.setPosition(x,y);
					this.gameModel.grid[row][col] = this.currentPieceModel;
					this.currentPieceModel = null;
		  		} 
		  	}
		}
	}

	this.onEndGame = function(opts) {
		var playerText = "";
		var piecePos = "";

		if (opts.winningPositions.length == 4) {
			piecepos = opts.winningPositions[0].split(',');

			this.winHighlight1.style.x = piecepos[1] * 60 + gameConstants.GRID_X_OFFSET;
			this.winHighlight1.style.y = piecepos[0] * gameConstants.ROW_SIZE + gameConstants.GRID_X_OFFSET;
			this.winHighlight1.style.visible = true;

			piecepos = opts.winningPositions[1].split(',');

			this.winHighlight2.style.x = piecepos[1] * 60 + gameConstants.GRID_X_OFFSET;
			this.winHighlight2.style.y = piecepos[0] * gameConstants.ROW_SIZE + gameConstants.GRID_X_OFFSET;
			this.winHighlight2.style.visible = true;

			piecepos = opts.winningPositions[2].split(',');

			this.winHighlight3.style.x = piecepos[1] * 60 + gameConstants.GRID_X_OFFSET;
			this.winHighlight3.style.y = piecepos[0] * gameConstants.ROW_SIZE + gameConstants.GRID_X_OFFSET;
			this.winHighlight3.style.visible = true;

			piecepos = opts.winningPositions[3].split(',');

			this.winHighlight4.style.x = piecepos[1] * 60 + gameConstants.GRID_X_OFFSET;
			this.winHighlight4.style.y = piecepos[0] * gameConstants.ROW_SIZE + gameConstants.GRID_X_OFFSET;
			this.winHighlight4.style.visible = true;
		}

		if (opts.winner == gameConstants.PLAYER_1) {
			playerText = 'Player 1';
		} else {
			playerText = 'Player 2';
		}

		this.endGameView.setDialog(playerText + ' Wins!');
		this.endGameView.show();
	}

	this.resetGame = function() {
		this.currentPieceModel = null;
		this.gamePieceViewPool.releaseAllViews();	
		this._highlight.style.visible = false;
		this.winHighlight1.style.visible = false;
		this.winHighlight2.style.visible = false;
		this.winHighlight3.style.visible = false;
		this.winHighlight4.style.visible = false;
	}

	this.initUI = function() {

    	this.backButton = new ButtonView({
		    superview: this,
		    width: 150,
		    height: 80,
		    x: 5,
		    y: 750,
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
				this.gameModel.resetGame();
				this.resetGame();
		      	this.emit('ExitGame');
		      })
		    },
		    title: "Back",
		    text: {
		      color: "#ffffff",
		      size: 36,
		      autoFontSize: false,
		      autoSize: false
		    }
    	});
	}
});