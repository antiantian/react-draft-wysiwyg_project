/**
 * 
 * @authors zcy (1366969408@qq.com)
 * @date    2017-11-02 17:22:03
 * @version $Id$
 */
import queryString from 'query-string'
import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment';
import { Form, Input,Select, InputNumber, Radio, Modal, Cascader , Upload, Icon,Row, Col, Card,DatePicker} from 'antd'
import { convertToRaw } from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import draftToMarkdown from 'draftjs-to-markdown'
import {createTrees,parentUrl,createTreesMutiple,createPersonMutiple} from 'utils'
const FormItem = Form.Item
const Option = Select.Option;
const { TextArea } = Input;
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
}

const modal = ({
  publishItem = {},
  nowPurpose,
  onOk,
  sitelist,
  selectTree,
  editorContent,
  onEditorStateChange,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    setFields
  },
  ...modalProps
}) => {
  const handleOk = () => {
    validateFields((errors, fieldsValue) => {
      if (errors) {
        return
      }
      // 提交之前转换时间参数
      const data = {
        ...fieldsValue,
        "siteId": fieldsValue['siteId']?fieldsValue['siteId'].join(','):null,
        'releaseDate': fieldsValue['releaseDate'].format('YYYY-MM-DD HH:mm:ss'),
        'endDate': fieldsValue['endDate']?fieldsValue['endDate'].format('YYYY-MM-DD HH:mm:ss'):null,
      };
      onOk(data)
    })
  }
  const modalOpts = {
    ...modalProps,
    onOk: handleOk,
  }
  const emitEmpty = () => {

         setFields({
              siteUrl: {
                value:''
              },
         });
         changeItmeP(null)

  }
  const getTims = (name) => {
    let fields = getFieldsValue();
    return fields[name]?fields[name]:null
  }
  const disabledStartDate = (startValue) => {
    const endValue = getTims("endDate");
    if (!startValue || !endValue) {
      return false;
    }
    return startValue.valueOf() > endValue.valueOf();
  }
  const disabledEndDate = (endValue) => {
    const startValue = getTims("releaseDate");
    if (!endValue || !startValue) {
      return false;
    }
    return endValue.valueOf() <= startValue.valueOf();
  }
  const getTreeMess = (item) =>{
    const nowId=item.id;
    const nowUrl=item.siteUrl
    const combineUrl=nowUrl;//parentUrl(nowId,sitelist); //拼接url
    let hadUrl = getTims("siteUrl")
    let  urlArr = [];
     if(hadUrl&&hadUrl.length>0){
        urlArr = hadUrl.split(',') 
     }   
     // 判断之前是否存在id
      let had =  getTims("siteId")||[];
      var typeL= Object.prototype.toString.call(had);
      if(typeL =='[object String]'){
           had = had.split(',')
      }
      if(typeL =='[object Number]'){
          had = [had]
      }
     if(had.includes(nowId)){ 
        had = had.filter(item=>{
         return item != nowId
        })   
        urlArr = urlArr.filter(item=>{
         return item != combineUrl
        }) 
     }else{
       had.push(nowId);
       urlArr.push(combineUrl)
     }
     //publishItem.siteId = had
    // item.sitePid=nowId;
    setFields({
      siteId: {
        value:had
      },
      siteUrl:{
        value:urlArr.length>0?urlArr.join(','):null
      }
    });
   // changeItmeP(nowId) 
  }
   const changeItmeP = (id) =>{
      let nowId = id;
      let had = publishItem.siteId||[];
    
      var typeL= Object.prototype.toString.call(had);
      if(typeL =='[object String]'){
           had = had.split(',')
      }
      if(typeL =='[object Number]'){
          had = [had]
      }
     if(had.includes(nowId)){ 
       had = had.filter(item=>{
         return item != nowId
       })   
     }else{
       had.push(id);
     }
     publishItem.siteId   = had
  }
  //站点多选
  let initSiteId =  getTims("siteId")||[];
  let typeL= Object.prototype.toString.call(initSiteId);
  if(typeL =='[object String]'){
       initSiteId = initSiteId.split(',')
  }
  if(typeL =='[object Number]'){
      initSiteId = [initSiteId]
  }
  let limitId = [];
  if(sitelist&&nowPurpose&&nowPurpose!=3){
     sitelist.map(item=>
     {
         if(item.purpose!=nowPurpose&&item.purpose!=3){  //3tongyong 
              limitId.push(item.id) 
         }
     })   
  }
 
  const suffix = publishItem.siteUrl ? <Icon type="close-circle" style={{right:'20px'}} onClick={emitEmpty} /> : null;
  let treeElement=selectTree?createTreesMutiple(
     selectTree,
     initSiteId,
     limitId,
     getTreeMess):null;
  return (
    <Modal {...modalOpts}>
      <Form layout="horizontal">
        <FormItem label="发布id" hasFeedback {...formItemLayout}>
          {getFieldDecorator('resourceId', {
            initialValue: publishItem.publishId,
            rules: [
              {
                required: true 
              },
            ],
          })(<Input disabled={true} />)}
        </FormItem>
        <FormItem label="发布站点URL" hasFeedback {...formItemLayout}>
          {getFieldDecorator('siteUrl', {
            initialValue: publishItem.siteUrl,  
            rules: [
              {
                required: true 
              },
            ],
          })(<TextArea disabled={true} />)}
        </FormItem>
        <FormItem label="站点URL" hasFeedback {...formItemLayout}>
          {getFieldDecorator('siteId', {
            initialValue: publishItem.siteId?publishItem.siteId.toString():null,
            rules: [
              {
                required: true, message: '请选择站点URL!' 
              },
            ],
          })(<Input placeholder='请选择站点URL!'  disabled={true}/>)}
        </FormItem>
        <Row style={{marginBottom:'24px'}}>
          <Col span={6}></Col>
          <Col span={14}>{treeElement}</Col>
        </Row>
        <FormItem label="发布时间" hasFeedback {...formItemLayout}>
          {getFieldDecorator('releaseDate', {
            initialValue:publishItem.releaseDate?moment(publishItem.releaseDate,"YYYY-MM-DD HH:mm:ss"):null,
            rules: [
              {
                required: true, message: '请选择发布时间!' 
              },
            ],
          })( <DatePicker 
                 format={"YYYY-MM-DD HH:mm:ss"}
                 showTime
                 disabledDate={disabledStartDate}
                 placeholder="Start"
                 style={{width:"100%"}}
              />)}
        </FormItem>
        <FormItem label="结束时间" hasFeedback {...formItemLayout}>
          {getFieldDecorator('endDate', {
            initialValue:publishItem.endDate?moment(publishItem.endDate,"YYYY-MM-DD HH:mm:ss"):null,
            rules: [
              {
                required: false,
              },
            ],
          })( <DatePicker 
                   disabledDate={disabledEndDate}
                   format="YYYY-MM-DD HH:mm:ss"
                   showTime
                   placeholder="End"
                   style={{width:"100%"}}
              />)}
        </FormItem>
      </Form>
    </Modal>
  )
}   
const textareaStyle = {
      minHeight: 496,
      width: '100%',
      background: '#f7f7f7',
      borderColor: '#F1F1F1',
      padding: '16px 8px',
    }
modal.propTypes = {
  form: PropTypes.object.isRequired,
  onOk: PropTypes.func,
}

export default Form.create()(modal)
