import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Button, Row, Col, Form, Input } from 'antd'
import { config } from 'utils'
import styles from './index.less'

const FormItem = Form.Item
const Login = ({
  loading,
  dispatch,
  form: {
    getFieldDecorator,
    validateFieldsAndScroll,
  },
}) => {
  function handleOk () {
    validateFieldsAndScroll((errors, values) => {
      if (errors) {
        return
      }
      dispatch({ type: 'login/SAAScodeBySms', payload: values })
    })
  }

  return (
    <div className={styles.form}>
      <div className={styles.logo}>
        {/* <img alt={'logo'} src={config.logo} /> */}
        <span>{config.name}</span>
      </div>
      <form>
        <FormItem hasFeedback>
          {getFieldDecorator('userName', {
            //initialValue:'18000000001',
            rules: [
              {
                required: true,
                 message: '请输入用户名!'
              },
            ],
          })(<Input size="large" onPressEnter={handleOk} placeholder="请输入用户名" />)}
        </FormItem>
        <FormItem hasFeedback>
          {getFieldDecorator('password', {
            //initialValue:'111111',
            rules: [
              {
                required: true,
                message: '请输入密码!'
              },
            ],
          })(<Input size="large" type="password" onPressEnter={handleOk} placeholder="请输入密码" />)}
        </FormItem>
        <FormItem>
            {getFieldDecorator('googleCode', {
             //  initialValue:'111111',
              rules: [{ required: true, message: '请输入谷歌验证码!' }],
            })(
              <Input size="large" placeholder="请输入谷歌验证码"/>
            )}
        </FormItem>
        {getFieldDecorator('redirectUri',{
          initialValue:'NONE'
          })(
          <Input type='hidden'/>
        )}
        <Row>
          <Button type="primary" size="large" onClick={handleOk} loading={loading.effects.login}>
            登录
          </Button>
        </Row>

      </form>
    </div>
  )
}

Login.propTypes = {
  form: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ loading }) => ({ loading }))(Form.create()(Login))
