import React from 'react'
import PropTypes from 'prop-types'
import { Dropdown, Button, Icon,Input, Menu } from 'antd'

const DropOption = ({ onMenuClick, menuOptions = [], buttonStyle, dropdownProps,...props}) => {
  const menu = menuOptions.map( (item,index)=> {
    if(item&&item.type=='formButtom'){
      let messdata=item.messages||[]
       const inputs=messdata.map( (item,index) => {
           return( <Input key={index} type='hidden' name={item.name} value={item.value} /> )
       })
       return(
            <form  key={index} action={item.action} method="post" target="_blank">
                    {inputs}
                    <button id='daochu' className="ant-btn  ant-btn-lg" type="submit" style={{ width: '100px', marginRight: 10,}}>{item.name}</button>
             </form>
        )
    }else{
      return(
        <Menu  key={index} onClick={onMenuClick}>
         <Menu.Item key={item.key}>{item.name}</Menu.Item>
        </Menu> 
      )
    }
      
  })
  return (<Dropdown
    overlay={<div>{menu}</div>}
    {...dropdownProps}
  >
    {props.children?props.children:
      <Button style={{ border: 'none', ...buttonStyle }}>
        <Icon style={{ marginRight: 2 }} type="bars" />
        <Icon type="down" />
      </Button>
    }
  </Dropdown>)
}

DropOption.propTypes = {
  onMenuClick: PropTypes.func,
  menuOptions: PropTypes.array.isRequired,
  buttonStyle: PropTypes.object,
  dropdownProps: PropTypes.object,
}

export default DropOption
