define(function(require, exports, module) {
	module.exports = {
		getRecordValue:function(record,name){
			if(!name) return '';
			var props = name.split('.');
			var value = record;
			for(var prop = 0; prop < props.length; prop++){
				try{
					var propName = props[prop];
					var arrMatch = /^(.*)\[([0-9]+)\]$/;
					var el = propName.match(arrMatch);
					if(el != null){
						value = value[el[1]][el[2]];
					}
					else{
						value = value[props[prop]];
					}
				}
				catch(e){
					return '';
				}
			}
			return value;
		},
		// 大小写转换
		moneyToUpper:function(n){
		    if (!/^(0|[1-9]\d*)(\.\d+)?$/.test(n))
		        return "";
		    var unit = "仟佰拾亿仟佰拾万仟佰拾元角分", str = "";
		        n += "00";
		    var p = n.indexOf('.');
		    if (p >= 0)
		        n = n.substring(0, p) + n.substr(p+1, 2);
		        unit = unit.substr(unit.length - n.length);
		    for (var i=0; i < n.length; i++)
		        str += '零壹贰叁肆伍陆柒捌玖'.charAt(n.charAt(i)) + unit.charAt(i);
		    return str.replace(/零(仟|佰|拾|角)/g, "零").replace(/(零)+/g, "零").replace(/零(万|亿|元)/g, "$1").replace(/(亿)万|(拾)/g, "$1$2").replace(/^元零?|零分/g, "").replace(/元$/g, "元整");

		},
		getShow:function(record,format){
			if(typeof(format) == 'string'){
				try{
					if(/^([0-9a-zA-Z_])+(\.[0-9-a-zA-Z_]+)*$/.test(format)){
						var val = this.getRecordValue(record,format);
						if(val==0) return val;
						if(!val) val = '';
						return val;
					}
				}
				catch(e){}
				var text = this._propertyParser(record,format);
				if(text == format);
				return text;
			}
		},
		_propertyParser:function(record,format){
			var el = format.match(/{([0-9a-zA-Z._]+)}/);
			if(el == null) return format;
			var result = format;
			do{
				result = result.replace(el[0], this.getRecordValue(record,el[1]));
				el = result.match(/{([0-9a-zA-Z._]+)}/);
			}while(el != null);
			return result;
		}
	};
});