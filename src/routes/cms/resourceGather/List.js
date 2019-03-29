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

const List = ({dispatch, onDeleteItem, onSeeItem,onEditItem, onPublish,isMotion,typelist, location, ...tableProps ,app,cms_resourceGather}) => {
  const {modal2Visible ,showImg,hideEditButton,hideTrialButton} = cms_resourceGather;
  location.query = queryString.parse(location.search)

  const handleMenuClick = (record, e) => {
    if (e.key === 'preview') {
      onSeeItem(record)
    } else if (e.key === 'delete') {
      confirm({
        title: '确定删除这条记录吗?',
        onOk () {
          onDeleteItem(record.id)
        },
      })
     
    } else if (e.key === 'edit') {
      // confirm({
      //   title: '确定发布这条记录吗?',
      //   onOk () {
      //     alert("发布中。。。")
      //     // onDeleteItem(record.id)
      //   },
      // })
      onEditItem(record); //发布资源
    }else if (e.key === 'publish') {
      onPublish(record); //发布资源
    }
    else if (e.key === 'publish') {
      onPublish(record); //审核资源
    }
  }
  const setModal2Visible = (text) => {
     dispatch({
        type: 'cms_resourceGather/showModal2',
        payload: {
          showImg: text,
        },
      })
  }
 const hideModal2= () => {
    dispatch({
        type: 'cms_resourceGather/hideModal2',
      })
 }

  let visible=false;
  let url=null;
  let columns = [
    {
      title: '栏目',
      dataIndex: 'columnId',
      key: 'columnId',
      width:100,
      render: (text, record) => <p  style={{width:100}}>{typelist_trans(typelist,text,"columnName")}</p>,
    }, {
      title: '标题名称',
      dataIndex: 'title',
      key: 'title',
      onCellClick:onSeeItem,
      render: (text, record) => <p >{typelist_trans(typelist,text,"columnName")}</p>,
    },
    {
      title: '封面图',
      dataIndex: 'coverImg', 
      key: 'h5',
      width: 64,
      className:'thumbnail',
      render: text => <div>{text&&JSON.parse(text).h5?<img onClick={()=> setModal2Visible(JSON.parse(text).h5)} alt={'avatar'}  src={JSON.parse(text).h5} />:'无'}</div>,
    }, {
      title: '创建人',
      dataIndex: 'createName',
      key: 'createName',
      width:120,
      render: (text, record) => <p style={{width:120}}>{text}</p>,//app.user.username
    },{
      title: '创建时间',
      dataIndex: 'createDate',  
      key: 'createDate',
      width:150,
      render: (text, record) => <p>{finishDate(text)}</p>,
    },{
      title: '修改人',
      dataIndex: 'updateName',
      key: 'updateName',
      width:120,
      render: (text, record) => <p style={{width:120}}>{text}</p>,
    },{
      title: '修改时间',
      dataIndex: 'updateDate',
      key: 'updateDate',
      width:150,
      render: (text, record) => <p>{finishDate(text)}</p>,
    }, 
    // {
    //   title: '操作',
    //   key: 'operation',
    //   width: 100,
    //   render: (text, record) => {
    //     return <DropOption 
    //             onMenuClick={
    //               e => handleMenuClick(record, e)
    //             } 
    //             menuOptions={[
    //               { key: 'preview', name: '预览' }, 
    //               { key: 'edit', name: '修改' }, 
    //               { key: 'publish', name: '审核' },
    //             ]} />
    //   },
    // },
  ]
 let optionlist =[{ 
        key: 'preview',
        name: '预览' 
      }];
  if(!hideEditButton){ // 修改   
      optionlist.push({ 
        key: 'edit',
        name: '修改' 
      })
  }
  if(!hideTrialButton){ //删除
      optionlist.push({ 
        key: 'publish',
        name: '审核' 
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
        scroll={{x: 1000}}
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
