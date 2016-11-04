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
					// 新增
					$('#addUser').click(function(){
						$('#userForm').webform('clear');
						$('#userSave').modal({show:true});
					});
				
					
					//加载表格
					$('#datatable').dataTable({
						url: '${__baseUrl}/sys/role/pager',
						filter:'#userFilters'
					});
					$('#datatable').on('click','a.right',function(){
						$.read('${__baseUrl}/sys/menu/tree/'+$(this).data('id'),{},function(result){
							$('#rightForm').webform('fill',result);
							$.fn.zTree.init($("#treeDemo"), {
								check: {
									enable: true,
									chkboxType: { "Y" : "ps", "N" : "ps"}
								},
								view: {
									dblClickExpand: false
								},
								data: {
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
										v = "";
										for (var i=0, l=nodes.length; i<l; i++) {
											v += nodes[i].id + ",";
										}
										if (v.length > 0 ) v = v.substring(0, v.length-1);
										var cityObj = $("#menus");
										cityObj.attr("value", v);
									}
								}
								
							}, result.tree).expandAll(true);
						});
						$('#rightSave').modal('show');
					});
					$('.modal').on('shown.bs.modal',function(){
						var wh = $(window).height();
						$('.modal .modal-body').css('max-height',wh-80); 
					});
					//修改
					$('#datatable').on('click','a.modify',function(){
						$('#userForm').webform('clear');
						$('#userForm').webform('fill','${__baseUrl}/sys/role/find/'+$(this).data('id'));
						$('#userSave').modal('show');
					});
					$('#userForm').webform('option','success',function(){
						$('#datatable').dataTable('reload');
					});
				});
			});
		</script>
	</tiles:putAttribute>
	<tiles:putAttribute name="body">
		<div class="row">
				<div class="col-md-3">
				<div class="toolbar btn-group">
					<button id="addUser" type="button" class="btn btn-default"><span class="icon-plus"></span> <span>新增角色</span></button>
				</div>
				</div>
				<div class="col-md-9" style="text-align: right;" id="userFilters" data-auto="true">
					<div class="form-inline">
					<div class="form-group">
				      <input name="roleName"  type="text" class="form-control" placeholder="角色名称">
				    </div>
					<div class="form-group">
				      <input name="roleSign"  type="text" class="form-control" placeholder="角色代码">
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
							<th data-format="roleName" class="sortable asc" data-order="roleName"><span>角色名称</span></th>
							<th data-format="roleSign" class="sortable asc" data-order="roleSign"><span>角色代码</span></th>
							<th data-format="description" class="sortable asc" data-order="description"><span>描述</span></th>
							<th data-format="<a href='#' title='修改' class='modify btn-xs' data-id='{id}'><span class='icon-pencil'></span></a>"><span></span></th>
							<th data-format="<a href='#' class='right' data-id='{id}'>设置权限</a>"><span></span></th>
						</tr>
					</thead>
				</table>
		</div>
	<!-- 新增/修改表单 -->
		<sdf:form id="userForm" action="/sys/role/add"  mode="ajax" method="post" showMessage="true">
			<sdf:dialog title="保存角色表单" id="userSave">
		    	<jsp:attribute name="buttons">
		    		<button type="submit" id="saveUserButton" class="btn btn-primary">保存</button>
		    	</jsp:attribute>
				<jsp:body>
		      		<input name="id" id="roleId" type="hidden" >
		      		<sdf:input name="roleName" id="roleName" type="text" placeholder="角色名称" label="角色名称"
		      			required="true" />
		      		<sdf:input name="roleSign" id="roleSign" type="text" placeholder="角色代码" label="角色代码"
		      			required="true" />
		      		<sdf:select id="roleLevel" name="roleLevel" convert="sys_level" label="角色级别" required="true"/>	
		      		<sdf:input name="description" id="description" type="text" placeholder="角色描述" label="角色描述"
		      			required="true"/> 
		      		<div class="alert"></div>
		      	</jsp:body>
			</sdf:dialog>
		</sdf:form>
		<!-- 角色权限 -->
		<sdf:form id="rightForm" action="/sys/role/menu"  mode="ajax" method="post" showMessage="true">
			<sdf:dialog title="角色权限" id="rightSave">
		    	<jsp:attribute name="buttons">
		    		<button type="submit" id="saveUserButton" class="btn btn-primary">保存</button>
		    	</jsp:attribute>
				<jsp:body>
		      		<input name="roleId" id="roleId" type="hidden" >
		      		<input name="menus" type="hidden" id="menus">
					<ul id="treeDemo" class="ztree" style="margin-top:0; width:180px; "></ul>
		      		<div class="alert"></div>
		      	</jsp:body>
			</sdf:dialog>
		</sdf:form>
</tiles:putAttribute>
</tiles:insertDefinition>