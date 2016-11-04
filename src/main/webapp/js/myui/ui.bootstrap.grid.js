/*
	表格组件
	options:
		title: 标题文本
		buttons:按钮数组
			- name: 按钮名称，后面会用于按钮事件回调
			- text: 按钮文本
			- icon: 图标样式
		columns:列数组
			- name: 列名，后面会用于ajax数据记录值键
			- text: 列文本
			- width: 列宽
		src: ajax加载URL
		autoload: 是否自动加载ajax数据
*/
(function( $ ) {

$.widget( "ui.grid", {
	options:{
		title: 'ui.grid',
		height: 100,
		autoload: true,
		buttons:[
			{name:'add',text:'添加',icon:'ui-icon-plusthick'},
			{name:'edit',text:'修改',icon:'ui-icon-pencil'},
			{name:'remove',text:'删除',icon:'ui-icon-minusthick'}
		],
		pageSizeRange:[5,10,15,20,30,50],
		pageSize:5,
	},
	_create:function(){
		this._addClass();
		this._createTitle();
		this._createToolbar();
		this._createHeader();
		this._createBody();
		this._createFooter();
		this.pageSize = this.options.pageSize;
		this.page = this.maxPage = 1;
		this._addEvent();
	},
	_init:function(){
		if(this.options.src && this.options.autoload){
			this._loadData();
		}
	},
	_addEvent:function(){
		this._adddToolbarEvent();
		this._addPageSizeEvent();
		//this._addFooterEvent();
		this._addBodyEvent();
		this._addDraglinesEvent();
	},
	_adddToolbarEvent:function(){
		this._on(true,this.toolbar.find('button'),{
			click:function(event){
				this._trigger($(event.currentTarget).attr('name')+'Click');
			}
		});
	},
	_addPageSizeEvent:function(){
		this._on(true,this.footer.find('.ui-grid-footer-select'),{
			change:function(event){
				this.pageSize = this.options.pageSize = parseInt($(event.target).val());
				this._loadData();
			}
		});
	},
	_addDraglinesEvent:function(){
		var self = this;
		this._on(true,this.draglines,{
			mousedown:function(event){
				$(event.target).addClass('ui-grid-dragline-active');
			}
		});
		this.draglines.children().draggable({
			axis: "x",
			start:function(event,ui){
				self.element.disableSelection();
			},
			stop:function(event,ui){
				self.element.enableSelection();
				$(this).removeClass('ui-grid-dragline-active');
				var col = self.header.find('div.' + $(this).attr('name'));
				var cells = self.body.find('div.' + $(this).attr('name'));
				col.width($(this).position().left - col.position().left);
				cells.width($(this).position().left - col.position().left);
				self.draglines.children().each(function(){
					$(this).position({of:self.header.find('div.' + $(this).attr('name')),at:'right top',my:'left+1 top'});
				});
			}
		});
	},
	
	_setPage:function(page){
		if(page > this.maxPage || page < 1) return;
		this.page = page;
		this.footer.find('.ui-grid-footer-input').val(page);
		this._loadData();
	},
	_addBodyEvent:function(){
		this._on(true,this.body,{
			scroll:function(){
				this.header.children('table').css('left',-this.body.scrollLeft() + 'px');
				this.draglines.position({of:this.header,at:'left-' + this.body.scrollLeft() + ' top',my:'left top'});
			}
		});
	},
	// 添加样式
	_addClass:function(){
		if(!this.element.hasClass('ui-grid')) this.element.addClass('ui-grid');
		if(!this.element.hasClass('ui-widget-content')) this.element.addClass('ui-widget-content');
		if(!this.element.hasClass('ui-corner-all')) this.element.addClass('ui-corner-all');
	},
	// 创建表格标题
	_createTitle:function(){
		this.title = this.element.find('.ui-grid-title:first');
		if(this.title.lenght > 0) return;
		this.title = $('<div class="ui-grid-title ui-widget-header ui-corner-top"><span class="ui-grid-title-text ui-widget-header">' 
			+ this.options.title + '</span></div>');
		this.element.append(this.title);
	},
	// 创建表格工具栏
	_createToolbar:function(){
		this.toolbar = this.element.find('.ui-grid-toolbar:first');
		if(this.toolbar.lenght > 0) return;
		this.toolbar = $('<div class="ui-grid-toolbar btn-group"/>');
		this.element.append(this.toolbar);
		for(var i in this.options.buttons){
			this._addButton(this.options.buttons[i]);
		}
	},
	// 创建列头
	_createHeader:function(){
		this.header = this.element.find('.ui-grid-header:first');
		if(this.header.length > 0){
			this.columns = this.header.find('tr');
			return;
		}
		this.header = $('<div class="ui-grid-header ui-widget-content"><table class="table"><thead><tr></tr></thead></table></div>');
		this.draglines = $('<div class="ui-grid-draglines" style="position:absolute;"/>');
		this.element.append(this.header);
		this.element.append(this.draglines);
		this.draglines.position({of:this.header,at:'left top',my:'left top'});
		this.columns = this.header.find('tr');
		for(var i in this.options.columns){
			this._addColumn(i,this.options.columns[i]);
		}
	},
	// 创建表体
	_createBody:function(){
		this.body = this.element.find('.ui-grid-body:first');
		if(this.body.lenght > 0) return;
		this.body = $('<div class="ui-grid-body ui-widget-content" style="height:' + this.options.height + 'px;"><table class="table"><tbody></tbody></table></div>');
		this.element.append(this.body);
	},
	_createFooter:function(){
		this.footer = this.element.find('.ui-grid-footer:first');
		if(this.footer.length > 0) return;
		this.footer = $('<div class="ui-grid-footer"><ul></ul></div>');
		this.element.append(this.footer);
		this.footer.children('ul').pager({change:$.proxy(function(page,pageSize){
			this.options.pageSize = pageSize;
			this._setPage(page);
		},this)});
	},
	// 添加一个按钮到工具栏
	_addButton:function(button){
		var bt = $('<button type="button" name="' + button.name + '" class="btn btn-default">' + button.text + '</button>');
		this.toolbar.append(bt);
		bt.button({
			icons:{
				primary: button.icon
			}
		});
	},
	// 添加列
	_addColumn:function(i,column){
		this.columns.append('<th class="ui-grid-header-column" name="' + column.name + '"><div class="col-' + i + '" style="width:' 
			+ (column.width?column.width:100) + 'px">' + column.text + '</div></th>');
			this.draglines.append('<div name="col-' + i + '" class="ui-grid-dragline" style="height:' 
				+ (this.options.height + this.header.outerHeight()) + 'px;" />');
			this.draglines.find('div:last').position({of:this.columns.children(':last'),at:'right top',my:'left top'});
	},
	_loadData:function(){
		var self = this;
		self.footer.find('[name="refresh"]').addClass('ui-grid-footer-button-loading');
		$.read(self.options.src,self._getParams(),function(pager){
			if(self.options.recordParser){
				return self._fillData(self.options.recordParser(pager));
			}
			self.footer.find('[name="refresh"]').removeClass('ui-grid-footer-button-loading');
			return self._fillData(pager);
		},function(){
			self.footer.find('[name="refresh"]').removeClass('ui-grid-footer-button-loading');
		});
	},
	_getParams:function(){
		return {pagesize : this.pageSize, page : this.page}
	},
	_fillData:function(pager){
		var html = '';
		// 设置页脚
		this.footer.find('.ui-grid-footer-input').val(pager.page);
		var pageCount = parseInt(pager.recordCount / this.pageSize) + (pager.recordCount % this.pageSize == 0?0:1);
		this.maxPage = pageCount;
		this.footer.find('.ui-grid-footer-record-count').text('共' + pager.recordCount + '条记录当前列出第' 
			+ (this.pageSize * (pager.page - 1) + 1) + '-' 
			+ (pageCount == pager.page ? pager.recordCount % this.pageSize : this.pageSize) + '条记录');
		this.footer.find('.ui-grid-footer-pagecount').text('共' + pageCount + '页');
		// 填充表格
		for(var i in pager.rows){
			var rowHtml = '<tr class="' + (i%2==1?'erow':'') + ' ">';
			for(var j in this.options.columns){
				var value = pager.rows[i][this.options.columns[j].name];
				rowHtml += '<td><div class="cell col-' + j + '" style="width:' + (this.options.columns[j].width?this.options.columns[j].width:100)  
					+ 'px;" title="' + value + '">' + value + '</div></td>';
			}
			rowHtml += '</tr>';
			html += rowHtml;
		}
		this.body.find('tbody').html(html);
	}
});

}( jQuery ) );