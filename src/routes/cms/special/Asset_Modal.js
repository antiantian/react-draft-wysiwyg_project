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
import {finishDate,trim} from 'commonfun'
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
  item = {},
 onCancel,
 form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    setFields,
  },
  ...modalProps
}) => {
  const  {chans} = item
  const creatteP = (arr) => {
      return arr?arr.map(item=>{
         return <p >
           {item.title} 
           <span style={styles.chapterTile}>{finishDate(item.releaseDate2)}</span>
        </p>
      }):null
  }
  const results =chans?chans.map((item,index)=>{
     let contents = item.content
     return  <div  key ={index} style={styles.chapter}>
                <h2 style={styles.title}>{item.title}</h2>
                {creatteP(contents)}
             </div> 
  }):null
  return (
    <Modal {...modalProps}  onCancel={onCancel} footer={<div>
   
          <Button onClick={onCancel}  >
             确定 
          </Button>
      </div>}>
       <div>{results}</div>
    </Modal>
  )
}   
const styles = {
        chapter:{
           margin:'15px',
           lineHeight:1.75,
        },
        title: {
           paddingBottom:10,
        },
        chapterTile: {
          float:'right'
        },
 };
modal.propTypes = {
  form: PropTypes.object.isRequired,
  onOk: PropTypes.func,
}

export default Form.create()(modal)


