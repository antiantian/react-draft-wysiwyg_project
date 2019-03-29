/**
 * 
 * @authors zcy (1366969408@qq.com)
 * @date    2018-09-05 16:14:07
 * @version $Id$
 */

import React, { Component } from 'react';
import { Form,Row, Col,Input,Button,Radio,Checkbox,Switch,message,Icon} from 'antd';
import Resource_Modal  from './resource_Modal'
import flow from 'lodash/flow';
import { connect } from 'dva'
const { TextArea } = Input;
const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const textList=["privateKey","publicKey","dataKey","signKey"];
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
}
class CreatePay extends Component{
  state = {
    check_default:true,
    name:'', //conde 与费率主键现在相同
    open:true,
    validate:true,
    changeVal:false,//点击保存按钮
    default_OBJ:this.props.default_OBJ,
    defaultList:{},
    sourceListVisible:false,// 文章弹框
    selectedRowKeys:this.props.item.select?this.props.item.select.releaseId.split(','):null,
    selectedRows:this.props.item.select?this.props.item.select.content:null,
    title:this.props.item.select?this.props.item.select.title:null,
    itemN:this.props.item||{}
  }
 
  componentDidMount(){
 
     console.log(this.props.item)
  }
 
  componentWillReceiveProps(nextProps) {
    console.log(nextProps)
        if ('item' in nextProps && nextProps.item) {
            const item = nextProps.item
            if(this.state.itemN.name!==item.name){
                    this.props.form.resetFields()
                     this.setState({
                            selectedRowKeys:item.select&&item.select.releaseId&&item.select.releaseId.length>0?item.select.releaseId.split(','):null,
                      selectedRows:item.select?item.select.content:null,
                      title:item.select?item.select.title:null,
                      itemN:item
                     });
            }
           
        }
        if(this.state.validate){
          
          if('false'===nextProps.datasValidate){
            this.setState({
               open:true,
               validate:false,
               changeVal:true
           })

           this.changes()

            return false;
          }
        }      
        /*当formData.timeFlag-1，代表不限时段，日期组件即将不可用，1是限时段日期组件可以选用*/
    }
   changes=()=>{
      this.props.form.validateFields((errors) => {
        if (errors) {
          // message.error('请填写必填信息');
          return
        }
      })
     this.props.changeValidate(this.props.innerItem)
     this.setState({
      validate:true
     })
     return false
   }
  keyUp=(e)=>{
    if(this.returnNum(e.target.name)){
       this.setState({
          [e.target.name]:e.target.value.replace(/[^\d\.]/g,'')
        })
    }else{
       this.setState({
          [e.target.name]:e.target.value
        })
    }  
  }
 
    trim = (s) => {
    return s.replace(/(^\s*)|(\s*$)/g, "");
}
 
 addAsset = () =>{
   //搜索  文章资源列表 
   const {cms_special,dispatch}  =this.props;
   const {resourcepagination,resource_pageNo,resource_pageSize} =cms_special
   dispatch({
            type: 'cms_special/updateState',
            payload: {
                selectedRowKeys: this.state.selectedRowKeys||[],  
               selectedRows: this.state.selectedRows||[],   
            },
    })
   dispatch({
            type: 'cms_special/resourcelist',
            payload: {
               pageSize:10,
               pageNo:1
            },
    })
    this.setState({
       sourceListVisible:true
    })
 }
 delChapter = ( ) => {
  console.log(this.props.item)

      this.props.changeParVal({},this.props.item.name,true)  //obj,names,del
   //  this.props.delChapter(this.props.item)
     console.log(this.props.cms_special.releaseds) 
 } 
 setFilter = (name,key) => {
     this.props.form.setFields({
              [name]: {
                value:key
              },
      });
  
 } 

