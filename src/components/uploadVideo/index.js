/**
 * 
 * @authors zcy (1366969408@qq.com)
 * @date    2017-11-03 15:57:19
 * @version $Id$
 */
import React from 'react'
import PropTypes from 'prop-types'
import { Upload, Icon, Modal,Button } from 'antd';
import styles from '../../css/style.less'


class VideoWall extends React.Component {
  constructor(props) {
    super(props);

    const value = this.props.fileList || [];
    this.state = {
      previewVisible: false,
	    previewImage: '',
	    fileList: this.props.fileList||[],
	    limitmun: this.props.limitmun||1,
    };
  }
   componentWillReceiveProps(nextProps) {

    // Should be a controlled component.
    if ('fileList' in nextProps && nextProps.fileList) {
      const fileList = nextProps.fileList;
      this.setState(fileList);
    }
  }
  handleCancel = () => this.setState({ previewVisible: false })

  handlePreview = (file) => {
    this.setState({
      previewImage:file.url || file.thumbUrl,
      previewVisible: true,
    });
  }
  
  handleChange = ({fileList}) => {
  	 let  fileUrl=null;
    // console.log(Object.prototype.toString.call(fileList))
     if (fileList[0].response&&fileList[0].response.code===0) {
           //fileList[0].url=fileList[0].response.data.fileUpload
            this.props.onChange(fileList);  //onchange的参数转为控件的参数
           
      }else{
         this.props.onChange();  //onchange的参数转为控件的参数 
      }
      this.setState({ fileList });
   
  }
  onRemove = (file) => {
        this.setState(({ fileList }) => {
          const index = fileList.indexOf(file);
          const newFileList = fileList.slice();
          newFileList.splice(index, 1);
          return {
            fileList: newFileList,
          };
        },()=>{
           this.props.onChange(null);
        });
      }
    beforeUpload = (file) => {
        this.setState(({ fileList }) => ({
          fileList: [...fileList, file],
        }));
       
      } 
  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    //"//jsonplaceholder.typicode.com/posts/"
    const {actionURL} = this.props;
    const uploadButton = (
      <div>
        {/* <Icon type="plus" />
        <div className="ant-upload-text">请上传视频</div> */}
        <Button type="ghost">
        <Icon type="upload" /> 请上传视频
      </Button>
      </div>
    );
    return (
        <div className="clearfix">
        <Upload
          name='file'
          action= {actionURL}
          listType="text"
          fileList={fileList}
          accept="video/*"
          onRemove={this.onRemove}
          onChange={this.handleChange}  
        >
          {fileList.length >= this.state.limitmun ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          {/* <img alt="example" style={{ width: '100%' }} src={previewImage} /> */}
           <video style={{ width: '100%'}} src={previewImage} controls="controls"></video>
        </Modal>
      </div>
    );
  }
}
VideoWall.propTypes = {
  size: PropTypes.string,
  select: PropTypes.bool,
  selectProps: PropTypes.object,
  onSearch: PropTypes.func,
  fileList: PropTypes.array,
  style: PropTypes.object,
  keyword: PropTypes.string,
}

export default VideoWall
