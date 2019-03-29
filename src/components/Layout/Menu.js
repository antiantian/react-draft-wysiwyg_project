import PropTypes from 'prop-types'
import { Menu, Icon } from 'antd'
import { Link } from 'react-router-dom'
import { arrayToTree, queryArray } from 'utils'
import pathToRegexp from 'path-to-regexp'
import '../../css/icon.less'
const Menus = ({ siderFold, darkTheme, handleClickNavMenu, navOpenKeys, changeOpenKeys, menu, location ,auditCount}) => {
  // 生成树状
  const menuTree = arrayToTree(menu.filter(_ => _.mpid !== '-1'), 'id', 'mpid')
  const levelMap = {}
  // 递归生成菜单
  // '/assetTodo/list'
 
  const getMenus = (menuTreeN, siderFoldN) => {
    return menuTreeN.map((item) => {
      if (item.children) {
        if (item.mpid) {
          levelMap[item.id] = item.mpid
        }
        return (
          <Menu.SubMenu
            key={item.id}
            title={<span>
              {item.icon && <Icon type={item.icon} />} 
               {!item.icon && item.route!='/homepage'&&  <Icon type={'bars'} />}  
               {!item.icon && item.route=='/homepage'&& <Icon type="dashboard" />} 
               {(!siderFoldN || !menuTree.includes(item)) && (item.route=='/homepage'?"工作台":item.name)}
               {item.route=='/assetTodo/list' && <sup>123</sup>}
            </span>}
          >
            {getMenus(item.children, siderFoldN)}
          </Menu.SubMenu>
        )
      }
      return (
        <Menu.Item key={item.id}>
          <Link to={{
            pathname:item.route || '#',
            state:{
               controlState:{
                 buttonType:item.authority&&item.authority['type'],
                 buttonState:item.authority&&item.authority['list']
               }
            },
            query:{
               controlState:{
                 buttonType:item.authority&&item.authority['type'],
                 buttonState:item.authority&&item.authority['list']
               }
            },
          }}>

            {item.icon && <Icon type={item.icon} />}
            {!item.icon && item.route=='/homepage'&& <Icon type="dashboard" />} 
            {!item.icon && item.route!='/homepage'&&!item.mpid&& <Icon type={'bars'} />} 
            {(!siderFoldN || !menuTree.includes(item)) && (item.route=='/homepage'?"工作台":item.name)}
            {item.route=='/assetTodo/list' && auditCount&& auditCount!="0"&&
              <sup style={{
                backgroundColor:'#ff0000',color:"#ffffff",
                borderRadius:10,minWidth:20,fontSize:12,
                lineHeight:'20px',display:'inline-block',
                textAlign:'center'
              }}>{auditCount}</sup>
            }
            {siderFoldN&&!item.mpid&&<span style={{width:0,height:0,overflow:'hidden'}}>{item.name}</span>}
          </Link>
        </Menu.Item>
      )
    })
  }


  // <SubMenu key="sub4" title={<span><Icon type="setting" /><span>Navigation Three</span></span>}>
  //         <Menu.Item key="9">Option 9</Menu.Item>
  //         <Menu. key="10">Option 10</Menu.Item>
  //         <Menu.ItemItem key="11">Option 11</Menu.Item>
  //         <Menu.Item key="12">Option 12</Menu.Item>
  //       </SubMenu>


  const menuItems = getMenus(menuTree, siderFold)

  // 保持选中
  const getAncestorKeys = (key) => {
    let map = {}
    const getParent = (index) => {
      const result = [String(levelMap[index])]
      if (levelMap[result[0]]) {
        result.unshift(getParent(result[0])[0])
      }
      return result
    }
    for (let index in levelMap) {
      if ({}.hasOwnProperty.call(levelMap, index)) {
        map[index] = getParent(index)
      }
    }
    return map[key] || []
  }

  const onOpenChange = (openKeys) => {
    const latestOpenKey = openKeys.find(key => !navOpenKeys.includes(key))
    const latestCloseKey = navOpenKeys.find(key => !openKeys.includes(key))
    let nextOpenKeys = []
    if (latestOpenKey) {
      nextOpenKeys = getAncestorKeys(latestOpenKey).concat(latestOpenKey)
    }
    if (latestCloseKey) {
      nextOpenKeys = getAncestorKeys(latestCloseKey)
    }
    changeOpenKeys(nextOpenKeys)
  }

  let menuProps = !siderFold ? {
    onOpenChange,
    openKeys: navOpenKeys,
  } : {}

 const detailExp = (item) => {
    let haddetail=false;
    let data=[];
    if(item.details){
       data=item.details.split(',')
    }
    if(data.length>0){
        for(let i=0;i<data.length;i++){
          let valpath=pathToRegexp(data[i]).exec(location.pathname);
          if(valpath){
            haddetail=true   
          }
       }
    }
  
   return   haddetail
 }
  // 寻找选中路由  父路由或者 details路由  (item.details && pathToRegexp(item.details).exec(location.pathname))
  let currentMenu
  let defaultSelectedKeys
  for (let item of menu) {
    if ((item.route && pathToRegexp(item.route).exec(location.pathname))||detailExp(item)) {
      currentMenu = item
      break
    }
  }
  const getPathArray = (array, current, pid, id) => {
    let result = [String(current[id])]
    const getPath = (item) => {
      if (item && item[pid]) {
        result.unshift(String(item[pid]))
        getPath(queryArray(array, item[pid], id))
      }
    }
    getPath(current)
    return result
  }
  if (currentMenu) {
    defaultSelectedKeys = getPathArray(menu, currentMenu, 'mpid', 'id')
  }

  if (!defaultSelectedKeys) {
    defaultSelectedKeys = ['1']
  }
const SubMenu = Menu.SubMenu;
  return (
    <Menu
      {...menuProps}
      mode={siderFold ? 'vertical' : 'inline'}
      theme={darkTheme ? 'dark' : 'light'}
      onClick={handleClickNavMenu}
      selectedKeys={defaultSelectedKeys}
      inlineCollapsed={siderFold}
    >
      {menuItems}
    </Menu>
  )
}

Menus.propTypes = {
  menu: PropTypes.array,
  siderFold: PropTypes.bool,
  darkTheme: PropTypes.bool,
  handleClickNavMenu: PropTypes.func,
  navOpenKeys: PropTypes.array,
  changeOpenKeys: PropTypes.func,
  location: PropTypes.object,
}

export default Menus
