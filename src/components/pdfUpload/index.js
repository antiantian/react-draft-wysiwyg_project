/**
 * 
 * @authors zcy (1366969408@qq.com)
 * @date    2018-03-20 16:52:27
 * @version $Id$
 */
import React,{Component} from 'react';
import {Modal,message ,Icon, Input,Button} from 'antd';
import moment from 'moment';
import styles from './style.less';
import {uploadFile} from './common'
import axios from 'axios'
import qs from 'qs'
class   UploadImages extends React.Component{
  constructor(props) {
    super(props);
      this.state = { 
         previewVisible:false,
         previewImage:null,
         uploadMess:this.props.uploadMess||[],
         id:(new Date()).getTime()+(this.props.id||'CC1'),
      }
  }
  componentDidMount(){
    this.setState({
      userName:'11'
    })
  }
  componentWillReceiveProps(nextProps) {
    // Should be a controlled component.
 
    if ('uploadMess' in nextProps && nextProps.uploadMess) {
      const value = nextProps.value?nextProps.value.toString():nextProps.value;
       this.setState({
        uploadMess:nextProps.uploadMess
       } );
      // this.changeV(this.state.uploadMess,nextProps.uploadMess)
    }
  }
  showMaodal = (item) => {
       if(item.aliurl!=item.url&&this.props.getAPI){
          let aliurl =  item.aliurl;
          axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
          axios.defaults.transformRequest=[
           function(data) {
              //为了避免qs格式化时对内层对象的格式化先把内层的对象转为
                data = JSON.stringify(data);
              //由于使用的form-data传数据所以要格式化
              return data;
            }
           ]
            axios.post(this.props.getAPI,{
                url:item.aliurl
             })
            .then(function(response){
                if(response.data.code==200){
                    /**插 件内部需要img src*/
                    window.open(response.data.data.url);
        
                   
                }else{
                      message.error(response.data.info)
                }
            })
            .catch(function(error){
                  message.error(error)
            })
       }else{
           window.open(item.url);
       }
  }
  deleteFile = (url) => {
      var file = document.getElementById(this.state.id);
      file.value = ''; //虽然file的value不能设为有字符的值，但是可以设置为空值
//或者file.outerHTML = file.outerHTML; //重新初始化了file的html
      if(this.state.uploadMess&&this.state.uploadMess.length>0){
             this.state.uploadMess.map((item,index)=>{
                  if(item.url==url){
                         this.state.uploadMess.splice(index,1)
                         this.setState({
                             uploadMess:this.state.uploadMess
                         },()=>{
                          this.props.onChange(null)
                         })
                        return;
                  }
             })
     }
      //this.props.deleteFile(url) 
  }
  handleCancel = () => {
    this.setState({
       previewVisible:false,
     })
  }
  changeV = (preval,now) => {
 
    if(!preval&&now[0].aliurl){
        this.props.onChange(now)
    } 
    if(preval&&now){
       if(preval[0]&&now[0]&&now[0].aliurl!=preval[0].aliurl){
          this.props.onChange(now)
       }
    }
  }
  uploadImags = (event) => {
         
         let uploadMess = this.state.uploadMess;
         var file = event.target.files[0];
         // console.log(file)
         // console.log((new Date()).getTime()+file.name)
          if(!/\/(pdf)$/.test(file.type)){
            message.error("只能上传pdf格式文件")
            return
         }else{
             this.setState({
               filelist:event.target.files
             })
         }
 

       let url =(new Date()).getTime()+file.name;//this.getObjectURL(file);

        if(url){
          let data=[];
   
          if(uploadMess){
               uploadMess.push({url:url,fail:'loading'})
               data=uploadMess
          }else{
             data.push({url:url,fail:'loading'}) 
          }
          uploadMess=data;
          this.setState({
              uploadMess:uploadMess
          },()=>{
             // this.props.onChange(uploadMess)
          })
        }
        if(file){
            this.uploadImagsAli(file,uploadMess)
        }
  }

