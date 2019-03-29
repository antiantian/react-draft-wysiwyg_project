/**
 * 
 * @authors zcy (1366969408@qq.com)
 * @date    2017-11-02 17:22:03
 * @version $Id$
 */

import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input,Select, InputNumber, Radio, Modal, Cascader , Upload, Icon,Row, Col, Card,Button} from 'antd'
import { UploadImage,InEditor,S_html,VideoUpload} from 'components'
import { EditorState, convertToRaw, ContentState } from 'draft-js'
import htmlToDraft from 'html-to-draftjs';
import { Editor} from 'react-draft-wysiwyg'
import draftToHtml from 'draftjs-to-html'
import draftToMarkdown from 'draftjs-to-markdown'
import {typelist_trans,stencil_C_text} from 'utils'
const FormItem = Form.Item
const Option = Select.Option;
const { TextArea } = Input;
import {finishDate,trim} from 'commonfun'
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
  onCancel,
  dispatch,
  typelist,
  titlePub,
  resUser,
}) => {
 
  const {
    title,
   // typeId,
    coverImg,
    linkUrl,
    content,
    //createDate,
    //createBy,
    purpose,
    additionalInformation,
    tag,
    video
  } =item.resource?item.resource:{};  //snapshotResource
  const {
    id,
    columnId,
    createBy,
    createName,
    createDate,
    resourceId,
    releaseDate,
    releaseUser,
    siteUrl,
    state,
    updateDate,
    updateBy,
    updateName,
    endDate,
    stencilType,
  } =item
 
    let position_menuData=resUser||[]
   let initdata= {
      id:"357a127c9fa04af8af9a412e9f4f4834",
      key:"357a127c9fa04af8af9a412e9f4f4834",
      label:"布朗客",
      nickName:"布朗客",
      value:"357a127c9fa04af8af9a412e9f4f4834"
  };
 if(resUser&&resUser.length>0){
 console.log()
  let slient = resUser.filter(item=>{
      return item.id == "357a127c9fa04af8af9a412e9f4f4834"
  }) 
  if(slient.length==0){
      resUser.push(initdata) 
  }
  position_menuData =resUser
}else{
  position_menuData.push(initdata) 
}
 let userName =item.resUser;
 position_menuData.filter(child=>{
    if(child.id==item.resUser){
        userName = child.nickName
    }
 })

 console.log(position_menuData)
  console.log(item.resUser)
  return (
    <div>
      <h2 className="titleCommon" style={{ marginBottom: 15 }}>
          {titlePub}
          <Button onClick={onCancel} style={{float:'right'}}>
             返回
          </Button>
      </h2>
      <div className="showDetail">
          <div>资源信息：</div>
          
          <Row>
            <Col span={6}><div className="title">资源id：</div></Col>
            <Col span={14}><div className="con">{id}</div></Col>
          </Row>
          <Row>
            <Col span={6}><div className="title">栏目：</div></Col>
            <Col span={14}><div className="con">{typelist?typelist_trans(typelist,columnId,"columnName"):""}</div></Col>
          </Row>
          <Row>
            <Col span={6}><div className="title">模版：</div></Col>
            <Col span={14}><div className="con">{stencil_C_text(stencilType)}</div></Col>
          </Row>
          
          <Row>
            <Col span={6}><div className="title">标题名称：</div></Col>
            <Col span={14}><div className="con">{title}</div></Col>
          </Row>
           <Row>
            <Col span={6}><div className="title">作者：</div></Col>
            <Col span={14}><div className="con">{userName}</div></Col>
          </Row>
          <Row>
            <Col span={6}><div className="title">创建人：</div></Col>
            <Col span={14}><div className="con">{createName}</div></Col>
          </Row>
          <Row>
            <Col span={6}><div className="title">创建时间：</div></Col>
            <Col span={14}><div className="con">{finishDate(createDate)}</div></Col>
          </Row>
        {/*
          <Row>
            <Col span={6}><div className="title">使用途径：</div></Col>
            <Col span={14}><div className="con">{purpose==1?"pc":(purpose==2?"app":"通用")}</div></Col>
          </Row>
          */}
 
            <div>
             <Row>
              <Col span={6}><div className="title">封面图：</div></Col>
              <Col span={14}><div className="img"><img width="100" src={coverImg?JSON.parse(coverImg).h5:null} /></div>  </Col>
            </Row>
            </div> 
           {/*  
            <Row>
              <Col span={6}><div className="title">app图片链接：</div></Col>
              <Col span={14}><div className="con">{linkUrl?JSON.parse(linkUrl).h5:null}</div>  </Col>
            </Row>
           
          */}
          { stencilType ==5&& 
           <Row>
              <Col span={6}><div className="title">视频封面图：</div></Col>
              <Col span={14}><div className="img"><img width="100" src={item.video?item.video.coverUrl:null}/></div> </Col>
            </Row>
          } { stencilType ==5&&   
            <Row>
              <Col span={6}><div className="title">视频：</div></Col>
              <Col span={14} style={{overflow:'hidden'}}>
                {item.video&&item.video.ldmp4&&
                   <VideoUpload 
                           uploadMess={[
                                {
                                  videoId: item.video?item.video.videoId:null,
                                  url: item.video?item.video.ldmp4:null,
                                  fail:'false',
                                  coverUrl:item.video?item.video.coverUrl:null
                                }
                           ]}
                           limitdelete={true}
                            idName= {"videoIdplay"}
                  />
                } 
                {(item.video&&!item.video.ldmp4 || !item.video)&&
                   <p>无</p>
                } 
              </Col>
            </Row>
          }
          <Row>
            <Col span={6}><div className="title">内容：</div></Col>
            <Col span={14}>
              <div className="con" style={{maxHeight:300,overflow:'auto'}}>
               {content&&<S_html value={content?content.replace(/(style=")(.*?)(")/ig,""):''} />}
              </div>
            </Col>
          </Row>
          <Row>
            <Col span={6}><div className="title">标签：</div></Col>
            <Col span={14}><div className="con">{tag}</div>  </Col>
          </Row>
           <div>发布信息：</div>
           <Row>
            <Col span={6}><div className="title">发布id：</div></Col>
            <Col span={14}><div className="con">{item.id}</div></Col>
          </Row>
          <Row>
            <Col span={6}><div className="title">开始时间：</div></Col>
            <Col span={14}><div className="con">{finishDate(item.releaseDate)}</div></Col>
          </Row>
          <Row>
            <Col span={6}><div className="title">结束时间：</div></Col>
            <Col span={14}><div className="con">{finishDate(item.endDate)}</div></Col>
          </Row>
          
          {/*

            <Row>
            <Col span={6}><div className="title">发布人：</div></Col>
            <Col span={14}><div className="con">{item.releaseUser}</div></Col>
          </Row>
          
          <Row>
            <Col span={6}><div className="title">发布网址：</div></Col>
            <Col span={14}><div className="con">{item.siteUrl}</div></Col>
          </Row>
          */}
          <Row>
            <Col span={6}><div className="title">发布状态：</div></Col>
            <Col span={14}><div className="con">{item.status==1?"已结束":"发布中"}</div></Col>
          </Row>
          <Row>
            <Col span={6}><div className="title">修改时间：</div></Col>
            <Col span={14}><div className="con">{finishDate(item.updateDate)}</div></Col>
          </Row>
          <Row>
            <Col span={6}><div className="title">修改人：</div></Col>
            <Col span={14}><div className="con">{item.updateName}</div></Col> 
          </Row>
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
 
  item: PropTypes.object,
}

export default gatherDel
