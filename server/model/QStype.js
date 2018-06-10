import base from './Base.js'

async function operType(ctx){
    let data = ctx.request.body;
    let operType=data.operType;
    let res='';
    let qstypeid='';
    let typename='';
    switch(operType){
        case 'add':
            typename = data.typename;
            res= await base.add(`insert into qstype (typename) values ('${typename}')`);
            break;
        case 'del':
            qstypeid = data.qstypeid;
            res = await base.delById('qstype','qstypeid',qstypeid);
            break;
        case 'update':
            qstypeid = data.qstypeid;
            typename = data.typename;
            res = await base.update(`update qstype set typename = '${typename}' where qstypeid = ${qstypeid}`);
            break;
        case 'get':
            res = await base.findAll('qstype');
            break;
    }
    ctx.body={data:{data:res}}
}
//分页条件查询
async function searchqsTypeCondition(ctx){
    const data = ctx.request.body;
    let page = data.page;
    let pageSize = data.pageSize;
    let where = data.where;
    let whereval = data.whereval;
    let res = await base.pageSearchCondition('qstype', page, pageSize,' where '+ where +' like '+whereval);
    ctx.body={data:{res}}
}

export default{
    operType,
    searchqsTypeCondition
}
