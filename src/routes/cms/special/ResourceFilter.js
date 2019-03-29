/**
 * 
 * @authors zcy (1366969408@qq.com)
 * @date    2018-09-12 17:22:58
 * @version $Id$
 */

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
import { Form, Button, Row, Col, DatePicker, Input, Cascader, Switch ,Modal,TreeSelect} from 'antd'
import {createTrees,parentUrl,arrayToTree, arrayToSelectTree} from 'utils'

import lodash from  'lodash'
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
}

const Filter = ({
  onFilterChange,
  filter,
  typelist, 
  form: {
    getFieldDecorator,
    getFieldsValue,
    setFieldsValue,
    setFields
  },

}) => {

  const handleFields = (fields) => {
    return fields
  }

  const handleSubmit = () => {
    let fields = getFieldsValue()
    fields = handleFields(fields)
 
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
    onFilterChange(fields)
  }

  const {status,columnId,siteId,search} = filter

  const setFilter = (name,key) => {
     setFields({
              [name]: {
                value:key
              },
      });
      handleSubmit();
 } 
   const SelectonChange_columnId  = (key,values) => {
 
     setFilter("columnId",key)
      return  key
  }
    let department_treeData=[];
   if(typelist){
    let dataw = lodash.cloneDeep(typelist);
    department_treeData = arrayToSelectTree(dataw.filter(_ => _.mpid !== '-1'), 'id', 'pid','children','columnName')
    
  }
  return (
    <div>

    <Row gutter={24}>

      <Col {...TwoColProps} xl={{ span: 8 }} md={{ span: 8 }} >
         {getFieldDecorator('columnId', { initialValue: columnId?columnId.toString():columnId, getValueFromEvent:SelectonChange_columnId })(
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
      <Col {...ColProps} xl={{ span:8}} md={{ span: 8 }}>
        {getFieldDecorator('search', { initialValue: search })(<Search placeholder="搜索资源内容" size="large" onSearch={handleSubmit} />)}
      </Col>
      <Col {...TwoColProps} xl={{ span: 8 }} md={{ span: 8}} >
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
            <Button size="large" onClick={handleReset}>重置</Button>
        </div>
      </Col>
    </Row>
    </div>
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
