//绑定事件
var addEvent = document.addEventListener ? function(el,type,callback){
    el.addEventListener( type, callback, !1 );
} : function(el,type,callback){
    el.attachEvent( "on" + type, callback );
};
//移除事件
var removeEvent = document.removeEventListener ? function(el,type,callback){
    el.removeEventListener( type, callback );
} : function(el,type,callback){
    el.detachEvent( "on" + type, callback);
};
//精确获取样式
var getStyle = document.defaultView ? function(el,style){
    return document.defaultView.getComputedStyle(el, null).getPropertyValue(style)
} : function(el,style){
    style = style.replace(/\-(\w)/g, function($, $1){
        return $1.toUpperCase();
    });
    return el.currentStyle[style];
};

//数组排序
var arraySort=function(prop){
    return function (obj1, obj2) {
        var val1 = obj1[prop];
        var val2 = obj2[prop];
        if (parseInt(val1) < parseInt(val2)) {
            return -1;
        } else if (parseInt(val1) > parseInt(val2)) {
            return 1;
        } else {
            return 0;
        }
    }
};
var round2=function (Num1,Num2){
    if(isNaN(Num1)||isNaN(Num2)){
        return(0);
    }else{
        return(Num1.toFixed(Num2));
    }
};

var generateUUID=function(len, radix){
    //Private array of chars to use
    var CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    var chars = CHARS, uuid = [],
        rnd = Math.random;
    radix = radix || chars.length;
    if (len) {
        // Compact form
        for (var i = 0; i < len; i++)
            uuid[i] = chars[0 | rnd()*radix];
    } else {
        // rfc4122, version 4 form
        var r;
        // rfc4122 requires these characters
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
        uuid[14] = '4';
        // Fill in random data.  At i==19 set the high bits of clock sequence as      // per rfc4122, sec. 4.1.5
        for (var i = 0; i < 36; i++) {
            if (!uuid[i]) {
                r = 0 | rnd()*16;
                uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r & 0xf];
            }
        }
    }return uuid.join('');
};

var getSelectText = function(text) {
	return text.replace(text.match(/\([^\(\)]*\)/g), '');
}