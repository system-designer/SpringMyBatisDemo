define(function(require, exports, module){
	
	var jQuery = require('jquery');
	(function($){
        var methods = {
            inint: function (options) {
                return this.each(function () {
                    var $this = $(this);
                    //清除
                    $this.empty();
                    
                    //默认值
                    var defaults = {
                    		data:null,
                    		pageSize:null,
                    		datatableSeletor:null
                    };
                    if (typeof (options) == 'undefined') {
                        settings = $.extend({}, defaults);
                    } else {
                        var settings = {
                            data: options.data,//后台返回数据
                            pageSize:options.pageSize,//一页显示多少条
                            datatableSeletor:options.datatableSeletor//datatable的选择器
                            //Event: handlers.zqzClick($this, options)
                        };
                        settings = $.extend({}, defaults, settings);
                    }

                    var createPagination=function(){
                        var warpDiv="<center>"+
                        "<a class='btn btn-default prevPage'>上一页</a>"+
                        "<a class='btn btn-default nextPage'>下一页</a>"+
                        "<a class='btn btn-default totalPage'>共"+settings.data.totalCount+"条</a>"+
                        "</center>";

                        $this.append(warpDiv);
                    };

                    //控制是否可点击
                    var pageBtnDisabled=function(){
                        if(settings.data.totalCount<=settings.pageSize){
                            $(".prevPage").addClass('disabled');
                            $(".nextPage").addClass('disabled');
                        }else if(settings.data.totalCount>settings.pageSize){
                            if(settings.data.pageNo==1){
                                $(".prevPage").addClass('disabled');
                                $(".nextPage").removeClass('disabled');
                            }else
                            if(settings.data.pageNo>1 && settings.data.pageNo<settings.data.totalPages){
                                $(".prevPage").removeClass('disabled');
                                $(".nextPage").removeClass('disabled');
                            } else
                            if(settings.data.pageNo==settings.data.totalPages){
                                $(".prevPage").removeClass('disabled');
                                $(".nextPage").addClass('disabled');
                            }
                        }
                    }

                    //用以触发datatable的事件
                    var bindEvent=function(){
                        $(".prevPage").click(function(){
                            $(settings.datatableSeletor[0]).click();
                        })
                        $(".nextPage").click(function(){
                            $(settings.datatableSeletor[1]).click();
                        })
                    }

                    var initSomeThing=function(){
                        createPagination();
                        pageBtnDisabled();
                        bindEvent();
                   }

                   initSomeThing();

                })
            }
        };

        $.fn.myPagination = function () {
            var method = arguments[0];
            if (methods[method]) {
                method = methods[method];
                arguments = Array.prototype.slice.call(arguments, 1);
            } else if (typeof (method) == 'object' || !method) {
                method = methods.inint;
            } else {
                $.error('not find myPagination!');
                return this;
            }
            return method.apply(this, arguments);
        }
    })(jQuery);
})


