/**
 * 
 * @authors zcy (1366969408@qq.com)
 * @date    2017-11-02 17:22:03
 * @version $Id$
 */

import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input,Select, InputNumber, Radio, Modal, Cascader , Upload, Icon,Row, Col, Card,Button,message,TreeSelect} from 'antd'
import { UploadImage,InEditor,NewSelect,S_html,Definedupload,VideoUpload} from 'components'
 
import { CompositeDecorator,
        ContentBlock,
        ContentState,
        EditorState,
        //convertFromHTML,
        convertToRaw, 
        Modifier, 
      } from 'draft-js'
      //  import { 
      //   convertFromHTML,
 
      // } from './draft/Draft.js'
import htmlToDraft from 'html-to-draftjs';
import {convertFromHTML} from  'draft-convert';
import { Editor } from 'react-draft-wysiwyg'
//import draftToHtml from 'draftjs-to-html'
import draftToHtml from './d_html'
import draftToMarkdown from 'draftjs-to-markdown'
import {config ,typelist_trans,getObjectURL,uploadFile,stencilText,stencil_C_text} from 'utils'
import ConvertToRawDraftContent from '../ConvertToRawDraftContent'
import { OrderedMap } from 'immutable';
import axios from 'axios'
import qs from 'qs'

import {arrayToSelectTree} from 'utils'
import lodash from 'lodash'
import LayoutComponent  from './Component'
 const RadioGroup = Radio.Group;
