define(function(require, exports, module) {
	var $ = require('jquery');
	function printFinish(ctrl,onread){
		if(typeof(onread) == 'function')
			onread(ctrl.fingerprintBase64,ctrl.fingerprintTemplateStr);
	}
	module.exports = {
		read:function(id,count){
			var ctrl = id;
			if(typeof(id) == 'string'){
				ctrl = $(id)[0];
			}
			if(ctrl){
				ctrl.fingerprintEnrollCount = count|3;
				ctrl.StartFingerPrint();
			}
		}
	};
});