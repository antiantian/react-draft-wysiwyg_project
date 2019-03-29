import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal,Popconfirm } from 'antd'
import classnames from 'classnames'
import { DropOption } from 'components'
import { Link } from 'react-router-dom'
import queryString from 'query-string'
import AnimTableBody from 'components/DataTable/AnimTableBody'
import styles from '../List.less'
import {finishDate,trim} from 'commonfun'
const confirm = Modal.confirm

const List = ({ onDeleteItem, onEditItem, isMotion, location, ...tableProps ,app,cms_resourceType}) => {

  location.query = queryString.parse(location.search)

  const handleMenuClick = (record, e) => {
    if (e.key === '1') {
      onEditItem(record)
    } else if (e.key === '2') {
      confirm({
        title: '确定删除这条记录吗?',
        onOk () {
          onDeleteItem(record.id)
        },
      })
    }
  }

  const columns = [
    // {
    //   title: '序号',
    //   dataIndex: 'key',
    //   key: 'key',
    //   width: 64,
    //   className: styles.avatar,
    // }, 
    {
      title: '资源名称',
      dataIndex: 'typeName',
      key: 'typeName',
    }, {
      title: '创建人',
      dataIndex: 'createBy',
      key: 'createBy',
      render: (text, record) => <p>{text}</p>,//app.user.username
    },{
      title: '创建时间',
      dataIndex: 'createDate',  
      key: 'createDate',
      render: (text, record) => <p>{finishDate(text)}</p>,
    },{
      title: '修改人',
      dataIndex: 'updateBy',
      key: 'updateBy',
      render: (text, record) => <p>{text}</p>,
    },{
      title: '修改时间',
      dataIndex: 'updateDate',
      key: 'updateDate',
      render: (text, record) => <p>{text}</p>,
      render: (text, record) => <p>{finishDate(text)}</p>,
    }, {
      title: '操作',
      key: 'operation',
      width: 100,
      render: (text, record) => {
        return <DropOption onMenuClick={e => handleMenuClick(record, e)} menuOptions={[{ key: '1', name: '修改' }, { key: '2', name: '删除' }]} />
      },
    },
  ]

  const getBodyWrapperProps = {
    page: location.query.page,
    current: tableProps.pagination.current,
  }

  const getBodyWrapper = (body) => { return isMotion ? <AnimTableBody {...getBodyWrapperProps} body={body} /> : body }

  return (
    <div>
      <Table
        {...tableProps}
        className={classnames({ [styles.table]: true, [styles.motion]: isMotion })}
        bordered
        scroll={{x: 1200}}
        columns={columns}
        simple
        rowKey={record => record.id}
        getBodyWrapper={getBodyWrapper}
      />
    </div>
  )
}

List.propTypes = {
  onDeleteItem: PropTypes.func,
  onEditItem: PropTypes.func,
  isMotion: PropTypes.bool,
  location: PropTypes.object,
}

export default List
