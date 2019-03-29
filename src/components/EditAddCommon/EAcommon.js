import React from 'react';
import {message} from 'antd';
 message.config({
    top:60,
    duration:2,
});
 /*
  const saveList2=[{
      index:'status',
      mess:'是否开启不能为空',
      arr:this.state.status
    },{
      index:'rateJson',
      type:'datasValidate', //数组验证
      necessary:this.state.rateNecsssary,
      arr:this.state.rateJson,
      mess:'费率信息不能为空',
      messAll:'请补全费率必填信息',
    },{
      index:'configJson',
      type:'objValidate', //对象验证
      necessary:this.state.configNecsssary,
      arr:this.state.configJson,
      mess:'配置信息不能为空',
      messAll:'请补全配置必填信息',
    }]  
    */
 //验证  编辑 保存 
function ValidateEA(saveList){
  var nextDo=true;
  var indexVal="";
  var codename=[];
    for(let i=0;i<saveList.length;i++){
      var item=saveList[i];
      if(item.type==='datasValidate'||item.type==='objValidate'){
          if(item.arr.length<=0){
            message.error(item.mess+",请勾选");
            indexVal=item.index;
            nextDo=false;
            break;
          }else{
              if(item.type==='datasValidate'){
                  const necessary=item.necessary;  
                  const arr=item.arr;
                  var rateNameArr=[];
                  for(let i=0;i<arr.length;i++){
                      const rateJsonitem=arr[i];
                      const key=Object.keys(rateJsonitem)[0];
                      var valall=false; //验证是否有未填写的
                      if(necessary&&necessary.length>0){
                        for(let j=0;j<necessary.length;j++){
                          var innerkey=necessary[j];
                          if(rateJsonitem[key][innerkey]==undefined||(rateJsonitem[key][innerkey].length<=0)){
                                 valall=true;
                                 break;
                          }
                         }
                      }
                      //
                      if(valall){
                         rateNameArr.push(key)
                      }
                  }

                  if(rateNameArr.length>0){
                      //判断信息是否已经填写完整
                      /*this.setState({
                        datasValidate:'false',  //false 为信息不全
                        codename:rateNameArr //不全信息的name
                      })*/
                      message.error(item.messAll||'请补全必填信息');
                      indexVal=item.index;
                      nextDo=false;
                      codename=rateNameArr;
                      break;
                  }else{
                     continue;
                  }
             }else if(item.type==='objValidate'){
                  const necessaryC=item.necessary;
                  const arr=item.arr;
                  var valall=false; //验证是否有未填写的
                  if(necessaryC&&necessaryC.length>0){
                    for(let j=0;j<necessaryC.length;j++){
                          var innerkey=necessaryC[j];
                          if(arr[innerkey]==undefined||(arr[innerkey].length<=0)){
                                 valall=true;
                                 break;
                          }
                      }
                   }   
                  if(valall){
                      //判断信息是否已经填写完整
                      /*
                      this.setState({
                        configValidate:'false'
                      })*/
                      message.error(item.messAll||'请补全必填信息');
                      indexVal=item.index;
                      nextDo=false;
                      break;
                  }else{
                     continue;
                  }
             }
         }
      }else{
         if(item.arr===''||!item.arr){
            message.error(item.mess);
            indexVal=item.index;
            nextDo=false;
            break;
         }else{
            if(item.type==='phone'){
                if(item.arr.length!=11){
                  message.error('您输入的手机号位数不对');
                  indexVal=item.index;
                  nextDo=false;
                  break;
                }
                
            }else if(item.type==='idCard'){
                if(item.arr.length!=18&&item.arr.length!=15){
                  message.error('您输入的身份证号长度不对');
                  indexVal=item.index;
                  nextDo=false;
                  break;
                }
            }else if(item.type==='banknum'){
                if(item.arr.length < 16 || item.arr.length > 19){
                  message.error('银行卡号长度必须在16到19之间');
                  indexVal=item.index;
                  nextDo=false;
                  break;
                }
            }
         }
      }     
    }
    return {nextDo:nextDo,indexVal:indexVal,codename:codename}
}
//合并数组里的对象
function changeDataObj(rateJsons){
      var ateobj={};
      for(var i=0;i<rateJsons.length;i++){
          let obs=rateJsons[i];
          for(let k in obs){
            ateobj[k]= obs[k]
          }
      }
      return ateobj;
}
//改变多个多选列表值
function rateJson_Change(obj,arr,names,fn){
         if(obj.add){
           if(arr.length<=0){
              arr.push({
                [obj.name]:obj.data
              })
              names.push(obj.name)
           }else{
             var have=false;
             for(let i=0;i<arr.length;i++){
                 const object=arr[i];
                 var key = obj.name; 
                 var value = object[key];
                 if(value){
                    arr[i]={[obj.name]:obj.data} 
                    have=true;
                    break;
                 }else{
                    have=false
                 }
             }
             if(!have){
                arr.push({
                  [obj.name]:obj.data
                })
                names.push(obj.name)
             }
           }
           fn();
        }else{
           for(let i=0;i<arr.length;i++){
                 const object=arr[i];
                 var key = obj.name; 
                 var value = object[key];
                 if(value){
                    arr.splice(i,1);
                    names.splice(i,1)
                 }
           } 
           fn(); 
        }
  }
  //保存按钮  提交的json对象
function postObject(list,obj){
  for(let i=0;i<list.length;i++){
     if(list[i].type==='objValidate'){
       obj[list[i].index]=JSON.stringify(list[i].arr); 
     }else if(list[i].type==='datasValidate'){
         var ateobj=changeDataObj(list[i].arr);
         obj[list[i].index]=JSON.stringify(ateobj);   
     }else{
       obj[list[i].index]=list[i].arr; 
     }
     
  }
  return obj;
}  

export {ValidateEA,changeDataObj,rateJson_Change,postObject} ;

