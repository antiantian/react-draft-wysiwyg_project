import React ,{Component}from 'react'
import PropTypes from 'prop-types'
import { Editor } from 'react-draft-wysiwyg'
import { Entity,EditorState, convertToRaw, ContentStat , Modifier , AtomicBlockUtils  } from 'draft-js'
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import styles from './Editor.less'
//import * as draftEtend from 'draft-extend'
 
import { createPlugin, pluginUtils } from 'draft-extend'
import { Button, Modal, message ,Select} from 'antd'
const Option = Select.Option;
const ENTITY_TYPE = 'VIDEO'
const BLOCK_TYPE = 'atomic:video'
class CustomOption extends Component {
  static propTypes = {
    onChange: PropTypes.func,
    editorState: PropTypes.object,
  };

  addStar: Function = (): void => {
    const { editorState, onChange } = this.props;
    const contentState = Modifier.replaceText(
      editorState.getCurrentContent(),
      editorState.getSelection(),
      '♀',
      editorState.getCurrentInlineStyle(),
    );
    onChange(EditorState.push(editorState, contentState, 'insert-characters'));
  };

  render() {
    return (
      <div onClick={this.addStar}>♀</div>
    );
  }
}

class DraftEditor extends React.Component {
  constructor(props) {
    super(props);
    const value = this.props.editorState ;
   // console.log(this.props.editorState)
    this.state = {
	    editorState: this.props.editorState ,
    };
  }
  componentDidMount(){
  	//this.handleChange(this.props.editorState)
  }
  html_draft = (html) => {
    const contentBlock = htmlToDraft(html);
    if (contentBlock) {
      const contentState =ContentState.createFromBlockArray(contentBlock.contentBlocks);
      const editorState = EditorState.createWithContent(contentState);
      return editorState
    }
  }
  //  componentWillReceiveProps(nextProps) {
  //   // Should be a controlled component.

  //   if ('editorState' in nextProps) {
  //     const editorState = nextProps.editorState;
  //     this.setState({ editorState:editorState })
  //   }
  // }
  handleChange = (editorState) => {
  
  	this.setState({ editorState:editorState })
  	this.props.onChange(editorState);  //onchange的参数转为控件的参数
  }
  render() {

    const {editorState } = this.state;
    const {placeholder,wrapperStyle,editorStyle,toolbar,...others} = this.props;
  //  console.log(editorState)  <WithPlugin/>
  let customDecorators= this.props.customDecorators
  customDecorators.push(VideoDecorator)
  console.log(others)
    return (
        <Editor toolbarClassName={styles.toolbar}
           wrapperClassName={styles.wrapper} 
           editorClassName={styles.editor} 
           editorState={editorState}
           onEditorStateChange={this.handleChange}
           wrapperStyle={wrapperStyle}
           editorStyle={editorStyle}
           placeholder={placeholder||"Enter some text..."}
           toolbar={toolbar}
           uploadCallback={toolbar.image.uploadCallback}
           customDecorators={customDecorators}
           localization={{ locale: 'zh' }}
           htmlToEntity={htmlToEntity}
           customDecorators={customDecorators} 
        />
    );
  }
}
const htmlToEntity = (nodeName, node) => {
    if (nodeName === 'iframe') {
        return Entity.create(
            ENTITY_TYPE,
            'IMMUTABLE',
            {
                src: node.getAttribute('src'),
            }
        )
    }
}

DraftEditor.propTypes = {
  size: PropTypes.string,
  select: PropTypes.bool,
  selectProps: PropTypes.object,
  onSearch: PropTypes.func,
  fileList: PropTypes.array,
  style: PropTypes.object,
  keyword: PropTypes.string,
}

export default DraftEditor



const VideoDecorator = {
    strategy: pluginUtils.entityStrategy(ENTITY_TYPE),
    component: props => {
        const entity = Entity.get(props.entityKey)
        const { src } = entity.getData()
        return (
            <iframe allowFullScreen frameBorder={0} width={750} height={1040} src={src} controls />
        );
    }
}
