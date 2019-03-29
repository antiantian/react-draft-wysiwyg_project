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

const List = ({dispatch, onDeleteItem, onEditItem,onTopItem,onShowAsset, onPublish,isMotion,typelist, location, ...tableProps ,app,cms_special}) => {
  const {modal2Visible ,showImg,hideEditButton,hideTopButton,hideDeleteButton} = cms_special;
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
     
    } else if (e.key === 'top') {
       
      onTopItem(record); //置顶
    }else if (e.key === 'asset') {
       
      onShowAsset(record); //看文章
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
 const  onRowMouseEnter = (record, index, event)=>{
     // console.log(record)
 }
  let visible=false;
  let url=null;
  let columns = [
    // {
    //   title: '序号',
    //   dataIndex: 'key',
    //   key: 'key',
    //   width: 64,
    //   className: styles.avatar,
    // }, 
    {
      title: '栏目',
      dataIndex: 'columnId',
      key: 'columnId',
      render: (text, record) => <p>{typelist_trans(typelist,text,"columnName")}</p>,
    }, {
      title: '专题名称',
      dataIndex: 'title',
      key: 'title',

    }, {
      title: '简介',
      dataIndex: 'synopsis',
      key: 'synopsis',
      width:200,
      render: (text, record) => <p title={text} className="websiteName" style={{width:200}}>{text}</p>,
    }, {
      title: '封面图',
      dataIndex: 'coverImg', 
      key: 'h5',
      width: 64,
      className:'thumbnail',
      render: text => <div>{text&&JSON.parse(text).h5?<img onClick={()=> setModal2Visible(JSON.parse(text).h5)} alt={'avatar'}  src={JSON.parse(text).h5} />:'无'}</div>,
    },{
      title: '最后更新时间',
      dataIndex: 'updateDate',
      key: 'updateDate',
      render: (text, record) => <p>{finishDate(text)}</p>,
    },{
      title: '置顶',
      dataIndex: 'stencilType',
      key: 'stencilType',
      width:80,
      render: (text, record) => <p>{text==2?"是":"否"}</p>,
    }
    // , {
    //   title: '操作',
    //   key: 'operation',
    //   width: 100,
    //   render: (text, record) => {
    //     return <DropOption 
    //             onMenuClick={
    //               e => handleMenuClick(record, e)
    //             } 
    //             menuOptions={[
    //               { key: 'asset', name: '文章' }, 
    //               { key: 'editor', name: '修改' }, 
    //               { key: 'top', name: '置顶' },
    //               { key: 'delete', name: '删除' }, 
    //             ]} />
    //   },
    // },
  ]
  let optionlist =[{ 
        key: 'asset',
        name: '文章' 
      }];
  if(!hideEditButton){ // 修改   
      optionlist.push({ 
        key: 'editor',
        name: '修改' 
      })
  }
  if(!hideTopButton){ //置顶  
      optionlist.push({ 
        key: 'top',
        name: '置顶' 
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
         onRowMouseEnter={onRowMouseEnter}
        className={classnames({ [styles.table]: true, [styles.motion]: isMotion })}
        bordered
        scroll={{x: 1200}}
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
