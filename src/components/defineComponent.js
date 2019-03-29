/**
 * 
 * @authors zcy (1366969408@qq.com)
 * @date    2017-12-05 17:21:12
 * @version $Id$
 */
import React,{Component} from 'react';
import { Row, Col,Checkbox,  AutoComplete,DatePicker,Spin,Table,Pagination,Select,TimePicker,Button, Radio, Icon} from 'antd';
import moment from 'moment';
const RadioGroup = Radio.Group;
const Option = Select.Option;
class AddMode extends Component{
	constructor(props) {
	    super(props);
	    this.state={
	      datas:this.props.datas,
	      value:this.props.value,
         placeholder:this.props.placeholder,
         disabled:this.props.disabled
	    }
	}
   changeVal = (value) => {
      this.props.onChange(val,this.props.name)
   }
   render(){
      const {datas,value,placeholder,disabled} = this.props;

      return(
         <div>
            <Button type="primary" shape="circle" icon="plus" size={'large'} />
         </div>
      )
   }
}

export{
	AddMode
}
