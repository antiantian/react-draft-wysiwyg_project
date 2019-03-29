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
import { Form, Button, Row, Col, DatePicker, Input, Cascader, Switch } from 'antd'


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
    fields.isHide= fields.isHide?parseInt(fields.isHide):undefined
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
       setFilter("isHide",key)
      return  key
  }

  const { search,tag,name,isHide} = filter
//title 改 search
 
  return (
    <Row gutter={24}>
{/*
      <Col {...ColProps} xl={{ span: 6}} md={{ span:6 }}>
        {getFieldDecorator('search', { initialValue: search })(<Search placeholder="搜索视频内容" size="large" onSearch={handleSubmit} />)}
      </Col>
*/}
       <Col {...TwoColProps} xl={{ span:6 }} md={{ span:6}} >
         {getFieldDecorator('isHide', { initialValue: isHide, getValueFromEvent:SelectonChange })(
             <NewSelect 
               name="agencyGroupId" 
               datas={[{value:'0',text:'否'},{value:'1',text:'是'}]} 
               placeholder="是否隐藏" 
               style={{ width: '100%',fontSize:'12px' }} 
               valMess={'value'}
               textMess={'text'}
               size="large"
             />
          )}
         
      </Col>
       <Col {...ColProps} xl={{ span: 6 }} md={{ span: 6 }}>
        {getFieldDecorator('tag', { initialValue: tag })(<Search placeholder="搜索视频标签" size="large" onSearch={handleSubmit} />)}
      </Col>
       <Col {...ColProps} xl={{ span: 6 }} md={{ span: 6 }}>
        {getFieldDecorator('name', { initialValue: name })(<Search placeholder="搜索视频标题" size="large" onSearch={handleSubmit} />)}
      </Col>
     {/*
        <Col {...TwoColProps} xl={{ span: 4 }} md={{ span: 8 }} >
         {getFieldDecorator('typeId', { initialValue: typeId, getValueFromEvent:SelectonChange })(
             <NewSelect 
               name="agencyGroupId" 
               datas={typelist} 
               placeholder="资源类型" 
               style={{ width: '100%',fontSize:'12px' }} 
               valMess={'id'}
               textMess={'typeName'}
               size="large"
             />
          )}
         isHide
      </Col>
     */}
      <Col {...ColProps} xl={{ span: 6 }} md={{ span: 6 }} sm={{ span: 24 }}>
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
