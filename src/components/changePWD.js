/**
 * 
 * @authors zcy (1366969408@qq.com)
 * @date    2018-01-14 17:13:28
 * @version $Id$
 */

import React from 'react';
import { Form, Icon, Input, Button, message} from 'antd';
import {hashHistory} from 'react-router';
 message.config({
    top:60,
    duration:2,
});
const FormItem = Form.Item;


class NormalLoginForm extends React.Component{
  constructor(props) {
    super(props);
      this.state = { 
       userName:'',
       password:'',
       kouling:'',
       loading: false,
       confirmDirty: false,
      }
  }
  componentDidMount(){
    this.setState({
      userName:'11'
    })
  }
  success=(json)=>{
   hashHistory.push('/login');
   message.info('密码修改成功，请重新登录');
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => { 
      if (!err) {
       console.log('Received values of form: ', values);
      }
    });
    var userName=this.state.userName;
    var password=this.state.password;
    var kouling=this.state.kouling;
    if(this.state.repassword!==password){
          message.error('两次输入密码不一致!');
          return
    }
    var url=(api.resourcesPath||api.resourcePath)+api.updatePwd;
    var objson={token:localStorage.cok,password:password,googleKey:kouling}
    changeID(objson);
    var obj={
      url:url,
      jsonp:objson,
      func200:this.success
     }
    newfetch(obj);
  } 
  handleConfirmBlur = (e) => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  }
  checkPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('两次输入密码不一致!');
    } else {
      callback();
    }
  }
  checkConfirm = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  }
  onChange=(e)=> {
    this.setState({ [e.target.name]: e.target.value })
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 14,
          offset: 6,
        },
      },
    };
    return (
      <div>
      <h2 className="titleName">修改密码</h2>
      <Form onSubmit={this.handleSubmit} className="pwdChange">

        <FormItem
          {...formItemLayout}
          label="设置新密码"
          hasFeedback
        >
          {getFieldDecorator('password', {
            rules: [{
              required: true, message: '请输入新密码!',
            }, {
              validator: this.checkConfirm,
            }],
          })(
            <Input type="password" name="password" onChange={this.onChange} />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="确认新密码"
          hasFeedback
        >
          {getFieldDecorator('repassword', {
            rules: [{
              required: true, message: '请确认新密码!',
            }, {
              validator: this.checkPassword,
            }],
          })(
            <Input type="password" name="repassword" onChange={this.onChange} onBlur={this.handleConfirmBlur} />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="动态验证码"
          hasFeedback
        >
          {getFieldDecorator('kouling', {
            rules: [{
              required: true, message: '请输入口令!',
            }],
          })(
            <Input type="text" name="kouling" onChange={this.onChange}/>
          )}
        </FormItem>
        <FormItem {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">确认</Button>
        </FormItem>
      </Form>
      </div>
    );
  }
 }

const WrappedNormalLoginForm = Form.create()(NormalLoginForm);

export default WrappedNormalLoginForm;
