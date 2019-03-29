/**
 * 
 * @authors zcy (1366969408@qq.com)
 * @date    2017-12-08 16:42:41
 * @version $Id$
 */
import React,{Component} from 'react';
import {Icon} from 'antd'
import lodash from 'lodash'
 
const neemenu =[
  { 
  	id: 1, 
  	userRealname: "dtsola",
  	orgIds:"133",
  },{ 
  	id: 2, 
  	userRealname: "dtsola2",
  	orgIds:"133,124,130",
  },{ 
  	id: 3, 
  	userRealname: "dtsola22",
  	orgIds:"124,130",
  },{ 
  	id: 4, 
  	userRealname: "dtsola11",
  	orgIds:"133",
  },{ 
  	id: 5, 
  	userRealname: "dtsola32",
  	orgIds:"133",
  }
]
const equalCompeare = (data,id) => {
 // console.log(data)
    let cdata=[];
    if(!data){
       return
    }
    var typeL= Object.prototype.toString.call(data);
    if(typeL!=='[object String]'&&typeL!=='[object Array]'){
        return
    }
    if(typeL==='[object String]'){
    	var b=data.split(",")
       cdata=b
    }
    if(typeL==='[object Array]'){
      cdata=data
    }

  
   //以上功能  转成数组
   var had=cdata.includes(id.toString());
   return had
}
const copyObj = (beforeObj) =>{
   const result ={};
   for( let key in beforeObj){
   	  result[key] = beforeObj[key]
   }
   return result
}
//var had=beforeId.includes(nowId);
 const combinePP= (department_menu,person_menu, id = 'id', pid = 'pid', children = 'personchildren') => {
 	 let cp,others;
 	 let department_m =lodash.cloneDeep(department_menu);
   department_m=department_m?department_m:[];
 	 let person_m =lodash.cloneDeep(person_menu);
 	  let result = []
 	  let otherD= []
	  let hash = {}
	  if(department_m){
		  department_m.forEach((item, index) => {
		    hash[department_m[index][id]] = department_m[index]
		  })
	   }
	  if(person_m){ 
		    person_m.forEach((item) => {
              const ids=item.orgIds
              const personC=copyObj(item)
              if(!ids||ids.length<1){
              	   otherD.push(personC)   //没有部门的添加到 otherD
              }else{
				  	 const current = department_m.filter(  // 查找部门数组
					    item =>   {
					    	var hasd=equalCompeare(ids,item.id)
				
					    	return hasd

					    }
					  )
				  	 if(current.length>0){
				  	 	 current.forEach((item) => {
				  	 	 	   const personC_C=copyObj(personC)
				  	 	 	   let hashVP = hash[item[id]] 
				  	 	 	   if (hashVP) {
							        if(!hashVP[children] && (hashVP[children] = [])){
                                         hashVP[children].push(personC_C)  //添加的是当前比对的人员对象
							        }else{
							        	 //已有子集  要看是否已经添加过了  
							        	 const dataC= hashVP[children].filter(item =>{
                                              item.id===personC_C.id
							        	 })
							        	 if(dataC.length==0){
							        	 	  hashVP[children].push(personC_C)

							        	 }
							        }
							    } else {
								    
                                   
						       }
				  	 	 })
				  	 	
		       //           let ids=current.id  //匹配到的数组
		       //           let hashVP = hash[item[id]]
					    //  if (hashVP) {
					    //     !hashVP[children] && (hashVP[children] = [])
					    //     hashVP[children].push(item)
					    //  } else {
						   //    result.push(item)
						   //    // if(item[pid]==0){
						   //    //   result.push(item)
						   //    // }
					      
					    // }
				  	 }else{
				  	 	otherD.push(personC)   //没有部门的添加到 otherD
				  	 }
				}  	 
		  })
      }		  
      // console.log(department_m)
      // console.log('-----------')
      // console.log(otherD) 
      //personchildren:
 	 const a = {
 	 	  newdepartment:department_m,others:otherD
 	 }
 	 return a;
 }
// combinePP(menusdata,neemenu)
 const arrayToTree = (array, id = 'id', pid = 'pid', children = 'children') => {
  let data = lodash.cloneDeep(array)
  let result = []
  let hash = {}
  data.forEach((item, index) => {
    hash[data[index][id]] = data[index]
  })

  data.forEach((item) => {
    let hashVP = hash[item[pid]]
    if (hashVP) {
      !hashVP[children] && (hashVP[children] = [])
      hashVP[children].push(item)
    } else {
      result.push(item)
      // if(item[pid]==0){
      //   result.push(item)
      // }
      
    }
  })
  return result
}
 module.exports = combinePP 