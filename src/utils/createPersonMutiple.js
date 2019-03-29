/**
 * 
 * @authors zcy (1366969408@qq.com)
 * @date    2017-11-14 09:41:58
 * @version $Id$
 */
import React,{Component} from 'react';
import {equalCompearePar,stoData,equalCompeare} from './commonPersonPart'
import {Icon} from 'antd'
import lodash from 'lodash'
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

 // 递归生成树状图 (createTrees(selectTree))
    const createTrees = (menuTreeN,idselect,selfID,getTreeMess,option) => { //生成树 ，父级id , 自身id , 方法名称
       const id=(option&&option.id)?option.id:'id';
       const siteName=(option&&option.siteName)?option.siteName:'siteName'; 
       const personName=(option&&option.personName)?option.personName:'userRealname'; 
       const sitePid=(option&&option.sitePid)?option.sitePid:'sitePid';
       const expand =(option&&option.expand)?option.expand:false;     //是否带有扩展收缩按钮
       const expandAll= (option&&option.expandAll)?option.expandAll:false; //是否全部展开
       const partIDs=(option&&option.partIDs)?option.partIDs:null; //选中的部门集合    //idselect 选中的人员名称集合
 
       const trees = menuTreeN.map((item) => {
       const person_getTreeMess = (option&&option.person_getTreeMess)?option.person_getTreeMess:getTreeMess;  
            let titleId=equalCompearePar(idselect,item,null,id)?"title selected":"title"  //选中的部门  
            let personId=equalCompeare(idselect,item[id])?"title selected":"title"   //选中的  人员名称
            if(expand){
               titleId+=" exp"
               personId+=" exp"
               if(item.children||item.personchildren){  //如果有子集 children 或  personchildren  添加 exp_child类  为了点击扩展的实现
                  titleId+=" exp_child"
               }
            }
      
            const iconsel = () => {
                if(equalCompeare(idselect,item[id])){
                   return <Icon type="user-add" />
                 }else{
                   return <Icon type="user-add" />
                 }
               
            }
            const parsel = () => {
                 if(equalCompearePar(idselect,item,selfID,id)=='all'){
                   return <Icon type="check-circle-o" /> 
                 }else if(equalCompearePar(idselect,item,selfID,id)=='half'){
                   return <Icon type="minus-circle-o" />
                 }else{
                   return <Icon type="check-circle" />
                 }
               
            }
            const parsel_no =  equalCompearePar(selfID,item,null,id)=='all'?true:false;
            const person_no =  selfID.includes(item[id])?true:false;
            const parent_title =parsel_no?'innerTitle noedit':'innerTitle canedit'
            const person_title =person_no?'innerTitle noedit':'innerTitle canedit' 
            //console.log(selfID)

                if (item.children) {
                    let newOption =lodash.cloneDeep(option);
                    if(item.personchildren){
                             
                             newOption.ispersonchildren=true;
                             newOption.parname=item[siteName];
                             newOption.parId=item[id];
                    }               
                   return (<div className="Tree" key={item[id]}>
                            <IconExpand expand={expand} show={expandAll}>
                              <p className={titleId}>
                                <span className="innerTitle" 
                                      onClick={()=>getTreeMess(item)}
                                >
                                  {parsel()}
                                  {item[siteName]} {/*{item[sitePid]}-{item[id]}*/}
                                </span>
                              </p>
                              {item.personchildren&&
                                   <div className="TreeMore">{createTrees(item.personchildren,idselect,selfID,person_getTreeMess,newOption)}</div>
                              }
                              <div className="TreeMore">{createTrees(item.children,idselect,selfID,getTreeMess,option)}</div>
                           </IconExpand> 
                            
                         </div>
                   )
                }

                if(item.personchildren){
                    let newOption =lodash.cloneDeep(option);
                    newOption.ispersonchildren=true;
                    newOption.parname=item[siteName];
                    newOption.parId=item[id];

                    return (<div className="Tree" key={item[id]}>
                              <IconExpand expand={expand} show={expandAll}>
                                <p className={titleId}>
                                  <span className={parent_title} 
                                        onClick={()=>{
                                          if(!parsel_no){
                                             getTreeMess(item)
                                          }
                                            
                                        }}
                                  >
                                    {parsel()}
                                    {item[siteName]} {/*{item[sitePid]}-{item[id]}*/}
                                  </span>
                                </p>
                                <div className="TreeMore">{createTrees(item.personchildren,idselect,selfID,person_getTreeMess,newOption)}</div>
                             </IconExpand> 
                              
                           </div>
                     )
                }
                if(option.ispersonchildren){
                      item.parname=option.parname;
                      item.parId=option.parId;
                      return (
                           <div className="Tree" key={item[id]}>
                               <p className={personId}>
                                 <span className={person_title} 
                                      onClick={()=>{
                                        if(!person_no){
                                           getTreeMess(item)
                                        }
                                      }}
                                 >
                                    {iconsel()}
                                   {item[personName]} {/*{item[sitePid]}-{item[id]}*/}
                                 </span>
                               </p>
                            </div>
                     )
                }else{
                   return (<div className="Tree" key={item[id]}>
                             <p className={titleId}>
                               <span className="innerTitle" 
                                    onClick={()=>getTreeMess(item)}
                               >
                                  {parsel()}
                                  {item[siteName]} {/*{item[sitePid]}-{item[id]}*/}
                               </span>
                             </p>
                          </div>
                   )
                }

       })
       return trees
    }
   module.exports = createTrees 