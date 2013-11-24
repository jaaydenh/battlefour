import device as Device;
//import AudioManager;
//import src.sounds.soundManager as soundManager;
import src.constants.gameConstants as gameConstants;
import src.models.GameModel as GameModel;
import src.views.GameView as GameView;
import src.views.TitleView as TitleView;
import src.views.StartGameView as StartGameView;
import ui.View as View;
import ui.StackView as StackView;
import src.lib.parse as Parse;
import src.views.HomeView as HomeView;
import util.ajax as ajax;

var BOUNDS_WIDTH = 576;
var BOUNDS_HEIGHT = 1024;

exports = Class(GC.Application, function () {
	
	this.initUI = function() {
		this.engine.updateOpts({
			alwaysRepaint: true,
			clearEachFrame: true,
			keyListenerEnabled: false,
			logsEnabled: true,
			noReflow: true,
			showFPS: false,
			scaleUI: true,
			preload: ['resources/images', 'resources/sounds']
		});

		//this.scaleUI();
		//logger.log(Parse.Parse.VERSION);
		Parse.Parse.initialize("J3gALSUBlUMfOSAGHyaEqXGVmyrlXOOsa8TiCh7u", "0gqBOcrMEu08EdlaHaszYexc9o4LXuua4UeY2jYC");


		/*ajax.post({
		  'url':'https://api.parse.com/1/events/AppOpened',
		  'headers':{
		    'X-Parse-Application-Id':'J3gALSUBlUMfOSAGHyaEqXGVmyrlXOOsa8TiCh7u',
		    'X-Parse-REST-API-Key':'0gqBOcrMEu08EdlaHaszYexc9o4LXuua4UeY2jYC',
		    'Content-Type':'application/json'
		  },
		  data:{

		  },
		  success:function(result) { 
		    // app open was saved.
		  },
		  error:function(error) { 
		    // error saving analytics.  message in error.responseText
		  }
		});*/



		var rootView = new StackView({
			superview: this,
			x: 0,
			y: 0,
			width: BOUNDS_WIDTH,
			height: BOUNDS_HEIGHT,
			clip: true,
			backgroundColor: '#37B34A'
		});

		this.gameModel = new GameModel();

		var homeView = new HomeView({
			gameModel: this.gameModel
		});

		var titleView = new TitleView();

		titleView.on('Start', function () {
			rootView.push(homeView);
			homeView.load();
		});

		rootView.push(titleView);



		var startGameView = new StartGameView({
			gameModel: this.gameModel
		})

		var gameView = new GameView({
			//superview: this,
			//parent: this,
			gameModel: this.gameModel
		});

		this.gameModel.
			on('Update', bind(gameView, 'onUpdate')).
			on('PlacePiece', bind(gameView, 'onPlacePiece')).
			on('MoveCompleted', bind(gameView, 'onMoveCompleted')).
			on('EnableMove', bind(gameView, 'onEnableMoveCompleted')).
			on('DisableMove', bind(gameView, 'onDisableMoveCompleted')).
			on('EndGame', bind(gameView, 'onEndGame'));



		//titleView.on('Signin', function () {
		//	this.gameModel.getCurrentUser();
		//});

		homeView.on('StartGame', function () {
			//gameModel.setGameType();
			rootView.push(startGameView);

			//gamescreen.emit('app:start');
		});

		homeView.on('LoadGame', function () {
			rootView.push(startGameView);
			rootView.push(gameView);
		});

		startGameView.on('CreateGame', function () {
			rootView.push(gameView);
		});

		startGameView.on('Back', function () {
			rootView.pop();
		});

		gameView.on('ExitGame', function () {
			homeView.load();
			rootView.pop();
			rootView.pop();
		});

		this.initAudio();

		titleView.checkForLoggedInUser();
	};
	
	this.launchUI = function () {
		

	};
	
	this.initAudio = function () {

		//soundManager.playGameBackground();
	};

	/*this.scaleUI = function () {
		if (device.height > device.width) {
			this.baseWidth = BOUNDS_WIDTH;
			this.baseHeight = device.height * (BOUNDS_WIDTH / device.width);
			this.scale = device.width / this.baseWidth;
		} else {
			this.baseWidth = BOUNDS_HEIGHT;
			this.baseHeight = device.height * (BOUNDS_HEIGHT / device.width);
			this.scale = device.height / this.baseHeight;
		}
		this.view.style.scale = this.scale;
	};*/
});
