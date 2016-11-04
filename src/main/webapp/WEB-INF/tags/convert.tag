<%@tag import="com.raymond.oauth.db.model.Codeitem"%>
<%@tag import="java.util.List"%>
<%@tag import="com.raymond.oauth.service.CodeitemService"%>
<%@tag import="java.util.TreeMap"%>
<%@tag import="org.springframework.web.context.support.WebApplicationContextUtils"%>
<%@tag import="org.springframework.context.ApplicationContext"%>
<%@ tag language="java" pageEncoding="UTF-8"%>
<%@ attribute name="code" required="true"%>
<%
ApplicationContext ctx = WebApplicationContextUtils.getWebApplicationContext(((PageContext)this.getJspContext()).getServletContext());
CodeitemService cm = (CodeitemService)ctx.getBean("codeitemService");
List<Codeitem> list = cm.findCodeItem((String)this.getJspContext().getAttribute("code"));
%>
<script type="text/javascript">
	seajs.use('jquery',function($){
		if(!$.codemap) $.codemap = {}
		$.codemap['<%= this.getJspContext().getAttribute("code") %>'] = {
		<%
		boolean first = true;
		for(Codeitem item: list){
		%>			<%= first?"":"," %>'<%=item.getCode()%>':'<%=item.getName()%>'
		<%first = false;}%>
		}
	});
</script>