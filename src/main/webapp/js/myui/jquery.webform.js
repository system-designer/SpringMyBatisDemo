define(function(require, exports, module) {
	var jQuery = require('jquery');
	var $ = jQuery;
	require('jquery.ui.widget');
	require('myutil.rest');
	require('myui.alert');
	require('select2');
	require('jquery.blockUI');
	var common = require('myutil.common');
	module.exports = jQuery;
/**
 * samples:
 * 		$('#formid').webform({
 * 			createFields:true,		// 创建输入域
 *		});
 */
(function($) {
	$.widget("jquery.webform",{
		options:{
			createFields:false,
			createButtons:false,
			ajax:false,
			method:'get',
			clear:true
		},
		_create:function(){
			if(this.options.createFields)	this._createFields();
			if(this.options.createButtons) this._createButtons();
			if(this.element.data('mode') && this.element.data('mode').toLowerCase() == 'ajax') this.options.ajax = true;
			this.options.method = this.element.attr('method');
			this._bindEvent();
		},
		_init:function(){
			if(this.options.clear){
				this.clear();
			}
		},
		_createFields:function(){
			
		},
		_createButtons:function(){
			
		},
		_bindEvent:function(){
			var self = this;
			this.element.submit(function(){
				return self.submit();
			});
			this.element.find('input:not(:hidden,:checkbox,:radio),select,textarea').bind('change',function(e){
				self._valiateField(this);
			});
		},
		_setStatus:function(status){
			this.status = status;
			if(status == ''){
				this.element.find('button:submit.disabled').removeClass('disabled');
			}
			else if(status == 'submiting'){
				this.element.find('button:submit').addClass('disabled');
			}
		},
		submit:function(src){
			try{
				var self = this;
				if(this.status && this.status != '') return false;
				if(!this.options.ajax){
					if(this.validate()){
						this._setStatus('');
						return true;
					}
					return false;
				}
				if(!this.validate()){
					return false;
				}
				if(self.options.beforeSubmit){
					if(!self._trigger('beforeSubmit')) return false;
				}
				
			//	var postData = this.element.find('input,select,textarea').serializeArray();
				var postData = $.param(this.element.find('input:not(:checkbox,:radio,:file),input:checked,select,textarea'),true);
				
				var hasFile = this.element.find("input:file").length;
				if(hasFile){
					var formdata = new FormData();
					this.element.find('input:file').each(function(){
						var fileinput = $(this)[0];
						for(var i = 0;i<fileinput.files.length;i++){
							formdata.append($(this).attr('name'),fileinput.files[i]);
						}
					});
					this.element.find('input:not(:checkbox,:radio,:file),input:checked,select,textarea').each(function(){
						formdata.append($(this).attr('name'),$(this).val());
					});
					this.options.method = 'file';
					postData = formdata;
				}
				
				var methods = {get:$.read, post:$.create, 'delete':$.destroy, put:$.update,file:$.postFile};
				var method = methods[this.options.method.toLowerCase()];
				method(src||this.element.attr('action'),postData,function(result){
					self._setStatus('');
					if(self.options.message){
						self._alert(self.options.message.apply(this.element,[result]));
					}
					else{
						self._alert(result);
					}
					// 业务异常
					if(result._exception){
						self._trigger('error',{},result);
					}
					else{
						self._trigger('success',{},result);
					}
				},function(error){
					self._setStatus('');
					self._alert(error);
					self._trigger('error',{},error);
				});
				return false;
			}
			catch(e){
				this._setStatus('');
				return false;
			}
		},
		clear:function(){
			this.element.find('input:not(:checkbox,:radio),textarea').val('');
			this.element.find('td.show-td').html('');
			this.element.find('*[data-name]').html('');
			this.element.find('select:not(:empty)').each(function(){
				$(this).val($(this).find('option:first').attr('value'));
			});
		//	this.element.find('select > option:first-child').attr('selected','selected');
			this.element.find(':checkbox,:radio').prop('checked',false);
			this.element.find('.has-error').removeClass('has-error');
			this.element.find('.alert').empty().hide();
			this.element.find('select').change();
		},
		fill:function(url, cb){
			if(typeof url == 'string'){
				$.read(url,$.proxy(function(obj){
					this._fill(obj, cb);
				},this));
			}
			else this._fill(url, cb);
		},
		_fill:function(record, cb){

			this.clear();
			var inputs = this.element.find('input:not(:checkbox,:radio),select,textarea,label,*[data-name]');
			inputs.each($.proxy(function(idx,input){
				var name = $(input).attr('name');
				if(name) {
					var select = $(input).is('select');
					var value = this._getRecordValue(record,name);
					if(select){//多选下拉框
						if(value && value.constructor == String){
							if(value){
								$(input).find('option').removeAttr('selected');
	    						var val = value.split(',');
	    						if($(input).hasClass('select2-hidden-accessible')){
	    							$(input).select2('val',val);
	    						}else{
	    							for(var i = 0;i<val.length;i++){
		    							$(input).find("option[value='"+val[i]+"']").prop('selected',true);
		    						}
	    						}
	    						
							}
    					}else{
    						if($(input).hasClass('select2-hidden-accessible')){
    							$(input).select2('val',value);
    						}else{
    							$(input).val(value);
    						}
    					}
					}else{
						$(input).val(value);
					}
				}
				var name_ = $(input).data('name');
        		var convert_ = $(input).data('convert');
        		if(name_){
        			var value = this._getRecordValue(record,name_);
        			if(value==null) value = "";
        			if(convert_){
        				var text = [];
        				if(value){ //代码转换:多选转换为逗号分隔,转换不了的原值显示
        					if(value.constructor == String){
        						var val = value.split(',');
        						for(var i = 0;i<val.length;i++){
        							text.push($.codemap[convert_][val[i]]||val[i]||'');
        						}
        					}else{
        						text.push($.codemap[convert_][value]||value||'');
        					}
        				}else{
        					text.push($.codemap[convert_][value]||'');
        				}
        				if (cb) {
        					cb(input, text.join(','));
        				} else {
        					$(input).text(text.join(','));
        				}
        				
        			}else{
        				if (cb) {
        					cb(input, value);
        				} else {
        					$(input).text(value);
        				}
        			}
        		}
			},this));
			
			var checks = this.element.find(':checkbox,:radio');
			checks.each($.proxy(function(idx,input){
				$(input).prop('checked',false);
				var name = $(input).attr('name');
				var value = $(input).val();
				var values = this._getRecordValue(record,name);
				if(values){
					if(values.constructor == String){
						var val = values.split(',');
						if(val.indexOf(value)!=-1){
							$(input).prop('checked',true);
						}
					}else{
						if(value==values){
							$(input).prop('checked',true);
						}
					}
				}
				
			},this));
			this.element.find('input.datepicker').each(function(){
				try{
					$(this).change();
					$(this).datepicker('update');
				}catch(e){}
			});
			this.element.find('select').change();
			this._trigger('loaded',{},record);
		},
		_getRecordValue:function(record,name){
			return common.getRecordValue(record,name);
		},
		_alert:function(msg){
			if (msg.code !== undefined && msg.code !== null && msg.code !== false) {
				var text = '';
				var type = 'alert-success';
				if(msg._exception){
					text = '[' + msg.code + ']' + msg.message;
					type = 'alert-danger';
				}
				else{
					if(msg.message){
						text = msg.message;
					}
					else{
						var msgMap = {}
						if (msg._exception==false){
							msgMap={post:'保存成功',get:'加载成功','delete':'删除成功','put':'保存成功'};
						} else {
							msgMap={post:'保存失败',get:'加载失败','delete':'删除失败','put':'保存失败'};
						}
											
						text = msgMap[this.options.method.toLowerCase()];
					}
				}
				var show = this.element.data('showMessage');
				if(!show) {
					alert(text);
					$(this).find('div.modal').modal('hide');
					return;
				}
				this.alert(text, type);
			}
		},
		alert:function(msg,alertType){
			this.element.alert({type:alertType,text:msg,icon:(alertType=='alert-success'?'icon-ok-sign':'icon-remove-sign')});
		},
		_valiateField:function(field){
			if($(field).is(':hidden') && !$(field).is('textarea')){
				return true;
			}
			
			if($(field).is('div')){
				var has = false;
				$(field).find('input').each(function(){
					if($(this).prop('checked')){
						has = true;
					}
				});
				if(!has){
					this._setError(field);
					return false;
				}
				this._removeError(field);
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
			if($(field).attr('required') && ($(field).val() ==null || $(field).val().length == 0 )){
				this._setError(field);
				return false;
			}
			
			if($(field).attr('pattern') && !(new RegExp($(field).attr('pattern')).test($(field).val()))){
				this._setError(field);
				return false;
			}
			if($(field).val() && $(field).val().length>0){
				if($(field).data('le')!=null && ($(field).val()>$(field).data('le'))){
					this._setError(field);
					return false;
				}
				if($(field).data('ge')!=null && ($(field).val()<$(field).data('ge'))){
					this._setError(field);
					return false;
				}
				if($(field).data('eq')!=null && ($(field).val()!=$(field).data('eq'))){
					this._setError(field);
					return false;
				}
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
			
			this.element.find('input:not(:hidden,:checkbox,:radio,.select2-search__field),select,textarea').each(function(){
				right = self._valiateField(this)&right;
			});
			this.element.find('.form-group div.required').each(function(){
				right = self._valiateField(this)&right;
			});
			var errorInput = this.element.find('.form-group.has-error:first');
			if(errorInput.length > 0) $('body').animate({scrollTop:errorInput.offset().top-50},500);
			this.element.find('.form-group.has-error');
			return right;
		}
	});
})(jQuery);
});