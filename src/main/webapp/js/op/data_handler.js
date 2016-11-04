var Cll = {};

Cll.Api = (function () {

    var _api = {};

    function _extend_param(target, src) {
        for (var key in src) {
            target[key] = src[key]; 
        }
    }
    
    function _get_fixed_param() {
        return {
            cityId: $('#cityId').val()
        }
    }
    
    function _get_fixed_params() {
        return {
            'sign': '',
            's': 'manager',
            'v': '1',
            'cityId': $('#cityId').val(),
            'magic': "zhangxu0328"
        }
    }
    
    /**
     * 重载基础数据
     */
    _api.reload_basic = function (params, cbk) {
        var _reload_basic_action = 'http://op.raymond.com:7000/city/manager!reload.action';
        //var _reload_basic_action = 'localhost';
        _extend_param(params, _get_fixed_params());
        $.get(_reload_basic_action, params, function (response) {
            cbk(response);
        })
    };

    /**
     * 原始数据备份
     * 
     * */
    _api.backup_ioexport = function (params, cbk) {
        var _backup_ioexport_action = __baseUrl + '/dataProcess/backup';
         _extend_param(params, _get_fixed_param());
        $.get(_backup_ioexport_action, params, function (response) {
            cbk(response);
        })
    };

    /**
     *  原始数据恢复
     * 
     * */
    _api.backup_ioimport = function (params, cbk) {
        var _backup_ioimport_action = __baseUrl + '/dataProcess/recovery';
        _extend_param(params, _get_fixed_param());
        $.get(_backup_ioimport_action, params, function (response) {
            cbk(response);
        })
    };
    
    /**
     * 坐标转换
     * */
    _api.convert_sosinf2 = function (params, cbk) {
        var _convert_sosinf_action = __baseUrl + '/dataProcess/ctran';
        _extend_param(params, _get_fixed_param());
        $.get(_convert_sosinf_action, params, function (response) {
            cbk(response);
        })
    }

    /**
     * 原始数据转基础数据
     * */
    _api.backup_sos2inf = function (params, cbk) {
        var _backup_sos2inf_action = __baseUrl + '/dataProcess/sosToInf';
        _extend_param(params, _get_fixed_param());
        $.get(_backup_sos2inf_action, params, function (response) {
            cbk(response);
        })
    };
    
    /**
     * 原始数据上传
     * 
     * */
    
    _api.backup_upload = function (params, cbk) {
        var _backup_upload_action = __baseUrl + '/dataProcess/upload';
        _extend_param(params, _get_fixed_param());
        var formdata = new FormData(document.uploadform);
        formdata.append('cityId', params['cityId']);
        $.ajax({  
            url: _backup_upload_action,  
            type: 'POST',  
            data: formdata,  
            dataType: 'JSON',  
            cache: false,  
            processData: false,  
            contentType: false,
            success: function(response) {
                cbk(response);
            },
            error: function(response) {
                alert('网络异常');
            }
        });
    };
    
    /**
     * 原始数据下载
     * 
     * */
    _api.backup_download= function (params, cbk) {
        var _backup_download_action = __baseUrl + '/dataProcess/download';
        _extend_param(params, _get_fixed_param());
        var p=[];
        p.push('cityId=' + params.cityId);
        p.push('dirName=' + params.dirName);
        p.push('dType=' + params.dType);
        window.open(_backup_download_action + '?' + p.join('&'));
    };

    /**
     * json转文件
     * 
     * */
    _api.json_to_file= function (params, cbk) {
        var _jsonToFile_action =  __baseUrl + '/dataProcess/jsonToFile';
        _extend_param(params, _get_fixed_param());
        $.get(_jsonToFile_action, params, function (response) {
            cbk(response);
        })
    };
    /**
     * 文件转json
     * 
     * */
    _api.file_to_json= function (params, cbk) {
        var _fileToJson_action =  __baseUrl + '/dataProcess/fileToJson';
        _extend_param(params, _get_fixed_param());
         $.get(_fileToJson_action, params, function (response) {
             cbk(response);
         })
    };

    /**
     * 原始数据备份列表 /manager/sosio!iolist.action
     * */
    _api.backup_iolist = function (params, cbk) {
        var _backup_iolist_action = __baseUrl + '/dataProcess/bakFileList';
        _extend_param(params, _get_fixed_param());
        $.get(_backup_iolist_action, params, function (response) {
            cbk(response);
        })
    };

    /**
     * 脊线预处理
     * */
    
    _api.compress_tra = function (params, cbk) {
        var _compress_tra_action =  __baseUrl + '/dataProcess/traCompress';
        _extend_param(params, _get_fixed_param());
        $.get(_compress_tra_action, params, function (response) {
            cbk(response);
        })
    };

    /**
     *  数据检查
     * */
    _api.dataCheck = function (params, cbk) {
        var _dataCheck_action = __baseUrl + '/dataCheck/check';
        _extend_param(params, _get_fixed_param());
        $.get(_dataCheck_action, params, function (response) {
            cbk(response);
        })
    };
    
    /**
     * add 2016-4-20 新接入城市数据入库处理
     * 
     * */
    _api.backup_access = function (params, cbk) {
        var _backup_access_action = __baseUrl + '/dataProcess/accessNewCity';
        _extend_param(params, _get_fixed_param());
        var formdata = new FormData(document.accessform);
        formdata.append('cityId', params['cityId']);
        $.ajax({  
            url: _backup_access_action,  
            type: 'POST',  
            data: formdata,  
            dataType: 'JSON',  
            cache: false,  
            processData: false,  
            contentType: false,
            success: function(response) {
                cbk(response);
            },
            error: function(response) {
                alert('网络异常');
            }
        });
    };

    /**
     * add 2016-5-23 wifi线路路测数据统计
     *
     * */
    _api.backup_wifiPlan = function (params, cbk) {
        var _backup_wifiPlan_action = __baseUrl + '/dataProcess/wifiLineRoadTestPlan';
        _extend_param(params, _get_fixed_param());
        var formdata = new FormData(document.wifiform);
        formdata.append('cityId', params['cityId']);
        $.ajax({
            url: _backup_wifiPlan_action,
            type: 'POST',
            data: formdata,
            dataType: 'JSON',
            cache: false,
            processData: false,
            contentType: false,
            success: function(response) {
                cbk(response);
            },
            error: function(response) {
                alert('网络异常');
            }
        });
    };

    return _api;
})();

