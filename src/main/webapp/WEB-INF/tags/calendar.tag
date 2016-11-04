<%@ tag language="java" pageEncoding="UTF-8"%>
<%@tag import="java.lang.*"%>
<%@ attribute name="id" required="true" %>
<%@ attribute name="type" required="false" %>
<%@ attribute name="name" required="true" %>
<%@ attribute name="labelClass" required="false" %>
<%@ attribute name="inputClass" required="false" %>
<%@ attribute name="format" required="false" %>
<%@ attribute name="startDate" required="false" %>
<%@ attribute name="endDate" required="false" %>
<%@ attribute name="minViewMode" required="false" %>
<%@ attribute name="showDate" required="false" type="Boolean" rtexprvalue="true" fragment="false"%>
<%@ attribute name="style" required="false" %>
<%@ attribute name="multidate" required="false" rtexprvalue="true" fragment="false" description="日期多选" type="Boolean"%>
<%@ attribute name="inputDivClass" required="false" %>
<%@ attribute name="placeholder" required="false" description="字段描述"%>
<%@ attribute name="label" required="false" description="字段前的标签文本" %>
<%@ attribute name="help" required="false" description="字段帮助文本" %>
<%@ attribute name="value" required="false" rtexprvalue="true" %>
<%@ attribute name="maxlen" required="false" rtexprvalue="true" %>
<%@ attribute name="pattern" required="false" rtexprvalue="true" %>
<%@ attribute name="required" required="false" rtexprvalue="true" type="Boolean" %>
<%@ attribute name="readonly" required="false" description="只读属性" type="Boolean" %>
<%@ attribute name="disabled" required="false" description="禁用" type="Boolean" %>

<%@ attribute name="helpInline" required="false" type="Boolean" description="字段帮助文本是否在同一行" %>

<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%
	Boolean multidate = (Boolean)this.getJspContext().getAttribute("multidate");
	if(multidate == null) this.getJspContext().setAttribute("multidate",false);
	Boolean showDate = (Boolean)this.getJspContext().getAttribute("showDate");
	if(showDate == null) this.getJspContext().setAttribute("showDate",true);
	String maxlen = (String)this.getJspContext().getAttribute("maxlen");
	if(maxlen != null) this.getJspContext().setAttribute("maxlen", "maxlength=\"" + maxlen + "\"");
	String pattern = (String)this.getJspContext().getAttribute("pattern");
	if(pattern != null) this.getJspContext().setAttribute("pattern", "pattern=\"" + pattern + "\"");
	String type = (String) this.getJspContext().getAttribute("type");
	String format = (String) this.getJspContext().getAttribute("format");
	if("time".equals(type)){
		if(format==null){
			 this.getJspContext().setAttribute("format","yyyy-MM-dd hh:mm:ss");
		}
	}else{
		if(format==null){
			 this.getJspContext().setAttribute("format","yyyy-mm-dd");
		}
	}
	String minViewMode = (String)this.getJspContext().getAttribute("minViewMode");
	if(minViewMode==null) this.getJspContext().setAttribute("minViewMode",0);
%>
<div class="form-group" >
	<c:if test="${ label ne null}">
	    <label class="${labelClass} control-label" for="${id}">${label}</label>
	</c:if>
	<c:if test="${type eq 'time' }">
		<div class="${inputDivClass} datepicker" >
	      <input id="${id}" data-format="${ format ne null ? format :'yyyy-MM-dd hh:mm:ss'}" ${maxlen} ${pattern} name="${name}" ${readonly eq true?"readonly":"" } ${disabled eq true?"disabled":"" } ${required eq true?"required='required'":""}   value="${value}" type="text" style="${style}" class="form-control datepicker ${inputClass }" title="${placeholder}" placeholder="${placeholder}"></input>
	       <i data-time-icon="icon-time" data-date-icon="icon-calendar"></i>
	    </div>    
    	
    	 <script>
	     seajs.use(['jquery','bootstrap.datetimepicker'],function($){
	    	 $('#${id}').datetimepicker({format:'${format}',minViewMode:${minViewMode},pickDate:${showDate}});
	     });
		</script>
	</c:if>
	<c:if test="${type eq null || type eq 'date'}">
		<div class="${inputDivClass} datepicker" >
	    	<input ${maxlen} ${pattern} name="${name}" ${readonly eq true?"readonly":"" } ${disabled eq true?"disabled":"" } ${required eq true?"required='required'":""}  id="${id}" value="${value}" type="text" style="${style}" class="form-control datepicker ${inputClass }" placeholder="${placeholder}">
	        <i class="icon-calendar"></i>
	    </div>
	    <script>
	     seajs.use(['jquery','bootstrap.datepicker'],function($){
	    	$('#${id}').datepicker({multidate:${multidate},format:'${format}',minViewMode:${minViewMode},autoclose:${multidate eq false}});
	    	
	    	if('${startDate}'){
	    		
	    		if(new RegExp('^-?[0-9]*$').test('${startDate}'.substring(0,1))){
	    			$('#${id}').datepicker('remove');
	    			$('#${id}').datepicker({multidate:${multidate},format:'${format}',startDate:'${startDate}',minViewMode:${minViewMode},autoclose:${multidate eq false}});
	    		}else{
	    			$('#${startDate}').change(function(){
	    				$('#${id}').datepicker('remove');
	    				if($(this).val()){
	    					$('#${id}').datepicker({multidate:${multidate},format:'${format}',startDate:$(this).val(),minViewMode:${minViewMode},autoclose:${multidate eq false}});
	    	    		}else{
	    	    			$('#${id}').datepicker({multidate:${multidate},format:'${format}',startDate:0,minViewMode:${minViewMode},autoclose:${multidate eq false}});
	    	    		}
	    			});
	    		}
	    	}
	    	if('${endDate}'){
	    		
	    		if(new RegExp('^-?[0-9]*$').test('${endDate}'.substring(0,1))){
	    			$('#${id}').datepicker('remove');
	    			$('#${id}').datepicker({multidate:${multidate},format:'${format}',endDate:'${endDate}',minViewMode:${minViewMode},autoclose:${multidate eq false}});
	    		}else{
	    			
	    			$('#${endDate}').change(function(){
	    				$('#${id}').datepicker('remove');
	    				if($(this).val()){
	    					$('#${id}').datepicker({multidate:${multidate},format:'${format}',endDate:$(this).val(),minViewMode:${minViewMode},autoclose:${multidate eq false}});
	    	    		}else{
	    	    			$('#${id}').datepicker({multidate:${multidate},format:'${format}',endDate:0,minViewMode:${minViewMode},autoclose:${multidate eq false}});
	    	    		}
	    			});
	    				
	    		}
	    	}
	    	
	     });
		</script>
	</c:if>
    <c:if test="${help ne null}">
    <c:if test="${helpInline ne false}">
    	<p class="help-inline">${help}</p>
    </c:if>
    <c:if test="${ helpInline eq false }">
    	<p class="help-block">${help}</p>
    </c:if>
    </c:if>
   
</div>