  uploadImagsAli = ( file, uploadMess) => {
      if(!this.props.clientOss){
          message.error("没有阿里上传凭证")
           return
      }
       if(file){
            const self =this;
            const key = this.props.keyOss+"/"+(new Date()).getTime()+file.name;
            uploadFile(file,this.props.clientOss,key, uploadMess.length).then(res=>{
               // console.log(res)
                 //成功 

                  let resultAliUrl = res.res.requestUrls[0];
                  let  changeUrl = null;
                  axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
                  axios.defaults.transformRequest=[
                   function(data) {
                      //为了避免qs格式化时对内层对象的格式化先把内层的对象转为
                        data = JSON.stringify(data);
                      //由于使用的form-data传数据所以要格式化
                      return data;
                    }
                   ]
                     axios.post(this.props.getAPI,{
                        url:resultAliUrl
                     })
                    .then(function(response){
        
                        if(self.props.from&&self.props.from=="pad"){
     
                             if(response.data.code==0){
                                /**插 件内部需要img src*/
                               // window.open(response.data.data.url);
                                changeUrl=response.data.data.imgUrl
                                 if(uploadMess&&uploadMess.length>0){
                                         uploadMess.map((item,index)=>{
                                            if(index==successIndex-1){
                                                   //上传成功
                                                   uploadMess[index].changeUrl=changeUrl;
                                                   self.setState({
                                                       uploadMess:uploadMess
                                                   })
                                                   self.props.onChange(uploadMess)
                                                  return;
                                            }
                                       })   
                                  }
                                  self.setState({
                                       uploadMess:uploadMess
                                   })
                            }else{
                                  message.error(response.data.info)
                            }
                        }else{
                           if(response.data.code==200){
                              /**插 件内部需要img src*/
                             // window.open(response.data.data.url);
                              changeUrl=response.data.data.url
                               if(uploadMess&&uploadMess.length>0){
                                       uploadMess.map((item,index)=>{
                                          if(index==successIndex-1){
                                                 //上传成功
                                                 uploadMess[index].changeUrl=changeUrl;
                                                 self.setState({
                                                     uploadMess:uploadMess
                                                 })
                                                 self.props.onChange(uploadMess)
                                                return;
                                          }
                                     })   
                                }
                                self.setState({
                                     uploadMess:uploadMess
                                 })
                          }else{
                                message.error(response.data.info)
                          }
                        }
                        
                    })
                    .catch(function(error){
                          message.error(error)
                    })


                  let changeAPI  = this.props.getAPI;
                  let successIndex = res.successIndex;
                  if(uploadMess&&uploadMess.length>0){
                         uploadMess.map((item,index)=>{
                            if(index==successIndex-1){
                                   //上传成功
                                   uploadMess[index].fail='false';
                                   uploadMess[index].aliurl=resultAliUrl;
                                   uploadMess[index].changeUrl=changeUrl;
                                   self.setState({
                                       uploadMess:uploadMess
                                   })
                                   this.props.onChange(uploadMess)
                                  return;
                            }
                       })   
                  }
                  self.setState({
                       uploadMess:uploadMess
                   })
                 
            },function(error){
                 let failIndex= error.failIndex;  //第几个
                  if(uploadMess&&uploadMess.length>0){
                         uploadMess.map((item,index)=>{
                            if(index==failIndex-1){
                                   //上传失败
                                   uploadMess[index].fail='true';
                                   self.setState({
                                       uploadMess:uploadMess
                                   })
                                  return;
                            }
                       })   
                  }
 
              }) 
         
        }
      
     
     
       
     // uploadMess
  } 

 // onChangeCheck(fileList)
  //获取图片路径
 getObjectURL = ( file) => {
      var url = null ;
      if (window.createObjectURL!=undefined) { // basic
      url = window.createObjectURL(file) ;
      } else if (window.URL!=undefined) { // mozilla(firefox)
      url = window.URL.createObjectURL(file) ;
      } else if (window.webkitURL!=undefined) { // webkit or chrome
      url = window.webkitURL.createObjectURL(file) ;
      }
      return url ;
  }
  uploadImageElement = (uploadMess) => {
      /// this.props.onChange(uploadMess)
       if(uploadMess&&uploadMess.length>0){
          return uploadMess.map((item,index)=>{
              let img = new Image();
          img.src =item.url;
        let natureSizeWidth = img.width;
        let natureSizeHeight = img.height;
        let mess = '';
        if(item.fail=='loading'){
                   mess = '上传中'
        }
        if(item.fail=='true'){
          mess = '上传失败'
        }
     
             return (
               <div key={index} className={styles.block} style={{
                    borderColor:item.fail=='true'?'red':'#dfdfdf'
                 }}>
                  
                  <div className={styles.blockinner} style={{
                     width:'100%',
                     overflow:'hidden',

                  }}>
                  {!this.props.disabled&&
                    <span className={styles.reporate}>
                      <span className={styles.inconWrap}>
                          <Icon className={styles.icons} type="delete" onClick={()=>{this.deleteFile(item.url)}} />
                         {item.aliurl!=item.url&&item.changeUrl&&
                          <a style={{color:'#7a7a7a'}} target="_blank" href={item.changeUrl}>
                            <Icon className={styles.icons} type="eye-o"/>
                          </a>
                          }
                          {item.aliurl==item.url&&
                           <a style={{color:'#7a7a7a'}} target="_blank" href={item.url}>
                            <Icon className={styles.icons} type="eye-o"/>
                          </a>
                          }
                       </span>
                    </span>
                  } 
                  {
                    this.props.disabled&&
                    <a style={{color:'#7a7a7a'}} target="_blank" href={item.url}>{item.url}</a>
                  } 
                    <p className={` ${styles.uploadState} ${item.fail=='true' ? styles.error: ''}`}>{mess}</p>
                   {!this.props.disabled&& <p>{item.url}</p>}
                  </div>
                 
               </div>  
             )
       })
         
       }
      
  }

  render() {
    const {previewVisible,previewImage,modalwiddth} = this.state
    const showWidth =modalwiddth?modalwiddth<400?modalwiddth:500:500
    const limit = this.props.limit;
    const limituploadMess =this.state.uploadMess;
  
    return (
          
         <div style={{lineHeight:1}}> 
              {this.uploadImageElement(this.state.uploadMess)}
              {(limit&&limituploadMess&&limituploadMess.length<limit||!limit||!limituploadMess) &&!this.props.disabled&&
                <a href="javascript:;" className={styles.upload}>
                   <Icon type="plus" />
                   上传文件
                  <input type="file" id={this.state.id} className={styles.change} onChange={this.uploadImags}/>
                </a>
              }
               <Modal width={showWidth} maskClosable={true} visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                <img alt="example" style={{ width: '100%' }} src={previewImage} />
              </Modal>
         </div>
    );
  }
 }




                   


    export default UploadImages;                 
