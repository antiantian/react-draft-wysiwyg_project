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
import { Form, Input,Select, InputNumber, Radio, Modal , Upload, Icon,Row, Col, Card,DatePicker} from 'antd'
import { convertToRaw } from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import draftToMarkdown from 'draftjs-to-markdown'
import {createTrees,parentUrl,createTreesMutiple} from 'utils'
import {finishDate,trim} from 'commonfun'
const FormItem = Form.Item
const RadioGroup = Radio.Group;
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
  onOk,
  editorContent,
  onEditorStateChange,
  selectTree,
  sitelist,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    setFields,
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
    // const nowId=item.id;
    // const nowUrl=item.siteUrl
    // const combineUrl=parentUrl(nowId,sitelist); //拼接url

    // // item.sitePid=nowId;
    // setFields({
    //   siteId: {
    //     value:nowId
    //   },
    //   siteUrl:{
    //     value:nowUrl
    //   }
    // });
    // changeItmeP(nowId) 
    const nowId=item.id;
    const nowUrl=item.siteUrl
    const combineUrl=nowUrl//parentUrl(nowId,sitelist); //拼接url

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
       had=had.map(item=>{
          return parseInt(item)     
      })
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
    publishItem.siteId = had
  }
   const changeItmeP = (id) =>{
     publishItem.siteId=id;
  }
  //站点多选
  let initSiteId =  publishItem.siteId||[];
  let typeL= Object.prototype.toString.call(initSiteId);
  if(typeL =='[object String]'){
       initSiteId = initSiteId.split(',')
  }
  if(typeL =='[object Number]'){
      initSiteId = [initSiteId]
  }
  initSiteId=initSiteId.map(item=>{
      return parseInt(item)     
  })
 let limitId = [];
 const nowPurpose = publishItem&&publishItem.resource?publishItem.resource.purpose:null;
  if(sitelist&&nowPurpose&&nowPurpose!=3){
     sitelist.map(item=>
     {
         if(item.purpose!=nowPurpose&&item.purpose!=3){  //3tongyong 
              limitId.push(item.id) 
         }
     })   
  }
  const validateDates=(e)=>{
    let value = e.target.value;
     return value.replace(/[^\d]/g,'')
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
          {getFieldDecorator('id', {
            initialValue: publishItem.id,
            rules: [
              {
                required: true, message: 'Please select your country!' 
              },
            ],
          })(
            <Input disabled={true} />
          )}
        </FormItem>
         {/*
        <FormItem label="发布资源id" hasFeedback {...formItemLayout}>
          {getFieldDecorator('resourceId', {
            initialValue: publishItem.resourceId,
            rules: [
              {
                required: true, message: 'Please select your country!' 
              },
            ],
          })(
            <Input  disabled={true}/>
          )}
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
            initialValue: publishItem.siteId,
            rules: [
              {
                required: true, message: '请选择站点URL!' 
              },
            ],
          })(<Input placeholder='请选择站点URL!'  disabled={true}/>)}
        </FormItem>
        <Row style={{marginBottom:'24px'}}>
          <Col span={6}><div style={{fontSize:12,textAlign:'right'}}><span style={{color:'#f04134'}}>*</span>请选择站点URL：</div></Col>
          <Col span={14}>{treeElement}</Col>
        </Row>
        */}
        <FormItem label="发布时间" hasFeedback {...formItemLayout}>
          {getFieldDecorator('releaseDate', {
            initialValue:publishItem.releaseDate?moment(finishDate(publishItem.releaseDate),"YYYY-MM-DD HH:mm:ss"):null,
            rules: [
              {
                required: true,  
              },
            ],
          })( <DatePicker 
                 format={"YYYY-MM-DD HH:mm:ss"}
                 disabledDate={disabledStartDate}
                 showTime
                 placeholder="Start"
                 style={{width:"100%"}}
              />)}
        </FormItem>
        <FormItem label="结束时间" hasFeedback {...formItemLayout}>
          {getFieldDecorator('endDate', {
            initialValue:publishItem.endDate?moment(finishDate(publishItem.endDate),"YYYY-MM-DD HH:mm:ss"):null,
            rules: [
              {
                required: false,
              },
            ],
          })( <DatePicker 
                   format="YYYY-MM-DD HH:mm:ss"
                   disabledDate={disabledEndDate}
                   showTime
                   placeholder="false"
                   style={{width:"100%"}}
              />)}
        </FormItem>
        <FormItem label="点赞次数" hasFeedback {...formItemLayout}>
          {getFieldDecorator('likes', {
            initialValue: publishItem.likes,
            getValueFromEvent:validateDates,
            rules: [
              { 
                required: false, message: '填写次数!' 
              },
            ],
          })(
            <Input style={{width:'100%'}}  placeholder="请输入点赞次数"/>
          )}
        </FormItem>
       <FormItem label="阅读次数" hasFeedback {...formItemLayout}>
          {getFieldDecorator('plays', {
            initialValue: publishItem.plays,
            getValueFromEvent:validateDates,
            rules: [
              {
                required: false, message: '填写次数!' 
              },
            ],
          })(
            <Input style={{width:'100%'}}   placeholder="请输入阅读次数"/>
          )}
        </FormItem>
        <FormItem label="发布状态" hasFeedback {...formItemLayout}>
          {getFieldDecorator('status', {
            initialValue: publishItem.status,
            rules: [
              {
                required: true, message: 'Please select your country!' 
              },
            ],
          })(
            <RadioGroup>
              <Radio value={0}>发布中</Radio>
              <Radio value={1}>已下架</Radio>
            </RadioGroup>
          )}
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
