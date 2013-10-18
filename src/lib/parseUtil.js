import event.Emitter as Emitter;
import src.lib.parse as Parse;

exports = Class(Emitter, function (supr) {
	
	this.init = function (opts) {
		
		supr(this, 'init', [opts]);
	};

this.signUp = function(username, password) {

	var user = new Parse.Parse.User();
	user.set("username", "test1");
	user.set("password", "password");
	//user.set("email", "email@example.com");
	 
	user.signUp(null, {
	  success: function(user) {
	    // Hooray! Let them use the app now.
	  },
	  error: function(user, error) {
	    // Show the error message somewhere and let the user try again.
	    alert("Error: " + error.code + " " + error.message);
	  }
	});
};

this.currentUser = function() {
	return Parse.Parse.User.current();
}

this.getGames = function(user) {
	
	var Game = Parse.Parse.Object.extend("Game");
	var query = new Parse.Parse.Query(Game);
	var games = [];

	query.find({
	  success: bind(this, function(results) {
	    for (var i = 0; i < results.length; i++) { 
	      var game = results[i];
	      //if (games != "") {
		//	games += ",";
	      //}
	      
	      //games += "{objectId: \"" + game.id + "\", currentPlayer: " + game.attributes.currentPlayer + "}";	
	      //var game = {objectId: \"" + game.id + \"", currentPlayer: " + game.attributes.currentPlayer + };
	      var game = {objectId: game.id, currentPlayer: game.attributes.currentPlayer};
	      games.push(game);	      
	    }
	    //games = "[" + games + "]";

	    this.emit('GamesLoaded', games);
	  }),
	  error: function(error) {
	    alert("Error: " + error.code + " " + error.message);
	  }
	});
}

this.getOpponent = function(username) {
	var User = Parse.Parse.Object.extend("User");
	var query = new Parse.Parse.Query(User);
	query.notEqualTo("username", username);
	query.first({
	  success: function(object) {
	    // Successfully retrieved the object.

	    return object;
	  },
	  error: function(error) {
	    alert("Error: " + error.code + " " + error.message);
	  }
	});
}

this.saveGame = function(game) {
	game.save(null, {
	  success: function(game) {
	    // Execute any logic that should take place after the object is saved.
	    //alert('New object created with objectId: ' + game.id);
	    //this.gameID = this.game.id;
	  },
	  error: function(game, error) {
	    // Execute any logic that should take place if the save fails.
	    // error is a Parse.Error with an error code and description.
	    alert('Failed to create new object, with error code: ' + error.description);
	  }
	});
}

this.logIn = function(username, password) {
	Parse.Parse.User.logIn(username, password, {
	  success: function(user) {
	    // Do stuff after successful login.
	  },
	  error: function(user, error) {
	    // The login failed. Check error to see why.
	    alert("Error: " + error.code + " " + error.message);
	  }
	});
};

});