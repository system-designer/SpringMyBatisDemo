define(function(require, exports, module) {
	var $ = require('jquery');
	var jQuery = $;
	module.exports = jQuery;

(function($) {
	$.fn.gpsdate = function() {
		
		var html = '<label>日期:</label>'
			+	'<input type="text" placeholder="选择日期" class="datepicker form-control"/>'
			+'<div style="margin:5px 0px;">'
			+'<button class="btn btn-primary btn-query cll-btn-query" type="button">'
			+	'<span>查询</span>'
			+'</button>&nbsp'
			+'<button class="btn btn-primary btn-query change-cars" type="button">'
			+	'<span>换一批</span>'
			+'</button>&nbsp'
			+'<a href="#" class="lq btn btn-info uncheck-cars">隐藏</a><br>'
			+'</div>'
			+'<div class="cars"></div>';
		$('.gpsdate').append(html);
		$('.gpsdate .datepicker').datepicker();
	}
})(jQuery);

});