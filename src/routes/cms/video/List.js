import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal,Popconfirm , Button} from 'antd'
import classnames from 'classnames'
import { DropOption,VideoUpload } from 'components'
import { Link } from 'react-router-dom'
import queryString from 'query-string'
import AnimTableBody from 'components/DataTable/AnimTableBody'
import styles from '../List.less'
import {finishDate,trim} from 'commonfun'
import {typelist_trans} from 'utils'
const confirm = Modal.confirm

const List = ({dispatch, onDeleteItem, onEditItem, onPublish,isMotion,typelist, location, ...tableProps ,app,cms_resourceVideo}) => {
  const {modal2Visible ,showImg,hideEditButton,hideHideButton } = cms_resourceVideo;
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
        type: 'cms_resourceVideo/showModal2',
        payload: {
          showImg: text,
        },
      })
  }
 const hideModal2= () => {
      dispatch({
        type: 'cms_resourceVideo/hideModal2',
      })
      dispatch({
         type:'cms_resourceVideo/updateState',
         showImg:null,
      })
 }

  let visible=false;
  let url=null;
  let columns = [
    {
      title: '视频',
      dataIndex: 'coverUrl',
      key: 'coverUrl',
       width: 64,
      className:'thumbnail',
      render: (text, record) => <div>{text?<img onClick={()=> setModal2Visible(record)} alt={'avatar'}  src={text} />:'无'}</div>,
    }, {
      title: '视频标题',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '创建人',
      dataIndex: 'createName',
      key: 'createName',
      render: (text, record) => <p>{text}</p>, 
    },{
      title: '状态',
      dataIndex: 'convertStatus',  
      key: 'convertStatus',
      render: (text, record) => <p>{text==1?'转码完成':'转码中'}</p>,
    },{
      title: '更新时间',
      dataIndex: 'updateDate',
      key: 'updateDate',
      render: (text, record) => <p>{finishDate(text)}</p>,
    },{
      title: '是否隐藏',
      dataIndex: 'isHide',  
      key: 'isHide',
      render: (text, record) => <p style={{color:text==1?'red':'green'}}>{text==1?'是':'否'}</p>,
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
    //               { key: 'editor', name: '修改' }, 
    //               { key: 'delete', name: '隐藏' }, 
    //             ]} />
    //   },
    // },
  ]
 let optionlist =[];
  if(!hideEditButton){ // 修改   
      optionlist.push({ 
        key: 'editor',
        name: '修改' 
      })
  }
  if(!hideHideButton){ //置顶  
      optionlist.push({ 
        key: 'delete',
        name: '隐藏' 
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
      {modal2Visible&&
      <Modal
          title="视频预览"
          wrapClassName="vertical-center-modal"
           visible={modal2Visible}
           onOk={hideModal2}
           onCancel={hideModal2}
           footer={null}
        > 
        {showImg&&showImg.ldmp4&&
         <VideoUpload 
                 uploadMess={[
                      {
                        videoId: showImg.video,
                        url: showImg.ldmp4,
                        fail:'false',
                        coverUrl:showImg.coverUrl
                      }
                 ]}
                 limitdelete={true}
                 idName= {"videoIdplay"}
        
        />
        }
        {showImg&&!showImg.convertStatus&&
          <p>转码中</p>
        }
      </Modal>
      }
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
