import PropTypes from 'prop-types'
import { Breadcrumb, Icon } from 'antd'
import { Link } from 'react-router-dom'
import pathToRegexp from 'path-to-regexp'
import { queryArray } from 'utils'
import styles from './Bread.less'

const Bread = ({ menu, location }) => {
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
  // 匹配当前路由
  let pathArray = []
  let current
  for (let index in menu) {   //route或者details
    if ((menu[index].route && pathToRegexp(menu[index].route).exec(location.pathname))||detailExp(menu[index])) {
      current = menu[index]
      break
    }
  }

  const getPathArray = (item) => {
    pathArray.unshift(item)
    if (item.mpid) {
      getPathArray(queryArray(menu, item.mpid, 'id'))
    }
  }
  if (!current) {
    pathArray.push(menu[0] || {
      id: 1,
      icon: 'laptop',
      name: 'Dashboard',
    })
    pathArray.push({
      id: 404,
      name: 'error',
    })
  } else {
    getPathArray(current)
  }

  // 递归查找父级
  const breads = pathArray.map((item, key) => {
    const content = (
      <span>{item.icon
        ? <Icon type={item.icon} style={{ marginRight: 4 }} />
        : ''}{item.name}</span>
    )
    return (
      <Breadcrumb.Item key={key}>
        {((pathArray.length - 1) !== key)
          ? <Link to={item.route || '#'}>
             {content}
          </Link>
          : content}
      </Breadcrumb.Item>
    )
  })

  return (
    <div className={styles.bread}>
      <Breadcrumb>
        {breads}
      </Breadcrumb>
    </div>
  )
}

Bread.propTypes = {
  menu: PropTypes.array,
  location: PropTypes.object,
}

export default Bread
