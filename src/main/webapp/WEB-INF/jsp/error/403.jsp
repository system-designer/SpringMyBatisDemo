<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<%@ taglib uri="http://tiles.apache.org/tags-tiles" prefix="tiles" %>
<tiles:insertDefinition name="console">
	<tiles:putAttribute name="body">
	<h1><span class="glyphicon glyphicon-warning-sign"></span><span>无权访问该页面</span></h1>
	</tiles:putAttribute>
</tiles:insertDefinition>