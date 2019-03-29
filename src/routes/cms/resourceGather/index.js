import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import { Row, Col, Button, Popconfirm } from 'antd'
import { Page } from 'components'
import queryString from 'query-string'
import styles from './index.less'
import List from './List'
import Filter from './Filter'
import Modal from './Modal'
import Trial_Modal from './trial_Modal'
import { arrayToTree, queryArray } from 'utils'
const ResourceType = ({ location, dispatch, app,cms_resourceGather, loading,props }) => {
  location.query = queryString.parse(location.search)
  const { list, pagination,searchlist,publishItem,typelist, currentItem, modalVisible, 
    modalType, isMotion, selectedRowKeys ,editorContent,state,publishId,
    sitelist,modalupdateSync,nowPurpose,uploadMess} = cms_resourceGather
  const { pageSize } = pagination
  let selectTree = null
  // 生成树状
  if(sitelist){
    selectTree = arrayToTree(sitelist.filter(_ => _.mpid !== '-1'), 'id', 'sitePid')
  }
 
  const listProps = {
    typelist,
    dataSource: list,
    loading: loading.effects['cms_resourceGather/query'],
    pagination,
    location,
    isMotion,
    app,
    dispatch,
    cms_resourceGather,
    onChange (page) {
        const { state, pathname } = location
        const serchlist=state?state.serchlist:{}
        dispatch({
          type: 'cms_resourceGather/serchlist',
          payload: {
            state:{...state},
            serchlist:{
              ...serchlist,
              pageNo: page.current,
              pageSize: page.pageSize,
            }
          },
        })
    },
    onDeleteItem (id) {

      dispatch({
        type: 'cms_resourceGather/delete',
        payload: id,
      })
    },
    onPublish (item) {
       dispatch({
          type: 'cms_resourceGather/updateState',
          payload: {
             modalVisible:true,
             modalType: 'trial',
             currentItem: item,
             nowPurpose: item.purpose,
          },
        })
 

    },
    onEditItem (item) {
      const { state, pathname } = location
   
      dispatch({
        type: 'cms_resourceGather/showdetail',
        payload: {
          modalType: 'update',
          currentItem: item,
          searchlist: {
            ...state,
          }
        },
      })
    },
    onSeeItem (item) {
      const { state, pathname } = location
   
      dispatch({
        type: 'cms_resourceGather/showdetail',
        payload: {
          modalType: 'preview',
          currentItem: item,
          searchlist: {
            ...state,
          }
        },
      })
    },
    // rowSelection: {
    //   selectedRowKeys,
    //   onChange: (keys) => {
    //     dispatch({
    //       type: 'cms_resourceGather/updateState',
    //       payload: {
    //         selectedRowKeys: keys,
    //       },
    //     })
    //   },
    // },
  }
  const filterProps = {
    isMotion,
    typelist,
    filter: {
      ...searchlist,
    },
    hideAddButton:cms_resourceGather.hideAddButton,
    onFilterChange (value) {
        const { state, pathname } = location
        dispatch({
          type: 'cms_resourceGather/serchlist',
          payload: {
            state:{...state},
            serchlist:{
              ...value,
              pageNo: 1,
              pageSize,
            }
          },
        })
    },
    onSearch (fieldsValue) {
      fieldsValue.keyword.length ? dispatch(routerRedux.push({
        pathname: '/cms/webManage',
        query: {
          field: fieldsValue.field,
          keyword: fieldsValue.keyword,
        },
      })) : dispatch(routerRedux.push({
        pathname: '/cms/webManage',
      }))
    },
    onAdd () {
      const { state, pathname } = location
      console.log(state)
      dispatch({
        type: 'cms_resourceGather/showdetail',
        payload: {
          modalType:'create',
          searchlist: {
            ...state,
          }
        },
      })
    },
    switchIsMotion () {
      dispatch({ type: 'cms_resourceGather/switchIsMotion' })
    },
  }

  const handleDeleteItems = () => {
    dispatch({
      type: 'cms_resourceGather/multiDelete',
      payload: {
        ids: selectedRowKeys,
      },
    })
  }
  const modalProps = {
     uploadMess:cms_resourceGather.uploadMess,
      clientOss:cms_resourceGather.clientOss,
     keyOss:cms_resourceGather.keyOss,
     videoAuth:cms_resourceGather.videoAuth,
     resUser:cms_resourceGather.resUser,
      modalType,
      item: modalType === 'create' ? {} : currentItem,
      visible: modalVisible,
      maskClosable: true,
      typelist,
      dispatch,
      confirmLoading: loading.effects['cms_resourceGather/update'],
     title: '投稿审核',
    wrapClassName: 'vertical-center-modal',
    onReview_Y (data) {
      dispatch({
        type: "cms_resourceGather/publishSource",
        payload:{
           resourceId:currentItem.id,
           isReview:0,   //0 通过
           remark:data.remark
        },
      })
    },
    onReview_N (data) {
     
      dispatch({
        type:"cms_resourceGather/publishSource",
        payload:{
           resourceId:currentItem.id,
           isReview:1, //1 拒绝
           remark:data.remark
        },
      })
    },
    onCancel () {
      dispatch({
        type: 'cms_resourceGather/updateState',
        payload: {
           modalVisible:false,
          currentItem: {}

        },
      })
    },
    okText:"发布",
    cancelText:"拒绝",
  }

  return (
       <Page inner>
           <Filter {...filterProps} />
            {
              selectedRowKeys.length > 0 &&
              <Row style={{ marginBottom: 24, textAlign: 'right', fontSize: 13 }}>
                <Col>
                  {`Selected ${selectedRowKeys.length} items `}
                  <Popconfirm title={'你确定要删除这些记录吗?'} placement="left" onConfirm={handleDeleteItems}>
                    <Button type="primary" size="large" style={{ marginLeft: 8 }}>删除</Button>
                  </Popconfirm>
                </Col>
              </Row>
            }
            <List {...listProps} />
            {modalVisible && <Trial_Modal {...modalProps} />}
             
            
      </Page>
  )
}
ResourceType.propTypes = {
  app: PropTypes.object,
  cms_resourceGather: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}
export default connect(({ app, cms_resourceGather,loading }) => ({ app,cms_resourceGather, loading }))(ResourceType)
