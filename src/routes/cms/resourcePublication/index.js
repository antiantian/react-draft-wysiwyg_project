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
const ResourceType = ({ location, dispatch, app,cms_resourcePublication, loading }) => {
  location.query = queryString.parse(location.search)
  const { list, pagination,searchlist,publishItem, currentItem, modalVisible, modalType, isMotion, selectedRowKeys 
    ,editorContent,state,publishId,sitelist,typelist,showParentTree,change_sitePid} = cms_resourcePublication
  const { pageSize } = pagination
  let selectTree = null
  // 生成树状
  if(sitelist){
    selectTree = arrayToTree(sitelist.filter(_ => _.mpid !== '-1'), 'id', 'sitePid')
     //console.log(selectTree)
     //console.log(sitelist)
  }
  const modalProps = {
    selectTree:selectTree,
    sitelist:sitelist,
    publishItem:publishItem,
    visible: modalVisible,
    maskClosable: false,
    confirmLoading: loading.effects['cms_resourcePublication/update'],
    title: '修改发布资源',
    wrapClassName: 'vertical-center-modal',
    onOk (data) {
      dispatch({
        type: 'cms_resourcePublication/update',
        payload: data,
      })
    },
    onCancel () {  
      dispatch({
        type: 'cms_resourcePublication/hidePushlish',
        payload: {
          publishItem: {}
        },
      })
    },
  }
  const listProps = {
    dataSource: list,
    loading: loading.effects['cms_resourcePublication/query'],
    pagination,
    location,
    isMotion,
    app,
    dispatch,
    cms_resourcePublication,
    typelist,
    onChange (page) {
        const { state, pathname } = location
        const serchlist=state?state.serchlist:{}
        dispatch({
          type: 'cms_resourcePublication/serchlist',
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
        type: 'cms_resourcePublication/delete',
        payload: id,
      })
    },
    onPublish (record) {

      dispatch({
        type: 'cms_resourcePublication/showPushlish',
        payload: {
          publishItem:record
        },
      })

    },
    onEditItem (item) {
      const { state, pathname } = location
      dispatch({
        type: 'cms_resourcePublication/showdetail',
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
    //       type: 'cms_resourcePublication/updateState',
    //       payload: {
    //         selectedRowKeys: keys,
    //       },
    //     })
    //   },
    // },
  }
  const filterProps = {
    sitelist,
    selectTree,
    typelist,
    isMotion,
    showParentTree,
    change_sitePid,
    filter: {
      ...searchlist,
    },
    onFilterChange (value) {
        const { state, pathname } = location
        dispatch({
          type: 'cms_resourcePublication/serchlist',
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
    switchIsMotion () {
      dispatch({ type: 'cms_resourcePublication/switchIsMotion' })
    },
    show_selPid () {

         dispatch({
            type: 'cms_resourcePublication/showParentTree',
          })
    },
     ParentTree_cancel () {
         dispatch({
            type: 'cms_resourcePublication/hideParentTree'
          })
    },
    ParentTree_ok () {
           dispatch({
            type: 'cms_resourcePublication/hideParentTree'
          })
    },
    changeItmeP (id) {
       dispatch({ 
          type: 'cms_resourcePublication/updateCparentPid', 
          payload: { change_sitePid:id} 
      })
    }
  }

  const handleDeleteItems = () => {
    dispatch({
      type: 'cms_resourcePublication/multiDelete',
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
  cms_resourcePublication: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}
export default connect(({ app, cms_resourcePublication,loading }) => ({ app,cms_resourcePublication, loading }))(ResourceType)
