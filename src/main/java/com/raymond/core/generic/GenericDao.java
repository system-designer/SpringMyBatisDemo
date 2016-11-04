package com.raymond.core.generic;

import java.util.List;

import com.raymond.core.feature.orm.mybatis.Example;
import com.raymond.core.feature.orm.mybatis.Page;

/**
 * 所有自定义Dao的顶级接口, 封装常用的增删查改操作,
 * 可以通过Mybatis Generator Maven 插件自动生成Dao,
 * 也可以手动编码,然后继承GenericDao 即可.
 * <p/>
 * Model : 代表数据库中的表 映射的Java对象类型
 * PK :代表对象的主键类型
 *
 * @author chen_zx
 * 
 */
public interface GenericDao<Model, PK> {

    /**
     * 插入对象
     *
     * @param model 对象
     */
    int insertSelective(Model model);

    /**
     * 更新对象
     *
     * @param model 对象
     */
    int updateByPrimaryKeySelective(Model model);

    /**
     * 通过主键, 删除对象
     *
     * @param id 主键
     */
    int deleteByPrimaryKey(PK id);

    /**
     * 通过主键, 查询对象
     *
     * @param id 主键
     * @return
     */
    Model selectByPrimaryKey(PK id);
    
    /**
     * 查询多个对象
     *
     * @return 对象集合
     */
    List<Model> selectByExample();
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
    List<Model> selectByExample(Example example,Page<Model> page);

}
