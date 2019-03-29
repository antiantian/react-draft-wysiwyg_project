import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal,Popconfirm , Button} from 'antd'
import classnames from 'classnames'
import { DropOption } from 'components'
import { Link } from 'react-router-dom'
import queryString from 'query-string'
import AnimTableBody from 'components/DataTable/AnimTableBody'
import styles from '../List.less'
import {finishDate,trim} from 'commonfun'
import {typelist_trans} from 'utils'
import ResourceFilter from './ResourceFilter'
const confirm = Modal.confirm

const List = ({dispatch, onDeleteItem, onEditItem, onPublish,isMotion,typelist, location, ...tableProps ,app,cms_special}) => {
  const {modal2Visible ,showImg} = cms_special;
  location.query = queryString.parse(location.search)

  const handleMenuClick = (record, e) => {
    if (e.key === 'editor') {
      onEditItem(record)
    } else if (e.key === 'delete') {
      confirm({
        title: '确定删除这条记录吗?',
        onOk () {
          onDeleteItem(record.id)
        },
      })
     
    } else if (e.key === 'publish') {
      // confirm({
      //   title: '确定发布这条记录吗?',
      //   onOk () {
      //     alert("发布中。。。")
      //     // onDeleteItem(record.id)
      //   },
      // })
      onPublish(record); //发布资源
    }
  }
  const setModal2Visible = (text) => {
     dispatch({
        type: 'cms_special/showModal2',
        payload: {
          showImg: text,
        },
      })
  }
 const hideModal2= () => {
    dispatch({
        type: 'cms_special/hideModal2',
      })
 }
 
  let visible=false;
  let url=null;
  const columns = [
    {
      title: '专题名称',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => <p title={text} className="websiteName" style={{width:200}}>{text}</p>,
    }, {
      title: '简介',
      dataIndex: 'synopsis',
      key: 'synopsis',
      width:100,
      render: (text, record) => <p  title={text}  className="websiteName" style={{width:100}}>{text}</p>,
    }, {
      title: '栏目',
      dataIndex: 'columnId',
      key: 'columnId',
      render: (text, record) => <p className="websiteName" style={{width:80}}>{typelist_trans(cms_special.typelist,text,"columnName")}</p>,  
    }
  ]

  const getBodyWrapperProps = {
    page: location.query.page,
    current: tableProps.pagination.current,
  }

  const getBodyWrapper = (body) => { return isMotion ? <AnimTableBody {...getBodyWrapperProps} body={body} /> : body }
  const filterProps = {
    typelist:cms_special.typelist,
    filter: {
      ...cms_special.resource_serchlist,
    },
    onFilterChange (value) {
        const { state, pathname } = location
        dispatch({
          type: 'cms_special/resourcelist', 
          payload: {
              ...value,
              pageNo: 1,
              pageSize:10,
          },
        })
    }
  }

  return (
    <div>
      <ResourceFilter {...filterProps}/>
      <Table
        {...tableProps}
        className={classnames({ [styles.table]: true, [styles.motion]: isMotion })}
        bordered
        scroll={{x: true}}
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
