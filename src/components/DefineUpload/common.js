/**
 * 
 * @authors zcy (1366969408@qq.com)
 * @date    2018-03-28 09:51:18
 * @version $Id$
 */

//上传图片到阿里云  
import {Modal,message ,Icon, Input,Button} from 'antd';
  let current_checkpoint;


const progress = (p, checkpoint) => {
  return function (done) {
    current_checkpoint = checkpoint;
 
    // var bar = document.getElementById('progress-bar');
    // bar.style.width = Math.floor(p * 100) + '%';
    // bar.innerHTML = Math.floor(p * 100) + '%';
    done();
  };
};
 const  uploadFile =  (file,client,key,index) => {
 
     if(!client){
         message.error("没有阿里上传的凭证,请先获取")
         return 
     }
     let uploadFileClient = client
    var options = {
        progress: progress,
        partSize: 100 * 1024,
        meta: {
          year: 2017,
          people: 'test'
        }
      }
      if (current_checkpoint) {
        options.checkpoint = current_checkpoint;
      }
       return new Promise((resolve, reject) => {
          const nowindex =index
          uploadFileClient.multipartUpload(key, file,options).then(res => {
            //console.log('upload success: %j', res);
            current_checkpoint = null;
            uploadFileClient = null;
            res.successIndex=nowindex;
            resolve(res);
          }).catch(err => {
          
             reject({error:'error',failIndex:nowindex})
            if (uploadFileClient && uploadFileClient.isCancel()) {
              message.error('stop-upload!');
            } else {
              message.error(err);
            }
            
          })
      })
      //   uploadFileClient.multipartUpload(key, file,options).then(function (res) {
      //   console.log('upload success: %j', res);
      //   current_checkpoint = null;
      //   uploadFileClient = null;
      // }).catch(function (err) {
      //   if (uploadFileClient && uploadFileClient.isCancel()) {
      //     message.error('stop-upload!');
      //   } else {
      //     message.error(err);
      //   }
      // });

}  //上传图片初始化信息
module.exports = {
	uploadFile,
	
}