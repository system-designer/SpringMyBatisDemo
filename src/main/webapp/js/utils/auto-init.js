define(function(require, exports, module) {
	var $ = require('jquery');
	require('myui.webform');
	var jQuery = $;
	module.exports = jQuery;
	$(function(){
		$('.auto-init').each(function(){
			$(this).webform({
				error:window[$(this).data('error')],
				success:window[$(this).data('success')],
				beforeSubmit:window[$(this).data('beforeSubmit')]
			});
		});
	});	
});