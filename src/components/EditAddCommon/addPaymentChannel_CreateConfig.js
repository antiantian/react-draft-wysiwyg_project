import React, { Component } from 'react';
import { Form,Row, Col,Input,Button,Radio,Checkbox,Switch} from 'antd';
const { TextArea } = Input;
const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const textList=["privateKey","publicKey","dataKey","signKey"];
class CreatePay extends Component{
  state = {
    check_default:true,
    name:'', //conde 与费率主键现在相同
    open:true,
    validate:true,
    changeVal:false,//点击保存按钮
    default_OBJ:this.props.default_OBJ,
    defaultList:{},
  }
  onChange=(e)=> {
    this.setState({
      check_default:e.target.checked,
      open:e.target.checked
    })
    this.changparent(e.target.checked)
  }
  changparent=(change,dataS)=>{
       var datas={};
       if(dataS){
          datas=dataS
       }else{
         var obj=this.state.defaultList||this.props.chanConfigs[0];
         for(var m in obj){
             datas[m]= this.state[m];
         }
       }
      var object={datas}
      this.props.changeParrateJson(object,this.props.innerItem)
  }
  onChangeAll=(e)=>{
    if(e.target.name=='allowCredit'||e.target.name=='autoD0'||e.target.name=='allowD0'){
        this.setState({
          [e.target.name]:e.target.value==='是'?true:false,
        },()=>{
          this.changparent(true)
        });  
    }else{
        if(e.target.name=='creditRate'){
            if(e.target.value!==''){
              this.setState({
                [e.target.name]:trim(e.target.value), //信用卡是联动的
                allowCredit:true
              },()=>{
                this.changparent(true)
              });
            }else{
              this.setState({
                [e.target.name]:trim(e.target.value), //信用卡是联动的
                allowCredit:false
              },()=>{
                this.changparent(true)
              });
            }
              
        }else{
            this.setState({
              [e.target.name]:trim(e.target.value), //去空格
            },()=>{
              this.changparent(true)
            });
        }
        
    }
    
  }
  changeOpen=(checked)=>{
    this.setState({
      open:checked,
    });
  }
  componentDidMount(){
    // 不能直接赋值 会修改原始值
    let objTest={};
    var defaults=this.state.default_OBJ;
    if(defaults){
          for(let k in defaults){
              objTest[k]=defaults[k];
          }
          this.setState({
               defaultList:objTest  
          })
    }

   //this.props 获取属性  
    const chanRatesList= this.props.chanConfigs[0];
       this.setState({
         check_default:true,
         open:true
       })
       for(let n in chanRatesList){
           this.setState({
              [n]:chanRatesList[n]
           })
       }
       this.changparent(true,chanRatesList)
       let creditRateHad=false;
        for(let k in chanRatesList){
           if(k==='creditRate'){
                creditRateHad=true;
                break;
           }
        }
        this.setState({
            creditRateHad:creditRateHad
        })
  }
  componentWillReceiveProps(nextProps) {
        if(this.state.validate){
          if('false'===nextProps.datasValidate){
            this.setState({
               open:true,
               validate:false,
               changeVal:true
           })
           this.changes()
            return false;
          }
        }      
        /*当formData.timeFlag-1，代表不限时段，日期组件即将不可用，1是限时段日期组件可以选用*/
    }
   changes=()=>{
      // alert(this.props.form.length)
      //this.props.form.submit()
      this.props.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values);
        }
      });
     this.props.changeValidate(this.props.innerItem)
     this.setState({
      validate:true
     })
     return false
   }
    nessC=(M)=>{
      var ness=this.props.necessaryMess;
      var nessCondition=false;
      if(ness&&ness.length>0){
         for(let i=0;i<ness.length;i++){
           if(M==ness[i]){
              nessCondition=true;
              break;
           }
         }
      }
      return nessCondition
   }
  check = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }else{
         this.setState({
          validate:true
         })
      }
    })
  }
   AA=(getFieldDecorator)=>{
     const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span:5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 19 },
      }
    }
     var obj=this.state.defaultList||this.props.chanConfigs[0];
     var string=[];
     for(var m in obj){
        if(m!='key'&&m!='name'){      
                  var nessM=this.nessC(m);
                  if(m=='autoD0'||m=='allowD0'){
                  string.push(
                     <FormItem {...formItemLayout} key={m} label={m}>
                      {getFieldDecorator(m, {
                        rules: [{
                          required: false,
                          message: 'Please input your nickname'+m,
                        }],
                        initialValue:this.state[m]===true?'是':this.state[m]===false?'否':''
                      })(
                        <RadioGroup onChange={this.onChangeAll}>
                          <Radio value='是' name={m}>是</Radio>
                          <Radio value='否' name={m}>否</Radio>
                       </RadioGroup>
                      )}
                    </FormItem>
                  )
                }else if(m=='allowCredit'){
                  if(this.state.creditRateHad){
                      string.push(
                       <FormItem {...formItemLayout} key={m} label={m}>
                        {getFieldDecorator(m, {
                          rules: [{
                            required: false,
                            message: 'Please input your nickname'+m,
                          }],
                          initialValue:this.state[m]===true?'是':this.state[m]===false?'否':''
                        })(
                          <RadioGroup disabled={true}>
                            <Radio value='是' name={m}>是</Radio>
                            <Radio value='否' name={m}>否</Radio>
                          </RadioGroup>
                        )}
                      </FormItem>
                    )
                  }else{
                     string.push(
                       <FormItem {...formItemLayout} key={m} label={m}>
                        {getFieldDecorator(m, {
                          rules: [{
                            required: false,
                            message: 'Please input your nickname'+m,
                          }],
                          initialValue:this.state[m]===true?'是':this.state[m]===false?'否':''
                        })(
                          <RadioGroup onChange={this.onChangeAll}>
                            <Radio value='是' name={m}>是</Radio>
                            <Radio value='否' name={m}>否</Radio>
                         </RadioGroup>
                        )}
                      </FormItem>
                    )
                  } 
                  
                }else{
                     if(nessM){
                         const valiOpen=this.state.changeVal&&(this.state[m]==undefined||(trim(this.state[m]).length<=0));
                         string.push(
                            <FormItem 
                              validateStatus={valiOpen?"error":''}
                              help={valiOpen?"请填写"+m:''}
                              {...formItemLayout} key={m} label={m}>
                              {getFieldDecorator(m, {
                                rules: [{
                                  required: true,
                                  message: 'Please input your nickname'+m,
                                }],
                                initialValue:this.state[m]
                              })(
                                <NewInput
                                     name={m}
                                     onKeyUp={this.keyUp}
                                     placeholder={"Please input your"+m} 
                                     onChange={this.onChangeAll}
                                 />
                              )}
                            </FormItem>
                          ) 
                      }else{
                         string.push(
                            <FormItem {...formItemLayout} key={m} label={m}>
                              {getFieldDecorator(m, {
                                initialValue:this.state[m]
                              })(
                               <NewInput
                                   name={m}
                                   onKeyUp={this.keyUp}
                                   placeholder={"Please input your"+m} 
                                   onChange={this.onChangeAll}
                               /> 
                              )}
                            </FormItem>
                          ) 
                      }                  
                    }


                }
                         
     }
     return string
  } 
  
   //是否只能是数字
  returnNum=(name)=>{
    let list=['rate','fee','minTransaction','maxTransaction','creditRate','fakeRate','d0Rate','d0Fee'];
    let had=false;
    for(let i=0;i<list.length;i++){
        if(name===list[i]){
          had=true;
          break;
        }
    }
    return had;
  } 
  keyUp=(e)=>{
    if(this.returnNum(e.target.name)){
       this.setState({
          [e.target.name]:e.target.value.replace(/[^\d\.]/g,'')
        })
    }else{
       this.setState({
          [e.target.name]:e.target.value
        })
    }  
  }
   render(){

      const { getFieldDecorator } = this.props.form;
      const {chanConfigs} =this.props;
      if(this.props.innerList){
         return(
               <div className="zChannel_parent">
                  <Row gutter={24}>
                        <Col style={{lineHeight:'32px'}} span={24}>
                            <Form ref={self => this.form = self} onSubmit={this.handleSubmit} className="zChannel_wrap">
                                {this.AA(getFieldDecorator)}
                            </Form>  
                        </Col>
                   </Row>               
              </div>     
          )
      }else{
          return(
             <div className="zChannel_parent">
                    <Row gutter={24}>
                        <Col style={{lineHeight:'32px'}} span={24}>
                            <Checkbox 
                              checked={this.state.check_default}>
                             </Checkbox>
                             <Switch 
                               checkedChildren="开" 
                               unCheckedChildren="关" 
                               size="small"
                               checked={this.state.open}
                               className="open_close"
                               onChange={this.changeOpen}
                              />
                        </Col>
                   </Row>
                 {this.state.open&&
                  <Row gutter={24}>
                        <Col style={{lineHeight:'32px'}} span={24}>
                            <Form ref={self => this.form = self} onSubmit={this.handleSubmit} className="zChannel_wrap">
                                {this.AA(getFieldDecorator)}
                            </Form>  
                        </Col>
                   </Row>    
                 }           
             </div>
            )
      }  
   }
}
class NewInput extends Component{
   render(){
      const isTextArea=TextAreaIS(this.props.name);
      if(isTextArea){
          return(
            <TextArea {...this.props} />
          )
      }else{
         return(
            <Input {...this.props}/>
          )
      }
      
   }
}
function TextAreaIS(name){
     const list=textList;
     let had=false;
     for(let i=0;i<list.length;i++){
        if(name===list[i]){
          had=true;
          break;
        }
    }
    return had;
}
//<TextArea rows={4} />
function trim(s){
    return s.replace(/(^\s*)|(\s*$)/g, "");
}
const WrappedDynamicRule2 = Form.create({
  //将属性传递到组件中
  mapPropsToFields(props) {
    return {
      props: props.formState,
    };
  }
})(CreatePay);
export default  WrappedDynamicRule2;