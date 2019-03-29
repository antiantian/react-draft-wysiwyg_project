/**
 * 
 * @authors zcy (1366969408@qq.com)
 * @date    2017-11-08 14:48:06
 * @version $Id$
 */

import React,{Component} from 'react';
import { Row, Col, Radio, Checkbox,  AutoComplete,DatePicker,Spin,Table,Pagination,Select,TimePicker,Button} from 'antd';
import moment from 'moment';
const RadioGroup = Radio.Group;
const Option = Select.Option;
class NewAutoComplete extends Component{
   changeVal = (value) => {
      this.props.changeVal2(value,this.props.names)
   }
   render(){
      return(
      <Row>
        <Col span={24}>
            <span className="singlepm">{this.props.text}</span>
            <AutoComplete {...this.props} onSearch={this.changeVal} style={{ width:'80%',maxWidth:'400px' }}/>
            <Checkbox checked={this.props.check} style={{ marginLeft: 10 }}></Checkbox>
        </Col> 
       </Row>    
      )
   }
}
class NewRadioGroup extends Component{
   changeVal = (e) => {
      this.props.RadioGroupVal(e,this.props.names)
   }
   render(){
    const datas=this.props.datas.map((item,index)=>{
         return <Radio key={index} value={item.val}>{item.text}</Radio>
    })
      return(
      <Row>
        <Col span={24}>
            <span className="singlepm" style={{ lineHeight: '20px' }}>{this.props.text}</span>
            <RadioGroup onChange={this.changeVal} value={this.props.value}>
                {datas}
            </RadioGroup>
        </Col> 
       </Row>    
      )
   }
}
class NewDatePicker extends Component{
  constructor(props){
    super(props);
    this.state={
        times:this.props.time
    }
  }
   changeVal = (dates,dateString) => {
      this.props.changeDatePicker(dates,dateString,this.props.name)
   }
   render(){
      return(
          <DatePicker onChange={this.changeVal} 
            size={'large'}
            showTime={{ defaultValue:this.props.isend? moment('23:59:59', 'HH:mm:ss'):moment('00:00:00', 'HH:mm:ss') }} 
            value={this.props.time!== '' ? moment(this.props.time, 'YYYY-MM-DD HH:mm:ss') : null}
            placeholder={this.props.title} style={{ marginRight: 10,verticalAlign:'middle' }} 
            format="YYYY-MM-DD HH:mm:ss"
            {...this.props}
          />
      )
   }
}

class TableCommon extends Component{
   render(){
      const {data,columns,totalAmount,total,load,currentpage,nopaging}=this.props;
      const currentpageSize=this.props.currentpageSize||10;
      return(  
           <div>
              <Table dataSource={data} columns={columns} scroll={{ x: 1300 }} pagination={false}  {...this.props} />
              {total!='0'&&total!=''&&
              <Row>
                   <Col span={24} style={{ textAlign: 'right', marginTop: 20 }}>
                    <span style={{verticalAlign:8}}>
                      {totalAmount&&
                        <span>
                         总计金额：{totalAmount}元,
                        </span>
                      }
                      {total}条记录</span>
                     {!nopaging&&
                       <Pagination 
                         showSizeChanger 
                         showQuickJumper 
                         onShowSizeChange={this.props.onShowSizeChange} 
                         onChange={this.props.onChangePage} 
                         total={total} 
                         pageSize={currentpageSize}
                         defaultPageSize={currentpageSize}
                         defaultCurrent={currentpage}
                         current={currentpage}
                         style={{display:'inline-block',marginLeft:20}}
                      />
                    }    
                  </Col>
               </Row>
             }
              <div className="Spin" style={{textAlign:'center'}}><Spin tip="Loading..." spinning={load} /></div>
           </div>
        )
    }
}
class NewSelect extends Component{
   handleChange=(val)=>{
       this.props.onChange(val,this.props.name)
   }
   render(){
      const datas=this.props.datas.map((item,index)=>{
           let values=item[this.props.valMess]||item.val;
           return <Option key={index} value={values.toString()}>{item[this.props.textMess]||item.text}</Option>
      })
      return(
        <Select  style={{ width: 120,verticalAlign:'middle' }}  onChange={this.handleChange} {...this.props}> 
            {datas}
        </Select> 
      )
   }
}
class NewSelectFilter extends Component{
  constructor(props) {
    super(props);
    this.state={
      value:this.props.value
    }
  }
   componentWillReceiveProps(nextProps) {
    // Should be a controlled component.
    if ('value' in nextProps && nextProps.value) {
      const value = nextProps.value?nextProps.value.toString():nextProps.value;
       this.setState({
        value:value
       });
    }
  }
   componentWillMount(){

   }
   handleChange=(val)=>{
       this.props.onChange(val,this.props.name)
   }
   render(){
      const datas=this.props.datas.map((item,index)=>{
           let values=item[this.props.valMess]||item.val;  
           return <Option key={index} value={values.toString()}>{item[this.props.textMess]||item.text}</Option>
      })
      const value=this.state.value
      return(
        <Select  style={{ width: 120,verticalAlign:'middle' }}  onChange={this.handleChange} {...this.props} value={value}> 
            {datas}
        </Select> 
      )
   }
}
class NewTimePicker extends Component{
  state = {
    newStart:this.props.newStart,
    timeType:this.props.timeType||'HH:mm'
  }
   onChangeTime=(time, timeString)=> {
    this.props.changeTime(this.props.name,timeString)
  }
  handleOpenChange = (open) => {
    this.setState({ open });
  }

  handleClose = () => this.setState({ open: false })
  render(){
    return(
      <TimePicker
                style={{width:"100%"}}
                className={this.props.classname}
                open={this.state.open}
                onOpenChange={this.handleOpenChange}
                format={this.state.timeType}
                defaultValue={this.state.newStart?moment(this.state.newStart, this.state.timeType):null} 
                onChange={this.onChangeTime}
                addon={() => (
                  <Button size="small" type="primary" onClick={this.handleClose}>
                     Ok
                  </Button>
                )}
              />
    )
  }
}

 const Z_Link = (props) => {
        const {url} = props.contentState.getEntity(props.entityKey).getData();
        return (
          <a href={url} style={styles.link}>
            111344{props.children}
          </a>
        );
      }
const Z_Image = (props) => {
  const {
    height,
    src,
    width,
  } = props.contentState.getEntity(props.entityKey).getData();

  return (
    <img src={src} height={height} width={width} />
  );
}
export{NewAutoComplete,NewRadioGroup,NewDatePicker,NewTimePicker,TableCommon,NewSelect,Z_Link,Z_Image,NewSelectFilter}

