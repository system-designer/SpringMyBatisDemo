package com.raymond.core.util.webapi;

import java.util.Map;

/**
 * Created by RayLew on 2016/8/2.
 */
public class WebApiRequest {
    private static final String webApiBaseUrl;

    static {
        webApiBaseUrl = "http://op.raymond.com:7000/universe";
    }

    /**
     * RequestMethod GET
     *
     * @param api
     * @param paramMap
     * @return
     * @throws Exception
     */
    public static String get(String api, Map<String, String> paramMap) throws Exception {
        String url = createUrl(api);
        return HttpWebRequest.get(url, paramMap);
    }

    /**
     * Post json 数据
     *
     * @param api
     * @param json
     * @return
     * @throws Exception
     */
    public static String postJson(String api, String json) throws Exception {
        String url = createUrl(api);
        return HttpWebRequest.post(url, null, json, HttpWebRequest.JsonContentType);
    }

    /**
     * RequestMethod POST
     *
     * @param api
     * @param paramMap
     * @param data
     * @param contentType
     * @return
     * @throws Exception
     */
    public static String post(String api, Map<String, String> paramMap, String data, String contentType) throws Exception {
        String url = createUrl(api);
        return HttpWebRequest.post(url, paramMap, data, contentType);
    }

    /**
     * Put json 数据
     *
     * @param api
     * @param json
     * @return
     * @throws Exception
     */
    public static String putJson(String api, String json) throws Exception {
        String url = createUrl(api);
        return HttpWebRequest.put(url, null, json, HttpWebRequest.JsonContentType);
    }

    /**
     * RequestMethod PUT
     *
     * @param api
     * @param paramMap
     * @param data
     * @param contentType
     * @return
     * @throws Exception
     */
    public static String put(String api, Map<String, String> paramMap, String data, String contentType) throws Exception {
        String url = createUrl(api);
        return HttpWebRequest.put(url, paramMap, data, contentType);
    }

    /**
     * RequestMethod DELETE
     *
     * @param api
     * @param paramMap
     * @return
     * @throws Exception
     */
    public static String delete(String api, Map<String, String> paramMap) throws Exception {
        String url = createUrl(api);
        return HttpWebRequest.delete(url, paramMap);
    }

    /**
     * 构建url
     *
     * @param api
     * @return
     */
    private static String createUrl(String api) {
        String url = String.format("%1$s/%2$s", webApiBaseUrl, api);
        return url;
    }
}
