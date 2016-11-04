define(function(require, exports, module) {
	var jQuery = require('jquery');
	var $ = jQuery;
	require('jquery.ui.draggable');
	require('jquery.ui.droppable');
	require('jquery.ui.mouse');
	require('jquery.ui.position');
	require('jquery.ui.resizable');
	require('bootstrap');
	require('select2');
	seajs.use((window.baseUrl||'') + '/css/ui/jquery.ui.pager.css');
/*
 * YOUI bootstrap pager
 *
 * Copyright (c) 2013 zhouyang
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 */
(function($) {
$.widget("ui.pager", {
	options:{
		pageSize:10,		// 每页记录数
		page:1,				// 当前面码
		pageCount:0,		// 最大页数
		pageIndexSize:5,	// 只显示５个页码
		pageSizeRange:[],   // 可以选择每页条数
		change:$.noop,
		autoload:true,
		showMore:false
	},
	_create:function(){
		this._addClass();
		this._createHtml();
		this._addEvent();
		this._addPageSizeEvent();
	},
	_init:function(){
		if(this.options.autoload) this.reload();
	},
	_addEvent:function(){
		this._on(false,this.element,{
			'click li:has(a)':function(event){
				if($(event.currentTarget).is('.disabled,.active')) return false;
				this.page($(event.currentTarget).data('page'));
				return false;
			}
		});
	},
	_addPageSizeEvent:function(){
		this._on(false,this.element,{
			'change select':function(event){
				this.pageSize = this.options.pageSize = parseInt($(event.target).val());
				this.reload();
			}
		});
	},
	_addClass:function(){
		if(!this.element.hasClass('pagination')){
			this.element.addClass('pagination');
		}
	},
	_createHtml:function(){
		var html = '';
		if (this.options.showMore) {
			html += '<li data-page="' + (this.options.page - 1) 
			+ '"><a href="#"><span class="' + 
			($.config.bsver == 3?'icon-fast-backward':'icon-fast-backward') + '"></span></a></li>';
			html += '<li data-page="' + (this.options.page + 1) 
			+ '"><a href="#" ><span class="'
			+ ($.config.bsver==3?'icon-fast-forward':'icon-fast-forward') + '"></span></a></li>';
			if(this.options.pageSizeRange.length){
				html +='<li class="pageSize"><span>每页<select class="ui-grid-footer-select"></select>条</span></li>';
			}
		} else {
			if(this.options.pageCount == 0){
				html += '<li><span>未找到记录</span></li>';
			}
			else{
				// 计算页码按钮个数,如果总页数小于可显示页码总数,则用总页数替代页码个数
				var count = this.options.pageIndexSize < this.options.pageCount?this.options.pageIndexSize:this.options.pageCount;
				// 计算第一个页面的索引值
				var startPage = this.options.page + this.options.pageIndexSize - 1 > this.options.pageCount ?
						this.options.pageCount - count + 1 : this.options.page;
				// 计算前进和后退按钮的可用状态
				var prevCls='',nextCls='';
				if(this.options.page == 1) firstCls = prevCls = ' class="disabled"';
				else if(startPage == 1) firstCls = ' class="disabled"';
				if(this.options.page == this.options.pageCount) nextCls = endCls = ' class="disabled"';
				else if(startPage + count > this.options.pageCount) endCls = ' class="disabled"';
				
				html += '<li' + prevCls + ' data-page="' + (this.options.page - 1) 
					+ '"><a href="#"><span class="' + 
					($.config.bsver == 3?'icon-fast-backward':'icon-fast-backward') + '"></span></a></li>';
				if(startPage != 1){
					html += '<li data-page="1"><a href="#">1</a></li>';
				}
				if(startPage > 2 && this.options.pageCount > 2){
					html += '<li><span>...</span></li>';
				}
				for(var i = 0; i < count; i++){
					var active = '';
					if(this.options.page == startPage + i) active = ' class="active"';
					html += '<li' + active + ' data-page="' + (startPage + i) + '"><a href="#">' + (startPage + i) + '</a></li>';
				}
				if(startPage + count < this.options.pageCount){
					html += '<li><span>...</span></li>';
				}
				if(startPage + count - 1< this.options.pageCount){
					html += '<li data-page="' + this.options.pageCount + '"><a href="#">' + this.options.pageCount + '</a></li>';
				}
				html += '<li' + nextCls + ' data-page="' + (this.options.page + 1) 
					+ '"><a href="#" ><span class="'
					+ ($.config.bsver==3?'icon-fast-forward':'icon-fast-forward') + '"></span></a></li>';
				
				if(this.options.pageSizeRange.length){
					html +='<li class="pageSize"><span>每页<select class="ui-grid-footer-select"></select>条</span></li>';
				}
				
				//total records
				html += '<li><span>总记录数：'+this.options.totalCount+'</span></li>';
			}
		}
		this.element.html(html);
		if(this.options.pageSizeRange.length){
			var rag = this.options.pageSizeRange;
			for(var i =0;i<rag.length;i++){
				var opt = $('<option value="'+rag[i]+'">'+rag[i]+'</option>');
				if(rag[i] == this.options.pageSize){
					$(opt).attr('selected','selected');
				}
				this.element.find('select').append(opt);
			}
			this.element.find('select').select2({minimumResultsForSearch: Infinity});
		}
	},
	/*pageCount:function(count){
		if(!count) return this.options.pageCount;
		this.options.pageCount = count;
		this._createHtml();
	},*/
	page:function(page){
		if(!page) return this.options.page;
		this.options.page = page;
		this.reload();
	},
	totalCount:function(count){
		var pageCount = 0;
		if(count > 0) pageCount = parseInt(count / this.options.pageSize) + (count % this.options.pageSize>0?1:0);
		this.options.pageCount = pageCount;
		this.options.totalCount = count;
		this._createHtml();
	},
	reload:function(){
		this._trigger('change',{},{page:this.options.page,pageSize:this.options.pageSize});
	}
});
})(jQuery);
});