import ui.View as View;
import ui.TextView as TextView;
import src.constants.gameConstants as gameConstants;

exports = Class(View, function (supr) {

	this.init = function(opts) {

		opts = merge(opts, {
			width:	gameConstants.GAME_WIDTH - 80,
			height: 120,
			backgroundColor: '#FFFFFF'
		});

		this.parent = opts.parent;
		this.gameId = opts.gameId;
		this.gameStatus = opts.gameItemText;
		this.Opponent = opts.gameItemOpponent;

		supr(this, 'init', [opts]);

		this.buildView();
	};

	this.buildView = function() {

		this._inputview = new View({
			superview: this,
			clip: false,
			x: 0,
			y: 0,
			width: gameConstants.GAME_WIDTH - 80,
			height: 120
		});

		this.gameStatusText = new TextView({
			parent: this._inputview,
			x: 0,
			y: 0,
			width: gameConstants.GAME_WIDTH - 80,
			height: 60,
			text: this.gameStatus,
			fontFamily: gameConstants.MAIN_FONT,
			size: 40,
			strokeColor: 'white',
			strokeWidth: 1,
			canHandleEvents: false
		});

		this.opponentText = new TextView({
			parent: this._inputview,
			x: 0,
			y: 50,
			width: gameConstants.GAME_WIDTH - 80,
			height: 60,
			text: this.Opponent,
			fontFamily: gameConstants.MAIN_FONT,
			size: 40,
			strokeColor: 'white',
			strokeWidth: 1,
			canHandleEvents: false
		});

		this._inputview.on('InputSelect', bind(this, function () {

    		this.parent.gameModel.loadGame(this.gameId);
    		this.parent.emit('LoadGame');
	
		}));
	};
});

