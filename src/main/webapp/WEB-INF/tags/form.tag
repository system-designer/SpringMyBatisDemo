<%@tag import="com.google.common.base.Strings"%>
<%@ tag language="java" pageEncoding="UTF-8"%>
<%@ attribute name="formClass" required="false" %>
<%@ attribute name="id" required="true" %>
<%@ attribute name="action" required="true" %>
<%@ attribute name="showMessage" required="false" description="是否自动在FORM上显示返回信息" %>
<%@ attribute name="beforeSubmit" required="false" description="提交前的事件,全局方法" %>
<%@ attribute name="error" required="false" description="ajax讲求返回错误事件,全局方法" %>
<%@ attribute name="success" required="false" description="ajax提交成功事件,全局方法" %>
<%@ attribute name="method" required="false" description="方法 post|get|delete|put" %>
<%@ attribute name="mode" required="true" description="提交方式 ajax|submit" %>
<%
	String action = (String)this.getJspContext().getAttribute("action");
	if(!Strings.isNullOrEmpty(action)){
		if (action.indexOf("http") == -1 && !"/robot".equals(action)) {
			this.getJspContext().setAttribute("action", request.getContextPath() + action);
		} else {
			this.getJspContext().setAttribute("action", action);
		}
	}
%>
<form novalidate data-show-message="${showMessage}" data-success="${success}" data-error="${error }" id="${id}" method="${ method eq null?'post':method }" data-mode="${ mode }" action="${action}" class="auto-init ${ formClass eq null?'form': formClass }">
<jsp:doBody />
</form>