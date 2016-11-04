<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<%@ taglib uri="http://tiles.apache.org/tags-tiles" prefix="tiles" %>
<%@ taglib prefix="shiro" uri="http://shiro.apache.org/tags" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<%@ taglib prefix="sdf" tagdir="/WEB-INF/tags" %>
<!DOCTYPE html>
<html>
<head>
<meta name="renderer" content="webkit"> 
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title><tiles:getAsString name="title"/></title>
<link rel="shortcut icon" href="<%= request.getContextPath() %>/favicon.ico" type="image/x-icon" />
<link rel="shortcut icon" href="<%= request.getContextPath() %>/images/logo.png" type="image/png" />
<sdf:themestyle src="/css/bsv2/bootstrap.css"></sdf:themestyle>
<sdf:themestyle src="/css/bsv2/bootstrap-responsive.css"></sdf:themestyle>
<sdf:style src="/css/layout/console/main.css"></sdf:style>
<sdf:style src="/css/ui.css"></sdf:style>
<sdf:style src="/css/font-awesome.css" />
<sdf:style src="/css/smart_wizard_vertical.css" />
<sdf:style src="/css/sweetalert.css"></sdf:style>

<script type="text/javascript">
    var baseUrl = '${__baseUrl}';
    var G_CFG = {
        username: '<shiro:principal property="name"></shiro:principal>',
        gaTrackingId: '${__gaTrackingId}'
    };
</script>
<sdf:script src="/js/sea-debug.js"></sdf:script>
<sdf:script src="/js/sea-css.js"></sdf:script>
<sdf:script src="/js/sea.config.js"></sdf:script>
<sdf:script src="/js/jquery/sweetalert.min.js"></sdf:script>
<sdf:script src="/js/op/utility.js"></sdf:script>
<sdf:script src="/js/utils/ga.js"></sdf:script>

<tiles:insertAttribute name="head" defaultValue=""/>
</head>
<body style="background: #fff;">
<tiles:insertAttribute name="body" />
</body>
</html>