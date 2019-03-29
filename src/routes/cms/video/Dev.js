/**
 * 
 * @authors zcy (1366969408@qq.com)
 * @date    2017-11-02 17:22:03
 * @version $Id$
 */

import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input,Select, InputNumber, Radio, Modal, Cascader , Upload, Icon,Row, Col, Card,Button,message} from 'antd'
import { UploadImage,InEditor,NewSelect,Definedupload,VideoUpload} from 'components'
 
import { CompositeDecorator,
        ContentBlock,
        ContentState,
        EditorState,
        convertFromHTML,
        convertToRaw, 
        Modifier, 
      } from 'draft-js'
import htmlToDraft from 'html-to-draftjs';

import { Editor } from 'react-draft-wysiwyg'
//import draftToHtml from 'draftjs-to-html'
import draftToHtml from './d_html'
import draftToMarkdown from 'draftjs-to-markdown'
import {config ,typelist_trans,getObjectURL,uploadFile} from 'utils'
import ConvertToRawDraftContent from '../ConvertToRawDraftContent'
import { OrderedMap } from 'immutable';
import axios from 'axios'
import qs from 'qs'
 
var stateFromHTML = require('draft-js-import-html').stateFromHTML;
const { appID,api } = config
const {resourceUpload,uploadVideo,getImgUrl,uploadImgAuth} = api

const FormItem = Form.Item
const Option = Select.Option;
const { TextArea } = Input;
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
}

