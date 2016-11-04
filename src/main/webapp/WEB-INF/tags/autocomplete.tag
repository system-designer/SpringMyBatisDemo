<%@tag import="com.google.common.base.Strings"%>
<%@tag import="java.lang.*"%>
<%@tag import="com.raymond.oauth.db.model.Codeitem"%>
<%@tag import="java.util.*"%>
<%@tag import="com.alibaba.fastjson.*"%>
<%@tag import="com.raymond.oauth.service.CodeitemService"%>
<%@tag import="java.util.Map.Entry"%>
<%@ tag language="java" pageEncoding="UTF-8"%>
<%@tag import="java.util.Locale"%>
<%@tag import="org.springframework.web.context.support.WebApplicationContextUtils"%>
<%@tag import="org.springframework.context.ApplicationContext"%>
<%@ attribute name="id" required="true" %>
<%@ attribute name="name" required="true" %>
<%@ attribute name="labelClass" required="false" %>
<%@ attribute name="inputClass" required="false" %>
<%@ attribute name="placeholder" required="false" description="字段描述"%>
<%@ attribute name="style" required="false" %>
<%@ attribute name="src" required="false" %>
<%@ attribute name="parentArea" required="false" %>
<%@ attribute name="paramProperty" required="false" %>
<%@ attribute name="label" required="false" description="字段前的标签文本" %>
<%@ attribute name="help" required="false" description="字段帮助文本" %>
<%@ attribute name="value" required="false" rtexprvalue="true" type="Object" %>
<%@ attribute name="helpInline" required="false" type="Boolean" description="字段帮助文本是否在同一行" %>
<%@ attribute name="convert" required="false" description="代码转换" %>
<%@ attribute name="item" required="false" description="数据列表" rtexprvalue="true" type="Object" %>
<%@ attribute name="itemtext" required="false"  description="数据列表文本字段" %>
<%@ attribute name="itemcode" required="false" description="数据列表代码字段" %>
<%@ attribute name="allText" required="false" description="不选择下拉项时的文本" %>
<%@ attribute name="allValue" required="false" description="不选择下拉项时的值" %>
<%@ attribute name="required" required="false" rtexprvalue="true" type="Boolean" %>
<%@ attribute name="defaultOption" required="false" rtexprvalue="true" type="Boolean" %>
<%@ attribute name="readonly" required="false" rtexprvalue="true" type="Boolean" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%
ApplicationContext ctx = WebApplicationContextUtils.getWebApplicationContext(((PageContext)this.getJspContext()).getServletContext());
CodeitemService cm = (CodeitemService)ctx.getBean("codeitemService");
String convert = (String)this.getJspContext().getAttribute("convert");

String idKey = (String)this.getJspContext().getAttribute("itemcode");
if(idKey == null) this.getJspContext().setAttribute("itemcode","id");

String pidKey = (String)this.getJspContext().getAttribute("itemtext");
if(pidKey == null) this.getJspContext().setAttribute("itemtext","name");
Object items = this.getJspContext().getAttribute("item");
if(items==null){
	
}else{
	this.getJspContext().setAttribute("item",JSONArray.toJSON(items));
}

