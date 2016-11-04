define(function(require, exports, module) {
	var jQuery = require('jquery');
	var $ = jQuery;
	require('jquery.ui.widget');
	module.exports = jQuery;
/**
 * samples:
 * 		$('#dom').alert({
 * 			type:'alert-error',
 * 			text: '保存失败',
 * 			time: 10000
 *		});
 */
(function($) {
	$.widget("jquery.alert",{
		options:{
			type:'alert-info',
			icon:'icon-info-sign',
			text:'成功',
			textMode:'text',
			time:5000	// 显示5秒
		},
		_create:function(){
			var elem = this.element.find('.alert');
			if(!elem.length){
				elem = $('<div class="alert ' + this.options.type + '"></div>');
				this.element.prepend(elem);
			}
		},
		_init:function(){
			var elem = this.element.find('.alert');
			elem.show();
			if(this.options.textMode == 'text'){
				elem.html('<i class="' + this.options.icon +'"></i> ' + this.options.text);
			}
			else if(this.options.textMode == 'jsonMessage'){
				elem.html('<i class="' + this.options.icon +'"></i> [' + this.options.text.code + ']' + this.options.text.message);
			}
			elem.attr('class','alert alert ' + this.options.type);
		}
	});
})(jQuery);
});