function uploadEdit(file) {
  return new Promise(
    (resolve, reject) => {
 
      const xhr = new XMLHttpRequest();
      xhr.open('POST',resourceUpload);
      xhr.setRequestHeader('Authorization', 'Client-ID XXXXX');
      const data = new FormData();
      data.append('file', file);
      xhr.send(data);

      xhr.addEventListener('load', () => {
        const response = JSON.parse(xhr.responseText);
        /**插件内部需要img src*/
        response.data.link=response.data.fileUpload;
        resolve(response);
      });
      xhr.addEventListener('error', () => {
        const error = JSON.parse(xhr.responseText);
        reject(error);
      });
    }
  );
}
const gatherDel = ({
  item = {},
  onOk,
  modalType,
  same_onOk,
  modalupdateSync_show,
  modalupdateSync_hide,
  editorContent,
  onCancel,
  title,
  typelist,
  dispatch,
  modalupdateSync,
  modalupdate,
  onEditorStateChange,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    setFields,
  },
  uploadMess,
  clientOss,
  keyOss,
  videoAuth,
  ...modalProps
}) => {
  //修改图片插件  阿里云上传
   const uploadImageCallBack = (file) =>  {
 
    return new Promise(
       (resolve, reject) => {
        //
               const key = keyOss+"/"+(new Date()).getTime()+file.name;
                       uploadFile(file,clientOss,key,1).then(res=>{
                       //成功 
                        let resultAliUrl = res.res.requestUrls[0];
                        let successIndex = res.successIndex;
                         axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
                        axios.defaults.transformRequest=[
                            function(data) {
                              //为了避免qs格式化时对内层对象的格式化先把内层的对象转为
                                data = JSON.stringify(data);
                              //由于使用的form-data传数据所以要格式化
                              return data;
                            }
                          ]
                         axios.post(api.getImgUrl,{
                            url:res.name
                         })
                        .then(function(response){
                            if(response.data.code==0){
                                /**插 件内部需要img src*/
                               response.data.link= response.data.data.imgUrl;
                    
                               resolve(response);
                            }else{
                                reject('失败了');
                            }
                        })
                        .catch(function(error){
                             reject(error);
                        })
                       
                  },function(error){
                    //成功 
                
                       reject(error);    
                   }) 
     }
  );
}

 const html_draft = (html) => {
  //console.log(html)
  //不用 convertFromHTML 的 原因  ： 内部style不会转换 

   const contentBlock = convertFromHTML(html);

     let editorState= EditorState.createEmpty()
     if(contentBlock.contentBlocks){
       let blockMap = new OrderedMap({});
        const contentState=ContentState.createFromBlockArray(
            contentBlock.contentBlocks,contentBlock.entityMap
          )
       editorState = EditorState.createWithContent(contentState);
     }
 
    return editorState
 }
 const sunbmitData = () => {
        let fields = getFieldsValue()   
        const data = {
          ...fields,
          "coverUrl": fields["coverUrl"]? fields["coverUrl"][0].aliurl :null,
          "videoId":fields["videoId"]? fields["videoId"][0].videoId :null,
        }
        if(data.content&&Object.prototype.toString.call(data.content)!='[object String]'){
           data.content =draftToHtml(convertToRaw((data.content).getCurrentContent())) 
        }
        data.appId= data.appId||appID
        return data
 }
  const modalupdateSync_show1 = () => {
       var datas=sunbmitData();
       modalupdateSync_show(datas)        
      
  }
  const modalupdateSync_hide1 = () => {
       var datas=sunbmitData();
       modalupdateSync_hide(datas); 
  }
  const modalup_hide = () => {
          dispatch({
             type: 'cms_resourceVideo/modalup_hide',
          })
  }

  const handleOk = () => {
      validateFields((errors) => {
        if (errors) {
          message.error('请填写必填信息');
          return
        }
      // 提交之前转换参数
       
        onOk(sunbmitData())
        
      })
  }

  const normFile = (list) => {
 
    if (Array.isArray(list)) {
      return list;
    }
    return  list  ;
  }
  const onEditorFile = (list) => {

    item.editorContent=list ? draftToHtml(convertToRaw(list.getCurrentContent())) : '';
    return draftToHtml(convertToRaw(list.getCurrentContent()));
  }
  const edit= (list) => {
    this.props.onChange(list);
  }
  const modalOpts = {
    ...modalProps,
    onOk: handleOk,
  }

 const logState = () => {
    const content = editorContent.getCurrentContent();
  };
 const SelectonChange = (key,values) => {
      return  key
  }
  const trim = (s) => {
    return s.replace(/(^\s*)|(\s*$)/g, "");
}
 const contentVal = (rule, value, callback) => {

     if(Object.prototype.toString.call(value)=='[object String]'){
        
        if(trim(value)=="<p></p>"){
            callback();
        }else{
           callback()
        }
       
     }else{
       callback()
     }
     
  }
  const  imageVal =(rule, value, callback) => {
 
        if(value){
                if (value&&value[0].fail&&value[0].fail=='false'){
                         callback()
                  }else{
                       callback('图片上传失败，请重新上传!');
                  }   
        }else{
            callback()
        }
       
       
  }
  const  videoVal =(rule, value, callback) => {

        if(value){
                if (value&&value[0]&&value[0].fail&&value[0].fail=='false'){
                         callback()
                  }else{
                       callback('视频上传失败，请重新上传!');
                  }   
        }else{
            callback()
        }
       
       
  }
   const setFilter = (name,key) => {
     setFields({
              [name]: {
                value:key
              },
      });
  
 } 
 
 const normtitle = (e) => {
     var value=(e.target.value)
     if(value){
        if(value.length>0){
          return trim(value)
        }else{
          return null
        }
        
     }
 }

 const startUp = () => {
     uploader.startUpload();
 }

  return (
    <div>
   {/** <ConvertToRawDraftContent/>*/}
      <Modal
            title="提示"
            wrapClassName="vertical-center-modal"
            visible={modalupdateSync}
            onOk={modalupdateSync_show1}
            onCancel={modalup_hide}
           
          >
            <p>是否保存并同步发布内容</p>
     </Modal>
     <Modal
            title="提示"
            wrapClassName="vertical-center-modal"
            visible={modalupdate}
            onOk={modalupdateSync_hide1}
            onCancel={modalup_hide}
           
          >
            <p>是否保存并发布内容</p>
     </Modal>
      <h2 className="titleCommon" style={{ marginBottom: 15 }}>{title}
          <Button onClick={onCancel} style={{float:'right'}}>
             返回
          </Button>
      </h2>
      <Form layout="horizontal">
         <FormItem label="视频标题" hasFeedback {...formItemLayout}>
          {getFieldDecorator('name', {
            initialValue: item.name,
            rules: [
              {
                required: false,
              },
            ],
          })(<Input />)}
        </FormItem>
       
         <FormItem label="视频" hasFeedback {...formItemLayout}>
          {getFieldDecorator('videoId', {
            initialValue: item.ldmp4? [{
              videoId: item.videoId,
              url: item.ldmp4,
              fail:'false',
              coverUrl:item.coverUrl
            }] :undefined,
            valuePropName: 'uploadMess',
            getValueFromEvent:normFile,
            rules: [
              {
                required: true,
                message: '请上传视频!',
                
              }, {
                validator:videoVal
              }
            ],
          })( <VideoUpload 
                 limit={1}
                  idName= {"videoId"}
                 videoAuth={videoAuth}
              />)}
        </FormItem>
        
        <FormItem label="视频封面图" hasFeedback {...formItemLayout}>
          {getFieldDecorator('coverUrl', {
            initialValue: item.coverUrl? [{
              aliurl: item.coverUrl,
              url: item.coverUrl,
              fail:'false',
            }] :undefined,
            valuePropName: 'uploadMess',
            getValueFromEvent:normFile,
            rules: [
              {
                required: false,
                message: '请上传视频封面图!',
                
              }, {
                validator:imageVal
              }
            ],
          })( <Definedupload 
                 limit={1}
                 clientOss={clientOss}
                 keyOss={keyOss}
              />)}
        </FormItem>
        
         <FormItem label="文本内容" hasFeedback {...formItemLayout}>
          {getFieldDecorator('content', {
            initialValue: item.content?html_draft(item.content):EditorState.createEmpty(),
            valuePropName: 'editorState',
            getValueFromEvent:onEditorFile,
            rules: [
              {
                required: false,
                message: '请填写文本内容!',
                validator:contentVal
              },
            ],
          })(<InEditor 
                wrapperStyle={{  
                  minHeight: 500,
                }}
                editorStyle={{
                  minHeight: 376,
                  maxHeight: 500,
                  overflow:'auto',
                }}
                placeholder="请编辑内容..."
                toolbar={{
                  image: { uploadCallback: uploadImageCallBack, alt: { present: true, mandatory: false } },
                }}
                customDecorators={[
                  {
                    strategy: findLinkEntities,
                    component: Link,
                  },
                  {
                    strategy: findImageEntities,
                    component: Image,
                  },
                ]}
              />)}
        </FormItem>        
        <FormItem label="标签" hasFeedback {...formItemLayout}>
          {getFieldDecorator('tag', {
            initialValue: item.tag,
            rules: [
              {
                required: false,
              },
            ],
          })(<Input />)}
        </FormItem>
       
     
      </Form>
 
      <div className="qc-save">
          <Button type="primary" onClick={handleOk} style={{marginLeft:10}}>保存</Button>
      </div>
    </div>
  )

}
const textareaStyle = {
      minHeight: 496,
      width: '100%',
      background: '#f7f7f7',
      borderColor: '#F1F1F1',
      padding: '16px 8px',
    }
