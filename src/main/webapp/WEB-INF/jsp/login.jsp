<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<%@ taglib uri="http://tiles.apache.org/tags-tiles" prefix="tiles" %>
<%@ taglib tagdir="/WEB-INF/tags" prefix="sdf" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="shiro" uri="http://shiro.apache.org/tags" %>
<%
String agent = request.getHeader("User-Agent");
int iep = agent.indexOf("MSIE");
if(iep >= 0){
	String ver = agent.substring(iep + 5, agent.indexOf(';', iep));
	Float version = Float.parseFloat(ver);
	pageContext.setAttribute("iever", version);
}
%>
<shiro:authenticated>
	<jsp:forward page="/"></jsp:forward>
</shiro:authenticated>
<tiles:insertDefinition name="default">
	<tiles:putAttribute name="title" value="登录"></tiles:putAttribute>
	<tiles:putAttribute name="head">
		<style>
			.support img{width:120px;}
			.form-horizontal .form-group {
				margin: 0px;
				margin-bottom: 20px;
			}
			.form-horizontal {
				margin-bottom: 20px;
			}
		</style>
		<script type="text/javascript">
			seajs.use('jquery',function($){
				$('#inputUsername').focus();
				$('#kaptchaImage').click(function(){
					document.getElementById('kaptchaImage').src='Kaptcha.jpg?_timeStamp='+new Date().getTime();
				});
				//$('.btn-success').click();
			});
		</script>
	</tiles:putAttribute>
	<tiles:putAttribute name="body">
		<div style="padding:10px;background: #666;color:#ccc;font-family: 黑体;">
		<img style="width:100px;height:80px;margin-top:-20px;" src="${__baseUrl}/images/car.png"/>
		<span style="font-size: 18px;margin-left:-20px;margin-top:-30px;">SpringMyBatisDemo</span>
		<div style="margin-top:-25px;margin-left:23px;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;MANAGEMENT&nbsp;SYSTEM</div>
		</div>
		<div style="width:300px;margin:20px auto;border: 1px solid #5bb75b;" class="panel panel-primary">
			<div class="panel-heading" style="background: #5bb75b;">登录</div>
			<div class="panel-body">
				<c:if test="${ shiroLoginFailure ne null }">
				<div class="alert alert-error">${ shiroLoginFailure }</div>
				</c:if>
				<form class="form-horizontal" action="" method="post">
					<div class="form-group">
						<div class="input-group">
							<span class="input-group-addon"><i class="icon-user"></i></span>
					      	<input type="text" id="inputUsername" name="username" required="required" placeholder="请输入用户名" value="" class="form-control">
					    </div>
					</div>
					<div class="form-group">
					   	<div class="input-group">
					   		<span class="input-group-addon"><i class="icon-lock"></i></span>
					     	<input type="password" id="inputPassword" required="required" name="password" placeholder="请输入用户密码" value="" class="form-control">
					   	</div>
				  	</div>
				  	<div class="form-group">
					   	<div class="input-group">
					   		<span class="input-group-addon"><i class="icon-qrcode"></i></span>
					     	<input type="text" id="inputCode" required="required" style="width:120px;" name="VERIFICATION_CODE" placeholder="验证码" value="" class="form-control">
					     	<img style="border-radius:4px;margin-left: 15px;" alt="验证码" id="kaptchaImage" src="Kaptcha.jpg">
					   	</div>
				  	</div>
				  	<div class="" align="center">
				  		<button type="submit" class="btn btn-success"><i class="icon-signin"></i> <span>登录</span></button>
				  		<button type="reset" class="btn btn-danger"><i class="icon-refresh"></i> <span>重置</span></button>
				  	</div>
				</form>
			</div>
		</div>
			<div style="background: #fff;" class="support">
			<c:if test="${iever ne null && iever lt 8}">
			<div style="padding:10px;text-align: center;background: #bd362f;color: #fff;">本系统不支持当前使用的浏览器,请使用以下推荐的浏览器</div>
			</c:if>
			<c:if test="${iever eq null or iever ge 8 }">
			<div style="padding:10px;text-align: center;background: #5bb75b;color: #fff;">本系统推荐浏览器</div>
			</c:if>
			<div>
			<div style="width:600px; margin:auto;margin-top:10px;">
			<table style="text-align: center;width:100%;">
				<tr>
					<td><a target="_blank" href="http://rj.baidu.com/soft/detail/14744.html"><img src="${__baseUrl }/images/chrome.jpg"/></a></td>
					<td><a target="_blank" href="http://se.360.cn/"><img src="${__baseUrl }/images/360.jpg"/></a></td>
					<td><a target="_blank" href="http://rj.baidu.com/soft/detail/14917.html?ald"><img src="${__baseUrl }/images/ie10.jpg"/></a></td>
					<td><a target="_blank" href="http://www.firefox.com.cn/"><img src="${__baseUrl }/images/firefox.jpg"/></a></td>
				</tr>
				<tr>
					<td><a target="_blank" href="http://rj.baidu.com/soft/detail/14744.html">谷歌浏览器</a></td>
					<td><a target="_blank" href="http://se.360.cn/">360浏览器<br/>(极速模式)</a></td>
					<td><a target="_blank" href="http://rj.baidu.com/soft/detail/14917.html?ald">IE10浏览器</a></td>
					<td><a target="_blank" href="http://www.firefox.com.cn/">火狐浏览器</a></td>
				</tr>
			</table>
			</div>
			</div>
			</div>
	</tiles:putAttribute>
</tiles:insertDefinition>