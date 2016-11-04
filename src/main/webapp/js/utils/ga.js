seajs.use(['jquery'], function($) {
	$(function() {
		//document ready之后再加载，防止GA脚本阻塞页面 
		(function(i, s, o, g, r, a, m) {
			i['GoogleAnalyticsObject'] = r;
			i[r] = i[r] || function() {
				(i[r].q = i[r].q || []).push(arguments)
			}, i[r].l = 1 * new Date();
			a = s.createElement(o), m = s.getElementsByTagName(o)[0];
			a.async = 1;
			a.src = g;
			m.parentNode.insertBefore(a, m)
		})(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');

		ga = ga || function() {};
		//事件统计
		ga('create', G_CFG.gaTrackingId.split(',')[0], 'auto');
		//ajax时间统计
		ga('create', G_CFG.gaTrackingId.split(',')[1], 'auto', 'ajaxTracker');

		ga('send', 'pageview');
		ga('ajaxTracker.send', 'pageview');
	});
});

//element, event, module, target, operator, useCapture
var Analysis = {};
seajs.use(['jquery'], function($) {
	$(function() {
	    Analysis.config = function(collection) {
	    	//"捕捉"事件集合
	    	var captures = [];
	        for (var i = 0; i < collection.length; i++) {
	            (function() {
	                var collect = collection[i];
	                if (collect[5] === true) {
	                	//“捕捉”事件
	                	captures.push(collect);
	                } else {
	                	//“冒泡”事件
	                	if ($(collect[0]).length > 0) {
		                	$(collect[0]).on(collect[1], function(e){
		                		//Category, Action, Label, Value
		                        ga('send', 'event', collect[2], collect[3], collect[4] || '--');
		                	});
		                } else {
		                	$(document).on(collect[1], collect[0], function(e) {
		                        //Category, Action, Label, Value
		                        ga('send', 'event', collect[2], collect[3], collect[4] || '--');
		                    });
		                }
	                }
	                
	            })();
	        }
	        //"捕捉"事件的处理
	        if (captures.length > 0) {
	        	document.addEventListener('click', function(e) {
	        		for (var i = 0; i < captures.length; i++) {
	        			var capture = captures[i];
	        			if (e.target === $(capture[0])[0]) {
	            			ga('send', 'event', capture[2], capture[3], capture[4] || '--');
	            			break;
	            		}
	        		}
    	        }, true);
	        }
	    };
	    
	    Analysis.ajaxTimer = function() {
	    	var t = {};
	    	$(document).bind('ajaxSend', function(event, jqxhr, settings) {
	    		var key = settings.url;
	    		key = key ? key.split('?')[0] : '';
	    		t[key] = {t1 : new Date().getTime()};
	        }).bind('ajaxSuccess', function(event, jqxhr, settings){
	        	var key = settings.url;
	        	key = key ? key.split('?') : [];
	        	var params = key[1] ? key[1] : '--';
	        	key = key[0];
	        	t[key].t2 = new Date().getTime();
	        	var seconds = t[key].t2 - t[key].t1;
	        	ga('ajaxTracker.send', 'event', document.title, key, params, seconds);
	        });
	    };
	    
	    Analysis.ajaxTimer();
	});
});
