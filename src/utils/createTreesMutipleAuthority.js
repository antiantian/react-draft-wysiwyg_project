/**
 * 
 * @authors zcy (1366969408@qq.com)
 * @date    2017-11-14 09:41:58
 * @version $Id$
 */
import React,{Component} from 'react';
import {Icon} from 'antd'
import lodash from 'lodash'
import {equalCompeareParAll } from './commonPersonPart'


class IconExpand extends Component{
  constructor(props){
    super(props);
    this.state={
        expand:this.props.expand||false,
        show:this.props.show||false
    }
  }
  getPar = (tar,name) =>{
    if(!tar){
       return
    }
    if(tar.className&&tar.className.match(name)){
        return  tar
    }else{
       var par=tar.parentNode;
       return this.getPar(par,name)
    }
  }
  expands = (e)=>{ 
      e.stopPropagation();
      // 阻止合成事件  onclick 绑定 
      //e.nativeEvent.stopImmediatePropagation()  //阻止源生dom  document.body.addEventListener
      // https://zhuanlan.zhihu.com/p/26742034
      var tar=e.target;
      if(!tar.className.match("expand")&&this.getPar(tar,"title")){   //点击 如果点击目标元素 没有expand类名 父级没有exp_child类名（表示有子集） 则不继续执行
        var str=this.getPar(tar,"title").className;
        if(!str.match("exp_child")){
           return
        }
      }
      var par=this.getPar(tar,"expandChild");
      if(!tar.className.match("expand")){   //如果点击目标元素 没有expand类名（代表不是扩展收缩按钮） 点击只展开  不收缩 
          if(par.className=="expandChild"){
            par.className="expandChild on"
            this.setState({
              show:true
          })
         }
      }else{                                //如果点击目标元素 有expand类名（代表 是扩展收缩按钮） 点击展开/收缩
          if(par.className=="expandChild"){
             par.className="expandChild on"
          }else{
            par.className="expandChild"
          }
          this.setState({
              show:!this.state.show
          })
      }  
  }
  render(){
     const {expand,show} = this.state ;
     let expandClass=show?"expand anticon anticon-down-circle-o":"expand anticon anticon-right-circle-o";   
     return(
        <div className={expand?this.props.show?'expandChild on':'expandChild':''}  onClick={expand?this.expands:null}>
             {
               expand&&<span className={expandClass}
                   
               ></span> 
             }
             {this.props.children}
        </div>
     )
   }
 } 
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
     cdata.push(data)
    }
    if(typeL==='[object Array]'){
      cdata=data
    }
   //以上功能  转成数组
   var had=cdata.includes(id);
   return had
}
 // 递归生成树状图 (createTrees(selectTree))
    const createTrees = (menuTreeN,idselect,selfID,getTreeMess,option) => { //生成树 ，父级id , 自身id , 方法名称
       const id=(option&&option.id)?option.id:'id';
       const siteName=(option&&option.siteName)?option.siteName:'siteName'; 
       const sitePid=(option&&option.sitePid)?option.sitePid:'sitePid';
       const expand =(option&&option.expand)?option.expand:false;     //是否带有扩展收缩按钮
       const expandAll= (option&&option.expandAll)?option.expandAll:false; //是否全部展开
       const parentAll = (option&&option.parentAll)?option.parentAll:false; //是否选中全部子集
       const trees = menuTreeN.map((item) => {
            
            let titleId=equalCompeare(idselect,item[id])?"title selected":"title"
            if(expand){
               titleId+=" exp"
               if(item.children){
                  titleId+=" exp_child"
               }
            }
 

            const iconsel = () => {
                if(equalCompeare(idselect,item[id])){
                   return <Icon type="check-circle-o" />
                 }else{
                   return <Icon type="check-circle" />
                 }
               
            }
            const parsel = () => {
                 let iconKey=equalCompeareParAll(idselect,item);
                 if(iconKey&&iconKey.key=='all'){
                   return <Icon type="check-circle-o" /> 
                 }else if(iconKey&&iconKey.key=='half'){
                   return <Icon type="minus-circle-o" />
                 }else{
                   return <Icon type="check-circle" />
                 }
               
            }

            if(item[id]!==selfID){
                if (item.children) {
                    let newOption =lodash.cloneDeep(option);
                    newOption.ispersonchildren=true;
                    newOption.parname=item[siteName];
                    newOption.parentItem=item;  
                    if(option.ispersonchildren){
                        item.parname=option.parname;
                        item.parentItem=option.parentItem;
                    }
                   return (
                       <div className="Tree" key={item[id]}>
                            <IconExpand expand={expand} show={expandAll}>
                              <p className={titleId}>
                                <span className="innerTitle" 
                                      onClick={()=>getTreeMess(item)}
                                >
                                  {parsel()}
                                  {item[siteName]} {/*{item[sitePid]}-{item[id]}*/}
                                </span>
                              </p>
                              <div className="TreeMore">{createTrees(item.children,idselect,selfID,getTreeMess,newOption)}</div>
                           </IconExpand> 
                            
                         </div>
                   )
                }else{
                     if(option.ispersonchildren){
                          item.parname=option.parname;
                          item.parentItem=option.parentItem;
                      }
                       return (<div className="Tree" key={item[id]}>
                                 <p className={titleId}>
                                   <span className="innerTitle" 
                                        onClick={()=>getTreeMess(item)}
                                   >
                                      {iconsel()}
                                      {item[siteName]} {/*{item[sitePid]}-{item[id]}*/}
                                   </span>
                                 </p>
                              </div>
                       )  
                }
           }
       })
       return trees
    }
   module.exports = createTrees 