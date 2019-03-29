/**
 * 
 * @authors zcy (1366969408@qq.com)
 * @date    2017-11-15 17:04:22
 * @version $Id$
 */

const parentUrl = (id,tree,url) => {

     if(!url){
        var url = null;
     }

    const finished= tree.map((item)=>{
        if(item.id==id){
            url=url?item.siteUrl+"/"+url:item.siteUrl; 
            if(item.sitePid!=0){ //
              // console.log(url)
               return parentUrl(item.sitePid,tree,url)
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
  const changeItmeP = (id) =>{
     publishItem.siteUrl=id;
  }

module.exports = parentUrl 