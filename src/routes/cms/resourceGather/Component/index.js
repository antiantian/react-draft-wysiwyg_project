/* @flow */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {  message} from 'antd'
 
import Option from './Option';
import './styles.css';

export function stopPropagation(event) {
  event.stopPropagation();
}

class LayoutComponent extends Component {
  static propTypes: Object = {
    expanded: PropTypes.bool,
    onExpandEvent: PropTypes.func,
    onChange: PropTypes.func,
    config: PropTypes.object,
    translations: PropTypes.object,
    doCollapse: PropTypes.func,
  };

  state: Object = {
    embeddedLink: '',
    height: this.props.config.defaultSize.height,
    width: this.props.config.defaultSize.width,
  };

  componentWillReceiveProps(props) {
    if (this.props.expanded && !props.expanded) {
      const { height, width } = this.props.config.defaultSize;
      this.setState({
        embeddedLink: '',
        height,
        width,
      });
    }
  }

  onChange: Function = (): void => {
    //判断网址：

    const { onChange } = this.props;
    const { embeddedLink, height, width } = this.state;

     console.log(embeddedLink)
  let reglink=/^(http|https):\/\/./
 //^((https|http|ftp|rtsp|mms)?://)^http(s)?:\/\/.+
 console.log(reglink.test(embeddedLink))
  if(reglink.test(embeddedLink)){
       onChange(embeddedLink, height, width);
  }else{
      message.error('必须是以http或者https开头的网址')
      this.setState({
        embeddedLink:''
      })
      return
  }


    
  };

  updateValue: Function = (event: Object): void => {
    console.log(event.target.value)//!#\$&'\(\)\*\+,/:;=\?@-\._~
     console.log(event.target.value.replace(/[^!#\$&'\(\)\*\+,/:;=\?@\-\._~0-9a-zA-Z]/g,''))  
    this.setState({
      [`${event.target.name}`]: event.target.value.replace(/[^!#\$&'\(\)\*\+,/:;=\?@\-\._~0-9a-zA-Z]/g,''),
    });
  };
  rendeEmbeddedLinkModal(): Object {
    const { embeddedLink, height, width } = this.state;
    const { config: { popupClassName }, doCollapse, translations } = this.props;
    return (
      <div
        className={classNames('rdw-embedded-modal', popupClassName)}
        onClick={stopPropagation}
      >
        <div className="rdw-embedded-modal-header">
          <span className="rdw-embedded-modal-header-option">
            {translations['components.controls.embedded.embeddedlink']}
            <span className="rdw-embedded-modal-header-label" />
          </span>
        </div>
        <div className="rdw-embedded-modal-link-section">
          <span className="rdw-embedded-modal-link-input-wrapper">
            <input
              className="rdw-embedded-modal-link-input"
              placeholder={translations['components.controls.embedded.enterlink']}
              onChange={this.updateValue}
              onBlur={this.updateValue}
              value={embeddedLink}
              name="embeddedLink"
            />
            <span className="rdw-image-mandatory-sign">*</span>
          </span>
          <div className="rdw-embedded-modal-size">
            <span>
              <input
                onChange={this.updateValue}
                onBlur={this.updateValue}
                value={height}
                name="height"
                className="rdw-embedded-modal-size-input"
                placeholder="Height"
              />
              <span className="rdw-image-mandatory-sign">*</span>
            </span>
            <span>
              <input
                onChange={this.updateValue}
                onBlur={this.updateValue}
                value={width}
                name="width"
                className="rdw-embedded-modal-size-input"
                placeholder="Width"
              />
              <span className="rdw-image-mandatory-sign">*</span>
            </span>
          </div>
        </div>
        <span className="rdw-embedded-modal-btn-section">
          <button
            type="button"
            className="rdw-embedded-modal-btn"
            onClick={this.onChange}
            disabled={!embeddedLink || !height || !width}
          >
            {translations['generic.add']}
          </button>
          <button
            type="button"
            className="rdw-embedded-modal-btn"
            onClick={doCollapse}
          >
            {translations['generic.cancel']}
          </button>
        </span>
      </div>
    );
  }

  render(): Object {
    const {
      config: { icon, className, title },
      expanded,
      onExpandEvent,
      translations,
    } = this.props;
    return (
      <div
        className="rdw-embedded-wrapper"
        aria-haspopup="true"
        aria-expanded={expanded}
        aria-label="rdw-embedded-control"
      >
        <Option
          className={classNames(className)}
          value="unordered-list-item"
          onClick={onExpandEvent}
          title={title || translations['components.controls.embedded.embedded']}
        >
          <img
            src={icon}
            alt=""
          />
        </Option>
        {expanded ? this.rendeEmbeddedLinkModal() : undefined}
      </div>
    );
  }
}

export default LayoutComponent;
