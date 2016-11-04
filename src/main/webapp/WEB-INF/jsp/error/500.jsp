<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<%@ taglib uri="http://tiles.apache.org/tags-tiles" prefix="tiles" %>
<tiles:insertDefinition name="default">
	<tiles:putAttribute name="body">
	<h2><span class="icon-warning-sign"></span><span>${message}</span></h2>
	</tiles:putAttribute>
</tiles:insertDefinition>