 normtitle = (e) => {
     var value=(e.target.value)
     if(value){
      let newT = value
        if(value.length>0){
          newT =  trim(value)
        }else{
          newT =  null   
        }
        let obj={
       title:newT,
       releaseId:this.state.selectedRowKeys?this.state.selectedRowKeys.join(','):this.state.selectedRowKeys,
       content:this.state.selectedRows
     }
     this.props.changeParVal(obj,this.props.item.name)  //obj,names,del
         return newT
     }
 }
add_Data = () =>{
   //增加选中的文章
 const {cms_special,dispatch}  =this.props;
   const {selectedRowKeys,selectedRows} = cms_special
    this.setFilter("releaseId",selectedRowKeys.join(','))
    let self = this;
   this.setState({
     selectedRowKeys,
     selectedRows
   },()=>{
     let obj={
      title:this.props.form.getFieldsValue().title,
       releaseId:selectedRowKeys.join(','),
       content:selectedRows
     }
     this.props.changeParVal(obj,this.props.item.name)  //obj,names,del
     this.clear_Data()
   })
  console.log( cms_special.releaseds) 
}
clear_Data = () =>{
   this.props.dispatch({
        type: 'cms_special/updateState',
        payload: {
          selectedRowKeys: null,  
          selectedRows: null,
          resource_pageNo:1,
            resource_pageSize:10,
            resourcelist:[]
        },
      })
     this.setState({
         sourceListVisible:false
      })
}
delRow = (item) =>{
  //删除某篇文章
     
     let pid = item.id;
     let selectedRowKeys = this.state.selectedRowKeys.filter(item=>{
          return item!=pid
     })
    let selectedRows = this.state.selectedRows.filter(item=>{
          return item.id!=pid
     })
    this.setState({
       selectedRowKeys,
       selectedRows
    },()=>{
       //修改上一级的 
       let obj={
       title:this.props.form.getFieldsValue().title,
       releaseId:selectedRowKeys?selectedRowKeys.join(','):selectedRowKeys,
       content:selectedRows
     }
     this.props.changeParVal(obj,this.props.item.name)  //obj,names,del
     //修改  releaseId  
     this.setFilter("releaseId",selectedRowKeys?selectedRowKeys.join(','):selectedRowKeys)
    })
}
  AA =(getFieldDecorator)=>{
    var string=[];
    let arr=[];
     var objd=[{name:'title',mess:'请填写小节标题'},{name:'releaseId',mess:'请选择关联文章'}];
     var obj=this.state.itemN.select?this.state.itemN.select:{title:null,releaseId:null}

     for(var m in obj){
           if(m=="releaseId"){
                 string.push(
                     <FormItem hasFeedback  {...formItemLayout} key={m} >
                      {getFieldDecorator(m, {
                        initialValue:obj[m],
                        rules: [
                          {
                            required: true,
                            message:'请选择关联文章'
                          },
                        ],
                      })(<Input disabled={true} placeholder="请选择关联文章"/>)}
                    </FormItem> 
                  )
                  arr.push(2)
              } 
              if(m=="title"){
                  string.push(
                     <FormItem hasFeedback {...formItemLayout} key={m} >
                      {getFieldDecorator(m, {
                        initialValue:obj[m],
                        getValueFromEvent:this.normtitle,
                        rules: [
                          {
                            required: true,
                            message:'请填写小节标题' 
                          },
                        ],
                      })(<Input disabled={false} placeholder="请填写小节标题"/>)}
                    </FormItem>
                  )  
              }    
     }
     return <Form className="zChannel_wrap">
                 {string}
              </Form> 
   }  
   render(){
    
      const { getFieldDecorator} = this.props.form;
      const {chanConfigs,disabled,delF,modalProps,cms_special,dispatch} =this.props;
      const item = this.props.item||{ };

      modalProps.visible=this.state.sourceListVisible
      //memus.push.apply(memus,audit);
      let self= this;
      let newModal = {...modalProps,
        visible:this.state.sourceListVisible,
        chapterItem:item,
        onOk (data) {
            self.add_Data(data)
        },

        onCancel () {
           self.clear_Data()
        },
       }
       let plist =this.state.selectedRows? this.state.selectedRows.map((item,index)=>{
           return <p 
                style={{lineHeight:1.75,paddingBottom:10}}
                key={index}><span style={{display:'inline-block',float:'right'}} onClick={()=>{this.delRow(item)}}><Icon type="minus-circle" /></span>{item.title} </p>
       }):null
         return(
               <div className="zChannel_parent" >
                  <Row gutter={24}>
                       <Col style={{lineHeight:'32px'}} span={6}>
                       </Col>
                        <Col style={{border:'1px solid #dfdfdf',padding:20,position:'relative',marginBottom:24}} span={14}>
                           {delF&&
                            <span style={{position:'absolute',zIndex:2,right:10,top:10,cursor:'pointer',display:'inline-block'}} onClick={this.delChapter} >
                              <Icon type="minus-circle" />删除
                            </span>
                           } 
                           {this.AA(getFieldDecorator)}
                           <div> {plist} </div>
                          <Button  onClick={this.addAsset} >增加文章</Button>
                        </Col>
                   </Row>   
                   {this.state.sourceListVisible && <Resource_Modal {... newModal}/>        }  
              </div>     
          )
}
     
}
 
 
class NewInput extends Component{
   render(){
      const isTextArea=TextAreaIS(this.props.name);
      if(isTextArea){
          return(
            <TextArea {...this.props} />
          )
      }else{
         return(
            <Input {...this.props}/>
          )
      }
      
   }
}
function TextAreaIS(name){
     const list=textList;
     let had=false;
     for(let i=0;i<list.length;i++){
        if(name===list[i]){
          had=true;
          break;
        }
    }
    return had;
}
 
function trim(s){
    return s.replace(/(^\s*)|(\s*$)/g, "");
}

export default flow(
  connect(({ cms_special,loading }) => ({ cms_special, loading })),
  Form.create({
  //将属性传递到组件中
  mapPropsToFields(props) {
    return {
      props: props.formState,
    };
  }
}),
)(CreatePay);