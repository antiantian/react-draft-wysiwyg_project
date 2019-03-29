/* global window */
import classnames from 'classnames'
import lodash from 'lodash'
import config from './config'
import request from './request'
import createTrees from './createTrees'
import createTreesMutiple from './createTreesMutiple'
import createTreesMutipleAuthority from './createTreesMutipleAuthority'
import createPersonMutiple  from './createPersonMutiple'
import parentUrl from './parentUrl'
import parentName from './parentName'
import { color } from './theme'
import combinePP  from './combinePP'
import {findLinkEntities,findImageEntities,Link,Image} from './draft_decorator'
import {equalCompearePar,stoData,equalCompeare,equalCompeareParAll} from './commonPersonPart'
import {changeText} from './chagetext'
import pathToRegexp from 'path-to-regexp' 
// 连字符转驼峰
String.prototype.hyphenToHump = function () {
  return this.replace(/-(\w)/g, (...args) => {
    return args[1].toUpperCase()
  })
}

// 驼峰转连字符
String.prototype.humpToHyphen = function () {
  return this.replace(/([A-Z])/g, '-$1').toLowerCase()
}

// 日期格式化
Date.prototype.format = function (format) {
  const o = {
    'M+': this.getMonth() + 1,
    'd+': this.getDate(),
    'h+': this.getHours(),
    'H+': this.getHours(),
    'm+': this.getMinutes(),
    's+': this.getSeconds(),
    'q+': Math.floor((this.getMonth() + 3) / 3),
    S: this.getMilliseconds(),
  }
  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, `${this.getFullYear()}`.substr(4 - RegExp.$1.length))
  }
  for (let k in o) {
    if (new RegExp(`(${k})`).test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : (`00${o[k]}`).substr(`${o[k]}`.length))
    }
  }
  return format
}


/**
 * @param   {String}
 * @return  {String}
 */

const resumePic = (parent) => {
  let returnData;
  if(parent){
     let data= parent.split(',');
     if(data.length>0){
          returnData=[];
          for(let i=0;i<data.length;i++){
            returnData.push({
                 aliurl: data[i],
                 url:  data[i],
                 fail:'false',
            })
          }
     }
  }
   return  returnData
}

