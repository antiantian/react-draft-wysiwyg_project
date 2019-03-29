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
const confirm = Modal.confirm

const List = ({dispatch, onDeleteItem, onEditItem, onPublish,isMotion, typelist,location, ...tableProps ,app,cms_resourcePublication}) => {
  const {modal2Visible ,showImg,hideEditButton,hideDeleteButton} = cms_resourcePublication;
  location.query = queryString.parse(location.search)

  const handleMenuClick = (record, e) => {
    if (e.key === 'see') {
      onEditItem(record)     
    } else if (e.key === 'delete') {
      confirm({
        title: '确定删除这条记录吗?',
        onOk () {
          onDeleteItem(record.id)
        },
      })
     
    } else if (e.key === 'editor') {
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
        type: 'cms_resourcePublication/showModal2',
        payload: {
          showImg: text,
        },
      })
  }
 const hideModal2= () => {
    dispatch({
        type: 'cms_resourcePublication/hideModal2',
      })
 }
  let visible=false;
  let url=null;
  let columns = [
    {
      title: '发布id',
      dataIndex: 'id',
      key: 'id',
      render: text => <p >{text}</p>,
    }, {
      title: '发布资源名称',
      dataIndex: 'resourceId',
      key: 'resourceId',
      width: 200,
      onCellClick:onEditItem,
      render: (text,record)=> <p className="websiteName" style={{width:200}} title={record.resource?record.resource.title:""}>{record.resource?record.resource.title:""}</p>
    }, {
      title: '栏目',
      dataIndex: 'columnId',
      key: 'columnId',
      render: (text, record) => <p >{typelist_trans(typelist,text,"columnName")}</p>,  
    },{
      title: '发布状态',
      dataIndex: 'status',
      key: 'status',
      render: (text, record) => <p>{text==1?'已下架':'发布中'}</p>,
    },{
      title: '开始时间',
      dataIndex: 'createDate',  
      key: 'createDate',
      width:150,
      render: (text, record) => <p style={{width:150}}>{finishDate(text)}</p>,
    },{
      title: '结束时间',
      dataIndex: 'endDate',  
      key: 'endDate',
      width:150,
      render: (text, record) => <p style={{width:150}}>{finishDate(text)}</p>,
    },{
      title:'点赞次数',
      dataIndex: 'likes',
      key: 'likes',
      width:80,
      render: (text, record) => <p style={{width:80}} >{text}</p>,
    },{
      title:'阅读次数',
      dataIndex: 'plays',
      key: 'plays',
      width:80,
      render: (text, record) => <p style={{width:80}} >{text}</p>,
    },{
      title:'创建人',
      dataIndex: 'createName',
      key: 'createName',
      width:120,
      render: (text, record) => <p style={{width:120}} >{text}</p>,
    },{
      title: '修改人',
      dataIndex: 'updateName',
      key: 'updateName',
      width:120,
      render: (text, record) => <p style={{width:120}} >{text}</p>,
    },{
      title: '修改时间',
      dataIndex: 'updateDate',
      key: 'updateDate',
      width:150,
      render: (text, record) => <p style={{width:150}}>{finishDate(text)}</p>,
    },
    //  {
    //   title: '操作',
    //   key: 'operation',
    //   width: 100,
    //   render: (text, record) => {
    //     return <DropOption 
    //          onMenuClick={e => handleMenuClick(record, e)} 
    //          menuOptions={[
    //           { key: 'see', name: '预览' }, 
    //           { key: 'editor', name: '修改' }, 
    //           { key: 'delete', name: '删除' }, 
    //           ]} />
    //   },
    // },
  ]
   let optionlist =[{ 
        key: 'see',
        name: '预览' 
      }];
  if(!hideEditButton){ // 修改   
      optionlist.push({ 
        key: 'editor',
        name: '修改' 
      })
  }
  if(!hideDeleteButton){ //删除 
      optionlist.push({ 
        key: 'delete',
        name: '删除' 
      })
  }
  if(optionlist.length>0){
    columns.push({
      title: '操作',
      key: 'operation',
      width: 100,
      render: (text, record) => {
        return <DropOption 
          onMenuClick={e => handleMenuClick(record, e)} 
           menuOptions={optionlist} />
      },
    })
  }
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
        scroll={{x: 1700}}
        columns={columns}
        simple
        rowKey={record => record.id}
        getBodyWrapper={getBodyWrapper}
      />
      <Modal
          title="图片预览"
          wrapClassName="vertical-center-modal"
           visible={modal2Visible}
           onOk={hideModal2}
           onCancel={hideModal2}
           footer={null}
        > 
          <img alt={'avatar'} width={'100%'} src={showImg} />
          <p> </p>

      </Modal>
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
