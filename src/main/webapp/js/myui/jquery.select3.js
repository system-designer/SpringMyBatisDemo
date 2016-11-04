define(function(require, exports, module) {
	var $ = require('jquery');
	var jQuery = $;
	require('select2');
	module.exports = jQuery;

(function($) {
	$.fn.select3 = function(option) {
		var that = this;
		var config = {
				templateResult: function(result) {
					var text = result.text;
					var match = text.match(/\([^\(\)]*\)/g);
					if (match && match.length > 0) {
						for (var i = 0; i < match.length; i++) {
							text = text.replace(match[i], "<span style='display:none;'>" + match[i] + "</span>");
						}
					}
					return text;
				},
				templateSelection: function(result) {
					var text = result.text;
					var match = text.match(/\([^\(\)]*\)/g);
					if (match && match.length > 0) {
						for (var i = 0; i < match.length; i++) {
							text = text.replace(match[i], "");
						}
					}
					return text;
				},
				matcher: function(params, data) {
					// Always return the object if there is nothing to compare
				      if ($.trim(params.term) === '') {
				        return data;
				      }

				      // Do a recursive check for options with children
				      if (data.children && data.children.length > 0) {
				        // Clone the data object if there are children
				        // This is required as we modify the object to remove any non-matches
				        var match = $.extend(true, {}, data);

				        // Check each child of the option
				        for (var c = data.children.length - 1; c >= 0; c--) {
				          var child = data.children[c];

				          var matches = matcher(params, child);

				          // If there wasn't a match, remove the object in the array
				          if (matches == null) {
				            match.children.splice(c, 1);
				          }
				        }

				        // If any children matched, return the new object
				        if (match.children.length > 0) {
				          return match;
				        }

				        // If there were no matching children, check just the plain object
				        return matcher(params, match);
				      }

				      var original = data.text.toUpperCase();
				      var term = params.term.toUpperCase();

				      // Check if the text contains the term
				      var chars = term.split('');
				      for (var i = 0; i < chars.length; i++) {
				    	  var index = original.indexOf(chars[i]);
				    	  if (index == -1) {
				    		  return null;
				    	  } else {
				    		  original = original.substr(index + 1, original.length - 1);
				    	  }
				      }
//				      if (original.indexOf(term) > -1) {
//				        return data;
//				      }

				      // If it doesn't contain the term, don't return anything
				      return data;
				   }
			};
		$.extend(config, option);
		var oldCitys = {};
		var newCitys = {
                '033': '新乡',
                '042': '昌吉',
                '055': '南通',
                '061': '长春',
                '070': '岳阳',
                '071': '鞍山',
                '069': '保定',
                '056': '唐山',
                '051': '莆田',
                '023': '许昌',
                '035': '沈阳',
                '032': '驻马店',
                '060': '大连',
                '007': '成都',
                '057': '徐州',
                '054': '无锡',
                '066': '长沙',
                '048': '温州',
                '074': '三亚',
                '078': '临沂',
                '026': '焦作',
                '011': '苏州',
                '008': '东莞',
                '027': '北京',
                '034': '上海',
                '004': '杭州',
                '000': '武汉',
                '015': '瑞安',
                '001': '乌鲁木齐',
                '009': '青岛',
                '010': '郑州',
                '016': '惠州',
                '017': '兰州',
                '018': '南京',
                '020': '太原',
                '021': '中山',
                '022': '南昌',
                '025': '邯郸',
                '028': '嘉兴',
                '029': '南阳',
                '030': '安阳',
                '031': '商丘',
                '036': '厦门',
                '037': '天津滨海',
                '038': '张家口',
                '039': '赣州',
                '041': '济南',
                '045': '宁波',
                '044': '绍兴',
                '043': '拉萨',
                '050': '昆山',
                '047': '福州',
                '046': '南宁',
                '003': '重庆',
                '006': '天津',
                '019': '佛山',
                '014': '深圳',
                '040': '广州',
                '052': '烟台',
                '053': '石家庄',
                '058': '常州',
                '059': '泉州',
                '024': '开封',
                '065': '绵阳',
                '062': '淮安',
                '063': '漳州',
                '067': '包头',
                '068': '台州',
                '072': '舟山',
                '073': '吉林',
                '049': '呼和浩特',
                '076': '西安',
                '077': '泰州',
                '079': '精河县',
                '080': '台北',
                '083': '贵阳',
                '082': '沧州',
                '081': '昆明',
                '084': '海口',
                '085': '香港',
                '086': '遵义',
                '087': '六盘水',
                '088': '攀枝花',
                '089': '安顺',
                '090': '凯里',
                '091': '济宁',
                '092': '珠海'
        };
		for (var i = 0; i < 150; i++) {
			var key = i;
			if (i < 10) {
				key = '00' + key;
			} else if (i < 100) {
				key = '0' + key;
			} else {
				key = '' + key;
			}
			if (newCitys[key]) {
				continue;
			}
			oldCitys[key] = true;
		}
		/*var children = $($(this).find('option'));
		for (var i = 0; i < children.length; i++) {
			if (oldCitys[$(children[i]).val()]) {
				$(children[i]).remove();
			}
		}*/
		$(this).select2(config);
	}
})(jQuery);

});