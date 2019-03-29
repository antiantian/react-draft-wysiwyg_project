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
import Asset_Modal from './Asset_Modal'
import { arrayToTree, queryArray } from 'utils'
const ResourceType = ({ location, dispatch, app,cms_special, loading,props }) => {
  location.query = queryString.parse(location.search)
  const { list, pagination,searchlist,publishItem,typelist, currentItem, modalVisible, 
    modalType, isMotion, selectedRowKeys ,editorContent,state,publishId,
    sitelist,modalupdateSync,nowPurpose,serchlist} = cms_special
  const { pageSize } = pagination
  let selectTree = null
  // 生成树状
  if(sitelist){
    selectTree = arrayToTree(sitelist.filter(_ => _.mpid !== '-1'), 'id', 'sitePid')
  }
 
 
  const listProps = {
    typelist,
    dataSource: list,
    loading: loading.effects['cms_special/query'],
    pagination,
    location,
    isMotion,
    app,
    dispatch,
    cms_special,
    onChange (page) {
        const { state, pathname } = location
        const serchlist=state?state.serchlist:{}
        dispatch({
          type: 'cms_special/serchlist',
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
        type: 'cms_special/delete',
        payload: {
          id:id
        },
      })
    },
    onPublish (item) {
       dispatch({
          type: 'cms_special/updateState',
          payload: {
            nowPurpose: item.purpose,
          },
        })
      dispatch({
        type: 'cms_special/updateState',
        payload: {
          modalVisible:true,
          modalType: 'trial',
          publishItem: {
            publishId:item.id
          }
        },
      })

    },
    onEditItem (item) {
      const { state, pathname } = location
   
      dispatch({
        type: 'cms_special/showdetail',
        payload: {
          modalType: 'update',
          currentItem: item,
          state:{
            ...state,
            serchlist
          }
        },
      })
    },
    onShowAsset (item) {
      dispatch({
        type: 'cms_special/updateState',
        payload: {
          currentItem: item,
          modalVisible:true
        },
      })
    },
    onTopItem (item) {
   
      dispatch({
        type: 'cms_special/top',
        payload: {
          id:item.id
        },
      })
    },
  }
  const filterProps = {
    isMotion,
    typelist,
    filter: {
      ...serchlist,
    },
    hideAddButton:cms_special.hideAddButton,
    onFilterChange (value) {
        const { state, pathname } = location
        dispatch({
          type: 'cms_special/serchlist',
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
      //清空小节数据
      dispatch({
        type: 'cms_special/updateState',
        payload : {
          chapter:[{name:(new Date()).getTime()}],
          selectedRowKeys: [],
          selectedRow: [],
          releaseIds:undefined,
          releaseds:{}
        },
      })   
      dispatch({
        type: 'cms_special/showdetail',
        payload: {
          modalType:'create',
          state,
          serchlist: {
            ...serchlist,
          }
        },
      })
    },
    switchIsMotion () {
      dispatch({ type: 'cms_special/switchIsMotion' })
    },
  }

  const handleDeleteItems = () => {
    dispatch({
      type: 'cms_special/multiDelete',
      payload: {
        ids: selectedRowKeys,
      },
    })
  }
  const modalProps = {
    typelist,
    item:currentItem||{},
    modalType,
    visible: modalVisible,
    maskClosable: true,
    confirmLoading: loading.effects['cms_special/review'],
    title: '文章预览',
    wrapClassName: 'vertical-center-modal',
    onCancel () {
      dispatch({
        type: 'cms_special/updateState',
        payload: {
          modalVisible: false,
          currentItem:{}
        },
      })
    },
    okText:"发布",
    cancelText:"拒绝",
  }

  return (
       <Page inner>
           <Filter {...filterProps} />
 
            <List {...listProps} />
         
            {modalVisible && <Asset_Modal {...modalProps} />} 
            
      </Page>
  )
}
ResourceType.propTypes = {
  app: PropTypes.object,
  cms_special: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}
export default connect(({ app, cms_special,loading }) => ({ app,cms_special, loading }))(ResourceType)
