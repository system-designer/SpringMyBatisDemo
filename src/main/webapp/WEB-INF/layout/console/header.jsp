<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
 <%@ taglib uri="http://tiles.apache.org/tags-tiles" prefix="tiles" %>
 <%@ taglib prefix="shiro" uri="http://shiro.apache.org/tags" %>
<%
	String baseUrl = request.getContextPath();
%>
<div class="header-module-info" style="padding-right:10px;">
	<img src="${__baseUrl}/images/logo.png" width="30" height="30">
</div>
<div class="header-module-info" style="padding-left:0px;">
	<span style="font-size:24px;font-weight:bold;line-height:30px;">SpringMyBatisDemo</span>
</div>
<div class="header-right user dropdown">
	<i class="icon-caret-down" data-toggle="dropdown" style="position:absolute;right:10px;top:12px;cursor: pointer;"></i>
	<a href="#" class="dropdown-toggle" data-toggle="dropdown">
		<i class="icon-user"></i> 
		<shiro:principal property="name"></shiro:principal>
	</a>
  	<ul class="dropdown-menu" role="menu" aria-labelledby="dLabel">
  		<li><a href="#" id="changePassword"><span class="icon-edit"></span> <span>修改密码</span></a></li>
  		<li><a href="${__baseUrl}/user/logout"><span class="icon-off"></span> <span>安全退出</span></a></li>
  	</ul>
</div>
