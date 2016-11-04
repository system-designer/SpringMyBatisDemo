/*
	表格组件
	options:
		method: [read|postRead]
		title: 标题文本
		columns:列数组
			- format: 如果是字符串分两种格式，1.字段名 2.表达式(<a href='user/{id}'>{name}</a>)，如果是函数则函数处理内容,函数参数为record
			- style: class样式
		src: ajax加载URL
		autoload: 是否自动加载ajax数据
*/
define(function(require, exports, module) {
	var jQuery = require('jquery');
	var $ = jQuery;
	require('myui.pager');
	require('myutil.rest');
	require('jquery.resizableColumns');
	require('jquery.blockUI');
	module.exports = jQuery;
	var common = require('myutil.common');

(function( $ ) {
$.widget( "ui.dataTable", {
	options:{
		method:'postRead',
		pageSize:10,
		pageSizeRange:[],
		autoload:true,
		resizable:true,
		checkbox:false,
		showNum:false,
		showPager:true,
		showMore: false,
		ellipsis:false,
		color:'',
		callback: function() {}
	},
	_create:function(){
		this._page = 1;
		this._createFooter();
	},
	_createFooter:function(){
		if(!this._content){
			this._content = this._addContent();
		}
		this.footer = this.element.find('.ui-datatable-pager');
		if(this.footer.length == 0) return;
		this._addEvent();
	},
	_addContent:function(){
		var tbody = this.element.find('table').find('tbody');
		if(tbody.length==0){
			this.element.find('table').append('<tbody></tbody>');
		}
		var cols = this.element.find('th[data-format],th[data-fill-method]');
		var colsL = cols.length;
		if(this.options.showNum){
			colsL = colsL+1;
		}
		if(this.options.checkbox){
			colsL = colsL+1;
		}
		var tfoot = this.element.find('table').find('.ui-datatable-pager');
		if(tfoot.length!=0){
			this.element.find('tfoot tr td:first').attr('colspan',colsL);
		}else{
			this.element.find('table').append('<tfoot><tr><td colspan="'+colsL+'"><div class="pagination"><ul class="ui-datatable-pager "></ul></div></td></tr></tfoot>');
		}
		if(!this.options.showPager){
			this.element.find('table').find('tfoot').hide();
		}
		return true;
	},
	_init:function(){
		this.element.find('table').addClass("table-bordered");
		if(!this._content){
			this._content = this._addContent();
		}
		var self = this;
		this._initColumns();
		this.footer.pager({
			pageSize:this.options.pageSize,
			autoload:this.options.autoload,
			pageSizeRange:this.options.pageSizeRange,
			showMore:this.options.showMore,
			change:$.proxy(function(event, data){
			this.options.pageSize = data.pageSize;
			this.setPage(data.page);
		},this)});
		if(this.options.resizable){
			this.element.find('table').resizableColumns();
			
			if(this.options.checkbox){
				this.element.find('.rc-handle-container > .rc-handle:first').remove();
			}
		}
		if(this.options.ellipsis){
			this.element.find('table').addClass('ellipsis');
		}
		this.element.find('tbody').on('click','tr',function(){
			$(this).toggleClass('selected');
			if(self.options.checkbox){
				if($(this).hasClass('selected')){
					$(this).find('.record-checkbox').prop('checked',true);
				}else{
					$(this).find('.record-checkbox').prop('checked',false);
				}
			}else{
				$(this).siblings().removeClass("selected");
			}
		});
		
	},
	_addEvent:function(){
		this._on(true, this.element,{
			'click.sortable':function(event){
				this.element.find('th.sorting').removeClass('sorting');
				$(event.currentTarget).addClass('sorting');
				$(event.currentTarget).toggleClass('desc');
				this._reload();
			}
		});
		this._filterInit();
	},
	_filterInit:function(){
		if(this.options.filter){
			var filters;
			if(typeof(this.options.filter) == "string"){
				filters = $(this.options.filter);
			}
			else{
				filters =  this.options.filter;
			}
			this._filter = this._getFilters(filters);
			this._on(filters,{
				'click .btn-query':$.proxy(function(){
					this._page = 1;
					this._query(filters);
				},this)
			});
			if(filters.data('auto') == true){
				this._on(filters,{
					'change input,select':$.proxy(function(){
						this._page = 1;
						this._query(filters);
					},this)
				});
			}
		}
	},
	_query:function(filters){
		var filter = this._getFilters(filters);
		this.reload(filter);
	},
	_getFilters:function(filters){
		var filter = {};
		filters.find('input[name]:not(:checkbox,:radio),select[name]').each(function(){
			if($(this).val()){
				filter[$(this).attr('name')] = $(this).val();
			}else if($(this).val()===0){
				filter[$(this).attr('name')] = $(this).val();
			}
		});
		filters.find('input[name]:checked').each(function(){
			filter[$(this).attr('name')] = $(this).val();
		});
		return filter;
	},
	_initColumns:function(){
		if(this.options.showNum){
			this.element.find('thead tr').prepend("<th class='th-num' style='width:40px;'>序号</th>");
		}
		if(this.options.checkbox){
			var self = this.element;
			this.element.find('thead tr').prepend("<th class='th-checkbox' style='width:12px;'><input type='checkbox' class='checkbox'></th>");
			this.element.find('thead tr').on('click','.checkbox',function(){
				if($(this).prop('checked')){
					self.find('tbody .record-checkbox').prop('checked',true);
					self.find('tbody tr').addClass('selected');
				}else{
					self.find('tbody .record-checkbox').prop('checked',false);
					self.find('tbody tr').removeClass('selected');
				}
			});
		}
		var cols = this.element.find('th[data-format],th[data-fill-method]');
		this._columns = [];
		for(var i = 0; i < cols.length; i++){
			var col = cols.eq(i);
			var column = {};
			column.format = col.data('format');
			column.type = col.data('type');
			column.align = col.data('align');
			column.fillMethod = col.data('fillMethod');
			column.join = col.data('join');
			this._columns.push($.extend({type:'data'},column));
			col.find('span.sorticon').remove();
			if(col.data('order')){
				col.append(' ');
				if($.config.bsver == 3){
					col.append('<span class="sorticon desc glyphicon glyphicon-chevron-down"></span>');
					col.append('<span class="sorticon asc glyphicon glyphicon-chevron-up"></span>');
				}
				else{
					col.append('<span class="sorticon desc icon-angle-down"></span>');
					col.append('<span class="sorticon asc icon-angle-up"></span>');
				}
			}
		}
		
	},
	setPage:function(page){
		this._page = page;
		this._reload();
	},
	reloadCustom:function(data) {
		this.footer.pager('totalCount',data.content.length);
		this.options.customContent = data;
		this._reload();
	},
	_reload:function(){
		if(!this.validate()){
			return false;
		}
		if (this.options.customContent) {
			this.footer.pager('totalCount',this.options.customContent.content.length);
			this.options.customContent.totalCount = this.options.customContent.content.length;
			this._fillBody(this.options.customContent);
		} else {
			$[this.options.method]({url:this.options.url,traditional:true,
				data:$.extend(this._getParam(),this._filter),
				success:$.proxy(function(pager){
				this.footer.pager('totalCount',pager.totalCount);
				this._fillBody(pager);
			},this)});
		}
	},
	getSelected:function(){
		var records = [];
		this.element.find('tbody tr.selected').each(function(){
			records.push($(this).data('record'));
		});
		return records;
	},
	reload:function(filter){
		var filters;
		if(typeof(this.options.filter) == "string"){
			filters = $(this.options.filter);
		}
		else{
			filters =  this.options.filter;
		}
		this._filter = this._getFilters(filters);
		this._reload();
	},
	_getParam:function(){
		return $.extend({'pageNo':this._page,'pageSize':this.options.pageSize},this._getOrderParams());
	},
	_getOrderParams:function(){
		var cols = this.element.find('th.sorting');
		var order = {'pageSorts':[]};

		for(var i = 0; i < cols.length; i++){
			var col = cols.eq(i);
			var property = col.data('order');
			var sort = property;
			if(col.hasClass('desc')) sort += ' desc';
			else sort += ' asc';
			order['pageSorts'][i] = sort;
		}
		return order;
	},
	_fillBody:function(pager){
		this.element.find('tbody').empty();
		var color = this.options.color;
		var num = ((this._page-1)*this.options.pageSize)+1;
		for(var i = 0; i < pager.content.length; i++){
			this._fillRow(pager.content[i]);
			var record = pager.content[i];
			if(record){
				var node = this.element.find('tbody').find('tr:last');
				if(this.options.showNum){
					node.prepend("<td class='tr-num'>"+(num+i)+"</td>");
				}
				if(this.options.checkbox){
					node.prepend("<td class='tr-checkbox'><input type='checkbox' class='record-checkbox'></td>");
				}
				node.data('record',record);
				if(color){
					node.addClass(color+"_"+record[color]);
				}
			}
		}
		if(this.element.find('tbody').is(':empty')){
			this.element.find('tbody').append('<tr/>');
		}
		$.unblockUI();
		this.options.callback(pager);
	},
	_fillRow:function(record){
		if(!record) return;
		var html = '<tr>';
		for(var i = 0; i < this._columns.length; i++){
			var align = this._columns[i].align;
			if(!align){
				align = "";
			}
			var column = this._columns[i];
			var v = this._fillCell(record,this._columns[i]);
			try{
				if(v && (v.indexOf('iframe')!=-1 || v.indexOf('script')!=-1 || v.indexOf('onload')!=-1 || v.indexOf('onerror')!=-1)){
					v = "<span class='icon-warning-sign'></span>非法字符";
				}
			}catch(e){};
			if(column.fillMethod && typeof(this.options[column.fillMethod]) == 'function'){
				html += '<td class="'+align+'">' + v + '</td>';
			}else{
				if(this.options.ellipsis){
					html += '<td class="'+align+'" title="'+ v +'">' + v + '</td>';
				}else{
					html += '<td class="'+align+'">' + v + '</td>';
				}
			}
			
		}
		html += '</tr>';
		this.element.find('tbody').append(html);
	},
	_fillCell:function(record,column){
		if(column.fillMethod && typeof(this.options[column.fillMethod]) == 'function'){
			return this.options[column.fillMethod].apply(this.element,[record,column]);
		}
		if(typeof(column.format) == 'string'){
			try{
				
				if(/^([0-9a-zA-Z_])+(\.[0-9-a-zA-Z_]+)*$/.test(column.format)){
					var val = this._getRecordValue(record,column.format);
					if(val==0) return val;
					if(!val) val = '';
					return val;
				}
			}
			catch(e){}
			var text = this._propertyParser(record,column.format);
			text = this._convertParser(record,text,column.join);
			if(text == column.format);
			return text;
		}
	},
	_propertyParser:function(record,format){
		var el = format.match(/{([0-9a-zA-Z._]+)}/);
		if(el == null) return format;
		var result = format;
		do{
			result = result.replace(el[0], this._getRecordValue(record,el[1]));
			el = result.match(/{([0-9a-zA-Z._]+)}/);
		}while(el != null);
		return result;
	},
	_getRecordValue:function(record,name){
		return common.getRecordValue(record,name);
	},
	_convertParser:function(record,format,join){
		var regex = /convert\[([0-9a-zA-Z._]+)\]\[([0-9a-zA-Z._]+)\]/;
		var el = format.match(regex);
		if(el == null) return format;
		var result = format;
		do{
			var value = this._getRecordValue(record,el[2]);
			var text = [];
			if(value){ //列表代码转换:多选转换为逗号分隔,转换不了的原值显示
				if(value.constructor == String){
					var val = value.split(',');
					for(var i = 0;i<val.length;i++){
						text.push(result.replace(el[0],$.codemap[el[1]][val[i]]||val[i]||''));
					}
				}else{
					text.push(result.replace(el[0],$.codemap[el[1]][value]||value||''));
				}
			}else{
				text.push(result.replace(el[0], $.codemap[el[1]][value]||value||''));
			}
			
			if(join){
				result = text.join(join);
			}else{
				result = text.join(',');
			}
			
			//result = result.replace(el[0], $.codemap[el[1]][this._getRecordValue(record,el[2])]||'');
			el = result.match(regex);
		}while(el != null);
		return result;
	},
	_valiateField:function(field){
		if($(field).is(':hidden')){
			return true;
		}
		if($(field).is('select')){
			var has = $(field).find('option').length;
			if(!has){
				if($(field).attr('required')){
					this._setError(field);
					return false;
				}
			}
		}
		if($(field).attr('required')  && $(field).val().length == 0){
			this._setError(field);
			return false;
		}
		if($(field).attr('pattern') && !(new RegExp($(field).attr('pattern')).test($(field).val()))){
			this._setError(field);
			return false;
		}
		this._removeError(field);
		return true;
	},
	_setError:function(field){
		$(field).addClass('has-error');
		$(field).closest('.form-group').addClass('has-error');
	},
	_removeError:function (field){
		$(field).removeClass('has-error');
		$(field).closest('.form-group').removeClass('has-error');
	},
	validate:function(){
		
		var self = this;
		var right = true;
		if(this.options.filter){
			var filters;
			if(typeof(this.options.filter) == "string"){
				filters = $(this.options.filter);
			}
			else{
				filters =  this.options.filter;
			}
			filters.find('input:not(:hidden,:checkbox,:radio),select,textarea').each(function(){
				right = self._valiateField(this)&right;
			});
			var errorInput = filters.find('.form-group.has-error:first');
			if(errorInput.length > 0) $('body').animate({scrollTop:errorInput.offset().top-50},500);
			filters.find('.form-group.has-error');
			
		}
		return right;
		
	}
});

}( jQuery ) );
});