const queryURL = (name) => {
  let reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`, 'i')
  let r = window.location.search.substr(1).match(reg)
  if (r != null) return decodeURI(r[2])
  return null
}

/**
 * 数组内查询
 * @param   {array}      array
 * @param   {String}    id
 * @param   {String}    keyAlias
 * @return  {Array}
 */
const queryArray = (array, key, keyAlias = 'key') => {
  if (!(array instanceof Array)) {
    return null
  }
  const item = array.filter(_ => _[keyAlias] === key)
  if (item.length) {
    return item[0]
  }
  return null
}

/**
 * 数组格式转树状结构
 * @param   {array}     array
 * @param   {String}    id
 * @param   {String}    pid
 * @param   {String}    children
 * @return  {Array}
 */
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

const arrayToSelectTree = (array, id = 'id', pid = 'pid', children = 'children',name ='organizationName') => {
  let data = lodash.cloneDeep(array)
  let result = []
  let hash = {}
  data.forEach((item, index) => {
    let newItem={};
    newItem.key=item[id].toString()
    newItem.value=item[id].toString()
    newItem[id]=item[id].toString()
    newItem.label=item[name]
    if(item[pid]){
       newItem[pid]=item[pid].toString()
    }
    data[index]=newItem
    hash[data[index][id]] = data[index]
    return  item
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
const arrayToSelectTree3 = (array, id = 'id', pid = 'pid', children = 'children',name ='organizationName') => {
  let data = lodash.cloneDeep(array)
  let result = []
  let hash = {}
  data.forEach((item, index) => {
    item.key=item.id
    item.value=item.id
    item.label=item[name]
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


 const typelist_trans = (typelist,id,name,idname) => {  //id转相应的文字 查询列表,被查询的值，要返回的keyname 做比较的keyname(默认id)
   let arrs = typelist.filter(function(item) { 
      return  idname?(item[idname] ==  id):(item.id ==  id); 
   });
   return arrs[0]?arrs[0][name]: id;
 }
 
 const sitelist=[
   {
     name:'乾趣科技',
     id:'1',
     sitePid:0,
   },{
      name:'技术部',
      id:'1_1',
      sitePid:1,
   },{
      name:'商务部',
      id:'1_2',
      sitePid:1,
   },{
      name:'行政部',
      id:'1_3',
      sitePid:1,
   },{
      name:'人事部',
      id:'1_4',
      sitePid:1,
   },{
      name:'销售部',
      id:'1_5',
      sitePid:1,
   },{
      name:'财务部',
      id:'1_6',
      sitePid:1,
   },{
      name:'设计部',
      id:'1_7',
      sitePid:1,
   },{
      name:'项目部',
      id:'1_8',
      sitePid:1,
   },{
      name:'产品部',
      id:'1_9',
      sitePid:1,
   },{
      name:'法律部',
      id:'1_10',
      sitePid:1,
   },{
      name:'钱橙信息咨询',
      id:'2',
      sitePid:0,
   },{
      name:'西北分公司',
      id:'2_1',
      sitePid:2,
   },{
      name:'华东分公司',
      id:'2_2',
      sitePid:2,
   },{
      name:'西安分公司',
      id:'2_1_1',
      sitePid:'2_1',
   },{
      name:'宁波分公司',
      id:'2_2_1',
      sitePid:'2_2',
   }
 ]

  const  keyUpInner = (name,value,initIdCard) => {
    if(name==='idCard'){
      // var indexStart=isContains(value,this.state.initIdCard);
       if(initIdCard){
          return value.replace(/[^\d\x\X\*]/g,'')
       }else{
         return value.replace(/[^\d\x\X]/g,'')
       }
    }else{
       return value.replace(/[^\d]/g,'')
    }

  }
 const  isContains = (str, substr) => {
    return str.indexOf(substr);
} 

//转换提交类型
const changeSubmitType = (parData,name,type,formatType) =>{ 
   if(!parData){
     return
   }else{
     if(type=='int'){
       return parData[name]?parseInt(parData[name]):undefined
     }
     if(type=='format'){
        let formatType_S='YYYY-MM-DD HH:mm:ss'
        if(formatType){
          formatType_S=formatType
        }
       return parData[name]?parData[name].format(formatType_S):null
     }
     if(type=='data_s'){
        return parData[name]?parData[name].join(','):undefined
     }
     if(type=='s_data'){
        return parData[name]?parData[name].split(','):undefined
     }
   }
}

  const stencilText=(text)=>{
    let str='';
    if(text&&text.length>0){
      for(let i =0;i<text.length;i++){
          let NS = '';
            if(text[i]==1){
               NS = 'banner'
            }
            if(text[i]==2){
               NS = '置顶'
            } 
            if(text[i]==3){
               NS = '图文'
            } 
            if(text[i]==4){
               NS = '纯文字'
            } 
            if(text[i]==5){
               NS = '视频'
            }  
           if(i!=0){
             str+=','+NS 
           }else{
             str= NS 
           }
        }
    }
    return str
  }
const stencil_C_text  =(text)=>{
    let str=null;
    if(text==1){
       str = 'banner'
    }
    if(text==2){
       str = '置顶'
    } 
    if(text==3){
       str = '图文'
    } 
    if(text==4){
       str = '纯文字'
    } 
    if(text==5){
       str = '视频'
    }  
    return str
  }
//上传图片到阿里云  

  let current_checkpoint;


const progress = (p, checkpoint) => {
  return function (done) {
    current_checkpoint = checkpoint;
    console.log(p * 100+ '%')
    // var bar = document.getElementById('progress-bar');
    // bar.style.width = Math.floor(p * 100) + '%';
    // bar.innerHTML = Math.floor(p * 100) + '%';
    done();
  };
};
   const  uploadFile =  (file,client,key,index) => {
    
     if(!client){
         message.error("没有阿里上传的凭证,请先获取")
         return 
     }
     let uploadFileClient = client
     console.log(uploadFileClient)
      var options = {
        progress: progress,
        partSize: 100 * 1024,
        meta: {
          year: 2017,
          people: 'test'
        }
      }
      if (current_checkpoint) {
        options.checkpoint = current_checkpoint;
      }


      console.log(uploadFileClient)
       return new Promise((resolve, reject) => {
          const nowindex =index

          console.log(uploadFileClient)
          uploadFileClient.multipartUpload(key, file,options).then(res => {
            //console.log('upload success: %j', res);
            current_checkpoint = null;
            uploadFileClient = null;
            res.successIndex=nowindex;
            resolve(res);
          }).catch(err => {
            console.log(err)
             reject({error:'error',failIndex:nowindex})
            if (uploadFileClient && uploadFileClient.isCancel()) {
              message.error('stop-upload!');
            } else {
              message.error(err);
            }
            
          })
      })
      //   uploadFileClient.multipartUpload(key, file,options).then(function (res) {
      //   console.log('upload success: %j', res);
      //   current_checkpoint = null;
      //   uploadFileClient = null;
      // }).catch(function (err) {
      //   if (uploadFileClient && uploadFileClient.isCancel()) {
      //     message.error('stop-upload!');
      //   } else {
      //     message.error(err);
      //   }
      // });

}

   
 const detailExp = (item,path) => {
    let haddetail=false;
    let data=[];
    if(item.details){
       data=item.details.split(',')
    }
    if(data.length>0){
        for(let i=0;i<data.length;i++){
          let valpath=pathToRegexp(data[i]).exec(path);
          if(valpath){
            haddetail=true   
          }
       }
    }
  
   return   haddetail
 }

const compareUp = (property) => {
    return function(obj1,obj2){
              var value1 = obj1[property];
              var value2 = obj2[property];
              if (value1 < value2){
                return -1;
              }else if (value1 > value2){
                return 1;
              }else{
              return 0;
              }
         }
  
}
const compareDown  = (property) => {
    return function(obj1,obj2){
              var value1 = obj1[property];
              var value2 = obj2[property];
              if (value1 < value2){
                return 1;
              }else if (value1 > value2){
                return -1;
              }else{
                return 0;
              }
         }
  
}
module.exports = {
  config,
  request,
  color,
  classnames,
  queryURL,
  queryArray,
  arrayToTree,
  arrayToSelectTree,
  createTrees,
  createTreesMutiple,
  createTreesMutipleAuthority,
  createPersonMutiple,
  parentUrl,
  parentName,
  typelist_trans,
  findLinkEntities,findImageEntities,Link,Image,
  sitelist,
  keyUpInner,
  combinePP,
  equalCompearePar,
  equalCompeareParAll,
  stoData,
  equalCompeare,
  changeSubmitType,
  changeText,
  resumePic,
  stencilText,
  stencil_C_text,
  uploadFile,
  detailExp,
  compareUp,
  compareDown,
}
