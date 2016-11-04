<%@page import="com.raymond.oauth.db.model.User"%>
<%@page import="java.util.List"%>
<%@page import="com.google.common.collect.Lists"%>
<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<%@ taglib uri="http://tiles.apache.org/tags-tiles" prefix="tiles" %>
<%@ taglib tagdir="/WEB-INF/tags" prefix="sdf" %>
<%
	List<User> users = Lists.newArrayList();
	User u = new User();
	u.setId(1L);
	u.setState("00");
	u.setUsername("苷");
	users.add(u);
	request.setAttribute("users", users);
%>
<tiles:insertDefinition name="console">
	<tiles:putAttribute name="title" value="首页"></tiles:putAttribute>
	<tiles:putAttribute name="head">
	
	<style>
	.photobooth{position:relative;font:11px arial,sans-serif;overflow:hidden;user-select:none;-webkit-user-select:none;-moz-user-select:none;-o-user-select:none}.photobooth canvas{position:absolute;left:0;top:0}.photobooth .blind{position:absolute;left:0;top:0;opacity:0;width:100%;height:100%;background:#fff;z-index:1}.photobooth .blind.anim{transition:opacity 1500ms ease-out;-o-transition:opacity 1500ms ease-out;-moz-transition:opacity 1500ms ease-out;-webkit-transition:opacity 1500ms ease-out}.photobooth .warning{position:absolute;top:45%;background:#ffebeb;color:#cf0000;border:1px solid #cf0000;width:60%;left:50%;margin-left:-30%;display:none;padding:5px;z-index:10;text-align:center}.photobooth .warning span{text-decoration:underline;cursor:pointer;color:#333}.photobooth ul{width:30px;position:absolute;right:0;top:0;background:rgba( 0,0,0,.6 );height:190px;z-index:2;border-bottom-left-radius:5px}.photobooth ul li{width:30px;height:38px;background-repeat:no-repeat;background-position:center center;cursor:pointer;position:relative}.photobooth ul li:hover{background-color:#aaa}.photobooth ul li.selected{background-color:#ccc}.photobooth ul.noHSB{height:80px}.photobooth ul.noHSB li.hue,.photobooth ul.noHSB li.saturation,.photobooth ul.noHSB li.brightness{display:none}.photobooth ul li.hue{background-image:url(data:image/jpeg;base64,/9j/4AAQSkZJRgABAgAAZABkAAD/7AARRHVja3kAAQAEAAAAZAAA/+4ADkFkb2JlAGTAAAAAAf/bAIQAAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQICAgICAgICAgICAwMDAwMDAwMDAwEBAQEBAQECAQECAgIBAgIDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMD/8AAEQgACAAYAwERAAIRAQMRAf/EAHgAAQEAAAAAAAAAAAAAAAAAAAkIAQEAAwAAAAAAAAAAAAAAAAAKBggLEAAAAwQLAAAAAAAAAAAAAAAAMQZBAjQ4A3MEdMQFdQcICTkRAAEBBAcGBwAAAAAAAAAAABExAAEhElECMjMEBQlhwgNzFDgVNRY3CBgK/9oADAMBAAIRAxEAPwBGOKPmqmNdT5FD2YgarLO67OVueIqrxF2tI/1Kn0jjjKfFcJZEt+5BAUCAaKuw+ThT3vC0wbFof+U4Dnv3WGl8Pu47A8vecwabKy8ZRVNKFdF3dY72fztbVdFu67axelcfrPkYlPTutCW7qqYCkwDf/9k=)}.photobooth ul li.saturation{background-image:url(data:image/jpeg;base64,/9j/4AAQSkZJRgABAgAAZABkAAD/7AARRHVja3kAAQAEAAAAZAAA/+4ADkFkb2JlAGTAAAAAAf/bAIQAAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQICAgICAgICAgICAwMDAwMDAwMDAwEBAQEBAQECAQECAgIBAgIDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMD/8AAEQgACAAYAwERAAIRAQMRAf/EAGMAAAMAAAAAAAAAAAAAAAAAAAYICQEBAQEAAAAAAAAAAAAAAAAACAkKEAAABgMBAAAAAAAAAAAAAAAAwYIDMwZxAkQHEQABAgUFAAAAAAAAAAAAAAAAAQYxgQIyM3HBQgMH/9oADAMBAAIRAxEAPwAwo0rWdSFXHBYpnLZmWjVB/fLedIODu5Do81j1y2KE0CJlJA2uK5ZjtY2Kg//Z)}.photobooth ul li.brightness{background-image:url(data:image/jpeg;base64,/9j/4AAQSkZJRgABAgAAZABkAAD/7AARRHVja3kAAQAEAAAAZAAA/+4ADkFkb2JlAGTAAAAAAf/bAIQAAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQICAgICAgICAgICAwMDAwMDAwMDAwEBAQEBAQECAQECAgIBAgIDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMD/8AAEQgACAAYAwERAAIRAQMRAf/EAFcAAQAAAAAAAAAAAAAAAAAAAAoBAQAAAAAAAAAAAAAAAAAAAAAQAAAEBQUAAAAAAAAAAAAAAACxAwgBMXECBXJzBDQ1EQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwAcTWfR4GtIwC5mITxNUDgAYA0joY3aRKwB/9k=)}.photobooth ul li.crop{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAICAYAAADjoT9jAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAEFJREFUeNpi/A8EDAjACMT/qUgzMCJZwMhAXQA2l4VGhsPNZKKR4XBfMMG8QiPASDcf0MIX/2FxgCJARRoMAAIMAK49Iv4yTUj5AAAAAElFTkSuQmCC)}.photobooth ul li.trigger{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAASCAYAAABB7B6eAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAa9JREFUeNqc1M8rRFEUwPF5M4MhP8aPIiIS21lQk1Is5ceChZIdOytlI/+A7Ig/gGRhpYiNbKQsrBRFLPzYWJghNH7MjOd76qhr8m6vOfWpmffevefec987juu6AZ8RQhhBpJHJuT+CfsiEDo6wGjYeKMKn8b8Um/jCG2qQ0skjyOIWB9hFNyaN8bWSwGEHM5q9EVc6mUQ9YpjDHQbwoQkjuspDDKNEF9hjJDjFcoAEx653XEoJMYoVxNGBGPZRhzbL+HTYWLEtpO6V6EQ5kijTc7HFiwyssDwgyXsxhW8tkZSxAAksoj3n7P4G20hatviKE3RpqXKN4V5K4TE+IQ89WBI8ao0DFkP49krw+057xbyWxBY72LIdXsbjnlzf8/kRbtgSeO1APqonnwlu8tlBIYp9JojmkyCiX7Kf6MsngcSsvvO2aMZEPmcgEcea7ua/aNKGaC2RY0lwgTNsYwwNOlkrprGOJe2q/84vvegabdrrQyqomrSTyirHtbPKc+84x4L2qBazORi/s9KuC7QfBY3JC1UVBlGt16PallPap+Tas+7wWc8za1Ql8yPAAAzkXGo1lmDtAAAAAElFTkSuQmCC)}.photobooth .submenu{background:rgba( 0,0,0,.6 );position:absolute;width:100px;opacity:0;height:20px;padding:5px 10px;color:#fff;top:4px;left:-124px;border-radius:5px;-webkit-transition:opacity 500ms ease;-moz-transition:opacity 500ms ease;-o-transition:opacity 500ms ease;-msie-transition:opacity 500ms ease;transition:opacity 500ms ease}.photobooth li:hover .submenu{opacity:1}.photobooth .submenu .tip{width:4px;height:8px;position:absolute;right:-4px;top:50%;margin-top:-2px;background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAICAYAAADeM14FAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAADVJREFUeNpiYGBgmAnEDP///wdjJgYImMnIyAhmwATggowwLTCArAKrQDqyQDrcMGQlAAEGAAGOCdflbyWyAAAAAElFTkSuQmCC)}.photobooth .submenu .slider{width:100px;height:20px;position:relative}.photobooth .submenu .slider .track{height:2px;width:100px;position:absolute;top:9px;background:rgba(255,255,255,.6)}.photobooth .submenu .slider .handle{height:14px;width:2px;position:absolute;top:3;background:#fff;z-index:2}.photobooth .submenu .slider .handle div{position:absolute;z-index:3;width:20px;top:-3px;height:20px;cursor:w-resize;left:-9px}.resizehandle{position:absolute;z-index:1;width:100px;height:100px;left:30px;top:30px;cursor:move;outline:1500px solid rgba( 0,0,0,.35 );box-shadow:2px 2px 10px rgba(0,0,0,.5),0 0 3px #000;opacity:0;transition:opacity 500ms ease;-moz-transition:opacity 500ms ease;-o-transition:opacity 500ms ease;-webkit-transition:opacity 500ms ease}noindex:-o-prefocus,.resizehandle{outline:0!important}@-moz-document url-prefix(){.resizehandle{ box-shadow:none!important}}.resizehandle .handle{width:100%;height:100%;border:2px dashed #0da4d3;margin:-2px 0 0 -2px;z-index:3;position:relative}.resizehandle .handle div{width:18px;height:18px;position:absolute;right:-2px;bottom:-2px;z-index:4;cursor:se-resize;background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAYAAAA71pVKAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAHdJREFUeNpi/P//PwO5gIlcjXxLr/xnIlujsg7pNsM0AgEjE7kaSfIzusZ/d4n0M1aNxPgZWeMHC4RGIJuREV8847IRpBGvnwlpxBnPRGkEyYOcjYx5l1z+z3/8Pwij8NHlQWwUPxNrI4afSdUI9zNZGoF8gAADAOGvmx/e+CgVAAAAAElFTkSuQmCC);background-position:top left;background-repeat:no-repeat}
	.multiselect {
		text-align: left;
		}
		.multiselect b.caret {
		position: absolute;
		
		right: 8px;
		}
		.multiselect-group {
		font-weight: bold;
		text-decoration: underline;
		}
	</style>
	<script type="text/javascript">
		// 文件上传JS例子
		seajs.use(['jquery','bootstrap','fileinput','jquery.blockUI'],function($){
			$(function(){
		    	$('input[type=file]').fileinput();
		    	$('#modal').click(function(){
		    		$('#dialogForm').webform('clear');
		    		$('#dialog').modal('show');
		    	});
		    	$('#saveUserButton1').click(function(){
		    		var formdata = new FormData();
		    		
		    		for(var i =0;i<$('#dialog :file')[0].files.length;i++){
		    			formdata.append('file',$('#dialog :file')[0].files[i]);
		    		}
		    		
			    	$.blockUI({
						 title:'请稍等', 
				         timeout: 0,
				         message:'<p style="margin: 10px 0;">正在处理...</p>',
				         baseZ:3000,
				         css: {
				              border: 'none',
				              width: '20%',
				              left:	'40%'
				          }
			      	}); 
			    	$.ajax({  
			            url: '${__baseUrl}/common/upload',  
			            type: 'POST',  
			            data: formdata,  
			            dataType: 'JSON',  
			            cache: false,  
			            processData: false,  
			            contentType: false,
			            success: function(result) {
			            	$.unblockUI();
			            	alert(result.message);
			            	if (!result._exception) {
			            		$('#dialog').modal('hide');
								
							}
			            },
			            error: function(result) {
			            	$.unblockUI();
			            	alert('网络异常');
			            }
				    });
		    	});
		    	
		    	
			});
		});
		// 摄像头例子
		seajs.use(['jquery','jquery.scriptcam','myutil.rest'],function($){
			$(function(){
				$("#webcam").scriptcam({
                    showMicrophoneErrors:false,
                    onError:onError,
                    cornerRadius:20,
                    width:320,
                    height:240,
                    //zoom:0.3,
                    disableHardwareAcceleration:1,
                    cornerColor:'e3e5e2',
                    onWebcamReady:onWebcamReady,
                    path:'${__baseUrl}/images/',
                    onPictureAsBase64:base64_tofield_and_image
                });
				$('#capture').click(base64_toimage);
				function base64_tofield() {
	                $('#formfield').val($.scriptcam.getFrameAsBase64());
	            };
	            function base64_toimage() {
	            	var base64 = $.scriptcam.getFrameAsBase64();
	                $('#captureImg').attr("src","data:image/png;base64,"+ base64);
	                $.post('${__baseUrl}/common/base64/upload',{filename:'png文件.png',base64:base64},function(ret){
	                	console.log(ret);
	                });
	            };
	            function base64_tofield_and_image(b64) {
	                $('#formfield').val(b64);
	                $('#image').attr("src","data:image/png;base64,"+b64);
	            };
	            $('#cameraNames').change(function() {
	                $.scriptcam.changeCamera($('#cameraNames').val());
	            });
	            function onError(errorId,errorMsg) {
	                $( "#btn1" ).attr( "disabled", true );
	                $( "#btn2" ).attr( "disabled", true );
	                alert(errorMsg);
	            }          
	            function onWebcamReady(cameraNames,camera,microphoneNames,microphone,volume) {
	                $.each(cameraNames, function(index, text) {
	                    $('#cameraNames').append( $('<option></option>').val(index).html(text) )
	                });
	                $('#cameraNames').val(camera);
	            }
	            // 放大
	            var zoom = 1;
				$('#zoomIn').click(function(){
					zoom += 0.5;
					if(zoom > 2) zoom = 2;
					$("#webcam").scriptcam({zoom:zoom});
				});
				$('#zoomOut').click(function(){
					zoom -= 0.5;
					if(zoom < 0.5) zoom = 0.5;
					$("#webcam").scriptcam({zoom:zoom});
				});
			});
		});
		
		// 数据列表例子
		seajs.use(['jquery','myui.datatable','bootstrap','myutil.init'],function($){
				$(function(){
					//加载表格
					$('#datatable').dataTable({
						url: '${__baseUrl}/user/pager',
						showNum:true,
						checkbox:true,
						buttons:function(record,col){
							return '<a href="#" class="view">查看</a>';
						}
					});
					$('#datatable').on('click','a.view',function(){
						var record = $(this).closest('tr').data('record');
						$('#detail').webform('fill',record);
						$('#detail').modal('show');
					});
				});
		});
		
		seajs.use(['jquery','bootstrap.datepicker'],function($){
			$(function(){
				$('#datepicker').datepicker({multidate:true});
			});
		});
		// 图片查看窗口例子
		seajs.use(['jquery','jquery.foxibox'],function($){
			$(function(){
				$('a[rel]').foxibox();
			});
		});
		
		// 打印例子
		seajs.use(['jquery','jquery.printarea'],function($){
			$('#btnPrint').click(function(){
				$('#printArea').printArea();
			});
		});
		
		
	</script>
	<sdf:convert code="user_status" />
	<sdf:convertSrc code="user_level" text="name" value="code" src="/user/userLevel?codemap=sys_level"/>
	</tiles:putAttribute>
	<tiles:putAttribute name="body">
	<sdf:convertText code="userStatus" value="01"></sdf:convertText>
	<div class="panel panel-primary">
		<div class="panel-heading">文件上传例子</div>
		<div class="panel-body">
			
		     <input id="fileupload" name="file"  type="file" data-show-upload="false"  data-show-remove="false">
			
		</div>
		<div class="panel-footer">
			<button id="modal">弹出框</button>
			<p>JS模块：</p>
			<p>fileinput</p>
		</div>
	</div>
	<sdf:form id="dialogForm" action="/common/upload" mode="ajax" method="post">
		<sdf:dialog title="弹出框" draggable="true" id="dialog">
			<jsp:attribute name="buttons">
				<button type="submit" id="saveUserButton" class="btn btn-primary">保存</button>
			</jsp:attribute>
			<jsp:body>
				 <sdf:input name="name" type="text"/>
				 <input id="fileupload1" name="file" multiple="multiple" type="file" data-show-upload="false"  data-show-remove="false"> 
			</jsp:body>
		</sdf:dialog>
	</sdf:form>
	<div class="panel panel-primary">
		<div class="panel-heading">树形例子</div>
		<div class="panel-body">
			<sdf:treeSelect id="aa" divId="bb" value="menuId" text="citySel" idKey="id" pidKey="parent" src="/sys/menu/all"/>
			<sdf:input id="citySel" name="citySel" type="text" ></sdf:input>
			<input id="menuId" >
		</div>
		<div class="panel-footer">
			
			
			
		</div>
	</div>
	
	<div class="panel panel-primary">
		<div class="panel-heading">DataTable例子</div>
		<div class="panel-body"></div>
		<div id="datatable">
			<table class="table table-striped">
				<thead>
					<tr>
						<th data-format="<a href='#' data-id='{id}'>{id}</a>" class="sortable asc" data-order="id"><span>Id</span></th>
						<th data-format="name"><span>userName</span></th>
						<th data-format="username"><span>loginName</span></th>
						<th data-format="convert[user_status][state]"><span>状态</span></th>
						<th data-format="convert[user_level][userLevel]"><span>级别</span></th>
						<th data-fill-method='buttons'><span>操作</span></th>
					</tr>
				</thead>
			</table>
		</div>
		<div class="panel-footer">
			<p>JS模块：myui.datatable</p>
		</div>
	</div>
	
	<sdf:dialog title="用户详情" id="detail" dialogClass="auto-init">
		<jsp:body>
			<table class="table">
				<tr>
					<td class="control-label">姓名：</td><td class="show-td" data-name="name"></td>
					<td class="control-label">登录名：</td><td class="show-td" data-name="username" ></td>
				</tr>
				<tr>
					<td class="control-label">级别：</td><td class="show-td" data-name="userLevel" data-convert="user_level"></td>
					<td class="control-label">状态：</td><td class="show-td" data-name="state" data-convert="user_status"></td>
				</tr>
			</table>
		</jsp:body>
	</sdf:dialog>
	
	<div class="panel panel-primary">
		<div class="panel-heading">Select下拉例子</div>
		<div class="panel-body"></div>
		<table class="table">
				<tr>
				<td>
					<sdf:select name="convertSelect" id="convertSelect" convert="sys_level"></sdf:select>
					<sdf:select id="aac" name="bb" item="${users}" itemcode="id" itemtext="username"/>
				</td>
				<td>带Convert参数的例子</td>
				</tr>
				<tr>
					<td>
						<sdf:autocomplete id="autoSelect" name="auto" convert="sys_level"></sdf:autocomplete>
					</td>
					<td>带查询下拉框</td>
				</tr>
		</table>
	</div>
	<div class="panel panel-primary">
		<div class="panel-heading">日历例子</div>
		<div class="panel-body">
			<input type="text" id="datepicker" type="text" class="form-control">
			<sdf:calendar id="a2" name="a2" placeholder="年" format="yyyy" minViewMode="2"/>
			<sdf:calendar id="a1" name="a1" placeholder="月份" minViewMode="1" format="yyyy-mm"/>
			<sdf:calendar id="start" name="aa" endDate="end" placeholder="开始日期"/>
			<sdf:calendar id="end" name="bb" startDate="start" placeholder="结束日期"/>
			<sdf:calendar id="b1" name="b1" type="time" placeholder="时间"/>
			<sdf:calendar id="b2" name="b2" type="time" showDate="false" placeholder="时间" format="HH:mm:ss"/>
		</div>
		<div class="panel-footer">
			<p>JS模块：bootstrap.datepicker</p>
			<p>文档例子：http://eternicode.github.io/bootstrap-datepicker/</p>
		</div>
	</div>
	<div class="panel panel-primary">
		<div class="panel-heading">图片放大查看例子</div>
		<div class="panel-body">
			<a target="_blank" rel="test1" href="http://www.baidu.com/img/bd_logo1.png">
				<img width="100" src="http://www.baidu.com/img/bd_logo1.png"/>
			</a>
		</div>
		<div class="panel-footer">http://www.opusonline.at/foxitools/foxibox/</div>
	</div>
	
	<div class="panel panel-primary">
		<div class="panel-heading">打印例子</div>
		<div class="panel-body">
			<button type="button" class="btn btn-primary" id="btnPrint">打印</button>
			<div id="printArea">
				<pre>
	使用jQuery和CSS控制页面打印区域
	有时我们需要打印页面中的某一区域的内容，比如只打印页面中的表格部分，
	其他如页头和页脚都不需要打印。解决办法有多种，本文只探讨使用CSS和
	jQuery实现的方法。	
				</pre>
			</div>
		</div>
		<div class="panel-footer">https://github.com/RitsC/PrintArea</div>
	</div>
	
	
	
	<div class="panel panel-primary">
		<div class="panel-heading">摄像头例子</div>
		<div class="panel-body">
			<div id="webcam"></div>
			<div class="btn-group">
			<select id="cameraNames"></select>
			<button class="btn" id="capture">拍照</button>
			</div>
			<div><img id="captureImg"/></div>
		</div>
		<div class="panel-footer">
			<p>JS模块：jquery.scriptcam</p>
			<p>文档例子：http://www.scriptcam.com/demo_1.cfm</p>
		</div>
	</div>
	
	
	
	</tiles:putAttribute>
</tiles:insertDefinition>