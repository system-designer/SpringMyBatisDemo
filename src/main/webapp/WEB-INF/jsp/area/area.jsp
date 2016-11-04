<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<%@ taglib uri="http://tiles.apache.org/tags-tiles" prefix="tiles" %>
<%@ taglib tagdir="/WEB-INF/tags" prefix="sdf" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<tiles:insertDefinition name="console">
	<tiles:putAttribute name="title" value="城市管理"></tiles:putAttribute>
	<tiles:putAttribute name="head">
		<script type="text/javascript">
			seajs.use(['jquery','myui.datatable','bootstrap','myutil.init'],function($){
				$(function(){
					// 新增
					$('#addCity').click(function(){
						$('#cityForm').webform('clear');
						$('#citySave').modal({show:true});
					});
					//加载表格
					$('#datatable').dataTable({
						url: '${__baseUrl}/area/pager',
						filter:'#cityFilters',
						fillButtons:function(city,col){
							return "<div class='btn-group'>"
							+ "<a href='#' class='modify btn btn-info default' value='"+city.id+"'>修改</a>"
							+ "<a href='#' class='del btn btn-info default' value='"+city.id+"'>删除</a>"
							+ "</div>";
						}
					});
					//修改
					$('#datatable').on('click','a.modify',function(){
						var id = $(this).attr('value');
						$('#cityForm').webform('clear');
						$('#cityForm').webform('fill','${__baseUrl}/area/detail?id='+id);
						$('#citySave').modal('show');
					});
					$('#datatable').on('click','a.del',function(){
						var id = $(this).attr('value');
						$.get('${__baseUrl}/area/del?id='+id,function(ret){
							alert(ret.msg);
							$('#datatable').dataTable('reload');
						});
					});
					
					$('#cityForm').webform('option','success',function(){
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
					<button id="addCity" type="button" class="btn btn-default"><span class="icon-plus"></span> <span>新增城市</span></button>
				</div>
				</div>
				<div class="col-md-9" style="text-align: right;" id="cityFilters" data-auto="true">
					<div class="form-inline">
					<div class="form-group">
				      <input name="cityCn"  type="text" class="form-control" placeholder="中文名称">
				      <input name="code"  type="text" class="form-control" placeholder="城市编码">
				      <select name="order" class="form-control" style="width:100px;">
							<option value="">优先级</option>
							<option value="1">P1</option>
							<option value="2">P2</option>
							<option value="3">P3</option>
							<option value="4">P4</option>
					</select>
				    </div>
				    <button id="search" class="btn btn-primary btn-query" type="button"><span class="glyphicon glyphicon-search"></span> <span>查询</span></button>
				    </div>
				</div>
			</div>
		<div id="datatable">
			<table class="table table-striped">
					<thead>
						<tr>
							<th data-format="<a href='#' data-id='{id}'>{code}</a>" class="sortable asc" data-order="code_"><span>城市编码</span></th>
							<th data-format="cityCn" class="sortable asc" data-order="city_cn_"><span>中文名</span></th>
							<th data-format="cityEn" class="sortable asc" data-order="city_en_"><span>英文名</span></th>
							<th data-format="areaCode" class="sortable asc" data-order="area_code_"><span>区号</span></th>
							<!-- <th data-format="parent" class="sortable asc" data-order="icon"><span>省份</span></th> -->
							<th data-format="order" class="sortable asc" data-order="order_"><span>优先级</span></th>
							<!-- <th data-format="type" class="sortable asc" data-order="icon"><span>样式</span></th> -->
							<th data-fill-method="fillButtons" width="150px;"><span>操作</span></th>
						</tr>
					</thead>
				</table>
		</div>
	<!-- 新增/修改表单 -->
		<sdf:form id="cityForm" action="/area/save"  mode="ajax" method="post" showMessage="true">
			<sdf:dialog title="新增/修改城市" id="citySave">
		    	<jsp:attribute name="buttons">
		    		<button type="submit" id="saveCityButton" class="btn btn-primary">保存</button>
		    	</jsp:attribute>
				<jsp:body>
					<sdf:input name="id"  type="hidden"/>
		      		<sdf:input name="code"  type="text" placeholder="城市编号" label="城市编号" required="true" />
		      		<sdf:input name="cityCn"  type="text" placeholder="中文名称" label="中文名称" required="true" />
		      		<sdf:input name="cityEn" type="text" placeholder="英文名称"  label="英文名称" />
		      		<sdf:input name="areaCode" type="text" placeholder="区号"  label="区号" />
					<label>类型</label>
					<select name="type" class="form-control" style="width:100px;">
						<option value="">类型</option>
						<option value="1">实时</option>
						<option value="2">第三方</option>
						<option value="3">里程</option>
					</select>
					<label>优先级</label>
					<select name="order" class="form-control" style="width:100px;">
							<option value="">优先级</option>
							<option value="1">P1</option>
							<option value="2">P2</option>
							<option value="3">P3</option>
							<option value="4">P4</option>
					</select>
		      		<%-- <sdf:input name="order" type="text" placeholder="优先级"  label="优先级" /> --%>
		      		<%-- <sdf:input name="parent" type="text" placeholder="省份"  label="省份" /> --%>
		      		<div class="alert"></div>
		      	</jsp:body>
			</sdf:dialog>
		</sdf:form>
		
</tiles:putAttribute>
</tiles:insertDefinition>