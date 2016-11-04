<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<%@ taglib uri="http://tiles.apache.org/tags-tiles" prefix="tiles" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<%@ taglib prefix="sdf" tagdir="/WEB-INF/tags" %>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title><tiles:getAsString name="title"/></title>
<sdf:script src="/js/sea-debug.js"></sdf:script>
<sdf:script src="/js/sea-css.js"></sdf:script>
<script type="text/javascript">
	var baseUrl = '${__baseUrl}';
</script>
<sdf:script src="/js/sea.config.js"></sdf:script>
<tiles:insertAttribute name="head" defaultValue=""/>
</head>
<body>
<tiles:insertAttribute name="body" />
</body>
</html>