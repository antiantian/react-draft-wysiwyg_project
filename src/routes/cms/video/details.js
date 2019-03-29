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

const ResourceDetails = ({ location, dispatch, app,cms_resourceVideo, loading }) => {
   location.query = queryString.parse(location.search)
   const { currentItem, modalVisible, modalType,editorContent,typelist,modalupdateSync,modalupdate,
      uploadMess,
	  clientOss,
	 keyOss,
	 videoAuth,
	} = cms_resourceVideo
   const { state, pathname } = location 
    const modalProps = {
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
	    confirmLoading: loading.effects['cms_resourceVideo/update'],
	    title: `${modalType === 'create' ? '添加视频' : '修改视频'}`,
	    wrapClassName: 'vertical-center-modal',
	    editorContent,
	    onOk (datas) {
	    	dispatch({
			        type: `cms_resourceVideo/${modalType}`,
			        payload: {datas,state:state},
			      })
	    	// if(modalType !== 'create'){
      //           dispatch({
			   //      type: 'cms_resourceVideo/dialogpublishSource',
			   //    })
	    	// }else{
	    	// 	 dispatch({
			   //      type: `cms_resourceVideo/${modalType}`,
			   //      payload: {datas,state:state},
			   //    })
	    	// } 
	    },
	    same_onOk () { 
	    	dispatch({
		        type: 'cms_resourceVideo/upsync',
		      })
	    },
	    modalupdateSync_show(datas){
	       if(datas){
	           dispatch({
	             type: 'cms_resourceVideo/updateSync',
	             payload: {datas,state:state},
	          })
	       }
		  },
	    modalupdateSync_hide(datas){
		       if(datas){
		           dispatch({
		             type: 'cms_resourceVideo/update',
		             payload: {datas,state:state},
		          })
		       }      
		  },
	    onCancel () {
	      const { state, pathname } = location 
	 
	       dispatch(routerRedux.push({
	        pathname:'/bronk/video',
	        state: {
	          ...state.searchlist
	        },
	      }))
	    },
	    onEditorStateChange (data) {

	      dispatch({
	        type: 'cms_resourceVideo/editorContent',
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
  cms_resourceVideo: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}
export default connect(({ app, cms_resourceVideo,loading }) => ({ app,cms_resourceVideo, loading }))(ResourceDetails)