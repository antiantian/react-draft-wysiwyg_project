/**
 * 
 * @authors zcy (1366969408@qq.com)
 * @date    2018-01-14 17:21:46
 * @version $Id$
 */


import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, InputNumber, Radio, Modal, Cascader,message} from 'antd'
import { NewSelect} from 'components'
const FormItem = Form.Item
const { TextArea } = Input
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
  dispatch,
  onOk,
  onCancel,
  app,
  confirmDirty=false,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    setFieldsValue,
  },

  ...modalProps
}) => {
  const handleOk = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
      }
      if(data.newPwdOne!==data.newPwdTwo){
          message.error('两次输入密码不一致!');
          return
      }
       onOk(data)
    })
  }
  const handleCancel = () => {
  	  clearall();
  }
  const clearall = () => {
          const fields = getFieldsValue()
          for (let item in fields) {
              if ({}.hasOwnProperty.call(fields, item)) {
                if (fields[item] instanceof Array) {
                  fields[item] = []
                } else {
                  fields[item] = undefined
                }
              }
            }
            setFieldsValue(fields)  //手动清空已选择的部门
             dispatch({ type: 'app/updateState',payload:{pwdDegree: null} })  
            onCancel()
  }
  const modalOpts = {
    ...modalProps,
    onOk: handleOk,
    onCancel:handleCancel
  }
  const  handleConfirmBlur = (e) => {
    const value = e.target.value;
    dispatch({ type: 'app/updateState',payload:{confirmDirty:confirmDirty|| !!value } })  
  }
  const checkPassword = (rule, value, callback) => {
    const fields = getFieldsValue()
    if (value && value !== fields.newPwdOne) {
      callback('两次输入密码不一致!');
    } else {
      callback();
    }
  }
   const checkConfirm = (rule, value, callback) => {
    var regPwd2=/^[^\u4e00-\u9fa5\s]+(([A-Za-z]\d)|([A-Za-z][^\u4e00-\u9fa5a-zA-Z\d])|(\d[^\u4e00-\u9fa5a-zA-Z\d]))/
    var regPwd =/^((?=.*\d)(?=.*[a-zA-Z])|(?=.*[^\u4e00-\u9fa5a-zA-Z\d])(?=.*[a-zA-Z])|(?=.*[^\u4e00-\u9fa5a-zA-Z\d])(?=.*\d))([\S])/
    if(!value){
       callback("请输入密码"); 
       return     
    }
    if (value &&  confirmDirty) {
       validateFields(['newPwdTwo'], { force: true });
    }
    if(value.length<10||value.length>32){
        dispatch({ type: 'app/updateState',payload:{pwdDegree: null} })  
        callback("密码长度需10-32位");
    }
    if(!regPwd.test(value)){
      dispatch({ type: 'app/updateState',payload:{pwdDegree: null} })  
      callback("大写字母、小写字母、数字和标点符号至少包含2种")
    }
    if(regPwd.test(value)){
      var reg31 = /^(?=.*[0-9]+$)(?=.*[a-zA-Z]+$)(?=.*[^\u4e00-\u9fa5a-zA-Z\d])[^\u4e00-\u9fa5\s]$/;
       reg31 =/^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^\u4e00-\u9fa5a-zA-Z\d])/
      var reg1 =/^(?=.*[0-9])(?=.*[a-zA-Z])[0-9A-Za-z]/;
      var reg2 =/^(?=.*[0-9])(?=.*[^\u4e00-\u9fa5a-zA-Z\d])[^\u4e00-\u9fa5a-zA-Z]/;
      var reg3 =/^(?=.*[^\u4e00-\u9fa5a-zA-Z\d])(?=.*[a-zA-Z])[^\u4e00-\u9fa5\d]/;
      var Degree;

      if(reg1.test(value)||reg2.test(value)||reg3.test(value)){
           if(value.length>=10&&value.length<=15){
              Degree=("密码强度:弱")
           }

           if(value.length>=16&&value.length<=32){
              Degree=("密码强度:较强")
           }
      }
      if(reg31.test(value)){
           if(value.length>=10&&value.length<=15){
              Degree=("密码强度:较强")
           }
           // if(value.length>=10&&value.length<=12){
           //    Degree=("密码强度:强")
           // }
           if(value.length>=16&&value.length<=32){
              Degree=("密码强度:很强")
           }
      }
      dispatch({ type: 'app/updateState',payload:{pwdDegree: Degree} })  
      callback();
    }
    callback();
  }

  return (
    <Modal {...modalOpts}>
      <Form layout="horizontal">
        <FormItem label="旧密码" hasFeedback {...formItemLayout}>
            {getFieldDecorator('oldPwd', {
              initialValue: item.oldPwd,
              rules: [
                {
                  required: true,message:'请输入旧密码!'
                },
              ],
            })(<Input  type="password" placeholder="请输入旧密码" />)}
          </FormItem>
          <div style={{position:'relative'}}>
             <FormItem label="设置新密码" hasFeedback {...formItemLayout}>
                {getFieldDecorator('newPwdOne', {
                  initialValue: item.newPwdOne,
                  rules: [
                    {
                      required: true,message:'请输入新密码!'
                    }, {
                    validator: checkConfirm,
                  }
                  ],
                })(<Input type="password" placeholder="10-32位密码,数字/字母/符号至少2种" />)}
              </FormItem>
              {getFieldsValue().newPwdOne&&
              <div style={{position:'absolute',right:'17%',bottom:-18,fontSize:12,color:'#00a854'}}>{app.pwdDegree}</div>
              }
          </div>
           <FormItem label="确认新密码" hasFeedback {...formItemLayout}>
            {getFieldDecorator('newPwdTwo', {
              initialValue: item.newPwdTwo,
              
              rules: [
                {
                  required: true,message:'请确认新密码!'
                }, {
		              validator: checkPassword,
		            }
              ],
            })(<Input  type="password" placeholder="请确认新密码" onBlur={handleConfirmBlur} />)}
          </FormItem>
      
	        <FormItem
	          {...formItemLayout}
	          label="动态验证码"
	          hasFeedback
	        >
	          {getFieldDecorator('googleCode', {
	          	initialValue: item.googleCode,
	            rules: [{
	              required: true, message: '请输入动态验证码!',
	            }],
	          })(
	            <Input placeholder="请输入动态验证码"/>
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
