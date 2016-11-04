<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<%@ taglib uri="http://tiles.apache.org/tags-tiles" prefix="tiles" %>
<%@ taglib tagdir="/WEB-INF/tags" prefix="sdf" %>
<tiles:insertDefinition name="console">
	<tiles:putAttribute name="title" value="SpringMyBatisDemo"></tiles:putAttribute>
	<tiles:putAttribute name="head">
	<link href="${__baseUrl}/js/umeditor/themes/default/css/umeditor.css" type="text/css" rel="stylesheet">
	<script type="text/javascript" charset="utf-8" src="${__baseUrl}/js/umeditor/umeditor.config.js"></script>
	<script type="text/javascript" charset="utf-8" src="${__baseUrl}/js/umeditor/umeditor.js"> </script>
	<script type="text/javascript" charset="utf-8" src="${__baseUrl}/js/umeditor/lang/zh-cn/zh-cn.js"></script>
	<script type="text/javascript">
			
			seajs.use(['jquery', 'myui.datatable', 'bootstrap', 'myutil.init'],function($) {
					var um = UM.getEditor('editor');
						$(function() {
							$("#aaa").on('click',function(){
								$("#contentUrl").modal('show');
							});
						

							$('#viewButton').click(function(){
								um.execCommand('preview');
							});
						});
					});
		</script>
		
		<style>
			#datatable .dropdown-menu{
				width:90px;
				min-width: 90px;
				border-radius:0;
				top: 23px;
				padding:5px 0px;
				border-radius: 0 0 4px 4px;
				border-top: 0;
				background: #5fc6e4;
				text-align: center;
			}
			#datatable .btn-group .btn.btn-info.default{width:45px;}
			#datatable .dropdown-menu a{color:#fff;}
			.imagebox img{width:320px;height:180px;}
			.form-group input,.form-group select{width:120px;}
			.panel-body button{
				margin : 5px;
			}
		</style>
		<sdf:convert code="content_status"></sdf:convert>
	</tiles:putAttribute>
	
	<tiles:putAttribute name="body">
		<div>
			<sdf:dialog title="查看url" id="contentUrl" style="width:700px;">
				<jsp:body>
					<textarea id="editor" name="content" style="width: 1010px; "></textarea>
				</jsp:body>
			</sdf:dialog>
		</div> 
	</tiles:putAttribute>
</tiles:insertDefinition>