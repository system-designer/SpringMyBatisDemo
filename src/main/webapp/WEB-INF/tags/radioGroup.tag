<%@tag import="com.google.common.base.Strings"%>
<%@tag import="java.lang.*"%>
<%@tag import="com.raymond.oauth.db.model.Codeitem"%>
<%@tag import="java.util.List"%>
<%@tag import="com.raymond.oauth.service.CodeitemService"%>
<%@tag import="java.util.Map.Entry"%>
<%@ tag language="java" pageEncoding="UTF-8"%>
<%@tag import="java.util.Locale"%>
<%@tag import="org.springframework.web.context.support.WebApplicationContextUtils"%>
<%@tag import="org.springframework.context.ApplicationContext"%>
<%@ attribute name="id" required="true" %>
<%@ attribute name="name" required="true" %>
<%@ attribute name="labelClass" required="false" %>
<%@ attribute name="inputDivClass" required="false" %>
<%@ attribute name="style" required="false" %>
<%@ attribute name="src" required="false" %>
<%@ attribute name="label" required="false" description="字段前的标签文本" %>
<%@ attribute name="help" required="false" description="字段帮助文本" %>
<%@ attribute name="value" required="false" rtexprvalue="true" type="Object" %>
<%@ attribute name="helpInline" required="false" type="Boolean" description="字段帮助文本是否在同一行" %>
<%@ attribute name="convert" required="false" description="代码转换" %>
<%@ attribute name="item" required="false" description="数据列表" rtexprvalue="true" type="Object" %>
<%@ attribute name="itemtext" required="false"  description="数据列表文本字段" %>
<%@ attribute name="itemcode" required="false" description="数据列表代码字段" %>
<%@ attribute name="required" required="false" rtexprvalue="true" type="Boolean" %>
<%@ attribute name="readonly" required="false" rtexprvalue="true" type="Boolean" %>
<%@ attribute name="groupInline" required="false" rtexprvalue="true" type="Boolean" description="是否一行显示"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%
ApplicationContext ctx = WebApplicationContextUtils.getWebApplicationContext(((PageContext)this.getJspContext()).getServletContext());
CodeitemService cm = (CodeitemService)ctx.getBean("codeitemService");
String convert = (String)this.getJspContext().getAttribute("convert");

String idKey = (String)this.getJspContext().getAttribute("itemcode");
if(idKey == null) this.getJspContext().setAttribute("itemcode","id");

String pidKey = (String)this.getJspContext().getAttribute("itemtext");
if(pidKey == null) this.getJspContext().setAttribute("itemtext","name");

%>
<div class="form-group">
	<c:if test="${ label ne null}">
	    <label class="${labelClass}  control-label" for="${id}">${label}</label>
	</c:if>
	<div id="${id}" class="${inputDivClass} ${required eq true ? 'required':'' } ${groupInline eq true ? 'form-inline':''}">
		
    	
    	<%
    	if(!Strings.isNullOrEmpty(convert)){
    		List<Codeitem> list = cm.findCodeItem(convert);
	   		for(Codeitem item: list){
    	%>
    		<label class="control-label"><input type="radio" <%= item.getCode().equals(value)?"checked":"" %> style="margin-left:10px;margin-top: 0px;width:15px;" name="${name}" value="<%= item.getCode()%>"> <%= item.getName() %></label>
    		
    	<%
    		}
    	}
    	%>
    	<c:if test="${item ne null}">
    		<c:forEach items="${item}" var="li">
    			<label class="control-label"><input type="radio" ${li[itemcode] eq value ? 'checked':''} style="margin-left:10px;margin-top: 0px;width:15px;" name="${name}" value="${li[itemcode]}"> ${li[itemtext]}</label>
    		</c:forEach>
    	</c:if>
    	
    	<c:if test="${src ne null }">
    		<script type="text/javascript">
	    		seajs.use(['jquery','myutil.init'],function($){
	    			var params = {};
	    			
	    			
	    			selectLoad(params);
	    			
	    			function selectLoad(params){
	    				$.read('${__baseUrl}${src}',params,function(result){
	    					$('#${id}').empty();
		    				for(var i = 0; result && i < result.length; i++){
		    					var record = result[i];
		    					fillOption(record);
		    					var node = $('#${id}').find('input:last');
		    					node.data('record',record);
		    				}
						});
	    			}
	    			
	    			function fillOption(record){
	    				var code = record['${itemcode}'];
    					var text = record['${itemtext}'];
    					var selected = (code=='${value}'?'checked':'');
	    				$('#${id}').append('<label class="control-label"><input type="radio" value="'+code+'"'+ selected+' style="margin-left:10px;margin-top: 0px;width:15px;" name="${name}"> '+text+'</label>');
	    			}
	    			
	    			
	    		});
    		</script>
    	
    	</c:if>
    </div>
    <c:if test="${help ne null}">
    <c:if test="${helpInline ne false}">
    	<p class="help-inline">${help}</p>
    </c:if>
    <c:if test="${ helpInline eq false }">
    	<p class="help-block">${help}</p>
    </c:if>
    </c:if>
</div>