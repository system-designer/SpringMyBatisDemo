package com.raymond.core;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;


@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface ServiceLog {
/**
 * 方法文本描述
 * @return
 */
 String text() default "";
 /**
  * 方法编号
  * @return
  */
 String methodId() default "";

}
