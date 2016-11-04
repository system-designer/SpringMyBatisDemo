<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<%@ taglib uri="http://tiles.apache.org/tags-tiles" prefix="tiles" %>
<%@ taglib tagdir="/WEB-INF/tags" prefix="sdf" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<tiles:insertDefinition name="console">
	<tiles:putAttribute name="title" value="菜单管理"></tiles:putAttribute>
	<tiles:putAttribute name="head">
		<script type="text/javascript">
			seajs.use(['jquery','myui.datatable','bootstrap','myutil.init'],function($){
				$(function(){
					// 新增
					$('#addUser').click(function(){
						$('#userForm').webform('clear');
						$('#userSave').modal({show:true});
					});
					//加载表格
					$('#datatable').dataTable({
						url: '${__baseUrl}/sys/menu/pager',
						filter:'#userFilters'
					});
					//修改
					$('#datatable').on('click','a.modify',function(){
						$('#updateForm').webform('clear');
						$('#updateForm').webform('fill','${__baseUrl}/sys/menu/find/'+$(this).data('id'));
						$('#userUpdate').modal('show');
					}).on('click','a.delete',function(){
						var that = this;
						confirm("确定删除?", function() {
							$.remove('${__baseUrl}/sys/menu/delete?id='+$(that).data('id'),function(res){
								alert(res.message);
								$('#datatable').dataTable('reload');
							});
						});
					});
					$('#userForm,#updateForm').webform('option','success',function(){
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
					<button id="addUser" type="button" class="btn btn-default"><span class="icon-plus"></span> <span>新增菜单</span></button>
				</div>
				</div>
				<div class="col-md-9" style="text-align: right;" id="userFilters" data-auto="true">
					<div class="form-inline">
					<div class="form-group">
				      <input name="name"  type="text" class="form-control" placeholder="菜单名称">
				    </div>
					<div class="form-group">
						<sdf:select id="parent" name="parent" item="${parent }" label="父级" itemcode="id" itemtext="name"/>
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
							<th data-format="name" class="sortable asc" data-order="name"><span>菜单名</span></th>
							<th data-format="url" class="sortable asc" data-order="url"><span>菜单地址</span></th>
							<th data-format="icon" class="sortable asc" data-order="icon"><span>样式</span></th>
							<th data-format="<a href='#' title='修改' class='modify btn-xs' data-id='{id}'><span class='icon-pencil'></span></a><a href='#' title='删除' class='delete btn-xs' data-id='{id}'><span class='icon-remove'></span></a>"><span></span></th>
						</tr>
					</thead>
				</table>
		</div>
	<!-- 新增表单 -->
		<sdf:form id="userForm" action="/sys/menu/add"  mode="ajax" method="post" showMessage="true">
			<sdf:dialog title="新增菜单" id="userSave">
		    	<jsp:attribute name="buttons">
		    		<button type="submit" id="saveUserButton" class="btn btn-primary">保存</button>
		    	</jsp:attribute>
				<jsp:body>
		      		<sdf:input name="id" id="id" type="text" placeholder="菜单编号" label="菜单编号"
		      			required="true" />
		      		<sdf:input name="name" id="name" type="text" placeholder="菜单名称" label="菜单名称"
		      			required="true" />
		      		<sdf:input name="icon" id="icon" type="text" placeholder="菜单样式"  label="菜单样式" />
		      		<sdf:input name="url" id="url" type="text" placeholder="菜单地址"  label="菜单地址" required="true" />
		      		<sdf:select id="parent" name="parent" item="${parent }" label="父级菜单" itemcode="id" itemtext="name"/>
		      		<div class="alert"></div>
		      	</jsp:body>
			</sdf:dialog>
		</sdf:form>
		
		<!-- 修改表单 -->
		<sdf:form id="updateForm" action="/sys/menu/update"  mode="ajax" method="post" showMessage="true">
			<sdf:dialog title="修改菜单" id="userUpdate">
		    	<jsp:attribute name="buttons">
		    		<button type="submit" id="saveUserButton" class="btn btn-primary">保存</button>
		    	</jsp:attribute>
				<jsp:body>
		      		<input name="id" type="hidden" >
		      		<sdf:input name="name" id="name" type="text" placeholder="菜单名称" label="菜单名称"
		      			required="true" />
		      		<sdf:input name="icon" id="icon" type="text" placeholder="菜单样式"  label="菜单样式" />
		      		<sdf:input name="url" id="url" type="text" placeholder="菜单地址"  label="菜单地址" required="true" />
		      		<sdf:select id="parent" name="parent" item="${parent }" label="父级菜单" itemcode="id" itemtext="name"/>
		      		<div class="alert"></div>
		      	</jsp:body>
			</sdf:dialog>
		</sdf:form>
</tiles:putAttribute>
</tiles:insertDefinition>