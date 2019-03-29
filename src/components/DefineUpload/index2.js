import React,{Component} from 'react';
import {Modal, Row, Col, Radio, Checkbox,Form,Icon, Input, AutoComplete,DatePicker,Spin,Table,Pagination,Select,TimePicker,Button} from 'antd';
import moment from 'moment';
import { NewSelect} from 'components'
import OSS from "ali-oss"
import co from "co"
import styles from './style.less';

class NormalLoginForm extends React.Component{
  constructor(props) {
    super(props);
      this.state = { 
         previewVisible:false,
         previewImage:null,
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
       });
    }
  }
  showMaodal = (url,width) => {
 
     this.setState({
     	 previewVisible:true,
         previewImage:url, 
         modalwiddth:width

     })
  }
  deleteFile = (url) => {
  	  this.setState({
  	  	   change:true
  	  })
  	  this.props.deleteFile(url) 
  }
  handleCancel = () => {
    this.setState({
     	 previewVisible:false,
     })
  }
  uploadImageElement = (uploadMess) => {
   
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
               <div className={styles.block} style={{
                    borderColor:item.fail=='true'?'red':'#dfdfdf'
                 }}>
                  
                  <div className={styles.blockinner} style={{
                     width:'100%',
                     height:'100%',
                     overflow:'hidden',

                  }}>
                    <span className={styles.reporate}>
                      <span className={styles.inconWrap}>
                         <Icon className={styles.icons} type="delete" onClick={()=>{this.deleteFile(item.url)}} />
                         <Icon className={styles.icons} type="eye-o" onClick={()=>{this.showMaodal(item.url,natureSizeWidth)}} />
                       </span>
                    </span>
                    <p className={` ${styles.uploadState} ${item.fail=='true' ? styles.error: ''}`}>{mess}</p>
                     <img style={{width:'100%',height:'auto'}} src={item.url}/>
                  </div>
                 
               </div>  
             )
       })
         
       }
      console.log(uploadMess)
  }

  render() {
    const {previewVisible,previewImage,modalwiddth} = this.state
    const showWidth =modalwiddth?modalwiddth<400?modalwiddth:500:500
    const limit = this.props.limit;
    const limituploadMess =this.props.uploadMess;
    console.log(1111111)
    return (
          
         <div> 
              {this.uploadImageElement(this.props.uploadMess)}
              {(limit&&limituploadMess&&limituploadMess.length<limit||!limit||!limituploadMess) &&
	              <a href="javascript:;" className={styles.upload}>
	                 <Icon type="plus" />
	                 上传图片
	                <input type="file" className={styles.change} onChange={this.props.uploadImags}/>
	              </a>
              }
               <Modal width={showWidth} maskClosable={true} visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                <img alt="example" style={{ width: '100%' }} src={previewImage} />
              </Modal>
         </div>
    );
  }
 }




                   


    export default NormalLoginForm;                 