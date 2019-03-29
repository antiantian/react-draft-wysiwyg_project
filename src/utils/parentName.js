/**
 * 
 * @authors zcy (1366969408@qq.com)
 * @date    2017-11-15 17:04:22
 * @version $Id$
 */

const parentName = (id,tree,url) => {

     if(!url){
        var url = null;
     }
    if(!tree){
      return null
    }
    const finished= tree.map((item)=>{
        if(item.id==id){
            url=url?item.organizationName+"/"+url:item.organizationName; 
            if(item.organizationSuper!=0){ //
              // console.log(url)
               return parentName(item.organizationSuper,tree,url)
            }else{
               return url
            }

        }

    })
    let result =  finished.filter(function(item) {
          return item;
      });
    return result?result.length==1?result[0]:null:null;
  }


module.exports = parentName 