var stateFromHTML = require('draft-js-import-html').stateFromHTML;
const { api } = config
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
  editorContent,
  onCancel,
  title,
  typelist,
  resUser,
  dispatch,
  onEditorStateChange,
  modalupdateSync,
  modalupdateSync_show,
  same_onOk,
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
  modalhide,
  ...modalProps
}) => {
  console.log(resUser)
  console.log(item)
 console.log(typelist)
  const disabled = !(modalType == "create" ||modalType == "update")
  let stencilTypes = null ;
  
  //修改图片插件  阿里云上传
   const uploadImageCallBack = (file) =>  {
     console.log(file)
    return new Promise(
       (resolve, reject) => {
        //
                 // const key = keyOss+"/"+(new Date()).getTime()+file.name;
                    const fileO= file.name.split(".");
                    let ownName= fileO[fileO.length-1];
                    const key =  keyOss+"/"+(new Date()).getTime()+'.'+ownName;  //+file.name  随机名称

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
                         axios.post(api.aliImgUrl,{
                            url:res.name
                         })
                        .then(function(response){
                            if(response.data.code==200){ 
                                /**插 件内部需要img src*/
                               response.data.link= response.data.data.imgUrl;
                    
                               resolve(response);
                            }else{
                                reject('失败了');
                            }
                        })
                        .catch(function(error){
                             reject(error);
                             console.log(error)
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
  // console.log(stateFromHTML(html))
  //  const contentBlock2 = htmlToDraft(html);
  //  console.log(contentBlock2)
  //  let editorState= EditorState.createEmpty()
  //   console.log(contentBlock2.contentBlocks)
  //   if (contentBlock2) {
  //     const contentState = stateFromHTML(html)||ContentState.createFromBlockArray(contentBlock2.contentBlocks);
  //     editorState = EditorState.createWithContent(contentState);
   
  //   }

 
var anchorAttr = ['className', 'href', 'rel', 'target', 'title'];

  var imgAttr = ['alt', 'className', 'height', 'src', 'width'];
   const contentBlock = convertFromHTML({
//.createEntity('EMBEDDED_LINK', 'MUTABLE', { src: embeddedLink, height, width }) VIDEO EMBEDDED_LINK
    htmlToEntity: (nodeName, node, createEntity) => {
   
        if (nodeName === 'iframe') {
           node.textContent = '内嵌的';
            return createEntity(
                'VIDEO',
                'MUTABLE',
                { src: node.getAttribute('src'), height:node.getAttribute('height'),width:node.getAttribute('width')}
            )
        }
        if (nodeName === 'a') {
            return createEntity(
                'LINK',
                'MUTABLE',
                {url: node.href}
            )
        }
  
        if (nodeName === 'img') {
           var image = node;
           var entityConfig = {};
            imgAttr.forEach(function (attr) {
                  var imageAttribute = image.getAttribute(attr);
                  if (imageAttribute) {
                    entityConfig[attr] = imageAttribute;
                  }
                });
              node.textContent = '\u6211\u662f\u76f8\u673a';
               return createEntity('IMAGE', 'MUTABLE',entityConfig || {});
        }
    },
})(html);
   console.log(contentBlock)
      console.log(contentBlock.contentBlocks)
     let editorState= EditorState.createEmpty()
     if(contentBlock.contentBlocks){
       let blockMap = new OrderedMap({});
        const contentState=ContentState.createFromBlockArray(
            contentBlock.contentBlocks,contentBlock.entityMap
          )
       editorState = EditorState.createWithContent(contentState);
     }

 editorState = EditorState.createWithContent(contentBlock);
    return editorState
 }
 const sunbmitData = () => {
        let fields = getFieldsValue()   
        const data = {
          ...fields,
          "videoImg": fields["videoImg"]? fields["videoImg"][0].aliurl :null,
          "coverImgH5": fields["coverImgH5"]? fields["coverImgH5"][0].aliurl :null,
          "videoId":fields["videoId"]? fields["videoId"][0].videoId :null,
        }
        if(data.content&&Object.prototype.toString.call(data.content)!='[object String]'){
           data.content =draftToHtml(convertToRaw((data.content).getCurrentContent())) 
        }
        data["purpose"]=2;
       // data["typeId"]=1;
        return data
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
 const same_handleOk = () => {
      validateFields((errors) => {
        if (errors) {
          message.error('请填写必填信息');
          return
        }
      // 提交之前转换参数
       
        same_onOk(sunbmitData())
        
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
   const setFilter = (name,key) => {
     setFields({
              [name]: {
                value:key
              },
      });
  
 } 
 const logState = () => {
    const content = editorContent.getCurrentContent();
  };
  const setRoot =(value) => {
    let stencilTypes=null
    var arrayFilter = typelist.filter(function(item) {
        return item.id==value;
    });
    setFilter('stencilType_text',arrayFilter[0]?arrayFilter[0].stencil:null) 
  }   
 const SelectonChange = (key,values) => {

      console.log(key)
      setFilter('stencilType',null)
      stencilTypes = setRoot(key)
      return  key
  }

  const trim = (s) => {
    return s.replace(/(^\s*)|(\s*$)/g, "");
}
 // const contentVal = (rule, value, callback) => {

 //     if(Object.prototype.toString.call(value)=='[object String]'){
        
 //        if(trim(value)=="<p></p>"){
 //            callback();
 //        }else{
 //           callback()
 //        }
       
 //     }else{
 //       callback()
 //     }
     
 //  }
    const contentVal = (rule, value, callback) => {

     if(Object.prototype.toString.call(value)=='[object String]'){
     
        if(trim(value)=="<p></p>"){
            callback('请上传正文！');
        }else{
           callback()
        }
       
     }else{
       if(draftToHtml(convertToRaw(value.getCurrentContent()))==draftToHtml(convertToRaw(EditorState.createEmpty().getCurrentContent()))){
         
          callback('请上传正文！');
       }else{
         callback()
       }
       
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
if(getFieldsValue().stencilType_text||item.columnId){

      if( item.columnId&&typelist&&typelist.length>0){
        let arrayFilter = typelist.filter(function(child) {
            if(child.id==item.columnId){
               console.log()
            }
            return child.id==item.columnId;
        });
        console.log(arrayFilter)
        if(arrayFilter[0]&&arrayFilter[0].stencil){
           stencilTypes =arrayFilter[0].stencil.map((item,index)=>{
             return <Radio key={index} value={item}> {stencil_C_text(item)||item}</Radio>
           })
        }
        
      }
      console.log(getFieldsValue().stencilType_text)
 
      if(getFieldsValue().stencilType_text&& Object.prototype.toString.call(getFieldsValue().stencilType_text)=='[object Array]'){
         stencilTypes = getFieldsValue().stencilType_text.map((item,index)=>{
             return <Radio key={index} value={item}> {stencil_C_text(item)||item}</Radio>
        })  
      }
  }

   let position_menuData=[]
   let initdata= {
      id:"357a127c9fa04af8af9a412e9f4f4834",
      key:"357a127c9fa04af8af9a412e9f4f4834",
      label:"布朗客",
      nickName:"布朗客",
      value:"357a127c9fa04af8af9a412e9f4f4834"
  };
 if(resUser&&resUser.length>0){
  let dataw = lodash.cloneDeep(resUser);
  let slient = dataw.filter(item=>{
      return item.id == "357a127c9fa04af8af9a412e9f4f4834"
  }) 
  if(slient.length==0){
      dataw.push(initdata) 
  }
  position_menuData = arrayToSelectTree(dataw, 'id', null,'children','nickName')
}else{
  position_menuData.push(initdata) 
}
 
 console.log(position_menuData)
 const modalupdateSync_show1 = () => {
       var datas=sunbmitData();
       modalupdateSync_show(datas)        
      
  } 
 const modalup_hide = () => {
         modalhide()
  }


 
  //筛选出 父级栏目 
      let newstypelist  = typelist.filter(item=>{
          return item.rootId
      })
 let department_treeData=[];
   if(typelist){
    let dataw = lodash.cloneDeep(typelist);
    department_treeData = arrayToSelectTree(dataw.filter(_ => _.mpid !== '-1'), 'id', 'pid','children','columnName')
    
  }
  //转码中
  let videoEditAble = true
  if(item.vid&&item.vid.videoId){
       if(!item.vid.ldmp4){
          videoEditAble='false'
       }
  }  
  return (
    <div className="showDetail">
      <Modal
            title="提示"
            wrapClassName="vertical-center-modal"
            visible={modalupdateSync}  
            onOk={modalupdateSync_show1}
            onCancel={modalup_hide}
           
          >
            <p>是否保存并同步发布内容</p>
     </Modal>
     { modalType!='trial' &&
        <h2 className="titleCommon" style={{ marginBottom: 15 }}>{title}
            <Button onClick={onCancel} style={{float:'right'}}>
               返回
            </Button>
        </h2>
       } 
      <Form layout="horizontal">
        <FormItem label="栏目" hasFeedback {...formItemLayout}>
          {getFieldDecorator('columnId', { 
             initialValue: item.columnId?(item.columnId).toString():item.columnId, 
             rules: [
              {
                required: true, message: '请选择栏目!' 
              },
             ],
             getValueFromEvent:SelectonChange 
           })(
            <TreeSelect
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  treeData={department_treeData}
                  placeholder="栏目类型"
                  treeDefaultExpandAll
                  allowClear
                  size={'large'}
                  style={{ width: '100%'}} 
                  className="treeOnlys2"
                />
             
          )}
       {/*

          <NewSelect 
               name="agencyGroupId" 
               datas={newstypelist} 
               placeholder="请选择栏目" 
               style={{ width: '100%',fontSize:'12px' }} 
               valMess={'id'}
               textMess={'columnName'}
               disabled={disabled}
             />
       */}
        </FormItem> 
         <FormItem label="模版类型" style={{display:'none'}} hasFeedback {...formItemLayout}>
          {getFieldDecorator('stencilType_text', {
            initialValue: item.stencilType,
            getValueFromEvent:normtitle,
            rules: [
              {
                required: true,
                message:'请选择模版类型'
              },
            ],
          })(
            <Input disabled={disabled} />
          )}
        </FormItem>
        {stencilTypes&&
        <FormItem label="模版类型" hasFeedback {...formItemLayout}>
          {getFieldDecorator('stencilType', {
            initialValue: item.stencilType,
            rules: [
              {
                required: true,
              },
            ],
          })(
             <RadioGroup disabled={disabled}>
                {stencilTypes}
            </RadioGroup>
          )}
        </FormItem>
        }
        <FormItem label="标题名称" hasFeedback {...formItemLayout}>
          {getFieldDecorator('title', {
            initialValue: item.title,
            getValueFromEvent:normtitle,
            rules: [
              {
                required: true,
                message:'请填写标题名称'
              },
            ],
          })(<Input disabled={disabled} placeholder="请填写标题名称"/>)}
        </FormItem>
       
          <FormItem label="作者" hasFeedback {...formItemLayout}>
          {getFieldDecorator('resUser', {
            initialValue:item.resUser?item.resUser:'357a127c9fa04af8af9a412e9f4f4834',
            rules: [
              {
                required: true,
                message:'请选择作者'
              },
            ],
          })(<TreeSelect
                     showSearch
                      treeNodeFilterProp={'label'}
                      dropdownStyle={{ maxHeight: 400, overflow: 'auto',width:'90%'}}
                      treeData={position_menuData}
                      placeholder="请选择作者"
                      treeDefaultExpandAll
                      disabled={disabled}
                    />)}
        </FormItem> 
         {/**/}  
       {!disabled&&
           <FormItem label="封面图" hasFeedback {...formItemLayout}>
          {getFieldDecorator('coverImgH5', {
            initialValue: item.coverImg&&JSON.parse(item.coverImg).h5  ? [{
              aliurl: JSON.parse(item.coverImg).h5,
              url: JSON.parse(item.coverImg).h5,
              fail:'false',
            }] :undefined,
            valuePropName: 'uploadMess',
            getValueFromEvent:normFile,
            rules: [
              {
                required: false,
                message: '请上传APP封面图片!',
                
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
         }
        <FormItem label="外部链接" hasFeedback {...formItemLayout}>
          {getFieldDecorator('linkUrlH5', {
            initialValue: item.linkUrl&&JSON.parse(item.linkUrl).h5,
            rules: [
              {
                required: false,
              },
            ],
          })(<Input disabled={disabled}  />)}  
        </FormItem>
        {disabled&&
          <Row>
          <Col span={6}><div className="title">封面图：</div></Col>
          <Col span={14}><div className="img"><img width="100" src={item.coverImg?JSON.parse(item.coverImg).h5:null} /></div>  </Col>
          </Row>
        }
       {   getFieldsValue().stencilType ==5&&disabled&&
             <Row>
              <Col span={6}><div className="title">视频封面图：</div></Col>
              <Col span={14}><div className="img"><img width="100" src={item.vid?item.vid.coverUrl:null}/></div> </Col>
            </Row>
        }    
        
        {   getFieldsValue().stencilType ==5&& 
         <FormItem label="视频" hasFeedback {...formItemLayout}>
          {getFieldDecorator('videoId', {
            initialValue: item.vid ? [{
              videoId: item.vid.videoId,
              url: item.vid.ldmp4,
              fail:'false',
              coverUrl:item.vid.coverUrl
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
                  limitdelete={disabled}
                 videoAuth={videoAuth}
                 editAble={videoEditAble}
              />)}
        </FormItem>
        }
        {  getFieldsValue().stencilType ==5&&!disabled&&
        <FormItem label="视频封面图" hasFeedback {...formItemLayout}>
          {getFieldDecorator('videoImg', {
            initialValue: item.vid &&item.vid.coverUrl? [{
              aliurl: item.vid.coverUrl,
              url: item.vid.coverUrl,
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
         }
         {disabled&&
            <Row>
              <Col span={6}><div className="title">内容：</div></Col>
              <Col span={14}>
                <div className="con" style={{maxHeight:300,overflow:'auto'}}>
                     <S_html value={item.content?item.content.replace(/(style=")(.*?)(")/ig,""):''} />
                </div>
              </Col>
            </Row>
         }
         {!disabled&&
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
                  embedded:{component:LayoutComponent}
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
         }
        <FormItem label="简介（选填）" hasFeedback  {...formItemLayout}>
          {getFieldDecorator('synopsis', {
            initialValue: item.synopsis,
            rules: [
              {
                required: false,
              },
            ],
          })(<Input.TextArea  disabled={disabled}    rows={4} placeholder="简介（选填）"/>)}
        </FormItem>
        
        
        <FormItem label="标签" hasFeedback {...formItemLayout}>
          {getFieldDecorator('tag', {
            initialValue: item.tag,
            rules: [
              {
                required: false,
              },
            ],
          })(<Input disabled={disabled} />)}
        </FormItem>
       
        {/*
          <FormItem label="额外信息" hasFeedback {...formItemLayout}>
          {getFieldDecorator('additionalInformation', {
            initialValue: item.additionalInformation,
            rules: [
              {
                required: false,
              },
            ],
          })(<ExtraMessage/>)}
        </FormItem>
      */}
      </Form>
 
       { !disabled &&  
          <div className="qc-save">
              {modalType != "create"&&<Button type="primary" onClick={same_handleOk}>同步保存</Button>}
              <Button type="primary" onClick={handleOk} style={{marginLeft:10}}>保存</Button>
          </div>
        }
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



