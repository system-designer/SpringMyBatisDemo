package com.raymond.core.util.webapi;

import com.raymond.core.util.DateUtils;
import org.apache.poi.ss.formula.functions.T;

/**
 * Created by Raymond on 2016/8/2.
 */
public class WebApiResult {
    //请求结果数据
    private Object data;
    //请求结果状态
    private String status;
    //请求结果文字说明
    private String msg;
    //服务器时间戳
    private String timestamp;

    public WebApiResult(String status, String msg, String timestamp, Object data) {
        this.status = status;
        this.msg = msg;
        this.timestamp = timestamp;
        this.data = data;
    }

    public WebApiResult(String status, String msg, Object data) {
        this.status = status;
        this.msg = msg;
        this.timestamp = DateUtils.time(DateUtils.DEFAULT_DATETIME_FORMAT);
        this.data = data;
    }

    public WebApiResult(String msg, Object data) {
        this.setStatus(ResultStatus.STATUS_OK);
        this.msg = msg;
        this.timestamp = DateUtils.time(DateUtils.DEFAULT_DATETIME_FORMAT);
        this.data = data;
    }

    public WebApiResult(Object data) {
        this.setStatus(ResultStatus.STATUS_OK);
        this.timestamp = DateUtils.time(DateUtils.DEFAULT_DATETIME_FORMAT);
        this.data = data;
    }

    public WebApiResult() {
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getMsg() {
        return msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }

    public Object getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }
}
