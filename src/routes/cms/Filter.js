import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { FilterItem } from 'components'
import { Form, Button, Row, Col, DatePicker, Input, Cascader, Switch } from 'antd'
import city from '../../utils/city'

const Search = Input.Search
const { RangePicker } = DatePicker

const ColProps = {
  xs: 24,
  sm: 12,
  style: {
    marginBottom: 16,
  },
}

const TwoColProps = {
  ...ColProps,
  xl: 96,
}

const Filter = ({
  onAdd,
  isMotion,
  switchIsMotion,
  onFilterChange,
  filter,
  form: {
    getFieldDecorator,
    getFieldsValue,
    setFieldsValue,
  },
}) => {
  const handleFields = (fields) => {
    const { createTime } = fields
    if (createTime.length) {
      fields.createTime = [createTime[0].format('YYYY-MM-DD'), createTime[1].format('YYYY-MM-DD')]
    }
    return fields
  }

  const handleSubmit = () => {
    let fields = getFieldsValue()
    // 提交之前转换时间参数
      const data = {
        ...fields,
        'startTime':fields['startTime']?fields['startTime'].format('YYYY-MM-DD HH:mm:ss'):null,
        'endTime': fields['endTime']?fields['endTime'].format('YYYY-MM-DD HH:mm:ss'):null,
      };
      console.log('Received values of form: ', data);

   // fields = handleFields(fields)
   onFilterChange(data)
  }

  const handleReset = () => {
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
    setFieldsValue(fields)
    handleSubmit()
  }

  const handleChange = (key, values) => {

    let fields = getFieldsValue()
    console.log(key)
    console.log(values)
    console.log(fields)
    fields[key] = values
   // fields = handleFields(fields)
    onFilterChange(fields)
  }
  const { siteName,siteUrl,createUser,updateUser,sitePid,startTime,endTime} = filter

  let initialCreateTime = []
  if (filter.createTime && filter.createTime[0]) {
    initialCreateTime[0] = moment(filter.createTime[0])
  }
  if (filter.createTime && filter.createTime[1]) {
    initialCreateTime[1] = moment(filter.createTime[1])
  }

  return (
    <Row gutter={24}>
      <Col {...ColProps} xl={{ span: 4 }} md={{ span: 8 }}>
        {getFieldDecorator('siteName', { initialValue: siteName })(<Search placeholder="搜索站点名称" size="large" onSearch={handleSubmit} />)}
      </Col>
      <Col {...ColProps} xl={{ span: 4 }} md={{ span: 8 }}>
        {getFieldDecorator('siteUrl', { initialValue: siteUrl })(<Search placeholder="搜索站点url" size="large" onSearch={handleSubmit} />)}
      </Col>
    {/*
      <Col {...ColProps} xl={{ span: 4 }} md={{ span: 8 }}>
        {getFieldDecorator('createUser', { initialValue: createUser })(<Search placeholder="搜索创建人" size="large" onSearch={handleSubmit} />)}
      </Col>
      <Col {...ColProps} xl={{ span: 4 }} md={{ span: 8 }}>
        {getFieldDecorator('updateUser', { initialValue: updateUser })(<Search placeholder="搜索修改人" size="large" onSearch={handleSubmit} />)}
      </Col>
      <Col {...ColProps} xl={{ span: 4 }} md={{ span: 8 }}>
        {getFieldDecorator('sitePid', { initialValue: sitePid })(<Search placeholder="搜索父节点" size="large" onSearch={handleSubmit} />)}
      </Col>
    
      <Col {...ColProps} xl={{ span: 4 }} md={{ span: 8 }}>
          {getFieldDecorator('startTime', {
            initialValue:startTime?moment(startTime,"YYYY-MM-DD HH:mm:ss"):null,
            rules: [
              {
                required: true,
              },
            ],
          })( <DatePicker 
                 size={'large'}
                 format={"YYYY-MM-DD HH:mm:ss"}
                 showTime
                 placeholder="开始时间"
                 style={{width:"100%"}}
         
              />)}
       </Col>
      <Col {...ColProps} xl={{ span: 4 }} md={{ span: 8 }}>
          {getFieldDecorator('endTime', {
            initialValue:endTime?moment(endTime,"YYYY-MM-DD HH:mm:ss"):null,
            rules: [
              {
                required: true,
              },
            ],
          })( <DatePicker 
                   size={'large'}
                   format="YYYY-MM-DD HH:mm:ss"
                   showTime
                   placeholder="结束时间"
                   style={{width:"100%"}}
  
              />)}
      </Col>
      */}


      <Col {...TwoColProps} xl={{ span: 16 }} md={{ span: 8 }} sm={{ span: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <div >
            {/*<Button type="primary" size="large" className="margin-right" onClick={handleSubmit}>搜索</Button>*/}
            <Button size="large" onClick={handleReset}>重置</Button>
          </div>
          <div>
            <Button size="large" type="ghost" onClick={onAdd}>创建</Button>
          </div>
        </div>
      </Col>
    </Row>
  )
}

Filter.propTypes = {
  onAdd: PropTypes.func,
  isMotion: PropTypes.bool,
  switchIsMotion: PropTypes.func,
  form: PropTypes.object,
  filter: PropTypes.object,
  onFilterChange: PropTypes.func,
}

export default Form.create()(Filter)
