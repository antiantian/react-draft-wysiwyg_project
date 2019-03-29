import modelExtend from 'dva-model-extend'
import { config } from 'utils'
import pathToRegexp from 'path-to-regexp'
import { routerRedux } from 'dva/router'
import { query,create,getbyID,remove,update,deleteone} from 'services/bronk_comment_api'
import * as column_api  from 'services/column_api' 
import { pageModel } from '../common'
import {message} from 'antd'

//const { query } = usersService
const { prefix } = config
export default modelExtend(pageModel, {


  namespace: 'bronk_comment',

  state: {
    currentItem: {},
    modalVisible: false,
    modalType: 'create',
    selectedRowKeys: [],
    isMotion: window.localStorage.getItem(`${prefix}userIsMotion`) === 'true',
    chapter:[{name:(new Date()).getTime()}],  //小节数组  
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/bronk/comment') {
          const payload =location.state?location.state.serchlist? location.state.serchlist:{ pageNo: 1, pageSize: 10 }:{ pageNo: 1, pageSize: 10 };
          dispatch({
            type: 'query',
            payload,
          })
          //清空小节数据
          dispatch({
            type: 'updateState',
            payload : {
              chapter:[{name:(new Date()).getTime()}],
              selectedRowKeys: [],
              selectedRow: [],
              releaseIds:undefined,
              releaseds:{}
            },
          })   
        }else if(location.pathname === '/bronk/comment/detail'){
             // 根据选中的 item 更新chapter chans  releaseds对象
           var mess=location.state;
           if(mess&&mess.currentItem&&mess.currentItem.chans){
             console.log(mess.currentItem)
              let chapterItem =[];
              let releaseds={}  ;
              let releaseIds=null ;
              mess.currentItem.chans.map((item,index)=>{
                 let names= (new Date()).getTime()+'_'+index;
                 let obj ={
                    title:item.title,
                    releaseId:item.releaseId
                 }
                  releaseds[names] = obj;//item.releaseId;
                //   releaseds["title"] = item.title;
                  if(index==0){
                      releaseIds = item.releaseId
                  }else{
                      releaseIds+= ',' + item.releaseId
                  }
                  chapterItem.push({
                    name:names,
                    select:item
                  }) 
              })
              /*
               chans:[]   

               title:'标题',
               releaseId:'aasd22,34242323,',
               content:{
                  id:releasedID,
                  title:title
               }
               根据  chans字段 生成chapter（文章小节数组）
               遍历chapter 生成文章小节数组   
               每个chapter子项目 
                ---name(唯一标识 用于修改和改变 文章内容和集合 )
                ---select(
                       title:'标题',
                       releaseId:'aasd22,34242323,',
                       content:{
                          id:releasedID,
                          title:title
                        }
                 )
                文章内容改变时  根据唯一name   修改 releaseds 的 rowIds集合
                chapterItem 
              */
              console.log(chapterItem)
              console.log(releaseds)
              dispatch({
                type: 'updateState',
                payload : {
                  chapter:chapterItem,
                  releaseds,
                  releaseIds
                },
              })      
           }
        }
      })
    },
  },
  effects: {
    * aliupload ({ payload = {} }, { call, put, select }) {
      const {clientOss,aliExpiration} = yield select(_ => _.bronk_comment)
      const timeNOW =  (new Date()).getTime();  //当前时间
    if(!clientOss || aliExpiration&&timeNOW>aliExpiration  || !aliExpiration){
          const data = yield call(column_api.UploadFileAuth, payload)
        if(data.code===200){
              const creds2= data.data;
              const client =  new OSS.Wrapper({
                  region: creds2.region,
                  secure: true,//https
                  endpoint: creds2.endpoint,
                  accessKeyId: creds2.AccessKeyId,
                  /*accessKeyId,accessKeySecret两者到阿里云控制台获得*/
                  accessKeySecret:creds2.AccessKeySecret,
                  stsToken: creds2.SecurityToken,
                  bucket: creds2.bucket /*装图片的桶名*/
              });

              yield put({
                  type: 'updateState',payload:{clientOss:client,keyOss:creds2.targetDir,aliExpiration:creds2.Expiration}
              })
        }
    }

      
    },
     * query ({ payload = {} }, { call, put }) {
      const data = yield call(query, payload)
      if (data.code===200) {
        yield put({
          type: 'querySuccess',
          payload: {
            list: data.data.results, 
            serchlist:payload,
            pagination: {
              current: Number(payload.pageNo) || 1,
              pageSize: Number(payload.pageSize) || 10,
              total: data.data.totalRecord,
              showTotal: (total, range) => `共 ${total}条,当前是${range}条`,
            },
          },
        })
      }
    },
   * delete ({ payload }, { call, put, select }) {
      const data = yield call(remove,{id:payload})
       const {contorlLimit,serchlist}  =   yield select(_ => _.bronk_comment)
       if (data.code===200) {
 
        yield put(routerRedux.push({
          pathname: '/bronk/comment',
          state:{
            serchlist,
            controlState:{
               buttonState:contorlLimit
            }
          }
        }))
      } else {
        //throw data
        message.error(data.info)
      }
    },

    * create ({ payload }, { select, call, put }) {

      console.log(payload )
      //const creator = yield select(({ app }) => app.user.username)
      const newUser = { ...payload}
      const data = yield call(create, newUser)
      if (data.code===200) {
        yield put({ type: 'hideModal' })
        yield put(routerRedux.push({
          pathname: '/bronk/comment'
        }))
      } else {
        //throw data
        message.error(data.info)
      }
    },

    * update ({ payload }, { select, call, put }) {
      const id = yield select(({ bronk_comment }) => bronk_comment.currentItem.id)
 
      const newUser = { ...payload, id}
      const data = yield call(update, newUser)
      if (data.code===200) {
        yield put({ type: 'hideModal' })
        yield put(routerRedux.push({
          pathname: '/bronk/comment'
        }))
      } else {
        //throw data
        message.error(data.info)
      }
    },
    * serchlist ({ payload }, { select, call, put }) {
      const stateOrigin = payload.state 
      const serchlist = payload.serchlist 
        yield put({ type: 'updateSearch' , payload :{ serchlist}})
         yield put({ type: 'query' , payload :{ ...serchlist}})  
        // yield put(routerRedux.push({
        //   pathname: '/bronk/cms/resourceType',
        //   state:{...stateOrigin,serchlist},
        // }))
    }
  },

  reducers: {

    showModal (state, { payload }) {

      return { ...state, ...payload, modalVisible: true }
    },

    hideModal (state) {
      return { ...state, modalVisible: false }
    },

    switchIsMotion (state) {
      window.localStorage.setItem(`${prefix}userIsMotion`, !state.isMotion)
      return { ...state, isMotion: !state.isMotion }
    },

  },
})
