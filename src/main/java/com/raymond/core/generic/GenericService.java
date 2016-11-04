package com.raymond.core.generic;

import java.util.List;

import com.raymond.core.feature.orm.mybatis.Example;
import com.raymond.core.feature.orm.mybatis.Page;

/**
 * 所有自定义Service的顶级接口,封装常用的增删查改操作
 * <p/>
 * Model : 代表数据库中的表 映射的Java对象类型
 * PK :代表对象的主键类型
 *
 * @author chen_zx
 * 
 */
public interface GenericService<Model, PK> {

    /**
     * 插入对象
     *
     * @param model 对象
     */
    int insert(Model model);

    /**
     * 更新对象
     *
     * @param model 对象
     */
    int update(Model model);

    /**
     * 通过主键, 删除对象
     *
     * @param id 主键
     */
    int delete(PK id);

    /**
     * 通过主键, 查询对象
     *
     * @param id 主键
     * @return model 对象
     */
    Model selectById(PK id);


    
    
    /**
     * 通用条件查询
     * @param example
     * @return
     */
    List<Model> selectByExample(Example example);
    
    /**
     * 通用条件统计
     * @param example
     * @return
     */
    int countByExample(Example example);
    
    /**
     * 分页条件查询
     * 
     * @param page
     * @param example
     * @return
     */
    Page<Model> selectByExample(Example example,Page<Model> page);

}
