define(function(require, exports, module) {
	var $ = require('jquery');
	module.exports = {
		init:function(id){
			var ctrl = id;
			if(typeof(id) == 'string'){
				ctrl = $(id)[0];
			}
			if(ctrl && ctrl.FindReader && ctrl.FindReader()){
				return true;
			}
			else
				return false;
		},
		read:function(id){
			var ctrl = id;
			if(typeof(id) == 'string'){
				ctrl = $(id)[0];
			}
			ctrl.SetReadType(0);
		  	nRet = ctrl.ReadCardMsg();
		  	if(nRet == 0){
		  		return {
		  			name: $.trim(ctrl.NameA),sex: ctrl.Sex,nation:ctrl.Nation,
		  			birthday:ctrl.Born,address:$.trim(ctrl.Address),cardNo:ctrl.CardNo
//		  			base64img:ctrl.Base64Photo
		  		};
		  	}
		  	else{
		  		return false;
		  	}
		}
	};
});