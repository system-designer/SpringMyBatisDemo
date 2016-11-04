<%@tag import="com.raymond.oauth.db.model.Codeitem"%>
<%@tag import="java.util.List"%>
<%@tag import="com.raymond.oauth.service.CodeitemService"%>
<%@tag import="java.util.TreeMap"%>
<%@tag import="org.springframework.web.context.support.WebApplicationContextUtils"%>
<%@tag import="org.springframework.context.ApplicationContext"%>
<%@ tag language="java" pageEncoding="UTF-8"%>
<%@ attribute name="code" required="true"%>
<%@ attribute name="value" required="true"%>
<%
ApplicationContext ctx = WebApplicationContextUtils.getWebApplicationContext(((PageContext)this.getJspContext()).getServletContext());
CodeitemService cm = (CodeitemService)ctx.getBean("codeitemService");
Codeitem code = cm.findCodeItem((String)this.getJspContext().getAttribute("code"),(String)this.getJspContext().getAttribute("value"));
%>
<%= code != null?code.getName():"" %>