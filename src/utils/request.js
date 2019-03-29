/* global window */
import axios from 'axios'
import qs from 'qs'
import jsonp from 'jsonp'
import lodash from 'lodash'
import pathToRegexp from 'path-to-regexp'
import { message } from 'antd'
import { YQL, CORS } from './config'
 
// http response 拦截器
axios.defaults.transformResponse=[
    function(data) {
      let _data = new Object()
      if(typeof data=='string'){
        _data =JSON.parse(data)
      }else{
        _data = data
      }
       if(_data.code!==0&&_data.code!==3&&_data.code!==200&&_data.code!==1011&&_data.code!==750&&_data.code!==707){
          message.error(_data.info)
      }
      return _data;
    }
  ];
 // http request 拦截器
axios.interceptors.request.use(
  config => {
    config.headers['X-Version']="h5/v0.1"
   // config.headers['X-App-Id']="ZZs7mA7PePp9kCIC5OJ1XHtlICS3mULR"
    if(localStorage.loginToken){
        config.headers.Authorization = localStorage.loginToken;
      // config.headers['X-Token'] = localStorage.loginToken;
    }  
 
    return config;
  },
  err => {
    return Promise.reject(err);
  }); 
axios.interceptors.response.use(
  response => {
      if(response.data.code==401){
        message.error('登录异常，请重新登录')   
        localStorage.clear();
        window.location.reload()
        history.push('/bronk/login')
      }
      if(response.data.code==707){
        message.error(response.data.info+'账户或密码错误，10分钟后再试！')   
      }
      return response;
  },
  error => {
      if (error.response) {
   
          switch (error.response.status) {
              case 401:
                  // 401 清除token信息并跳转到登录页面
                  // store.commit(types.LOGOUT);
                  // router.replace({
                  //     path: 'login',  
                  //     query: {redirect: router.currentRoute.fullPath}
                  // })
                  message.error("您已经在其他地方登录，请重新登录")
                  localStorage.clear();
                  window.location.reload()
                  history.push('/bronk/login')
          }
      }else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      console.log('Errorrequest')
      // http.ClientRequest in node.js
      console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error')
        console.log('Error', error.message);
      }
      // console.log(JSON.stringify(error));//console : Error: Request failed with status code 402
     // return Promise.reject(error.response.data)
     return Promise.reject(error)
  });
// axios.interceptors.response.use(
//   response => {
//       return response.data?response.data:response;
//   },
//   error => {
//       if (error.response) {
//           switch (error.response.status) {
//               case 401:
//                   // 401 清除token信息并跳转到登录页面
//                   store.commit(types.LOGOUT);
//                   router.replace({
//                       path: 'login',
//                       query: {redirect: router.currentRoute.fullPath}
//                   })
//           }
//       }
//       // console.log(JSON.stringify(error));//console : Error: Request failed with status code 402
//       return Promise.reject(error.response.data)
//   });
const fetch = (options) => {
  let {
    method = 'get',
    data,
    fetchType,
    url,
    head
  } = options
  const cloneData = lodash.cloneDeep(data)

  try {
    let domin = ''
    if (url.match(/[a-zA-z]+:\/\/[^/]*/)) {
      domin = url.match(/[a-zA-z]+:\/\/[^/]*/)[0]
      url = url.slice(domin.length)
    }
    const match = pathToRegexp.parse(url)
    url = pathToRegexp.compile(url)(data)
    for (let item of match) {
      if (item instanceof Object && item.name in cloneData) {
        delete cloneData[item.name]
      }
    }
    url = domin + url
  } catch (e) {
    alert(111111)
    message.error(e.message)
  }

  // if (fetchType === 'JSONP') {
  //   return new Promise((resolve, reject) => {
  //     jsonp(url, {
  //       param: `${qs.stringify(data)}&callback`,
  //       name: `jsonp_${new Date().getTime()}`,
  //       timeout: 4000,
  //     }, (error, result) => {
  //       if (error) {
  //         reject(error)
  //       }
  //       resolve({ statusText: 'OK', status: 200, data: result })
  //     })
  //   })
  // } else if (fetchType === 'YQL') {
  //   url = `http://query.yahooapis.com/v1/public/yql?q=select * from json where url='${options.url}?${encodeURIComponent(qs.stringify(options.data))}'&format=json`
  //   data = null
  // }
  if(/\/cas\/signIn2/.test(url)){
     axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
     axios.defaults.transformRequest=[
          function(data) {
            //为了避免qs格式化时对内层对象的格式化先把内层的对象转为
            //data.strSQL = base64encode(data.strSQL);
            //由于使用的form-data传数据所以要格式化
            data = qs.stringify(data);
            return data;
          }
        ]
  }else{
     axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
      axios.defaults.transformRequest=[
          function(data) {
            //为了避免qs格式化时对内层对象的格式化先把内层的对象转为
              data = JSON.stringify(data);
            //由于使用的form-data传数据所以要格式化
            return data;
          }
        ]
  }
  // if(/\/user\/getList/.test(url)||/\/user\/modifyState/.test(url) ||/\/user\/register/.test(url)||/\/bg\/app/.test(url)){ 
  //   console.log(url)
  //   console.log(/\/user\/getList/.test(url))
  //   if( localStorage.loginToken){
  //      axios.defaults.headers.Authorization= localStorage.loginToken;
  //   }
   
  // }else{
  //     delete axios.defaults.headers['Authorization'] 
  // }
 
  if(head){
    axios.defaults.headers['X-App-Id']=head['X-App-Id'];
  }else{
    if(localStorage.appId){
        axios.defaults.headers['X-App-Id']=localStorage.appId;//||"ZZs7mA7PePp9kCIC5OJ1XHtlICS3mULR"
    }else{
       delete axios.defaults.headers['X-App-Id']
    }
    
  }
  switch (method.toLowerCase()) {

    case 'get':
      return axios.get(url, {
        params: cloneData,
      })
    case 'delete':
      return axios.delete(url, {
        data: cloneData,
      })
    case 'post':
      return axios.post(url, cloneData)
    case 'put':
      return axios.put(url, cloneData)
    case 'patch':
      return axios.patch(url, cloneData)
    default:
      return axios(options)
  }
}

export default function request (options) {
  if (options.url && options.url.indexOf('//') > -1) {
    const origin = `${options.url.split('//')[0]}//${options.url.split('//')[1].split('/')[0]}`
    if (window.location.origin !== origin) {
      if (CORS && CORS.indexOf(origin) > -1) {
        options.fetchType = 'CORS'
      } else if (YQL && YQL.indexOf(origin) > -1) {
        options.fetchType = 'YQL'
      } else {
        options.fetchType = 'JSONP'
      }
    }
  }

  return fetch(options).then((response) => {
    const { statusText, status } = response
    let data = options.fetchType === 'YQL' ? response.data.query.results.json : response.data
    if (data instanceof Array) {
      data = {
        list: data,
      }
    }
    return Promise.resolve({
      success: true,
      message: statusText,
      statusCode: status,
      code:0,
      ...data,
    })
  }).catch((error) => {
    const { response } = error
    let msg
    let statusCode
    if (response && response instanceof Object) {
      const { data, statusText } = response
      statusCode = response.status
      msg = data.message || statusText
    } else {
      statusCode = 600
      msg = error.message || '网络错误，请重试'
    }
    return Promise.reject({ success: false, statusCode, message: msg })
  })
}
