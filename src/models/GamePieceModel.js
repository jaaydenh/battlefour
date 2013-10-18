import event.Emitter as Emitter;
import src.constants.gameConstants as gameConstants;

exports = Class(Emitter, function (supr) {
	
	this.init = function (opts) {
		
		this.gameModel = opts.gameModel;
		this.player = opts.player;

		supr(this, 'init', [opts]);

		this.column = null;
		this.row = null;
	};

	this.onInputRelease = function() {

		// Prevent input

		//var grid = this.gameModel.getGrid();

		//grid[this.row][this.column] = this.player;

		this.gameModel.setPiecePosition(this.row, this.column, this);

		this.emit('Move', {row: this.row, col: this.column})


	}

	this.getPlayer = function() {
		return this.player;
	}

	this.setRow = function(row) {
		this.row = row;
	}

	this.setColumn = function(column) {
		this.column = column;
	}

	this.setPosition = function(x,y) {

		this.emit('UpdatePosition', {x: x, y: y});
	}

});
