package com.raymond.oauth.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * 视图控制器,返回jsp视图给前端
 * 
 * @author chen_zx
 * 
 **/
@Controller
@RequestMapping("")
public class PageController {

    /**
     * 登录页
     */
    @RequestMapping("/login")
    public String login() {
        return "login";
    }
    
    /**
     * 404页
     */
    @RequestMapping("/404")
    public String error404() {
        return "error/404";
    }

    /**
     * 401页
     */
    @RequestMapping("/401")
    public String error401() {
        return "error/401";
    }
    
    /**
     * 403页 无权访问页面
     */
    @RequestMapping("/403")
    public String error403() {
        return "error/403";
    }

    /**
     * 500页
     */
    @RequestMapping("/500")
    public String error500() {
        return "error/500";
    }
    
    /**
     * 500页
     */
    @RequestMapping("/errorjson")
    public String errorjson() {
        return "error/errorjson";
    }

}