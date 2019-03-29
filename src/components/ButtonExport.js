/**
 * 
 * @authors zcy (1366969408@qq.com)
 * @date    2018-06-07 12:04:31
 * @version $Id$
 */

/**
 * 
 * @authors zcy (1366969408@qq.com)
 * @date    2018-02-09 17:17:11  moment(value).format("YYYY-MM-DD HH:mm:ss")
 * @version $Id$
 */
import { Dropdown, Button, Icon,Input, Menu } from 'antd'
import moment from 'moment'
const ButtonExport = ({ name, menuOptions = [], buttonStyle, action,...props}) => {
      let messdata=props.messages||[]
       const valueChange =(name,value) =>{
           if(name=='beginLogTime'||name=='endLogTime'||name=='beginOperaTime'||name=='endOperaTime'){
                  return  value? new Date(value):null
           }else{
              return value
           } 
       }
       const inputs=messdata.map( (item,index) => {
             
           
           return( <Input key={index} type='hidden' name={item.value!=undefined?item.name:null} value={valueChange(item.name,item.value)} /> )
       })
       return(
            <form style={{
                display: 'inline-block',
                color:' #fff',...props.style
            }} action={action} method="post" target="_blank">
                    {inputs}
                    <button id='daochu'
                     className="ant-btn  ant-btn-lg ant-btn-primary" 
                     type="submit" 
                     style={{ 
                        fontSize:14,
                        marginLeft:12,
                        marginRight:12,
                        ...props.style
                      }}>
                       {name}
                     </button>
             </form>
     )
}

  module.exports = {
     ButtonExport

  }