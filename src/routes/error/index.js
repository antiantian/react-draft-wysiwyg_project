import React from 'react'
import { Icon,Button  } from 'antd'
import { Link } from 'react-router-dom'
import styles from './index.less'
import ImgError from './error.svg'
const Error = () => (<div className="content-inner">
  <div className={styles.error}>
     <div style={{width:'60%'}}>
         <img className={styles.errorimg} src={ImgError} />
     </div>
     <div className={styles.rightError}>
		<h1>404</h1>
		<p className={styles.mess} >抱歉，你访问的页面不存在</p>
		<Button type="primary"><Link to='/'>返回首页</Link></Button>
     </div>
  </div>
</div>)

export default Error
