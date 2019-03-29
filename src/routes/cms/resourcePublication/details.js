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

const ResourceDetails = ({ location, dispatch, app,cms_resourcePublication, loading }) => {
   location.query = queryString.parse(location.search)
   const { currentItem, modalVisible, modalType,editorContent,typelist,resUser} = cms_resourcePublication
    const modalProps = {
	    item: modalType === 'create' ? {} : currentItem,
	    visible: modalVisible,
	    maskClosable: false,
	    typelist,
	    resUser,
	    confirmLoading: loading.effects['cms_resourcePublication/update'],
	    titlePub:'发布资源预览',
	    wrapClassName: 'vertical-center-modal',
	    onCancel () {
	      const { state, pathname } = location 
	       dispatch(routerRedux.push({
	        pathname:'/bronk/release',
	        state: {
	          ...state.searchlist
	        },
	      }))
	    },
  }  
  return (
       <Page inner>
            <GatherDel {...modalProps} />
      </Page>
  )
}
ResourceDetails.propTypes = {
  app: PropTypes.object,
  cms_resourcePublication: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}
export default connect(({ app, cms_resourcePublication,loading }) => ({ app,cms_resourcePublication, loading }))(ResourceDetails)