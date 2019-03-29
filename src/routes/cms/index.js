import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import { Row, Col, Button, Popconfirm ,Radio ,Icon,Modal} from 'antd'
import { Page } from 'components'
import queryString from 'query-string'
import List from './List'
import Filter from './Filter'
import InnerModal from './Modal'
import { arrayToTree, queryArray } from 'utils'
import {createTrees,parentUrl} from 'utils'
const RadioGroup = Radio.Group;
const Cms = ({ location, dispatch, app, cms, loading }) => {
    location.query = queryString.parse(location.search)
    const { list,searchlist, pagination, currentItem, modalVisible, modalType, isMotion, selectedRowKeys,sitelist,showParentTree,change_sitePid} = cms
    const { pageSize } = pagination  
    let selectTree = null
      // 生成树状
      if(sitelist){
        selectTree = arrayToTree(sitelist.filter(_ => _.mpid !== '-1'), 'id', 'sitePid')
         //console.log(selectTree)
         //console.log(sitelist)
      }
    const modalProps = {
      item: modalType === 'create' ? {} : currentItem,
      visible: modalVisible,
      maskClosable: false,
      confirmLoading: loading.effects['cms/update'],
      title: `${modalType === 'create' ? '添加站点' : '修改站点'}`,
      wrapClassName: 'vertical-center-modal',
      modalType,
      selectTree:selectTree,
      onOk(data) {
        dispatch({
          type: `cms/${modalType}`,
          payload: data,
        })
      },
      onCancel() {
        dispatch({
          type: 'cms/hideModal',
        })
      },
    }

    const listProps = {
      dataSource: list,
      loading: loading.effects['cms/query'],
      pagination,
      location,
      isMotion,
      app,
      cms,
      onChange(page) {
        const { state, pathname } = location
        const serchlist=state?state.serchlist:{}
        dispatch({
          type: 'cms/serchlist',
          payload: {
            state:{...state},
            serchlist:{
              ...serchlist,
              pageNo: page.current,
              pageSize: page.pageSize,
            }
          },
        })
        // dispatch(routerRedux.push({
        //   pathname,
        //   state: {
        //     ...state,
        //     serchlist:{
        //       ...serchlist,
        //       pageNo: page.current,
        //       pageSize: page.pageSize,
        //     }
        //   },
        // }))
      },
      onDeleteItem(id) {
        dispatch({
          type: 'cms/delete',
          payload: id,
        })
      },
      onEditItem(item) {
        dispatch({
          type: 'cms/showModal',
          payload: {
            modalType: 'update',
            currentItem: item,
            change_sitePid:item.sitePid
          },
        })
      },
      onEditParent(item) {
         dispatch({
          type: 'cms/showParentTree',
          payload: {currentItem: item,change_sitePid:item.sitePid},
        })
      },
    }

    const filterProps = {
      isMotion,
      filter: {
        ...searchlist,
      },
      onFilterChange(value) {
        const { state, pathname } = location
        const serchlist=state?state.serchlist:{}
        dispatch({
          type: 'cms/serchlist',
          payload: {
            state:{...state},
            serchlist:{
              ...value,
              pageNo: 1,
              pageSize,
            }
          },
        })

        // const {serchlist}=location.state
        // dispatch(routerRedux.push({
        //   pathname: location.pathname,
        //   state: {
        //      ...state,
        //      serchlist:{
        //       ...value,
        //       pageNo: 1,
        //       pageSize,
        //     }
        //   },
        // }))
      },
      onSearch(fieldsValue) {
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
      onAdd() {
        dispatch({
          type: 'cms/showModal',
          payload: {
            modalType: 'create',
          },
        })
      },
      switchIsMotion() {
        dispatch({ type: 'cms/switchIsMotion' })
      },
    }

    const handleDeleteItems = () => {
      dispatch({
        type: 'cms/multiDelete',
        payload: {
          ids: selectedRowKeys,
        },
      })
    }
   const emitEmpty = () => {

         setFields({
              siteUrl: {
                value:''
              },
         });
         changeItmeP(null)

  }
  
  const getTreeMess = (item) =>{
    const nowId=item.id;
    const nowUrl=item.siteUrl
    const combineUrl=parentUrl(nowId,sitelist); //拼接url
   

    dispatch({ 
        type: 'cms/updateCparentPid', 
        payload: { change_sitePid:nowId} 
    })
    
    // alert(nowId)
  }
  const ParentTree_cancel = () =>{
       dispatch({
          type: 'cms/hideParentTree',
          payload: {
            
          },
        })
  }
  const ParentTree_ok = () =>{
    
        dispatch({
          type: 'cms/updatePId',
          payload:  {
              id: currentItem.id,
              sitePid: change_sitePid
          },
        })
  }
    let treeElement=selectTree?createTrees(selectTree,change_sitePid,currentItem.id,getTreeMess):null;
    return ( 
      <Page inner >
          <Filter { ...filterProps }/> 
          {
            selectedRowKeys.length > 0 &&
              <Row style = { { marginBottom: 24, textAlign: 'right', fontSize: 13 } } >
                <Col > { `Selected ${selectedRowKeys.length} items ` } 
                  <Popconfirm title = { '你确定要删除这些记录吗?' } placement = "left" onConfirm = { handleDeleteItems } >
                      <Button 
                        type = "primary"
                        size = "large"
                        style = { { marginLeft: 8 } } >
                        删除 
                      </Button> 
                  </Popconfirm> 
                </Col> 
              </Row>    
          } 
          <List { ...listProps }/> 
          {modalVisible && 
            < InnerModal { ...modalProps }/>
          } 
           <Modal
                title="父站点修改"
                wrapClassName="vertical-center-modal"
                visible={showParentTree}
                onCancel={ParentTree_cancel} 
                onOk={ParentTree_ok}
              >  
                {currentItem.id}
                {currentItem.sitePid}
                {change_sitePid}
                <p style= {{padding:"10px 0"}}>当前选中的父节点为：{sitelist?parentUrl(change_sitePid,sitelist):""}</p>
                {treeElement}
         </Modal>
      </Page>
      )
    }

    Cms.propTypes = {
      app: PropTypes.object,
      cms: PropTypes.object,
      location: PropTypes.object,
      dispatch: PropTypes.func,
      loading: PropTypes.object,
    }

    export default connect(({ app, cms, loading }) => ({ app, cms, loading }))(Cms)
