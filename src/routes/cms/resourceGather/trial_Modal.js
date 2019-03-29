/**
 * 
 * @authors zcy (1366969408@qq.com)
 * @date    2018-09-03 15:55:59
 * @version $Id$
 */

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
import { Form, Input,Select, InputNumber, Radio, Modal, Cascader , Upload, Icon,Row, Col, Card,DatePicker,Button,message} from 'antd'
import { convertToRaw } from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import draftToMarkdown from 'draftjs-to-markdown'
import {createTrees,parentUrl,createTreesMutiple,createPersonMutiple} from 'utils'
import GatherDel from './Dev'
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
  currentItem = {},
 onReview_Y,
 onReview_N,
 form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    setFields,
  },
  ...modalProps
}) => {
 
  const getData = (mess) =>{   
     validateFields((errors) => {
      
          if (errors) {
                message.error('请填写必填信息');
                return
          }else{
               let fields = getFieldsValue()   
                const data = {
                  ...fields 
                }
               if(mess=="N1"){
                      onReview_N(data)
               }
                if(mess=="Y1"){
                     onReview_Y(data)
               }
          } 
      }) 
       
    
  }
  const onReview_N1 = () => {     
       getData("N1")
  }
  const onReview_Y1 = () => {
      getData("Y1")
  }
  return (
    <Modal {...modalProps}  footer={<div>
          <Button onClick={onReview_N1} >
             拒绝 
          </Button>
          <Button onClick={onReview_Y1}  >
             通过 
          </Button>
      </div>}>
        <GatherDel {...modalProps} />
         <Form layout="horizontal">
          <FormItem label="审核意见" hasFeedback {...formItemLayout}>
            {getFieldDecorator('remark', {
              initialValue: currentItem.remark,
              rules: [
                {
                  required: true,
                   message: '请填写审核意见!',
                },
              ],
            })(<TextArea style={{width:'100%'}}  placeholder="请填写审核意见"  />)}

             
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
