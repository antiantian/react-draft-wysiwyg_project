import { message } from 'antd'
import dva from 'dva'
import createLoading from 'dva-loading'
import createHistory from 'history/createBrowserHistory'
import 'babel-polyfill'

// 1. Initialize
const APP = dva({
  ...createLoading({
    effects: true,
  }),
  history: createHistory(),
  onError (error) {
  	 //alert(1)
  	  console.log(error)
  	  if(error.statusCode!=500){
           message.error(error.message)
  	  }
     
  },
})

// 2. Model createBrowserHistory createHashHistory 
APP.model(require('./models/app'))

// 3. Router
APP.router(require('./router'))

// 4. Start
APP.start('#root')
