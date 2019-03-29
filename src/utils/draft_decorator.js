/**
 * 
 * @authors zcy (1366969408@qq.com)
 * @date    2017-11-20 13:42:49
 * @version $Id$
 */
 import {CompositeDecorator, EditorState, convertToRaw, ContentState,convertFromHTML} from 'draft-js'


  function findLinkEntities (contentBlock, callback, contentState){
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

  const Link = (props) => {
    const {url} = props.contentState.getEntity(props.entityKey).getData();
    return (
      <a href={url} style={styles.link}>
       124455 {props.children}
      </a>
    );
  }

  function  findImageEntities(contentBlock, callback, contentState){
    contentBlock.findEntityRanges(
      (character) => {
        console.log(character)
        const entityKey = character.getEntity();
        console.log(entityKey)
        return (
          entityKey !== null &&
          contentState.getEntity(entityKey).getType() === 'IMAGE'
        );
      },
      callback
    );
  }

  const Image = (props) => {
    const {
      height,
      src,
      width,
      style,
    } = props.contentState.getEntity(props.entityKey).getData();
    console.log(props.contentState.getEntity(props.entityKey).getData())
    return (
      <div>1234<img src={src}  height={height} width={200} style={{width:200}} /></div>
    );
  }

module.exports = {findLinkEntities,findImageEntities,Link,Image};
