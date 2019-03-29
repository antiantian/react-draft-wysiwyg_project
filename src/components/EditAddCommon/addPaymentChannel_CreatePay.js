import React, { Component } from 'react';
import { Form,Row, Col,Input,Button,Radio,Checkbox,Switch} from 'antd';
import CreateConfig from './addPaymentChannel_CreateConfig';
const RadioGroup = Radio.Group;
const FormItem = Form.Item;
class CreatePay extends Component{
  state = {
    check_default:false,
    name:this.props.item.payCode, //conde 与费率主键现在相同  channelCode
    open:false,
    validate:true,
    changeVal:false,//点击保存按钮
    childObject:null,
    childObjectName:'',
    defaultSaleRateLIST:[],
    configNecsssary:[],
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
         var obj=this.state.defaultList||this.props.chanRates[0];
         for(var m in obj){
             datas[m]= this.state[m];
         }
       }
      var object={
        name:this.props.item.payCode,//channelCode
        add:change,
        data:datas
      }
      this.props.changeParrateJson(object)
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
            if(trim(e.target.value)!==''&&!isNaN(e.target.value)){
              this.setState({
                [e.target.name]:trim(e.target.value), //信用卡是联动的
                allowCredit:true
              },()=>{
                this.changparent(true)
              });
            }else{
              this.setState({
                [e.target.name]:e.target.value.replace(/[^\d\.]/g,''), //信用卡是联动的
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
  assignment=(names)=>{
      const chanRatesList= this.props.chanRates;
      let defaultSaleRate_val=null;
      for(let i=0;i<this.props.chanRates.length;i++){
         var obj_pre=chanRatesList[i];

         if(obj_pre.name===this.state.name){
             this.setState({
               check_default:true,
               open:true
             })
             for(let n in obj_pre){
                 this.setState({
                    [n]:obj_pre[n] //赋值已有的
                 })
                 if(names&&names==n){
                   defaultSaleRate_val= obj_pre[n];
                   return defaultSaleRate_val;

                 }
                 // objTest[n]=obj_pre[n];
             }
             this.changparent(true,obj_pre);
             break;
         }
      }
  }
  componentDidMount(){
   // this.handleSubmit(this.refs.form);
   //let objTest=this.props.default_OBJ||this.props.chanConfigs[0];
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
    
   this.assignment();
    //检查是否值的内容是一个对象
   for(let n in objTest){
     if(objTest[n]&&objTest[n].constructor == Object){
                  var arrs=this.state.defaultSaleRateLIST;
                  var vals=null;

                  arrs.push({
                         values:this.assignment(n),//赋值
                         obj:objTest[n], //初始值
                         name:n,
                      })
                  this.setState({
                      defaultSaleRateLIST:arrs
                  })
              }
    }           
    /*
    defaultSaleRateLIST
 if(obj[m]&&obj[m].constructor == Object){
                    objectChilds.push({
                        obj:obj[m],
                        name:m,
                    });
                    //this.changeObjChild(objectChilds);
                   //alert(m)
                  // string.push(this.AA(getFieldDecorator,obj[m]),m);//m shi
                }
*/
    //判断是否存在 creditRate 存在关联信用卡 iscrediet  
    let creditRateHad=false;
    for(let k in objTest){
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
        let formData = this.props.form.getFieldsValue();
        if(this.state.validate){
          if('false'===nextProps.datasValidate){
            var arr=nextProps.codename;
            if(arr.length){
                for(let i=0;i<arr.length;i++){
                   if(arr[i]==this.state.name){
                     this.setState({
                         open:true,
                         validate:false,
                         changeVal:true,
                         
                     })
                     this.changes()
                     break;
                   }
                   
                }
            }
            
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
     this.props.changeValidate()
     this.setState({
      validate:true,
      configValidate:'false',
     })
     return false
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
    handleChange=(e)=>{
      this.setState({
         clicked:e.target.value
      })
       if(e.target.value){
        console.log(13345566)
       }
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
   changeObjChild=(obj)=>{
     this.setState({
         childObject:obj
     })
   }
   AA=(getFieldDecorator,obj,parent)=>{
     const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span:5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 19},
      }
    }
     var objectChilds=[];
     var objectNames=[];
     var obj=obj;
     var string=[];
     for(var m in obj){
        if(m!='key'&&m!='name'){
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
                  
                  
                }else if(obj[m]&&obj[m].constructor == Object){
                    objectChilds.push({
                        obj:obj[m],
                        name:m,
                    });
                    //this.changeObjChild(objectChilds);
                   //alert(m)
                  // string.push(this.AA(getFieldDecorator,obj[m]),m);//m shi
                }else{
                  var nessM=this.nessC(m);
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
                            <Input 
                             onKeyUp={this.keyUp}
                             name={m}
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
                            <Input 
                             onKeyUp={this.keyUp}
                             name={m}
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
      const {chanRates} =this.props;
      const AA=this.AA(getFieldDecorator,this.state.defaultList||this.props.chanRates[0]);
      
      return(
       <div className="zChannel_parent">
           <div className="zChannel_check">
              <Row gutter={24}>
                  <Col style={{lineHeight:'32px'}} span={24}>
                       <Checkbox 
                        checked={this.state.check_default} 
                        onChange={this.onChange}>
                           {this.props.item.name} - {this.props.item.payCode}
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
           </div>
           {this.state.open&&
            <Row gutter={24}>
                  <Col style={{lineHeight:'32px'}} span={24}>
                        <Form ref={self => this.form = self} onSubmit={this.handleSubmit} className="zChannel_wrap">
                            {AA}
                        </Form>
                        {this.state.defaultSaleRateLIST.length>0&&this.state.defaultSaleRateLIST.map((item,index)=>
                         <div key={index}>
                             <Col style={{lineHeight:'32px'}} span={5}>
                                  <h1 style={{
                                     textAlign:'right',
                                     paddingRight:'10px'
                                   }}>
                                    {item.name}:
                                  </h1>
                             </Col>
                             <Col style={{lineHeight:'32px'}} span={19}>
                                <CreateConfig 
                                   innerList={true}
                                   innerItem={item}
                                   datasValidate={this.state.configValidate} 
                                   changeValidate={this.revalidate}
                                   necessaryMess={this.state.configNecsssary}
                                   changeParrateJson={this.changeConfigJson} 
                                   chanConfigs={[item.values]}
                                   default_OBJ={item.obj}
                                 />
                             </Col>    
                          </div>
                        )}
                    </Col>
             </Row>     
           }           
       </div>
        
      )
   }
    revalidate=()=>{
       this.setState({
          configValidate:'true'
        }) 
  }
    changeConfigJson=(obj,item)=>{
     this.setState({
         [item.name]:obj.datas
     },()=>{
        if(this.state.check_default){ //只有选中的时候才更新父级
          this.changparent(true)
        }
      // this.changparent(true)
     })
    }
    handleSubmit = (e) => {
      alert(e)
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  }
}

function trim(s){
   if(typeof str !== 'string') {
       return s
    }
  return s.replace(/(^\s*)|(\s*$)/g, "");
}
const WrappedDynamicRule = Form.create({
    mapPropsToFields(props) {
    return {
      props: props.formState,
    };
  }
})(CreatePay);
export default  WrappedDynamicRule;
const createInnerList={
            "rate": "0.0040",
            "fee": null,
            "minTransaction": "10",
            "maxTransaction": "20000",
            "creditRate": "0.0040",
            "fakeRate": null,
            "allowCredit": true,
            "autoD0": false,
            "d0Rate": null,
            "d0Fee": null
}