<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<%@ taglib tagdir="/WEB-INF/tags" prefix="sdf" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<script type="text/javascript">
seajs.use(['jquery','myutil.init','bootstrap'],function($){
	$(function(){
		$('#module-common-chpwd .modal').modal();
		$('#module-common-chpwd form').webform();
	});
});
</script>
<div id="module-common-chpwd">
<form class="form" action="${__baseUrl}/user/chpwd" method="post" data-mode="ajax" 
	data-show-message="true">
	<sdf:dialog title="修改密码">
			<jsp:attribute name="buttons">
			    <button type="submit" class="btn btn-primary">确认</button>
			</jsp:attribute>
			<jsp:body>
				<sdf:input id="oldPassword" name="oldPassword" type="password" label="输入旧密码：" required="true" placeholder="原密码"></sdf:input>
				<sdf:input id="newPassword" name="newPassword" type="password" label="输入新密码：" required="true" placeholder="新密码"></sdf:input>
				<sdf:input id="newPassword2" name="newPassword2" type="password" label="再次输入新密码：" required="true" placeholder="新密码"></sdf:input>
		  		<div class="alert"></div>
		</jsp:body>
	</sdf:dialog>

</form>
</div>