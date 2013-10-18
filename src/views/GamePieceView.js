import animate;
import ui.View as View;
import ui.TextView as TextView;
import ui.resource.Image as Image;
import menus.constants.menuConstants as menuConstants;
import src.constants.gameConstants as gameConstants;
import ui.ImageView as ImageView;
	
exports = Class(View, function (supr) {
	this.init = function (opts) {
		opts = merge(opts, {
			x: 0,
			y: 0,
			width: gameConstants.GAME_PIECE_WIDTH,
			height: gameConstants.GAME_PIECE_HEIGHT
		});

		this.gameModel = opts.gameModel;
		this.gameView = opts.gameView;

		supr(this, 'init', [opts]);

		this.style.zIndex = 999999;
		this.designView();
		this.reset();
	}

	this.reset = function() {
		this.column = null;
		this.row = null;		
	}

	this.designView = function() {

		this.redPiece = new Image({url: "resources/images/red_piece.png"});
		this.bluePiece = new Image({url: "resources/images/blue_piece.png"});

		this._gamePiece = new View({
			superview: this,
			clip: false,
			x: 0,
			y: 0,
			width: gameConstants.GAME_PIECE_WIDTH,
			height: gameConstants.GAME_PIECE_HEIGHT,
			zIndex: 1000
		});

		this._gamePieceImage = new ImageView({
			superview: this._gamePiece,
			//image: "resources/images/red_piece.png",
			x: 0,
			y: 0,
			width: gameConstants.GAME_PIECE_WIDTH,
			height: gameConstants.GAME_PIECE_HEIGHT,
			zIndex: 5
		});
	}

	this.onUpdatePosition = function(opts) {
		this.style.x = opts.x;
		this.style.y = opts.y;
	}

	this.onMove = function(opts) {

		var y = opts.row * gameConstants.ROW_SIZE + gameConstants.GRID_Y_OFFSET;
		var x = opts.col * gameConstants.COLUMN_SIZE + gameConstants.GRID_X_OFFSET

		this.gameView._highlight.style.visible = false;

		animate(this).now({x: x, y: y}, 700, animate.easeOut)
		.then(bind(this, function() {
			this.gameModel.finishMove();
		}))

		//this.emit('FinishMove');
	}

	this.setPlayer = function(player) {
		if (player == 1) {
			this._gamePieceImage.setImage(this.redPiece);
		} else if (player == 2) {
			this._gamePieceImage.setImage(this.bluePiece)
		}
	}

	this.setRow = function(row) {
		this.row = row;
	}

	this.setColumn = function(column) {
		this.column = column;
	}
});