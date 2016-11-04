<%@ tag language="java" pageEncoding="UTF-8"%>
<%@ attribute name="id" required="true" %>
<%
	String agent = request.getHeader("User-Agent");
	if(agent.indexOf("MSIE") > 0 || agent.indexOf("Trident") > 0){
%>
<object classid="clsid:4B3CB088-9A00-4D24-87AA-F65C58531039" id="${id}" codeBase="SynCardOcx.CAB#version=1,0,0,1" width="0" height="0" style="position: absolute;">
</object>
<%}
else{%>
<object
id="${id}"
    TYPE="application/xhanhan-activex"
    BORDER="0"
    WIDTH="0"
    HEIGHT="0"
    style="position: absolute;"
    clsid="{4B3CB088-9A00-4D24-87AA-F65C58531039}">
</object>
<%} %>
