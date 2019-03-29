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
import { arrayToTree, queryArray } from 'utils'
const ResourceType = ({ location, dispatch, app,cms_resourceVideo, loading,props }) => {
  location.query = queryString.parse(location.search)
  const { list, pagination,searchlist,publishItem,typelist, currentItem, modalVisible, 
    modalType, isMotion, selectedRowKeys ,editorContent,state,publishId,
    sitelist,modalupdateSync,nowPurpose} = cms_resourceVideo
  const { pageSize } = pagination
  let selectTree = null
  // 生成树状
  if(sitelist){
    selectTree = arrayToTree(sitelist.filter(_ => _.mpid !== '-1'), 'id', 'sitePid')
  }
  const modalProps = {
    nowPurpose:nowPurpose,
    publishItem:publishItem,
    visible: modalVisible,
    maskClosable: false,
    confirmLoading: loading.effects['cms/update'],
    title: '播放资源',
    wrapClassName: 'vertical-center-modal',
    selectTree:selectTree,
    sitelist:sitelist,
    onOk (data) {
      dispatch({
        type: 'cms_resourceVideo/publishSource',
        payload: data,
      })
    },
    onCancel () {
      dispatch({
        type: 'cms_resourceVideo/hidePushlish',
        payload: {
          publishItem: {}
        },
      })
    },
  }
 
  const listProps = {
    typelist,
    dataSource: list,
    loading: loading.effects['cms_resourceVideo/query'],
    pagination,
    location,
    isMotion,
    app,
    dispatch,
    cms_resourceVideo,
    onChange (page) {
        const { state, pathname } = location
        const serchlist=state?state.serchlist:{}
        dispatch({
          type: 'cms_resourceVideo/serchlist',
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
        type: 'cms_resourceVideo/hide',
        payload: {
          id
        },
      })
    },
    onPublish (item) {
       dispatch({
          type: 'cms_resourceVideo/updateState',
          payload: {
            nowPurpose: item.purpose,
          },
        })
      dispatch({
        type: 'cms_resourceVideo/showPushlish',
        payload: {
          publishItem: {
            publishId:item.id
          }
        },
      })

    },
    onEditItem (item) {
      const { state, pathname } = location
   
      dispatch({
        type: 'cms_resourceVideo/showdetail',
        payload: {
          modalType: 'update',
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
    //       type: 'cms_resourceVideo/updateState',
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
    hideAddButton:cms_resourceVideo.hideAddButton,
    onFilterChange (value) {
        const { state, pathname } = location
        dispatch({
          type: 'cms_resourceVideo/serchlist',
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
      dispatch({
        type: 'cms_resourceVideo/showdetail',
        payload: {
          modalType:'create',
          searchlist: {
            ...state,
          }
        },
      })
    },
    switchIsMotion () {
      dispatch({ type: 'cms_resourceVideo/switchIsMotion' })
    },
  }

  const handleDeleteItems = () => {
    dispatch({
      type: 'cms_resourceVideo/multiDelete',
      payload: {
        ids: selectedRowKeys,
      },
    })
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
            {modalVisible && <Modal {...modalProps} />}
           
            
      </Page>
  )
}
ResourceType.propTypes = {
  app: PropTypes.object,
  cms_resourceVideo: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}
export default connect(({ app, cms_resourceVideo,loading }) => ({ app,cms_resourceVideo, loading }))(ResourceType)