this.getJspContext().setAttribute("divId",UUID.randomUUID().toString());
%>
<div class="form-group" id="${divId}">
	<c:if test="${ label ne null}">
	    <label class="${labelClass}  control-label" for="${id}">${label}</label>
	</c:if>
    <select name="${name}" id="${id}" style="${style}" ${required eq true ? "required":"" } ${multiple eq true ? "multiple":"" }  class="form-control ${inputClass }" ${ readonly eq true?"readonly":"" }>
    	
     	<c:if test="${required ne true || defaultOption eq true }">
     		<option value="${ allValue eq null ? '':allValue }">${ allText eq null ? '所有':allText }</option>
    	</c:if>
    	
    	<%
    	if(!Strings.isNullOrEmpty(convert)){
    		List<Codeitem> list = cm.findCodeItem(convert);
	   		for(Codeitem item: list){
    	%>
    		<option <%= item.getCode().equals(value)?"selected":"" %> value="<%= item.getCode()  %>"><%= item.getName() %></option>
    	<%
    		}
    	}
    	%>
    	<c:if test="${item ne null}">
	    	<script type="text/javascript">
		    	seajs.use(['jquery','myutil.common','myutil.init'],function($,common){
		    		function fillOption(record){
	    				var code = record['${itemcode}'];
						var text = common.getShow(record,'${itemtext}');
						var selected = (code=='${value}'?'selected':'');
	    				$('#${divId} #${id}').append('<option value="'+code+'"'+ selected+'>'+text+'</option>');
	    			}
					var records = ${item};
					for(var i = 0;i<records.length;i++){
						var record = records[i];
						fillOption(record);
						var node = $('#${divId} #${id}').find('option:last');
    					node.data('record',record);
					}	
		    	});
	    	</script>
    		
    	</c:if>
    	
    	<c:if test="${src ne null }">
    		<script type="text/javascript">
	    		seajs.use(['jquery','myutil.common','myutil.init'],function($,common){
	    			var params = {};
	    			 if('${parentArea}'){
	    				var value = $('#${parentArea}').val();
	    				if(value){
	    					params = {'${paramProperty}':value};
	    				}
	    				$('#${parentArea}').change(function(){
	    					if($('#${parentArea}').val()){
	    						params = {'${paramProperty}':$('#${parentArea}').val()};
	    						$('#${divId} #${id}').empty();
	    						var required = '${required}';
	    						var defaultOption = '${defaultOption}';
			    				if(!required || defaultOption){
			    					$('#${divId} #${id}').append('<option value="${ allValue eq null ? '':allValue }">${ allText eq null ? "所有":allText }</option>');
			    				}
	    						selectLoad(params);
	    					}else{
	    						$('#${divId} #${id}').empty();
	    						var required = '${required}';
	    						var defaultOption = '${defaultOption}';
			    				if(!required || defaultOption){
			    					$('#${divId} #${id}').append('<option value="${ allValue eq null ? '':allValue }">${ allText eq null ? "所有":allText }</option>');
			    				}
	    					}
	    					
	    				});
	    			} 
	    			
	    			selectLoad(params);
	    			
	    			function selectLoad(params){
	    				$.read('${__baseUrl}${src}',params,function(result){
		    				
		    				for(var i = 0; result && i < result.length; i++){
		    					var record = result[i];
		    					fillOption(record);
		    					var node = $('#${divId} #${id}').find('option:last');
		    					node.data('record',record);
		    				}
						});
	    			}
	    			
	    			function fillOption(record){
	    				var code = record['${itemcode}'];
    					var text = common.getShow(record,'${itemtext}');
    					var selected = (code=='${value}'?'selected':'');
	    				$('#${divId} #${id}').append('<option value="'+code+'"'+ selected+'>'+text+'</option>');
	    			}
	    			
	    			
	    		});
    		</script>
    	
    	</c:if>
    </select>
    <%-- <div class="ui-autocomplete-input" style="${style}">
    	<input type="text" style="${style}"  ${required eq true?"required='required'":""} class="form-control ui-autocomplete-input ${inputClass }" ${ readonly eq true?"readonly":"" } placeholder="${placeholder}">
    	<i class="icon-caret-down icon-large"  title="显示所有"></i>
    </div>  --%>
    
    <script type="text/javascript">
	seajs.use(['jquery','myutil.init','select3'],function($){
  		$('#${divId} #${id}').select3({placeholder:"${placeholder}"});
  	});
	</script>
    <c:if test="${help ne null}">
    <c:if test="${helpInline ne false}">
    	<p class="help-inline">${help}</p>
    </c:if>
    <c:if test="${ helpInline eq false }">
    	<p class="help-block">${help}</p>
    </c:if>
    </c:if>
</div>