Cll.Console = function ($content) {
    this.content = $content;
    this.clear = function () {
        this.content.empty();
    };
    this.append = function (log_item) {
        this.content.append('<li>' + log_item + '</li>');
    };
};

function render_template(template_id, data, insert_dest_id) {
    var source = $(template_id).html();
    var template = Handlebars.compile(source);
    var context = {
        'data': data
    };
    var html = template(context);
    $(insert_dest_id).html(html);
}

function get_today_string() {
    var date = new Date();
    return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
}

function get_now_time_string() {
    var date = new Date();
    var hour=date.getHours()<10?"0"+date.getHours():date.getHours();
    var min=date.getMinutes()<10?"0"+date.getMinutes():date.getMinutes();
    var sec=date.getSeconds()<10?"0"+date.getSeconds():date.getSeconds();
    return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()+ ' ' +hour+":"+min+":"+sec;
}

function get_timestamp_string() {
	 var date = new Date();
	 var hour=date.getHours()<10?"0"+date.getHours():date.getHours();
	 var min=date.getMinutes()<10?"0"+date.getMinutes():date.getMinutes();
	 var sec=date.getSeconds()<10?"0"+date.getSeconds():date.getSeconds();
	 return date.getFullYear()+''+ (date.getMonth() + 1)+''+ date.getDate()+''+hour+''+min+''+sec;
}