gatherDel.propTypes = {
  form: PropTypes.object.isRequired,
  type: PropTypes.string,
  item: PropTypes.object,
  onOk: PropTypes.func,
}

function findLinkEntities(contentBlock, callback, contentState) {
        contentBlock.findEntityRanges(
          (character) => {
            const entityKey = character.getEntity();
            
            return (
              entityKey !== null &&
              contentState.getEntity(entityKey).getType() === 'LINK'
            );
          },
          callback
        );
      }
      function findImageEntities(contentBlock, callback, contentState) {
        contentBlock.findEntityRanges(
          (character) => {
            const entityKey = character.getEntity();
            return (
              entityKey !== null &&
              contentState.getEntity(entityKey).getType() === 'IMAGE'
            );
          },
          callback
        );
      }

const Link = (props) => {
  const {url} = props.contentState.getEntity(props.entityKey).getData();
  return (
    <a href={url} style={styles.link}>
      {props.children}
    </a>
  );
};
const Image = (props) => {
  
  const {
    height,
    src,
    width,
  } = props.contentState.getEntity(props.entityKey).getData();

  return (
    <img src={src} height={height} width={width} />
  );
};
const styles = {
        root: {
          fontFamily: '\'Helvetica\', sans-serif',
          padding: 20,
          width: 600,
        },
        editor: {
          border: '1px solid #ccc',
          cursor: 'text',
          minHeight: 80,
          padding: 10,
        },
        button: {
          marginTop: 10,
          textAlign: 'center',
        },
      };
export default Form.create()(gatherDel)


class ExtraMessage extends React.Component {
  constructor(props) {
      super(props);
      this.state={
          value:this.props.value?JSON.parse(this.props.value):{"contentAuthor":"","contentSource":""}
      }
  }
  componentDidMount(){

  }
  changeIn = (e) => {
    var name= e.target.name;
    var value= e.target.value;
    var valus= this.state.value;
    valus[name]=value;
    this.setState({
        value:valus
    },()=>{
      this.props.onChange(JSON.stringify(this.state.value))
      // if(this.state.value.contentAuthor.length==0&&this.state.value.contentSource.length==0){
      //    this.props.onChange()
      // }else{
      //   this.props.onChange(JSON.stringify(this.state.value))
      // }     
    })

  }
  render(){
    return(
      <div>
        <Row>
          <Col span={4}>
            <label>作者：</label>
          </Col>
          <Col span={20}>
            <Input name="contentAuthor" value={this.state.value.contentAuthor} onChange={this.changeIn}/>
          </Col> 
        </Row>    
        <Row>
          <Col span={4}>
             <label>来源：</label>
          </Col>
          <Col span={20}>
           <Input name="contentSource" value={this.state.value.contentSource} onChange={this.changeIn}/>
          </Col> 
        </Row>
      </div>
    )
  }
}