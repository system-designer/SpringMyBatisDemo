<%@ tag language="java" pageEncoding="UTF-8"%>
<%@ attribute name="id" required="true" %>
<%
	String agent = request.getHeader("User-Agent");
	if(agent.indexOf("MSIE") > 0 || agent.indexOf("Trident") > 0){
%>
<OBJECT ID="${id}" WIDTH="267" HEIGHT="270"  CLASSID="CLSID:AF0BE764-A5C0-4A4C-9BA1-2D55AACFFEC0"></OBJECT>	
<%}
else{%>
<object
id="${id}"
    TYPE="application/xhanhan-activex"
    BORDER="0"
    WIDTH="267" HEIGHT="270"
    clsid="{AF0BE764-A5C0-4A4C-9BA1-2D55AACFFEC0}">
</object>
<%} %>
