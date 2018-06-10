//后台路由配置
import config from '../config.js'
import mysql from 'mysql2/promise'

async function runsql(sql){
    const connection = await mysql.createConnection(config.mysqlDB);
    const [list] = await connection.execute(sql);
    await connection.end();
    return list;
}

/**
 * @param table 表名
 * @desc 插叙所有信息
 */
async function findAll(table){
    const connection = await mysql.createConnection(config.mysqlDB);
    const [list] = await connection.execute(`select * from ${table}`);
    await connection.end();
    return list;
}

/**
 * @param table 表名 arr[] 参数数组 xxid = yyyid
 * @desc 根据id 查询信息
 */
async function findOne(table,key,val){
    if(key && val){
        const connection = await mysql.createConnection(config.mysqlDB);
        const [list] = await connection.execute(`select * from ${table} where ${key} = '${val}'`);
        await connection.end();
        return list;
    }else{
        return [];
    }
}

/**
 * @param sql 
 * @desc 插入数据到数据表
 */
async function add(sql){
    if(sql){
        const connection = await mysql.createConnection(config.mysqlDB);
        await connection.execute(sql);
        await connection.end();
        return true;
    }else{
        return false;
    }
}
/**
 * @param table 表名 arr=[] id数据，xid,yid都是字符串
 * @desc 根据id删除
 */
async function delById(table,key,val){
    if(table){
        const connection = await mysql.createConnection(config.mysqlDB);
        await connection.execute(`delete from ${table} where ${key} = ${val}`);
        await connection.end();
        return true;
    }else{
        return false;
    }
}


/**
 * 
 * @param {*} table  表名
 * @param {*} id    表主键
 * @param {*} page1 页码
 * @param {*} pageSize1 每页条数
 * @desc 分页查询
 * @return {page,pageSize,total,list} 
 */
async function pageSearch(table, page1=0, pageSize1=10){
    if(table){
        let pageSize = Math.abs(pageSize1 >> 0)||10;//分页率
        let page = Math.abs(page1 >> 0)||1;//当前页码
        let arr = [];
        let querying = `select * from ${table} LIMIT ?, ?`;
        const connection = await mysql.createConnection(config.mysqlDB);
        const [rows] = await connection.execute(`SELECT SQL_NO_CACHE COUNT(*) as total FROM ${table}`);
        const total = rows[0].total;//总数量
        const pages = Math.ceil(total/pageSize);
        if(page > pages){
            page = Math.max(1,pages);//以防没数据
        }
        arr.push((page - 1) * pageSize,pageSize);
        const [list] = await connection.execute(querying, arr);
        await connection.end();
        return {page, total,data:list};
    }else{
        return false;
    }
}
/**
 * 
 * @param {*} table  表名
 * @param {*} id    表主键
 * @param {*} page1 页码
 * @param {*} pageSize1 每页条数
 * @param {*} condition 条件
 * @desc 带条件分页查询
 * @return {page,pageSize,total,list} 
 */
async function pageSearchCondition(table, page1=0, pageSize1=10,condition){
    console.log(condition)
    if(table){
        let pageSize = Math.abs(pageSize1 >> 0)||10;//分页率
        let page = Math.abs(page1 >> 0)||1;//当前页码
        const connection = await mysql.createConnection(config.mysqlDB);
        const [rows] = await connection.execute(`SELECT SQL_NO_CACHE COUNT(*) as total FROM ${table} ${condition}`);
        const total = rows[0].total;//总数量
        const pages = Math.ceil(total/pageSize);
        if(page > pages){
            page = Math.max(1,pages);//以防没数据
        }
        let sql = `select * from ${table} ${condition} LIMIT ${((page - 1) * pageSize)}, ${pageSize}`;
        console.log(sql)
        const [list] = await connection.execute(sql);
        await connection.end();
        return {page, total,data:list};
    }else{
        return false;
    }
}
/**
 * 
 * @param {*} table 表名 
 * @param {*} arr  [字段名字，要设置的字段值，where的字段名，where的字段值]
 */
async function update(sql){
    if(sql){
        const connection = await mysql.createConnection(config.mysqlDB);
        await connection.execute(sql);
        await connection.end();
        return true;
    }else{
        return false;
    }
}
/**
 * 
 * @param {*} table表名
 * @desc 统计数据行总数 
 */
async function count(table){
    const connection = await mysql.createConnection(config.mysqlDB);
    const [rows] = await connection.execute(`SELECT SQL_NO_CACHE COUNT(*) as total FROM ${table}`);
    const total = rows[0].total;//总数量
    await connection.end();
    return total;
}
//注释
/*
#增 INSERT INTO tbl_name VALUES(expr, expr)
#删 delete from table1 where 范围
#查 SELECT select_expr FROM table_references
#改 UPDATE table_reference SET col_name1=expr1 WHERE where_condition
#模糊查找： select * from table1 where field1 like ’%value1%’ 
-- like的语法很精妙，查资料!
-- 排序： select * from table1 order by field1,field2 [desc]
-- 总数： select count as totalcount from table1
-- 求和： select sum(field1) as sumvalue from table1
-- 最大： select max(field1) as maxvalue from table1
-- 最小： select min(field1) as minvalue from table1
-- 查询谓词 >,=,<,<>,!=,!>,!<,=>,=<
-- 分页查询 SELECT * FROM tb_name LIMIT $page,$N;

-- 查询指定范围的数据 SELECT * FROM tb_stu WHERE age BETWEEN 0 AND 18
-- 按日期查询数  SELECT * FROM tb_stu WHERE month(date) = '$_POST[date]' ORDER BY date ;

-- ---
-- 注：SQL语言中提供了如下函数，利用这些函数可以很方便地实现按年、月、日进行查询
-- year(data):返回data表达式中的公元年分所对应的数值
-- month(data):返回data表达式中的月分所对应的数值
-- day(data):返回data表达式中的日期所对应的数值
-- ---
-- 对数据进行降序/升序查询
 SELECT 字段名 FROM tb_stu WHERE 条件 ORDER BY 字段 DESC 降序
 SELECT 字段名 FROM tb_stu WHERE 条件 ORDER BY 字段 ASC  升序
*/
export default{
    findOne,
    findAll,
    add,
    delById,
    update,
    pageSearch,
    pageSearchCondition,
    count,
    runsql
}