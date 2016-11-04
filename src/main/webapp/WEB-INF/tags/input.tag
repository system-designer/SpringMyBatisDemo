<%@ tag language="java" pageEncoding="UTF-8"%>
<%@tag import="java.lang.*"%>
<%@ attribute name="id" required="false" %>
<%@ attribute name="name" required="true" %>
<%@ attribute name="labelClass" required="false" %>
<%@ attribute name="inputClass" required="false" %>
<%@ attribute name="style" required="false" %>
<%@ attribute name="inputDivClass" required="false" %>
<%@ attribute name="placeholder" required="false" description="字段描述"%>
<%@ attribute name="type" required="true" description="字段类型" %>
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
	String maxlen = (String)this.getJspContext().getAttribute("maxlen");
	if(maxlen != null) this.getJspContext().setAttribute("maxlen", "maxlength=\"" + maxlen + "\"");
	String pattern = (String)this.getJspContext().getAttribute("pattern");
	if(pattern != null) this.getJspContext().setAttribute("pattern", "pattern=\"" + pattern + "\"");
%>
<div class="form-group" >
	<c:if test="${ label ne null}">
	    <label class="${labelClass} control-label" for="${id}">${label}</label>
	</c:if>
    <input ${maxlen} ${pattern} name="${name}" ${readonly eq true?"readonly":"" } ${disabled eq true?"disabled":"" } ${required eq true?"required='required'":""}  id="${id}" value="${value}" type="${type}" style="${style}" class="form-control ${inputClass }" title="${placeholder}" placeholder="${placeholder}">
    <c:if test="${help ne null}">
    <c:if test="${helpInline ne false}">
    	<p class="help-inline">${help}</p>
    </c:if>
    <c:if test="${ helpInline eq false }">
    	<p class="help-block">${help}</p>
    </c:if>
    </c:if>
</div>