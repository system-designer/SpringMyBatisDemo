<%@ tag language="java" pageEncoding="UTF-8"%>
<%@tag import="com.raymond.oauth.db.model.Codeitem"%>
<%@tag import="java.util.List"%>
<%@tag import="com.raymond.oauth.service.CodeitemService"%>
<%@tag import="java.util.TreeMap"%>
<%@tag import="org.springframework.web.context.support.WebApplicationContextUtils"%>
<%@tag import="org.springframework.context.ApplicationContext"%>
<%@ attribute name="code" required="true"%>
<%@ attribute name="name" required="true"%>
<%@ attribute name="container" required="true"%>
<%@ attribute name="value" required="false"%>

<script type="text/javascript">
seajs.use('jquery',function($){
	if(!$.codemap) $.codemap = {};
	var code = '<%= this.getJspContext().getAttribute("code") %>';

	if ($.codemap[code] == null) {
		//init first
		$.codemap[code] = {};
		<%
		ApplicationContext ctx = WebApplicationContextUtils.getWebApplicationContext(((PageContext)this.getJspContext()).getServletContext());
		CodeitemService cm = (CodeitemService)ctx.getBean("codeitemService");
		List<Codeitem> list = cm.findCodeItem((String)this.getJspContext().getAttribute("code"));
		
		if (list != null && list.size() > 0) {
			boolean first = true;
			for(Codeitem item: list){
				%>
				$.codemap[code]['<%=item.getCode()%>'] = '<%=item.getName()%>';
				<%
			}
		}
		%>
	} 
	
	var html = '<div class="checkbox">';
	var name = '<%= this.getJspContext().getAttribute("name") %>';
	var value = '<%= this.getJspContext().getAttribute("value") %>';
	var values = value.split(',');
	for(var key in $.codemap[code]) {
		if(values.indexOf(key) > -1)
			html += '<label><input type="checkbox" checked style="margin-left:10px;" name="'+name+'" value="'+key+'">' + $.codemap[code][key] + '</label>';
		else
			html += '<label><input type="checkbox" style="margin-left:10px;" name="'+name+'" value="'+key+'">' + $.codemap[code][key] + '</label>';
	}
	
	html +='</div>';
	
	var container = '<%= this.getJspContext().getAttribute("container") %>';
	$('#' + container).html(html);
});
</script>
