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
import {config ,typelist_trans,getObjectURL,uploadFile,stencilText,stencil_C_text} from 'utils'
import axios from 'axios'
import qs from 'qs'
import Casset  from './asset'
import {arrayToSelectTree} from 'utils'
import lodash from 'lodash'
 const RadioGroup = Radio.Group;
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
const gatherDel = ({
  item = {},
  onOk,
  modalType,
  onCancel,
  title,
  typelist,
  dispatch,
  onEditorStateChange,
  openValidate,
  openValidate_fun,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    setFields,
  },
  uploadMess,
  clientOss,
  keyOss,
  addChapter,
  chapter,
  delChapter,
  datasValidate = 'true',
  sourceListVisible,
  cms_special,
  location,
  loading,
  ...modalProps
}) => {
  console.log(chapter)
  console.log(cms_special.releaseds)
  const changeParVal = (obj,names,del) =>{
        /// name  chapter name   obj:{title ,content}
      //追加小节 
 
     let releaseds=cms_special.releaseds || {}

     if(!del){
        chapter.map(item=>{
          if(item.name==names){
               item.select = obj
          }
       })
     }else{
       chapter=chapter.filter(item=>{
         return item.name!=names
       })
   
     }
     
 
     if(del){ //删除
      // releaseds[names] = undefined  属性扔在
      delete releaseds[names];
     }else{
      let newOBJ = {
        title:obj.title,
        releaseId:obj.releaseId
      }
      releaseds[names] = newOBJ
     }
     // console.log(obj)
     // console.log(names)
     // console.log(releaseds)
       ////转换小节数据 
 
        let chapterData =releaseds;// cms_special.releaseds  

        let chapterArr = []
        let idArr = '';
        Object.keys(chapterData).forEach((key, index)=>{
            chapterArr.push(chapterData[key])
            if(index==0){
              idArr =chapterData[key].releaseId
            }else{
              idArr+=','+chapterData[key].releaseId
            }
        })

        idArr=idArr&&idArr.length>0?idArr.split(','):null
       // data["chans"] = chapterArr
        let  newSet = new Set(idArr)
        // data["releaseId"] =  (Array.from(newSet)).join(',')

    //  releaseId chans

     setFilter("releaseId",(Array.from(newSet)).join(','))
     setFilter("chans",chapterArr)
      console.log(chapterArr)
      console.log(releaseds)
      console.log(chapter)
      console.log((Array.from(newSet)).join(','))
     dispatch({
            type: 'cms_special/updateState',
            payload:{releaseds,chapter}
          })
  }
  const addmodalProps = {
      loading,
      location,
      dispatch,
      cms_special,
        maskClosable: true,
        title: '添加文章',
        wrapClassName: 'vertical-center-modal',        
  }
  const disabled = !(modalType == "create" ||modalType == "update")
 const sunbmitData = () => {
        let fields = getFieldsValue()   
        const data = {
          ...fields,
          "coverImgH5": fields["coverImgH5"]? fields["coverImgH5"][0].aliurl :null,
        }
        data["purpose"]=2;
        data["isCha"]=1;
        data["stencilType"]=3; //专题默认传3
        
         return data
 }
  const handleOk = () => {
       
 
     
      validateFields((errors) => {
        if (errors) {
             
           if(errors.releaseId){
               dispatch({
                type: 'cms_special/updateState',
                payload:{datasValidate:'false'}
              })  
           }
            message.error('请填写必填信息'); 
           console.log(errors)
          return
        }else{
          
           //验证  小节文章  
 
            console.log(222)
            onOk(sunbmitData())
        }
      // 提交之前转换参数
       
      })
  }
  const modalOpts = {
    ...modalProps,
    onOk: handleOk,
  }
 const logState = () => {
    const content = editorContent.getCurrentContent();
  };
 

 
 
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
   const normFile = (list) => {
 
    if (Array.isArray(list)) {
      return list;
    }
    return  list  ;
  }
   const setFilter = (name,key) => {
     setFields({
              [name]: {
                value:key
              },
      });
  
 } 
   const trim = (s) => {
    return s.replace(/(^\s*)|(\s*$)/g, "");
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
 const changerateJson=(obj)=>{
    var arr=this.state.rateJson;
    var names=this.state.ratenames;
    rateJson_Change(obj,arr,names,()=>{
           this.setState({
             rateJson:arr,
             ratenames:names
           })  
    })
    // console.log(JSON.stringify( arr ))
  }
  const repayvalidate=()=>{
 
       dispatch({
            type: 'cms_special/updateState',
            payload:{datasValidate:'true'}
          })
  } 
   const SelectonChange = (key,values) => {
      // 切换选择栏目   更新文章的搜索栏目段  ，如果当前选择的栏目 和   上一个栏目不同  清空已选的所有小节   
      // dispatch({
      //   type: 'cms_special/updateState',
      //   payload:{serachColumnId:key}
      // })
      // console.log(key)
      return  key
  }

   // setFilter("chans",chapterArr)    
  // setFilter("releaseId",(Array.from(newSet)).join(','))   
   let department_treeData=[];
   if(typelist){
    let dataw = lodash.cloneDeep(typelist);
    department_treeData = arrayToSelectTree(dataw.filter(_ => _.mpid !== '-1'), 'id', 'pid','children','columnName')
    
  }
  return (
    <div>
 
      <h2 className="titleCommon" style={{ marginBottom: 15 }}>{title}
          <Button onClick={onCancel} style={{float:'right'}}>
             返回
          </Button>
      </h2>
      <Form layout="horizontal">
        <FormItem label="栏目" hasFeedback {...formItemLayout}>
          {getFieldDecorator('columnId', { 
             initialValue: item.columnId?(item.columnId).toString():item.columnId, 
             getValueFromEvent:SelectonChange,
             rules: [
              {
                required: true, message: '请选择栏目!' 
              },
             ],
             
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
                  disabled={disabled}
                />
          )}

        </FormItem> 
         
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
        {modalType=='trial'&&
          <Row>
          <Col span={6}><div className="title">app封面图：</div></Col>
          <Col span={14}><div className="img"><img width="100" src={item.coverImg?JSON.parse(item.coverImg).h5:null} /></div>  </Col>
          </Row>
        }
        {/*  */}
        <FormItem label="文章内容集合" style={{display:'none'}} hasFeedback {...formItemLayout}>
          {getFieldDecorator('chans', {
            initialValue: item.chans,  
            rules: [
              {
                required: true,
                message:'文章内容集合'
              },
            ],
          })(<Input disabled={true} placeholder="文章内容集合"/>)}
        </FormItem>
        <FormItem label="文章id集合" style={{display:'none'}} hasFeedback {...formItemLayout}>
          {getFieldDecorator('releaseId', {
            initialValue: cms_special.releaseIds,
            rules: [
              {
                required: true,
                message:'文章id集合'
              },
            ],
          })(<Input disabled={true} placeholder="文章id集合"/>)}
        </FormItem>
       
      </Form>
      { chapter&&
            chapter.map((item,index)=>

                  <Casset
                    key={index} 
                    delF ={index!=0}
                    item={item}
                    openValidate={openValidate}
                    datasValidate={datasValidate}
                    changeValidate={repayvalidate}
                    delChapter={delChapter} 
                    modalProps={addmodalProps}
                    columnID={getFieldsValue().columnId}
                    changeParVal ={changeParVal}
                  />
            )
      }
      
      <Row>
          <Col span={6}></Col>
          <Col span={14}>
              <Button type="primary" style={{marginTop:24}}  onClick={ addChapter} >增加小节</Button>
          </Col>
      </Row>
     
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