
/**
 * 
 * @authors zcy (1366969408@qq.com)
 * @date    2018-03-20 16:52:27
 * @version $Id$
 */

/**
 * 
 * @authors zcy (1366969408@qq.com)
 * @date    2018-03-20 16:52:27
 * @version $Id$
 */
import React,{Component} from 'react';
import {Modal, Row, Col, Radio, message, Checkbox,Form,Icon, Input, AutoComplete,DatePicker,Spin,Table,Pagination,Select,TimePicker,Button} from 'antd';
import moment from 'moment';
import { NewSelect} from 'components'
import styles from './style.less';
import {config ,typelist_trans,getObjectURL,uploadFile} from 'utils'
class NormalLoginForm extends React.Component{
  constructor(props) {
    super(props);
      this.state = { 
         previewVisible:false,
         previewImage:null,
         uploadMess:this.props.uploadMess||[],
         loading:null,
         had:true,  //是否显示添加文件按钮
         over:false,//是否显示上传按钮
         idName:"files_"+this.props.idName||(new Date()).getTime(),
         J_prismPlayer1:"J_prismPlayer"+this.props.idName,
         limitdelete:this.props.limitdelete||false,
         editAble:this.props.editAble==='false'?false:true,
      }
  }
  componentDidMount(){
 
                   const curr=  this.props.uploadMess&&this.props.uploadMess[0]&&this.props.uploadMess[0].url?this.props.uploadMess[0]:null
                   if(curr){
                         this.player = new Aliplayer({
                                id: this.state.J_prismPlayer1,
                                width: '100%',
                                autoplay: false,
                                //支持播放地址播放,此播放优先级最高
                                source :curr.url,//'http://video.qqdcloud.com/9308c20cf3614154ab0b2520900f1053/048f19246715472d92d022b30d61e1b9-60563ce766186d3a9c986cb2e5d2fb11-ld.mp4?auth_key=1524825029-670-0-5ef9926a68036fe40e5bdafd1a51a05e' ,//播放方式二：点播用户推荐
                                cover:curr.coverUrl,//'http://test-public.qqdcloud.com/qqd/cmsResource/152482431941416pic_4744685_b.jpg'
                       });
                   }
                   
             // document.getElementById(this.state.J_prismPlayer1).innerHTML ="";//();//id为html里指定的播放器的容器id
    this.setState({
      userName:'11'
    })
    var self = this;
    this.uploader = new AliyunUpload.Vod({
            // 文件上传失败
            'onUploadFailed': function (uploadInfo, code, message) {
                message.error("上传失败")
             //   console.log("onUploadFailed: file:" + uploadInfo.file.name + ",code:" + code + ", message:" + message);
                self.setState({
                  over:false
                })
            },
            // 文件上传完成
            'onUploadSucceed': function (uploadInfo) {
                message.success("上传成功")
                
               // console.log("onUploadSucceed: " + uploadInfo.file.name + ", endpoint:" + uploadInfo.endpoint + ", bucket:" + uploadInfo.bucket + ", object:" + uploadInfo.object);
                let  uploadMess = self.state.uploadMess || [];
             //   console.log(uploadMess)
                if(uploadMess[0]){
                    uploadMess[0].videoId= self.props.videoAuth.videoId;
                    uploadMess[0].fail = 'false'
                  //  uploadMess[0].url = "http://video.qqdcloud.com/9308c20cf3614154ab0b2520900f1053/048f19246715472d92d022b30d61e1b9-60563ce766186d3a9c986cb2e5d2fb11-ld.mp4?auth_key=1524825029-670-0-5ef9926a68036fe40e5bdafd1a51a05e"
                }else{
                    uploadMess.push({
                        videoId:self.props.videoAuth.videoId,
                        fail:'false',
                       // url: "http://video.qqdcloud.com/9308c20cf3614154ab0b2520900f1053/048f19246715472d92d022b30d61e1b9-60563ce766186d3a9c986cb2e5d2fb11-ld.mp4?auth_key=1524825029-670-0-5ef9926a68036fe40e5bdafd1a51a05e"

                    }) 
                }
                self.setState({
                     uploadMess
                })
                self.props.onChange(uploadMess)
            },
            // 文件上传进度
            'onUploadProgress': function (uploadInfo, totalSize, loadedPercent) {
                 self.setState({
                    loading:(loadedPercent * 100.00),
                    start:false
                 })
              //  console.log("onUploadProgress:file:" + uploadInfo.file.name + ", fileSize:" + totalSize + ", percent:" + (loadedPercent * 100.00).toFixed(2) + "%");
            },
            // STS临时账号会过期，过期时触发函数
            'onUploadTokenExpired': function (uploadInfo) {
            //    console.log("onUploadTokenExpired");
                if (self.isVodMode()) {
                    // 实现时，根据uploadInfo.videoId从新获取UploadAuth
                    //实际环境中调用点播的刷新上传凭证接口，获取凭证
                        //https://help.aliyun.com/document_detail/55408.html?spm=a2c4g.11186623.6.630.BoYYcY
                        //获取上传凭证后，调用setUploadAuthAndAddress
                    // uploader.resumeUploadWithAuth(uploadAuth);
                } else if (isSTSMode()) {
                    // 实现时，从新获取STS临时账号用于恢复上传
                    // uploader.resumeUploadWithSTSToken(accessKeyId, accessKeySecret, secretToken, expireTime);
                }
            },
            onUploadCanceled:function(uploadInfo)
            {
                //console.log("onUploadCanceled:file:" + uploadInfo.file.name);
            },
            // 开始上传
            'onUploadstarted': function (uploadInfo) {
              console.log(uploadInfo)
              console.log(self.isVodMode())

                self.setState({
                    start:true
                })
                console.log(uploadInfo.videoId)
                 //return
                if (self.isVodMode()) {
                    if(!uploadInfo.videoId)//这个文件没有上传异常  
                    {

                      console.log(1)
                        //mock 上传凭证，实际产品中需要通过接口获取
                        var uploadAuth = self.props.videoAuth.uploadAuth;
                        var uploadAddress = self.props.videoAuth.uploadAddress;
                        var videoId = self.props.videoAuth.videoId;
                        //实际环境中调用调用点播的获取上传凭证接口
                        //https://help.aliyun.com/document_detail/55407.html?spm=a2c4g.11186623.6.629.CH7i3X
                        //获取上传凭证后，调用setUploadAuthAndAddress
                        self.uploader.setUploadAuthAndAddress(uploadInfo, uploadAuth, uploadAddress,videoId);
                    }
                    else//如果videoId有值，根据videoId刷新上传凭证
                    {
                        //mock 上传凭证 实际产品中需要通过接口获取
                        var uploadAuth =  self.props.videoAuth.uploadAuth; //document.getElementById("uploadAuth").value;
                        var uploadAddress = self.props.videoAuth.uploadAddress;//document.getElementById("uploadAddress").value;
                        //实际环境中调用点播的刷新上传凭证接口，获取凭证
                        //https://help.aliyun.com/document_detail/55408.html?spm=a2c4g.11186623.6.630.BoYYcY
                        //获取上传凭证后，调用setUploadAuthAndAddress
                        self.uploader.setUploadAuthAndAddress(uploadInfo, uploadAuth, uploadAddress);
                    }
                }
                else if (self.isSTSMode()) {
                    var accessKeyId = self.props.videoAuth.accessKeyId; 
                    var accessKeySecret = self.props.videoAuth.accessKeySecret;
                    var secretToken = self.props.videoAuth.secretToken;
                    self.uploader.setSTSToken(uploadInfo, accessKeyId, accessKeySecret,secretToken, "test");
                }
               // console.log("onUploadStarted:" + uploadInfo.file.name + ", endpoint:" + uploadInfo.endpoint + ", bucket:" + uploadInfo.bucket + ", object:" + uploadInfo.object);
            }
            ,
            'onUploadEnd':function(uploadInfo){
                 self.setState({
                    start:false
                })
               // console.log("onUploadEnd: uploaded all the files");
            }
        });
  }
  componentWillUnmount(){
     if(this.player){
           this.player.dispose(); //销毁
     }
      
      
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
  
  showMaodal = (url,width) => {
 
     this.setState({
       previewVisible:true,
         previewImage:url, 
         modalwiddth:width

     })
  }
  isVodMode = () => {
        var uploadAuth =this.props.videoAuth?this.props.videoAuth.uploadAuth:null;
        return (uploadAuth && uploadAuth.length > 0);
    }
  isSTSMode = () => {
        var secretToken = this.props.videoAuth?this.props.videoAuth.secretToken:null;
        if (!isVodMode()) {
            if (secretToken && secretToken.length > 0) {
                return true;
            }
        }
        return false;
  }  
  deleteFile = (url) => {
      
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
        // console.log(event.target.files)
        if(!/\/(gif|jpg|jpeg|bmp)$/.test(file.type)){
            message.error("只能上传图片")
            return
        }
       let url =this.getObjectURL(file);
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

      /*
uploadAuth={videoAuth.uploadAuth}
                 uploadAddress={videoAuth.uploadAddress}
                 videoId={videoAuth.clientOss_video}

      */
      if(!this.props.clientOss){
          
           return
      }
       if(file){
            const self =this;
            const key = this.props.keyOss+"/"+(new Date()).getTime()+file.name;
            uploadFile(file,this.props.clientOss,key, uploadMess.length).then(res=>{
               // console.log(res)
                 //成功 
                  let resultAliUrl = res.res.requestUrls[0];
                  let successIndex = res.successIndex;
                  if(uploadMess&&uploadMess.length>0){
                         uploadMess.map((item,index)=>{
                            if(index==successIndex-1){
                                   //上传成功
                                   uploadMess[index].fail='false';
                                   uploadMess[index].aliurl=resultAliUrl;
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
  reUpFile = (url) =>{
    if(this.state.uploadMess&&this.state.uploadMess.length>0){
             this.state.uploadMess.map((item,index)=>{
                  if(item.url==url){
                         this.state.uploadMess.splice(index,1)
                         this.setState({
                             uploadMess:this.state.uploadMess
                         },()=>{
                          this.props.onChange(this.state.uploadMess||[])
                         })
                        return;
                  }
             })
     }
  }
  uploadImageElement = (uploadMess) => {
      /// this.props.onChange(uploadMess)
     // console.log(uploadMess)
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
             let player_id = "J_prismPlayer"+1;
             if(this.player){
              // this.player.dispose(); //销毁
             // document.getElementById(this.state.J_prismPlayer1).innerHTML ="";//id为html里指定的播放器的容器id
               //重新创建
              
             }
         //    console.log(this.state.J_prismPlayer1)
             let playerId=this.state.J_prismPlayer1 
             this.player = new Aliplayer({
                            id: 'J_prismPlayervideoId',
                            width: '100%',
                            autoplay: false,
                            //支持播放地址播放,此播放优先级最高
                            source :item.url,//'http://video.qqdcloud.com/9308c20cf3614154ab0b2520900f1053/048f19246715472d92d022b30d61e1b9-60563ce766186d3a9c986cb2e5d2fb11-ld.mp4?auth_key=1524825029-670-0-5ef9926a68036fe40e5bdafd1a51a05e' ,//播放方式二：点播用户推荐
                            cover:item.coverUrl,//'http://test-public.qqdcloud.com/qqd/cmsResource/152482431941416pic_4744685_b.jpg'
                   });
             return (
                   <Button type="primary" icon="delete" onClick={()=>{this.reUpFile(item.url)}}>重新上传</Button>
             )
       })
         
       }
      
  }
  start = () =>{
     //   console.log("start upload.");
        if(!this.state.nowFile){
            message.error('先上传视频')
        }
        this.uploader.startUpload();
        this.setState({
          over:true
        })
    }
    deleteFile = () => {
      
        this.uploader.deleteFile(0);
        this.clearInputFile();

        this.setState({
              nowFile:null,
              had:true,  //隐藏上传按钮
              over:false,
              loading:null,//进度条
              uploadMess:[],//初始值
       })
       this.props.onChange(null)
    }
    // 点播上传。每次上传都是独立的鉴权，所以初始化时，不需要设置鉴权
    // 临时账号过期时，在onUploadTokenExpired事件中，用resumeWithToken更新临时账号，上传会续传。
  selectFile =  (event) => {
           console.log(event.target.files[0]) 
           if(!/^(video)\//.test(event.target.files[0].type)){
               message.error("只能上传视频")
               this.clearInputFile()
               return
           }
           this.setState(
           {
              nowFile:event.target.files[0].name,
              had:false  
           })
            var endpoint = this.props.videoAuth.endpoint;
            var bucket = this.props.videoAuth.bucket;
            var objectPre = this.props.videoAuth.objectPre;
            var userData;
            var  extenda ={
              MessageCallback:{
                  "CallbackURL":"http://saas-gateway.qqdcloud.com:8888/admin/v0.2/cms/upload/callbackUploadVideo22" 
               },
              Extend:{
                "merAccessId":localStorage.merAccessId,
                "appId":"ZZs7mA7PePp9kCIC5OJ1XHtlICS3mULR"
              }
            }
            if (this.isVodMode()) {
                userData = JSON.stringify(extenda) ;//'{"Vod":{"UserData":{"IsShowWaterMark":"false","Priority":"7"}}}';
            } else {
                userData =  JSON.stringify(extenda) ;//'{"Vod":{"Title":"this is title.我是标题","Description":"this is desc.我是描述","CateId":"19","Tags":"tag1,tag2,标签3","UserData":"user data"}}';
            }

            for(var i=0; i<event.target.files.length; i++) {
                console.log("add file: " + event.target.files[i].name);
                if (this.isVodMode()) {
                    // 点播上传。每次上传都是独立的OSS object，所以添加文件时，不需要设置OSS的属性
                     this.uploader.addFile(event.target.files[i], null, null, null, userData);
                } else if(this.isSTSMode()) {
                    // STS的上传方式，需要在userData里指定Title
                    var object = objectPre;
                    // if(objectPre)
                    // {
                    //     object = objectPre +"/"+ event.target.files[i].name;
                    // }
                    this.uploader.addFile(event.target.files[i], endpoint, bucket, object , userData);
                }
            }
        }

  clearInputFile = () =>{
        var ie = (navigator.appVersion.indexOf("MSIE")!=-1);  
        if( ie ){  
            var file = document.getElementById(this.state.idName);
            var file2= file.cloneNode(false);  
            file2.addEventListener('change', selectFile);
            file.parentNode.replaceChild(file2,file);  
        }
        else
        {
            document.getElementById(this.state.idName).value = '';
        }

    }
  render() {
    const {previewVisible,previewImage,modalwiddth} = this.state
    const showWidth =modalwiddth?modalwiddth<400?modalwiddth:500:500
    const limit = this.props.limit;
    const limituploadMess =this.state.uploadMess;
     // const {url}=limituploadMess
     // console.log(limituploadMess)
    return (
           //id={`${this.state.J_prismPlayer1}`}
         <div> 
               
                  <div  style={{wdith:'100%'}}>
                  <div style={{display:(this.state.uploadMess[0]&&this.state.uploadMess[0].url)?'block':'none'}}
                      className="prism-player"  id={this.state.J_prismPlayer1}>
                   </div>
                   {
                     this.state.uploadMess[0]&&this.state.uploadMess[0].url&&!this.state.limitdelete&&
                     <Button type="primary" icon="delete" onClick={()=>{this.reUpFile(this.state.uploadMess[0].url)}}>重新上传</Button>
                   }
                   {/*this.state.uploadMess[0]&&this.state.uploadMess[0].url&&  this.uploadImageElement(this.state.uploadMess)  */}
                   
                  </div>
              

               {(this.state.uploadMess[0]&&!this.state.uploadMess[0].url ||!this.state.uploadMess[0] )&&
                 <div> 
                   
                   {this.state.editAble&&
                    <a href="javascript:;" style={{display:this.state.had?'block':'none',cursor: "pointer"}} className={styles.upload}>
                     <Icon type="upload" />
                     视频上传
                    <input type="file" className={styles.change}  id={`${this.state.idName}`} onChange={this.selectFile}/>
                   </a>
                   }
                   {!this.state.editAble&&
                     <div style={{display:'flex'}}> 
                    <a href="javascript:;" style={{display:'inline-block',cursor: "not-allowed"}} className={styles.upload}>
                     <Icon type="upload" />
                       视频上传
                     </a>
                     <span style={{color:'red'}}>视频正在转码中</span>
                     </div>
                   }
                   {this.state.nowFile&&
                      <div className={styles.fileC}>
                        <Icon type="link" className={styles.filelink} /> 
                        <div>
                            <p className={styles.filename}>{this.state.nowFile}</p>
                            
                            {(this.state.loading||this.state.loading==0)&&
                              <p className={styles.fileload}>
                                 <span style={{width:` ${this.state.loading}%`}}></span>
                              </p> 
                             }
                             {
                              this.state.start&&<p>开始上传...</p>
                            }
                        </div>

                        <Icon   className={styles.fileclose}  style={{cursor:'pointer'}} type="delete"  onClick={this.deleteFile}/>
                      </div>
                    }
                   {this.state.nowFile&&!this.state.over&&
                     <Button type="primary" icon="search" onClick={()=>
                      {
                        this.start()
                      }}>开始上传</Button>
                   }
                 </div>   
               }
         </div>
    );
  }
 }




                   


    export default NormalLoginForm;                 
