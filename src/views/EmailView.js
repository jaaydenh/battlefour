import animate;

import ui.View as View;
import ui.TextView as TextView;
import ui.ImageView as ImageView;
import menus.constants.menuConstants as menuConstants;
import menus.views.components.BoxBorderView as BoxBorderView;
import menus.views.components.BoxDialogView as BoxDialogView;
import menus.views.components.DialogBackgroundView as DialogBackgroundView;
import src.constants.gameConstants as gameConstants;
import ui.TextPromptView as TextPromptView;
import src.lib.parseUtil as ParseUtil;
import ui.TextEditView as TextEditView;

exports = Class(DialogBackgroundView, function (supr) {
	this.init = function (opts) {

		this.parent = opts.parent;

		supr(this, 'init', arguments);

		this.style.visible = false;

		this.canHandleEvents(true);

		this.parseUtil = new ParseUtil();

		this._dialogView = new BoxDialogView({
			superview: this._dialogContainerView,
			x: 20,
			y: 100,
			width: gameConstants.GAME_WIDTH - 40,
			height: gameConstants.GAME_HEIGHT - 340,
			title: 'Enter your email',
			closeCB: opts.closeCB ? bind(this, 'hide', opts.closeCB) : false,
			backCB: opts.backCB ? bind(this, 'hide', opts.backCB) : false
		});

		var itemStyle = menuConstants.MENU_ITEM;
		var textStyle = menuConstants.MENU_TEXT;
		var menu = this;

		 /*this._textPromptView = new TextPromptView({
			//These are inherited properties from View and TextView...
			superview: this._dialogView,
			x: gameConstants.GAME_WIDTH / 2 - 220,
			y: 200,
			backgroundColor: "#ffffff",
			width: 400,
			height: 80,
			color: "#000000",
			size: 40,
			horizontalAlign: "center",
			verticalALign: "center",
			wrap: false,
			autoSize: false,
			autoFontSize: false,
			clip: true ,
			//The message shown in the dialog
			prompt: "Enter your email address",
			//Set the text shown in the TextPromptView, when the view is clicked, the text is changed and ok clicked
			//then the text in the view will be updated
			text: "email"
		});*/

		this._textEditView = new TextEditView({
	      	superview: this._dialogView,
		  	x: gameConstants.GAME_WIDTH / 2 - 220,
			y: 200,
	      	backgroundColor: "#404040",
	      	width: 400,
	      	height: 80,
	      	color: "#FFFFFF",
	      	hintColor: "pink",
	      	hint: "email"
	    });

		//Subscribe to the change event, this event is published when the text is changed and ok is pressed.
		//this._textPromptView.subscribe("Change", this, "onChangeText");
		//this._textEditView.subscribe("Change", this, "onChangeText");
		//Subscribe to the cancel event, this event is published when the cancel button in the dialog is pressed.
		//this._textPromptView.subscribe("Cancel", this, "onCancelText");
		//this._textEditView.subscribe("Cancel", this, "onCancelText");

		var playButton = new BoxBorderView({
			superview: this._dialogView,
			x: 280,
			y: 300,
			width: 200,
			height: 100,
			image: itemStyle.BACKGROUND,
			text: 'Play',
			fontFamily: itemStyle.FONT_FAMILY,
			fontSize: itemStyle.FONT_SIZE,
			textPadding: itemStyle.PADDING,
			textColor: itemStyle.COLOR,
			textOutline: itemStyle.STROKE_COLOR,
			strokeWidth: itemStyle.STROKE_WIDTH,
			horizontalAlign: itemStyle.ALIGN || 'center'
		});

		var cancelButton = new BoxBorderView({
			superview: this._dialogView,
			x: 50,
			y: 300,
			width: 200,
			height: 100,
			image: itemStyle.BACKGROUND,
			text: 'Cancel',
			fontFamily: itemStyle.FONT_FAMILY,
			fontSize: itemStyle.FONT_SIZE,
			textPadding: itemStyle.PADDING,
			textColor: itemStyle.COLOR,
			textOutline: itemStyle.STROKE_COLOR,
			strokeWidth: itemStyle.STROKE_WIDTH,
			horizontalAlign: itemStyle.ALIGN || 'center'
		});

		playButton.on('InputSelect', bind(this, function () {
			this.parseUtil.signUp(this._textEditView.getText(),'battlefour');

		    this.parent.emit('Start');
		}));

		cancelButton.on('InputSelect', bind(this, function () {
			menu.hide();
		}));
	};

		//This function is called when the text is changed and ok is pressed
	this.onChangeText = function (text) {
		//this._textEditView.setText("Text input: " + text);
	};

	//This function is called when cancel is clicked in the dialog
	this.onCancelText = function (text) {
		//this._textView.setText("Cancel selected.");
	};
});