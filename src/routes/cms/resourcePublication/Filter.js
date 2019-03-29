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
import {createTrees,parentUrl,arrayToTree} from 'utils'
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
}

const Filter = ({
  isMotion,
  switchIsMotion,
  onFilterChange,
  filter,
  typelist, 
  sitelist,
  selectTree,
  ParentTree_cancel,
  ParentTree_ok,
  showParentTree,
  change_sitePid,
  show_selPid,
  changeItmeP,
  form: {
    getFieldDecorator,
    getFieldsValue,
    setFieldsValue,
    setFields
  },

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

  const handleChange = (key, values) => {
    let fields = getFieldsValue()
    fields[key] = values
    fields = handleFields(fields)
    fields.siteId=change_sitePid
    onFilterChange(fields)
  }
  const {status,columnId,siteId,search} = filter

  let initialCreateTime = []
  if (filter.createTime && filter.createTime[0]) {
    initialCreateTime[0] = moment(filter.createTime[0])
  }
  if (filter.createTime && filter.createTime[1]) {
    initialCreateTime[1] = moment(filter.createTime[1])
  }
  const setFilter = (name,key) => {
     setFields({
              [name]: {
                value:key
              },
      });
      handleSubmit();
 } 
 const SelectonUrlChange = (e) => {
     // console.log(e.target.value)
    return   (e.target.value&&sitelist)?parentUrl(e.target.value,sitelist):""
 } 
 const SelectonChange = (key,values) => {
      return  key
  }
  const SelectonChange_columnId  = (key,values) => {
    console.log(key)
     setFilter("columnId",key)
      return  key
  }
  const SelectonChange_status  = (key,values) => {
     setFilter("status",key)
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
 
      <Col {...TwoColProps} xl={{ span: 6 }} md={{ span: 6 }} >
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
      <Col {...ColProps} xl={{ span: 6 }} md={{ span: 6}}>
        {getFieldDecorator('status', { initialValue: status, getValueFromEvent:SelectonChange_status })(
             <NewSelect 
               size="large"
               name="agencyGroupId" 
               datas={[
                 {
                  val:0,
                  text:"发布中"
                 },{
                   val:1,
                  text:"已下架"
                 }
                ]} 
               placeholder="发布状态" 
               style={{ width: '100%',fontSize:'12px' }} 
             />
         )}
      </Col>
 
      <Col {...ColProps} xl={{ span:6}} md={{ span: 6 }}>
        {getFieldDecorator('search', { initialValue: search })(<Search placeholder="搜索资源内容" size="large" onSearch={handleSubmit} />)}
      </Col>
      {/*<Search placeholder="发布站点" disabled={true} size="large" onSearch={show_selPid} />*/}
      <Col {...TwoColProps} xl={{ span: 6 }} md={{ span: 6}} >
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <div >
            {/*<Button type="primary" size="large" className="margin-right" onClick={handleSubmit}>搜索</Button>*/}
            <Button size="large" onClick={handleReset}>重置</Button>
          </div>
          {/*
            <div>
            <Switch style={{ marginRight: 16 }} size="large" defaultChecked={isMotion} onChange={switchIsMotion} checkedChildren={'Motion'} unCheckedChildren={'Motion'} />
          </div>
          */}
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
