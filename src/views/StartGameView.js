import ui.View as View;
import ui.ImageView as ImageView;
import src.constants.gameConstants as gameConstants;
import ui.TextView as TextView;
import ui.widget.ButtonView as ButtonView;
import src.lib.parseUtil as ParseUtil;


exports = Class(View, function (supr) {

	this.init = function(opts) {

		opts = merge(opts, {
			x: 0,
			y: 0,
			width: gameConstants.GAME_WIDTH,
			height: gameConstants.GAME_HEIGHT,
			backgroundColor: '#000000'
		});

		this.gameModel = opts.gameModel;

		supr(this, 'init', [opts]);

		this.buildView();

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
			y: 100,
			width: 350,
			height: 150,
			text: "Start a Game",
			fontFamily: gameConstants.MAIN_FONT,
			color: 'white',
			size: 50,
			canHandleEvents: false
		});

		this.RandomOpponentButton = new ButtonView({
		    superview: this,
		    width: 350,
		    height: 80,
		    x: gameConstants.GAME_WIDTH / 2 - 175,
		    y: 250,
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

		      		this.gameModel.createGame(gameConstants.MULTIPLAYER);
		      		this.emit('CreateGame');
				})		      
		    },
		    title: "Random Opponent",
		    text: {
		      color: "#ffffff",
		      size: 36,
		      fontFamily: gameConstants.MAIN_FONT,
		      autoFontSize: false,
		      autoSize: false
		    }
    	});

		this.PassAndPlayButton = new ButtonView({
		    superview: this,
		    width: 350,
		    height: 80,
		    x: gameConstants.GAME_WIDTH / 2 - 175,
		    y: 450,
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

		      		this.gameModel.createGame(gameConstants.PASSANDPLAY);
		      		this.emit('CreateGame');
				})		      
		    },
		    title: "Pass and Play",
		    text: {
		      color: "#ffffff",
		      size: 36,
		      fontFamily: gameConstants.MAIN_FONT,
		      autoFontSize: false,
		      autoSize: false
		    }
    	});

    	this.BackButton = new ButtonView({
		    superview: this,
		    width: 130,
		    height: 70,
		    x: 10,
		    y: 10,
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
		      		this.emit('Back');
				})		      
		    },
		    title: "Back",
		    text: {
		      color: "#ffffff",
		      size: 36,
		      fontFamily: gameConstants.MAIN_FONT,
		      autoFontSize: false,
		      autoSize: false
		    }
    	});
	};



});
