<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<%@ taglib uri="http://tiles.apache.org/tags-tiles" prefix="tiles" %>
<%@ taglib tagdir="/WEB-INF/tags" prefix="sdf" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<tiles:insertDefinition name="console">
	<tiles:putAttribute name="title" value="用户管理"></tiles:putAttribute>
	<tiles:putAttribute name="head">
		<script type="text/javascript">
			seajs.use(['jquery','myui.datatable','bootstrap','myutil.init','jquery.ztree.exhide'],function($){
				$(function(){
					var list = [];
					$.read('${__baseUrl}/sys/role/all',{},function(result){
						list = result;
					});
					var settings = {check: {
						enable: true,
						chkboxType: { "Y" : "ps", "N" : "ps"}
					},
					view: {
						dblClickExpand: false
					},
					data: {
						key:{
							name:"description"
						},
						simpleData: {
							enable: true,
							pIdKey: "parent",
						}
					},
					callback: {
						beforeClick: function(treeId, treeNode){
							var zTree = $.fn.zTree.getZTreeObj("treeDemo");
							zTree.checkNode(treeNode, !treeNode.checked, null, true);
							return false;
						},
						onCheck: function(e, treeId, treeNode) {
							var zTree = $.fn.zTree.getZTreeObj("treeDemo"),
							nodes = zTree.getCheckedNodes(true),
							v = "",n="";
							for (var i=0, l=nodes.length; i<l; i++) {
								v += nodes[i].id + ",";
								n += nodes[i].description + ",";
							}
							if (v.length > 0 ) v = v.substring(0, v.length-1);
							if (n.length > 0 ) n = n.substring(0, n.length-1);
							$("#roleNames").val(n);
							$("#roles").val(v);
						}
					}};
					// 新增
					$('#addUser').click(function(){
						$('#userForm').webform('clear');
						$.fn.zTree.init($("#treeDemo"), settings, list).expandAll(true);
						$('#userSave').modal({show:true});
					});
					//加载表格
					$('#datatable').dataTable({
						url: '${__baseUrl}/user/pager',
						filter:'#userFilters'
					});
					//修改
					$('#datatable').on('click','a.modify',function(){
						$('#userForm').webform('clear');
						$('#userForm .form-group:has(#password,#repassword)').hide();
					//	$('#userForm').webform('fill','${__baseUrl}/user/'+$(this).data('id'));
						$.read('${__baseUrl}/user/'+$(this).data('id'),{},function(result){
							$('#userForm').webform('fill',result.user);
							$('#roles').val(result.roles);
							$('#roleNames').val(result.roleNames);
							$.fn.zTree.init($("#treeDemo"), settings, result.tree).expandAll(true);
						});
						$('#userSave').modal('show');
					}).on('click','a.reply',function(){
						var that = this;
						confirm('确定重置密码?', function() {
							var record = $(that).closest('tr').data('record');
							$.post('${__baseUrl}/user/resetPwd',{id:record.id},function(result){
								alert(result.message);
							});
						});
					});
					$('#userForm').webform('option','success',function(){
						$('#datatable').dataTable('reload');
						$('#userSave').modal('hide');
					});
					
					$('#roleNames').click(function(){
						var cityOffset = $(this).offset();
						var top = cityOffset.top-$('#menuContent').height()-15;
						$("#menuContent").addClass('zTree-orient-bottom');
						$("#menuContent").css({left:"15px", top:top + "px",visibility:'visible'}).slideDown("fast");
					//	$("#menuContent").css({left:cityOffset.left + "px", top:cityOffset.top + $(this).outerHeight() + "px"}).slideDown("fast");
						$("body").bind("mousedown", onBodyDown);
					
				});
				
				function hideMenu() {
					$("#menuContent").fadeOut("fast");
					$("body").unbind("mousedown", onBodyDown);
				}
				function onBodyDown(event) {
					if (!(event.target.id == "menuBtn" || event.target.id == "citySel" || event.target.id == "menuContent" || $(event.target).parents("#menuContent").length>0)) {
						hideMenu();
					}
				}
				});
			});
		</script>
		<sdf:convert code="user_status"></sdf:convert>
		<sdf:convert code="user_type"></sdf:convert>
	</tiles:putAttribute>
	<tiles:putAttribute name="body">
		<div class="row">
				<div class="col-md-3">
				<div class="toolbar btn-group">
					<button id="addUser" type="button" class="btn btn-default"><span class="icon-plus"></span> <span>添加用户</span></button>
				</div>
				</div>
				<div class="col-md-9" style="text-align: right;" id="userFilters" data-auto="true">
					<div class="form-inline">
					<div class="form-group">
				      <input name="name"  type="text" class="form-control" placeholder="用户名">
				    </div>
					<div class="form-group">
				      <input name="username"  type="text" class="form-control" placeholder="登录名">
				    </div>
					<div class="form-group">
						<sdf:select id="state" name="state" convert="user_status" />
					</div>
				    <button id="search" class="btn btn-primary btn-query" type="button"><span class="glyphicon glyphicon-search"></span> <span>查询</span></button>
				    </div>
				</div>
			</div>
		<div id="datatable">
			<table class="table table-striped">
					<thead>
						<tr>
							<th data-format="<a href='#' data-id='{id}'>{id}</a>" class="sortable asc" data-order="id"><span>Id</span></th>
							<th data-format="name" class="sortable asc" data-order="name"><span>用户名称</span></th>
							<th data-format="username" class="sortable asc" data-order="username"><span>登录名</span></th>
							<th data-format="convert[user_status][state]" class="sortable asc" data-order="state"><span>状态</span></th>
							<th data-format="<a href='#' title='修改' class='modify btn-xs' data-id='{id}'><span class='icon-pencil'></span></a>
							&nbsp;&nbsp;&nbsp;<a href='#' title='重置密码' class='reply btn-xs' ><span class='icon-reply'></span></a>"><span></span></th>
						</tr>
					</thead>
				</table>
		</div>
	<!-- 新增/修改表单 -->
		<sdf:form id="userForm" action="/user/add"  mode="ajax" method="post" showMessage="false">
			<sdf:dialog title="保存用户表单" id="userSave" draggable="true">
		    	<jsp:attribute name="buttons">
		    		<button type="submit" id="saveUserButton" class="btn btn-primary">保存</button>
		    	</jsp:attribute>
				<jsp:body>
		      		<input name="id" type="hidden" >
		      		<input name="roles" id="roles" type="hidden"/>
		      		<sdf:input name="name" id="name" type="text" placeholder="用户名称" label="用户名称"
		      			required="true" />
		      		<sdf:input name="username" id="username" type="text" placeholder="用户登录名" label="用户登录名"
		      			required="true" />
		      		<sdf:select id="state" name="state" convert="user_status" label="用户状态" required="true"/>
		      		<sdf:select id="userLevel" name="userLevel" src="/user/userLevel?codemap=sys_level" itemcode="code" itemtext="name" label="用户级别" required="true"/>
		      		<sdf:input name="roleNames" id="roleNames" type="text" placeholder="用户角色" label="用户角色" readonly="true"
		      			required="true"></sdf:input>
		      		<div id="menuContent" class="zTree zTree-dropdown zTree-orient-left" style="visibility:hidden; position: fixed;z-index: 3001;">
						<ul id="treeDemo" class="ztree" style="margin-top:0; width:180px; max-height: 300px;overflow: auto;"></ul>
					</div>
		      		<div class="alert"></div>
		      	</jsp:body>
			</sdf:dialog>
		</sdf:form>
</tiles:putAttribute>
</tiles:insertDefinition>