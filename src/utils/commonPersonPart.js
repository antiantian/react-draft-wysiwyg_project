/**
 * 
 * @authors zcy (1366969408@qq.com)
 * @date    2017-12-11 15:02:59
 * @version $Id$
 */
const stoData =(data) =>{
   let cdata=[];
    if(!data){
       return cdata
    }
    var typeL= Object.prototype.toString.call(data);
    if(typeL!=='[object String]'&&typeL!=='[object Array]'){
        return cdata
    }
    if(typeL==='[object String]'){
      let newD=data.split(",")
      cdata=newD
    }
    if(typeL==='[object Array]'){
      cdata=data
    }
    return cdata
} 
const equalCompeare = (data,id) => {
 // console.log(data)
    let cdata=stoData(data)
   var had=cdata.includes(id);
   return had
}
const equalCompearePar = (idselect,item,selfids,id='id') => { //idselect已选   //selfids 数据库中已选
   let hadsel = 0
   let cdata=stoData(idselect)
   if(!item.personchildren){
     return hadsel
   }
   if(item.personchildren&&item.personchildren.length>0){
       let personchild = item.personchildren;
       let personLen = personchild.length
       
       personchild.forEach((item)=>{

            let ids = item[id];
            if(cdata.includes(ids)||(selfids&&selfids.includes(ids))){
               hadsel+=1
            }
       })
       if(hadsel==personLen){
         return 'all'
       }  
       if(hadsel>0&&hadsel<personLen){
         return 'half'
       }
   }

}
const getChilds =(item,arr,children="children") =>{
       item.forEach((child)=>{
           if(child[children]){
              arr.push(child)
              getChilds(child[children],arr,children="children")
           }else{
              arr.push(child)
           }
       })
       return arr
}
const equalCompeareParAll = (idselect,item,children="children",id='id',selfids) => { //idselect已选   //selfids 数据库中已选
   let hadsel = 0
   let cdata=stoData(idselect)
   if(!item[children]){

     return false
   }
   let personchild=[];
   if(item[children]&&item[children].length>0){
        personchild = getChilds(item[children],personchild,children="children");
        let personLen = personchild.length
       
       personchild.forEach((item)=>{

            let ids = item[id];
            if(cdata.includes(ids)||(selfids&&selfids.includes(ids))){
               hadsel+=1
            }
       })
       if(hadsel==personLen){
         return {key:'all',child:personchild}
       }  
       if(hadsel>0&&hadsel<personLen){
         return {key:'half',child:personchild}
       }
       if(hadsel==0){
         return {key:'zero',child:personchild}
       }
   }

}
export{equalCompearePar,equalCompeareParAll,stoData,equalCompeare}