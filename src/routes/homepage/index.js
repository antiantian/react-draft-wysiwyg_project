/**
 * 
 * @authors zcy (1366969408@qq.com)
 * @date    2017-12-27 10:26:08
 * @version $Id$
 */
 import React,{Component} from 'react';
import PropTypes from 'prop-types'
import { Page } from 'components'
import moment from 'moment'
const HomePage = () => {
 const styles={
 	 head:{
 	 	fontSize: 20,
	    lineHeight: '28px',
	    fontWeight: 500,
	    color: 'rgba(0, 0, 0, 0.85)',
	    marginBottom: 12,
 	 }
 }
 const week=['星期日','星期一','星期二','星期三','星期四','星期五','星期六']
 const weeks=moment().format('d'); 
  return (
    <Page inner >
        <div style={{...styles.head}}>欢迎来到内容管理系统</div>
         <div>当前时间:<TimeDate/> {week[weeks]}</div>
     </Page>
  )
}
class TimeDate extends Component{
  constructor(props) {
      super(props);
      this.state={
        timeD:moment().format("YYYY-MM-DD , HH:mm:ss a"),
      }
      this.timer=null
  }
  componentDidMount(){
     let that=this;
      this.timer=setInterval(function(){

            let times=moment().format("YYYY-MM-DD , HH:mm:ss a");
            that.setState({
               timeD: times
            })
     },1000)
   }
  componentWillUnmount(){
    clearInterval( this.timer)
    this.state.timeD=null
   }
   render(){
      return(
         <span>{this.state.timeD}</span>
      )
   }
}
export default HomePage;

