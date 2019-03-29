/**
 * 
 * @authors zcy (1366969408@qq.com)
 * @date    2017-11-09 15:52:26
 * @version $Id$
 */

import moment from 'moment';
function finishDate(text){
  return text?moment(text).format('YYYY-MM-DD HH:mm:ss'):text;
}
 
//是否启用
function Open_disable(text){
  if(text==0){
    return '开启';
  }
  if(text==1){
    return '禁用';
  }
}
//收款账户类型
function CollectionAccountType(text){
  if(text==0){
    return '个人';
  }
  if(text==1){
    return '公户';
  }
}
//转换内容
function accountExs(record,parent,child){
 if(record[parent]){
     if(child==='accountType'){
        return CollectionAccountType(record[parent][child])
     }else{
        return record[parent][child] 
     }
    
 }else{
   return '-'
 }
}
function trim(s){
    return s.replace(/(^\s*)|(\s*$)/g, "");
}
//属性传递判断 是否含有mess  以及mess的下一级
function messParams(mess,params,defauleVal){
   var defaultValue=defauleVal?(defauleVal=='arr'?[]:defauleVal=='null'?null:defauleVal=='obj'?{}:defauleVal):'';
   var text = mess?mess[params]:defaultValue;
   return text;
}
function messChildParams(mess,child,params,defauleVal){
   var defaultValue=defauleVal?(defauleVal=='arr'?[]:defauleVal=='null'?null:defauleVal=='obj'?{}:defauleVal):'';
   var text = mess?(mess[child]?mess[child][params]:defaultValue):defaultValue;
   return text;
}
function addEditParams(pathname,isAdd,stateArray,record){
      let stateArr=stateArray;
      let stateObj={};
      if(stateArray&&stateArray.length>0){
        for(let i=0;i<stateArr.length;i++){
          let keys=stateArr[i];
          stateObj[keys]=this.state[keys];
        }
        stateObj=(JSON.stringify(stateObj))
      }else{
        stateObj=null
      } 
      hashHistory.push({
           pathname:pathname,
           state:{
            mess:record?record:null,
            listMess:stateObj,
            isAdd:isAdd,
            buttonState:this.props.location.state.buttonState,
          }
        })
}
//黑白按钮列表控制组
function authorityControl(){
  let arr=[
      {
        text:'导出',
        name:'hideExportButton'
      },
      {
        text:'编辑',
        name:'hideEditButton'
      },
      {
        text:'添加',
        name:'hideAddButton'
      },
      {
        text:'删除',
        name:'hideDeleteButton'
      },
      {
        text:'重置密码',
        name:'hideChangePwdButton'
      },
      {
        text:'重置密钥',
        name:'hideChangeKeyButton'
      }
     ];
     if(this.props.location.state&&this.props.location.state.buttonState){
         const buttonnameList=this.props.location.state.buttonState.split(',');
         let newarr=[];//最后获得的数组是要隐藏的按钮组
         if(localStorage.authorityType&&localStorage.authorityType==="white"){
             //白名单 把存在的都去掉
              for(let i=0;i<arr.length;i++){
                  let names=arr[i].text;
                  let had=false;
                  for(let j=0;j<buttonnameList.length;j++){
                        if(buttonnameList[j]===names){
                             had=true;
                             break; 
                        }
                  }
                  if(!had){
                      newarr.push(arr[i].name)
                  }
              } 
               
         }else if(localStorage.authorityType&&localStorage.authorityType==="black"){
            //黑名单  不存在的都去掉 只有存在的才添加到数组
              for(let i=0;i<buttonnameList.length;i++){
                  let names=buttonnameList[i];
                  for(let j=0;j<arr.length;j++){
                        if(arr[j].text===names){
                             newarr.push(arr[i].name)
                             break; 
                        }
                  }
              } 
         }
         console.log(newarr)
         //最后留下的则是不显示的按钮组 给相关的state值赋值 
         //不存在黑白名单则 数组为空 不隐藏默认存在的按钮
         if(newarr.length>0){
              for(let i=0;i<newarr.length;i++){
                let names=newarr[i];
                this.setState({
                      [names]:true 
                })
             }  
         }
     }
}
//初始化state状态
function initListState(listfn,stateArray){
      this.authorityControl2=authorityControl;
      this.authorityControl2(); //绑定this
      var listMess=this.props.location.state?this.props.location.state.listMess:null;
      if(listMess&&stateArray&&stateArray.length>0){
         var listPre=JSON.parse(listMess);
         for(let i=0;i<stateArray.length;i++){
                let keys=stateArray[i];
                this.setState({
                   [keys]:listPre[keys]
                },()=>{
                    if(i===stateArray.length-1){
                      listfn();
                    }
                })
         }
      }else{
        listfn();
      }
}
function returnAddEdit(pathname){
  hashHistory.push({
    pathname:pathname,
    state:{
      listMess:this.props.location.state?this.props.location.state.listMess:null,
      buttonState:this.props.location.state?this.props.location.state.buttonState:null,
    }
  })
}
function yesOno(text){
  if(text==true){
    return '是';
  }
  if(text==false){
    return '否';
  }
   
} 
function changeCodeName(text,channelCodeName,codename){
    var arr=channelCodeName;
    var codename=codename||'channelCode';
    var names=text;
    for(let i=0;i<arr.length;i++){
       if(arr[i][codename]===text){
            names=arr[i].name;
            //alert(names)
            break;
       }
    }
    return names;
}
//验证手机号  身份证 银行卡
function  blurValidate(name,value){
      let  results={};
      let type='';
      if(name=='idCard'){
         type='idcard';  
      }else if(name=='phone'||name=='cardMobile'){
        type='phone';  
      }else if(name=='bankCard'){ 
        type='banknum';  
      }
      results= ValidateCards({type:type,con:trim(value),initIdCard:this.state.initIdCard});  
      if(!results.next){
           this.setState({
               [name+'_class']:'inputErrors',
               [name+'_mess']:results.message
           })
       }else{
           this.setState({
               [name+'_class']:'',
               [name+'_mess']:''
           })
       }
  }
 function keyUpInner(name,value){
    if(name==='idCard'){
       var indexStart=isContains(value,this.state.initIdCard);
       if(this.state.initIdCard){
         //  var pre=value.slice(0,indexStart);
         //  var nexts=value.slice(this.state.initIdCard.length+indexStart);
         //  this.setState({
         //    [name]:pre.replace(/[^\d\x\X]/g,'')+this.state.initIdCard+nexts.replace(/[^\d\x\X]/g,'')
         // })
         this.setState({
           [name]:value.replace(/[^\d\x\X\*]/g,'')
         })
       }else{
         this.setState({
           [name]:value.replace(/[^\d\x\X]/g,'')
         })
       }
    }else{
       this.setState({
          [name]:value.replace(/[^\d]/g,'')
        })
    }

  }
 function isContains(str, substr) {
    return str.indexOf(substr);
}  
function changeDate(text){
  if(text){
    var arr=text.toString();
    return arr.substr(0,4)+"-"+arr.substr(4,2)+"-"+arr.substr(6,2)
  }else{
    return text
  }
  
}
const styleArr = [
  { label: '普通样式', value: 'general' },
  { label: '卡片', value: 'card' }
]
const reStyle = {
  'general':'普通样式',
  'card':'卡片'
}

export{
  keyUpInner,
  blurValidate,
  finishDate,
  Open_disable,
  CollectionAccountType,
  accountExs,
  trim,
  messParams,
  messChildParams,
  addEditParams,
  initListState,
  returnAddEdit,
  yesOno,
  changeCodeName,
  changeDate,
  styleArr,
  reStyle,
} 

