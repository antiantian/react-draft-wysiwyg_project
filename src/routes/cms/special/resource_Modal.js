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
import lodash from 'lodash'
import draftToHtml from 'draftjs-to-html'
import draftToMarkdown from 'draftjs-to-markdown'
import {createTrees,parentUrl,createTreesMutiple,createPersonMutiple} from 'utils'
import GatherDel from './Dev'
import ResourceList from './ResourceList'
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
  loading,
   typelist,
   list,
   cms_special,
  currentItem = {},
 onOk,
 onCancel,
 chapterItem,
 clear_Data,
 form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    setFields,
  },
  dispatch,
  ...modalProps,
  ...newModal,

}) => {
 
  const onReview_N1 = () => {    
      if(!cms_special.selectedRowKeys ||cms_special.selectedRowKeys.length<1 ) {
        message.error('请选择关联文章')
        return
      }else{
        onOk()
      }
      
  }
  console.log(cms_special.selectedRows)
  console.log(cms_special.selectedRowKeys)
  const addOrmove = (ids,rows) =>{
      //  ids 现在的id集合   rows当前返回的   pre已经存在的
      let preItem = lodash.cloneDeep(cms_special.selectedRows)
      let preId=cms_special.selectedRowKeys;
      rows.map(item=>{
            if(!preId.includes(item.id)){
               preItem.push(item)
            }
      })
      console.log(ids)
      console.log(rows)
      console.log(cms_special.selectedRows)
      console.log(cms_special.selectedRowKeys)
      console.log("preItem")
      console.log(preItem)
      let  arr  =  preItem.filter(item=>{
          return  ids.includes(item.id)
      })
      return arr
  }
  const listProps = {
    typelist,
    dataSource: cms_special.resourcelist,
    loading: loading.effects['cms_special/resourcelist'],
    pagination:cms_special.resourcepagination,
    location,
    dispatch,
    cms_special,
    onChange (page) {
       
        dispatch({
          type: 'cms_special/resourcelist',
          payload: {
              pageSize:page.pageSize,
              pageNo:page.current,
          },
        })
    },
    rowSelection: {
      selectedRowKeys:cms_special.selectedRowKeys,
      onChange: (keys,selectedRows) => {
        console.log(keys)
        console.log(selectedRows)
        let  pre  =cms_special.selectedRows;
        let selectedRows2=pre?addOrmove(keys,selectedRows):selectedRows;
        //selectedRows2.push.apply(selectedRows2,selectedRows);
       // let  newSet = new Set(selectedRows2)  //Array.from(newSet)
        dispatch({
          type: 'cms_special/updateState',
          payload: {
            selectedRowKeys: keys,  
            selectedRows:selectedRows2, 
          },
        })
      },
    },
  }
  return (
    <Modal {...modalProps}  onCancel={onCancel} footer={<div>
          <Button onClick={onCancel} >
             取消 
          </Button>
          <Button onClick={onReview_N1}  >
             确定 
          </Button>
      </div>}>
        <ResourceList {...listProps} /> 
         {/*
            <Form layout="horizontal">
          <FormItem label="审核意见" hasFeedback {...formItemLayout}>
            {getFieldDecorator('reviewRemark', {
              initialValue: currentItem.reviewRemark,
              rules: [
                {
                  required: true,
                   message: '请填写审核意见!',
                },
              ],
            })(<TextArea style={{width:'100%'}}  placeholder="请填写审核意见"  />)}
          </FormItem>  
        </Form>
         */}
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
