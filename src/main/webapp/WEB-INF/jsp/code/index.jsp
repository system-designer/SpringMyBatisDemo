<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<%@ taglib uri="http://tiles.apache.org/tags-tiles" prefix="tiles" %>
<%@ taglib tagdir="/WEB-INF/tags" prefix="sdf" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<tiles:insertDefinition name="console">
	<tiles:putAttribute name="title" value="代码管理"></tiles:putAttribute>
	<tiles:putAttribute name="head">
		<script type="text/javascript">
			seajs.use(['jquery','myui.datatable','bootstrap','myutil.init'],function($){
				$(function(){
					$('#addCode').click(function(){
						$('#codeForm').webform('clear');
						$('#codeSave').modal({show:true});
					});
					//加载表格
					$('#datatable').dataTable({
						url: '${_baseUrl}/code/pager',
						filter:'#userFilters'
					});
					$('#datatableItem').dataTable({
						url:'${__baseUrl}/code/item/pager',
						filter:'#codeItemFilters',
						autoload:false
					});
					//修改
					$('#datatable').on('click','a.modify',function(){
						$('#codeForm').webform('fill','${__baseUrl}/code/'+$(this).closest('tr').data('record').id);
						$('#codeSave').modal('show');
					});
					$('#datatable').on('click','a.subItem',function(){
						$('#codemapValue').val($(this).closest('tr').data('record').code);
						$('#datatableItem').dataTable('reload');
						$('#subItemdiv').modal('show');
					});
					$('#codeForm').webform('option','success',function(){
						$('#codeSave').modal('hide');
						$('#datatable').dataTable('reload');
					});
					//子页面的修改
					//修改
					$('#datatableItem').on('click','a.modify',function(){
						$('#codeItemForm').webform('fill','${__baseUrl}/code/item/'+$(this).closest('tr').data('record').id);
						$('#codeItemSave').modal('show');
					}).on('click','a.delete',function(){
						var that = this;
						confirm('确认删除？', function() {
							$.remove('${__baseUrl}/code/item/delete/'+$(that).closest('tr').data('record').id,function(result){
								alert(result.message);
								$('#datatableItem').dataTable('reload');
							});
						});
					});
					
					$('#codeItemForm').webform('option','success',function(){
						$('#codeItemSave').modal('hide');
						$('#datatableItem').dataTable('reload');
					});


					$('#addCodeItem').click(function(){
						var  codemap = $('#codemapValue').val();
						$('#codeItemForm').webform('clear');
						$('#codeItemForm').webform('fill',{codemap:codemap});
						$('#codeItemSave').modal({show:true});
					});
					$('#codeItemSave').on('show.bs.modal',function(){
						$('#subItemdiv').modal('hide');
					});
					$('#codeItemSave').on('hidden.bs.modal',function(){
						$('#subItemdiv').modal('show');
					});
				});
			});
		</script>
	</tiles:putAttribute>
	<tiles:putAttribute name="body">
			<div class="row">
				<div class="col-md-4">
				<div class="toolbar btn-group">
					<button id="addCode" type="button" class="btn btn-default"><span class="glyphicon glyphicon-plus"></span><span>添加代码集</span></button>
				</div>
				</div>
				
				<div class="col-md-8" style="text-align: right;" id="userFilters" data-auto="true">
					<div class="form-inline">
					<div class="form-group">
				     <input name="code"  type="text" class="form-control" placeholder="代码集CODE">
				    </div>
					<div class="form-group">
						 <input name="name"  type="text" class="form-control" placeholder="代码集描述">
					</div>
				    <button id="search" class="btn btn-primary btn-query" type="button"><span class="icon-search"></span> <span>查询</span></button>
				    </div>
				</div>
			</div>
		<div id="datatable">
			<table class="table table-striped">
					<thead>
						<tr>
							<th data-format="<a href='#' data-id='{id}'>{id}</a>" class="sortable desc sorting" data-order="id_"><span>Id</span></th>
							<th data-format="code" class="sortable asc" data-order="code"><span>代码集CODE</span></th>
							<th data-format="name" class="sortable asc" data-order="name"><span>代码集描述</span></th>
							<th data-format="<a href='#' class='subItem' >维护代码项</a>" width="150px;"><span></span></th>
							<th data-format="<a href='#' class='modify' >修改</a>" width="100px;"><span></span></th>
						</tr>
					</thead>
					<tbody>
					</tbody>
				</table>
		</div>
	<!-- 新增/修改表单 -->
