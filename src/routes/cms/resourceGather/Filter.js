/**
 * 
 * @authors zcy (1366969408@qq.com)
 * @date    2017-11-02 17:22:23
 * @version $Id$
 */

import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { FilterItem,NewSelect} from 'components'
import { Form, Button, Row, Col, DatePicker, Input, Cascader, Switch,TreeSelect } from 'antd'
import {arrayToSelectTree} from 'utils'
import lodash from 'lodash'
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
  typelist,
  isMotion,
  switchIsMotion,
  onFilterChange,
  filter,
  form: {
    getFieldDecorator,
    getFieldsValue,
    setFieldsValue,
    setFields
  },
  hideAddButton,
}) => {

  const handleFields = (fields) => {
    const { createTime } = fields
    if (createTime&&createTime.length) {
      fields.createTime = [createTime[0].format('YYYY-MM-DD'), createTime[1].format('YYYY-MM-DD')]
    }
    return fields
  }

  const handleSubmit = () => {
    let fields = getFieldsValue()
    //fields = handleFields(fields)
    onFilterChange(fields)
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
 const setFilter = (name,key) => {
     setFields({
              [name]: {
                value:key
              },
      });
      handleSubmit();
 } 
  const handleChange = (key, values) => {
    let fields = getFieldsValue()
    fields[key] = values
    fields = handleFields(fields)
    onFilterChange(fields)
  }

  const SelectonChange = (key,values) => {
       setFilter("columnId",key)
      return  key
  }

  const { search,url,createUser,changer,columnId} = filter
//title 改 search
  let initialCreateTime = []
  if (filter.createTime && filter.createTime[0]) {
    initialCreateTime[0] = moment(filter.createTime[0])
  }
  if (filter.createTime && filter.createTime[1]) {
    initialCreateTime[1] = moment(filter.createTime[1])
  }
    let department_treeData=[];
   if(typelist){
    let dataw = lodash.cloneDeep(typelist);
    department_treeData = arrayToSelectTree(dataw.filter(_ => _.mpid !== '-1'), 'id', 'pid','children','columnName')
    
  }
  console.log(department_treeData)
  return (
    <Row gutter={24}>
      <Col {...ColProps} xl={{ span: 4 }} md={{ span: 8 }}>
        {getFieldDecorator('search', { initialValue: search })(<Search placeholder="搜索投稿内容" size="large" onSearch={handleSubmit} />)}
      </Col>
      <Col {...TwoColProps} xl={{ span: 4 }} md={{ span: 8 }} >
         {getFieldDecorator('columnId', { initialValue: columnId, getValueFromEvent:SelectonChange })(
                <TreeSelect
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  treeData={department_treeData}
                  placeholder="栏目类型"
                  treeDefaultExpandAll
                  allowClear
                  size={'large'}
                  style={{ width: '100%'}} 
                  className="treeOnlys2"
                />
          )}
         
      </Col>
      <Col {...TwoColProps} xl={{ span: 16 }} md={{ span: 8 }} sm={{ span: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          
             <div >
            {/*<Button type="primary" size="large" className="margin-right" onClick={handleSubmit}>搜索</Button>*/}
            <Button size="large" onClick={handleReset}>重置</Button>
          </div>
          {!hideAddButton&&
          <div>
            <Button size="large" type="primary" onClick={onAdd}>创建</Button>
          </div>
          }
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
