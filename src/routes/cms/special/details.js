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

const ResourceDetails = ({ location, dispatch, app,cms_special, loading }) => {
   location.query = queryString.parse(location.search)
   const { currentItem, modalVisible, modalType,editorContent,typelist,modalupdateSync,modalupdate,
      uploadMess,
	  clientOss,
	 keyOss,
	 videoAuth,
	 chapter,
	 datasValidate,
	 resourcelist,
	} = cms_special
 
   const { state, pathname } = location 
    const modalProps = {
    	datasValidate,
    	cms_special,
    	 uploadMess,
		  clientOss,
		 keyOss,
		 location,
		 videoAuth,
		 openValidate:cms_special.openValidate,
    	modalupdateSync,
    	modalupdate,
    	modalType,
	    item: modalType === 'create' ? {} : currentItem,
	    visible: modalVisible,
	    maskClosable: false,
	    typelist,
	    dispatch,
	    loading,
	    chapter,
	    confirmLoading: loading.effects['cms_special/update'],
	    title: `${modalType === 'create' ? '添加专题' : '修改专题'}`,
	    wrapClassName: 'vertical-center-modal',
	    editorContent,
	    onOk (datas) {
	    	console.log(datas)
	 
	    	dispatch({
	        type: `cms_special/${modalType}`,
	        payload: {datas,state:state.state},
	      })
	    },
	    openValidate_fun () { 
	    	dispatch({
		        type: 'cms_special/updateState',
		        payload:{openValidate:true}
		      })
	    },
		  addChapter () {
		  	let len =chapter.length;
		  	let names = (new Date()).getTime()+"_"+len;
		    chapter.push({name:names})
	        dispatch({
	             type: 'cms_special/updateState',
	             payload: {
	                    chapter:chapter
	             },
	         })
        },  
        delChapter (obj) { 
            //删除chapter的同时也要删除  相应的数据
		   let neeC = chapter.filter(item=>{
		   	  return obj.name!=item.name
		   })

           dispatch({
             type: 'cms_special/updateState',
             payload: {
                    chapter:neeC
             },
          })
        },  
	    onCancel () {
	      const { state, pathname } = location 
	      // dispatch({
	      //   type: 'cms_special/hideDetails',
	      //   payload: {
	      //     query: {
	      //       ...query,
	      //     }
	      //   },
	      // })
	      console.log(1111111111111111111)

	      console.log(location)
	       dispatch(routerRedux.push({
	        pathname:'/bronk/special',
	        state: {
	          ...state.state
	        },
	      }))
	    },
	    onEditorStateChange (data) {

	      dispatch({
	        type: 'cms_special/editorContent',
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
  cms_special: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}
export default connect(({ app, cms_special,loading }) => ({ app,cms_special, loading }))(ResourceDetails)