<%@tag import="java.util.List"%>
<%@tag import="java.lang.*"%>
<%@tag import="net.sf.json.JSONArray"%>
<%@tag import="java.util.TreeMap"%>
<%@ tag language="java" pageEncoding="UTF-8"%>
<%@ attribute name="src" required="false"%>
<%@ attribute name="item" required="false" description="数据列表" rtexprvalue="true" type="Object" %>
<%@ attribute name="code" required="true"%>
<%@ attribute name="value" required="true"%>
<%@ attribute name="text" required="true"%>
<%
	Object item = this.getJspContext().getAttribute("item");
	
	if(item==null){
		this.getJspContext().setAttribute("item",0);
	}else{
		this.getJspContext().setAttribute("item",JSONArray.fromObject(item));
	}
		
	
%>
<script type="text/javascript">

	seajs.use(['jquery','myutil.init'],function($){
		if(!$.codemap) $.codemap = {}
		if(${item}){
			var result = ${item};
			var first = true;
			var v = "{";
		    for(var i=0;i<result.length;i++){
		    	var record = result[i];
				if(first){
					first = false;
					v += "'"+record['${value}']+"':'"+record['${text}']+"'";
				}else{
					v += ",'"+record['${value}']+"':'"+record['${text}']+"'";
				}
		    }
			v +="}";
			$.codemap['${code}'] = eval("("+v+")");
		}else{
			$.read('${__baseUrl}${src}',{},function(result){
				var first = true;
				var v = "{";
				for(var i=0;i<result.length;i++){
					var record = result[i];
					if(first){
						first = false;
						v += "'"+record['${value}']+"':'"+record['${text}']+"'";
					}else{
						v += ",'"+record['${value}']+"':'"+record['${text}']+"'";
					}
					
			    }
				v +="}";
				$.codemap['${code}'] = eval("("+v+")");
			});
		}
		
		
	});
</script>