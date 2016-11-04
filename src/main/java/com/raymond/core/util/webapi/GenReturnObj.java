/**
 *
 */
package com.raymond.core.util.webapi;

import net.sf.json.JSONObject;

/**
 * generate return object
 *
 * @author cxhuan
 */
public class GenReturnObj {
    public static JSONObject genObj(String status, String errMsg,
                                    Object object) {
        JSONObject jsonr = new JSONObject();
        jsonr.put("data", object);
        jsonr.put("errmsg", errMsg);
        jsonr.put("status", status);

        return jsonr;
    }

    public static com.alibaba.fastjson.JSONObject genAliObj(String status, String errMsg,
                                                            Object object) {
        com.alibaba.fastjson.JSONObject jsonr = new com.alibaba.fastjson.JSONObject();
        jsonr.put("data", object);
        jsonr.put("errmsg", errMsg);
        jsonr.put("status", status);

        return jsonr;
    }
}
