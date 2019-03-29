import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, InputNumber, Radio, Modal, Cascader,Row,Col,Icon,Select} from 'antd'
import {createTrees} from 'utils'

const FormItem = Form.Item

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
  onOk,
  modalType,
  selectTree,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    setFieldsValue,
    setFields
  },
  ...modalProps
}) => {
 
  const handleOk = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const fields = getFieldsValue();
      const data = {
        ...fields,
         "purpose": fields["purpose"] ? parseInt(fields["purpose"]):null,
      }

     // data.address = data.address.join(' ')
     onOk(data)
    })
  }
 
  const modalOpts = {
    ...modalProps,
    onOk: handleOk,
  }
  const emitEmpty = () => {

         setFields({
              sitePid: {
                value:''
              },
         });
         changeItmeP(null)

  }
  const getTreeMess = (item) =>{
    const nowId=item.id;
   // item.sitePid=nowId;
   //只展示
   if(modalType === 'update' ){
     return
   }
    setFields({
      sitePid: {
        value:nowId
      },
    });
    changeItmeP(nowId) 
  }
  const changeItmeP = (id) =>{
     item.sitePid=id;
  }
  console.log(item.sitePid)
  const suffix = item.sitePid ? <Icon type="close-circle" style={{right:'20px'}} onClick={emitEmpty} /> : null;
  let treeElement=selectTree?createTrees(selectTree,item.sitePid,null,getTreeMess):null;
  return (
    <Modal {...modalOpts}>
      <Form layout="horizontal">
     {
       modalType === 'update' && <FormItem label="站点id" hasFeedback {...formItemLayout}>
          {getFieldDecorator('id', {
            initialValue: item.id,
            rules: [
              {
                required: true,
              },
            ],
          })(<Input disabled={true}/>)}
        </FormItem>
       } 
        <FormItem label="站点名称" hasFeedback {...formItemLayout}>
          {getFieldDecorator('siteName', {
            initialValue: item.siteName,
            rules: [
              {
                required: true,
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem label="站点Url" hasFeedback {...formItemLayout}>
          {getFieldDecorator('siteUrl', {
            initialValue: item.siteUrl,
            rules: [
              {
                required: true,
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem label="父节点" hasFeedback {...formItemLayout}>
          {getFieldDecorator('sitePid', {
            initialValue: item.sitePid&&item.sitePid!==0?(item.sitePid).toString():item.sitePid,
            rules: [
              {
                required: false,

              },
            ],
          })(
              <Input addonAfter={suffix} disabled={true}/>
          )}
        </FormItem>
        <Row style={{marginBottom:'24px'}}>
          <Col span={6}></Col>
          <Col span={14}>{treeElement}</Col>
        </Row>
        <FormItem label="排序" hasFeedback {...formItemLayout}>
          {getFieldDecorator('siteSequence', {
            initialValue: item.siteSequence?parseInt(item.siteSequence):item.siteSequence,
            rules: [
              {
                type: 'number',
              },
            ],
          })(<InputNumber min={18} max={100} />)}
        </FormItem>
         <FormItem label="用途" hasFeedback {...formItemLayout}>
          {getFieldDecorator('purpose', {
            initialValue: item.purpose?(item.purpose).toString():item.purpose,
            rules: [
              {
                required: true, message: '请选择使用方向!' 
              },
            ],
          })(
            <Select placeholder="请选择使用方向">
              <Option value="1">Pc</Option>
              <Option value="2">App</Option>
              <Option value="3">通用</Option>
            </Select>
          )}
        </FormItem>
      </Form>
    </Modal>
  )
}

modal.propTypes = {
  form: PropTypes.object.isRequired,
  type: PropTypes.string,
  item: PropTypes.object,
  onOk: PropTypes.func,
}

export default Form.create()(modal)