<sdf:form id="codeForm" action="/code/save"  mode="ajax" method="post" showMessage="true">
<div class="modal fade" id="codeSave" tabindex="-1" data-backdrop="static" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
        <h4 class="modal-title" id="userSaveTitle">保存代码集</h4>
      </div>
      <div class="modal-body">
      		<input name="id" type="hidden" >
      		<sdf:input name="code" id="code" type="text" placeholder="代码集Code" label="代码集CODE"
      			required="true" />
      		<sdf:input name="name" id="name" type="text" placeholder="代码集描述" label="代码集描述"
      			required="true"/> 
      		<div class="alert"></div>
      </div>
      <div class="modal-footer">
        <button type="submit" id="saveCodeButton" class="btn btn-primary"><span class="icon-save"></span> <span>保存</span></button>
        <button type="button" class="btn btn-default" data-dismiss="modal"><span class="icon-remove"></span> <span>关闭</span></button>
      </div>
    </div>
  </div>
</div>
</sdf:form>

<!--  -->
<sdf:dialog title="维护代码项" id="subItemdiv">
	<jsp:body>
		<div class="row">
				<div class="col-md-4">
				<div class="toolbar btn-group">
					<button id="addCodeItem" type="button" class="btn btn-default"><span class="icon-plus"></span><span>添加代码项</span></button>
				</div>
				</div>
				
				<div class="col-md-8" style="text-align: right;" id="codeItemFilters" data-auto="true">
					<input type="hidden" id="codemapValue" name="codemap">
				</div>
			</div>
			<div id="datatableItem">
			<table class="table table-striped">
					<thead>
						<tr>
							<th data-format="<a href='#' data-id='{id}'>{id}</a>" class="sortable asc" data-order="id"><span>Id</span></th>
							<th data-format="codemap"><span>代码集名称</span></th>
							<th data-format="code"><span>代码值</span></th>
							<th data-format="name"><span>代码名称</span></th>
							<th data-format="<a href='#' class='modify'>修改</a>&nbsp;<a href='#' class='delete'>删除</a>" class="sortable asc" data-order="id"><span></span></th>
						</tr>
					</thead>
				</table>
		</div>
	</jsp:body>
</sdf:dialog>


<sdf:form id="codeItemForm" action="/code/item/save"  mode="ajax" method="post" showMessage="false">
<div class="modal fade" id="codeItemSave" tabindex="-1" data-backdrop="static" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
        <h4 class="modal-title" id="userSaveTitle">保存代码项</h4>
      </div>
      <div class="modal-body">
      		<input name="id" type="hidden" >
      		<sdf:input name="codemap" id="codemap" type="text" readonly="true" placeholder="代码集名称" label="代码集" 
      			required="true" />
      		<sdf:input name="code" id="code" type="text" placeholder="代码值" label="代码值"
      			required="true" />
      		<sdf:input name="name" id="name" type="text" placeholder="代码名称" label="代码名称"
      			required="true"/> 
      		<sdf:input name="sort" id="name" type="text" placeholder="顺序码" label="顺序码" value="0000" maxlen="16"
      			required="true"/> 
      		<div class="alert"></div>
      </div>
      <div class="modal-footer">
        <button type="submit" id="saveCodeItemButton" class="btn btn-primary"><span class="icon-save"></span> <span>保存</span></button>
        <button type="button" class="btn btn-default" data-dismiss="modal"><span class="icon-remove"></span> <span>关闭</span></button>
      </div>
    </div>
  </div>
</div>
</sdf:form>
</tiles:putAttribute>
</tiles:insertDefinition>