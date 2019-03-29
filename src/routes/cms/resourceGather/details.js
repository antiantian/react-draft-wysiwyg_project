import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import queryString from 'query-string'
import { Form, Input,Select, InputNumber, Radio, Modal, Cascader , Upload, Icon,Row, Col, Card, Button, Popconfirm } from 'antd'
import { UploadImage,Editor ,Page} from 'components'
import { convertToRaw } from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import draftToMarkdown from 'draftjs-to-markdown'
import GatherDel from './Dev'

const ResourceDetails = ({ location, dispatch, app,cms_resourceGather, loading }) => {
   location.query = queryString.parse(location.search)
   const { currentItem, modalVisible, modalType,editorContent,typelist,modalupdateSync,modalupdate,
      uploadMess,
	  clientOss,
	 keyOss,
	 videoAuth,
	 resUser,
	} = cms_resourceGather
   const { state, pathname } = location 
    const modalProps = {
    	resUser,
    	 uploadMess,
		  clientOss,
		 keyOss,
		 videoAuth,
    	modalupdateSync,
    	modalupdate,
    	modalType,
	    item: modalType === 'create' ? {} : currentItem,
	    visible: modalVisible,
	    maskClosable: false,
	    typelist,
	    dispatch,
	    confirmLoading: loading.effects['cms_resourceGather/update'],
	    title: `${modalType === 'create' ? '添加资源' :modalType === 'preview'?'预览资源':'修改资源'}`,
	    wrapClassName: 'vertical-center-modal',
	    editorContent,
	    onOk (datas) {
	    	
	    	     dispatch({
			        type: `cms_resourceGather/${modalType}`,
			        payload: {datas,state:state},
			      })
	    },
	    onCancel () {
	      const { state, pathname } = location 
	      // dispatch({
	      //   type: 'cms_resourceGather/hideDetails',
	      //   payload: {
	      //     query: {
	      //       ...query,
	      //     }
	      //   },
	      // })
	       dispatch(routerRedux.push({
	        pathname:'/bronk/submission',
	        state: {
	          ...state.searchlist
	        },
	      }))
	    },
	    same_onOk () { 
	    	dispatch({
		        type: 'cms_resourceGather/upsync',
		      })

	    },
	    modalhide () { 
	    	dispatch({
		        type: 'cms_resourceGather/modalup_hide',
		      })
	    },
	    modalupdateSync_show(datas){
	       if(datas){
	           dispatch({
	             type: 'cms_resourceGather/updateSync',
	             payload: {datas,state:state},
	          })
	           dispatch({
		        type: 'cms_resourceGather/modalup_hide',
		      })
	       }
		  },
	    onEditorStateChange (data) {

	      dispatch({
	        type: 'cms_resourceGather/editorContent',
	        payload: {editorContent : data}
	      })
	    }
  }  
  return (
       <Page inner>
            <GatherDel {...modalProps} />
      </Page>
  )
}
ResourceDetails.propTypes = {
  app: PropTypes.object,
  cms_resourceGather: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}
export default connect(({ app, cms_resourceGather,loading }) => ({ app,cms_resourceGather, loading }))(ResourceDetails)