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

const ResourceType = ({ location, dispatch, app,cms_resourceType, loading }) => {
   location.query = queryString.parse(location.search)
  const { list,serchlist, pagination, currentItem, modalVisible, modalType, isMotion, selectedRowKeys } = cms_resourceType
  const { pageSize } = pagination
  const modalProps = {
    item: modalType === 'create' ? {} : currentItem,
    visible: modalVisible,
    maskClosable: false,
    confirmLoading: loading.effects['cms/update'],
    title: `${modalType === 'create' ? '添加资源类型' : '修改资源类型'}`,
    wrapClassName: 'vertical-center-modal',
    onOk (data) {
      dispatch({
        type: `cms_resourceType/${modalType}`,
        payload: data,
      })
    },
    onCancel () {
      dispatch({
        type: 'cms_resourceType/hideModal',
      })
    },
  }
  const listProps = {
    dataSource: list,
    loading: loading.effects['cms_resourceType/query'],
    pagination,
    location,
    isMotion,
    app,
    cms_resourceType,
    onChange (page) {
        const { state, pathname } = location
        const serchlist=state?state.serchlist:{}
        dispatch({
          type: 'cms_resourceType/serchlist',
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
        type: 'cms_resourceType/delete',
        payload: id,
      })
    },
    onEditItem (item) {

      dispatch({
        type: 'cms_resourceType/showModal',
        payload: {
          modalType: 'update',
          currentItem: item,
        },
      })
    },
    // rowSelection: {
    //   selectedRowKeys,
    //   onChange: (keys) => {
    //     dispatch({
    //       type: 'cms_resourceType/updateState',
    //       payload: {
    //         selectedRowKeys: keys,
    //       },
    //     })
    //   },
    // },
  }
  const filterProps = {
    isMotion,
    filter: {
      ...serchlist,
    },
    onFilterChange (value) {
        const { state, pathname } = location
        dispatch({
          type: 'cms_resourceType/serchlist',
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
        state: {
          field: fieldsValue.field,
          keyword: fieldsValue.keyword,
        },
      })) : dispatch(routerRedux.push({
        pathname: '/cms/webManage',
      }))
    },
    onAdd () {
      dispatch({
        type: 'cms_resourceType/showModal',
        payload: {
          modalType: 'create',
        },
      })
    },
    switchIsMotion () {
      dispatch({ type: 'cms_resourceType/switchIsMotion' })
    },
  }

  const handleDeleteItems = () => {
    dispatch({
      type: 'cms_resourceType/multiDelete',
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
  cms_resourceType: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}
export default connect(({ app, cms_resourceType,loading }) => ({ app,cms_resourceType, loading }))(ResourceType)
