import modelExtend from 'dva-model-extend'
import { config } from 'utils'
import pathToRegexp from 'path-to-regexp'
import { query,create,remove,update,deleteone,updateSync,hide} from 'services/cms_resourceVideo_api'
import * as resourceType_api from 'services/cms_resourceType_api' 
 
import * as cms_resourcePublication from 'services/cms_resourcePublication_api'
import { pageModel } from '../common'
import { routerRedux } from 'dva/router'
import queryString from 'query-string'
import * as cms_api from 'services/cms_api' 
import * as column_api from 'services/column_api'
//const { query } = usersService
const { prefix } = config
export default modelExtend(pageModel, {


  namespace: 'cms_resourceVideo',

  state: {
    currentItem: {},
    publishItem: {},
    modalVisible: false,
    modal2Visible:false,
    modalupdateSync:false,
    modalupdate:false,
    modalType: 'create',
    selectedRowKeys: [],
    typelist:[],//资源类型
    editorContent: null,
    searchlist:null,
    publishId:null,
    isMotion: window.localStorage.getItem(`${prefix}userIsMotion`) === 'true',
    videoAuth:{},//视频上传凭证
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/bronk/video') {
          const payload =location.state?location.state.serchlist? location.state.serchlist:{ pageNo: 1, pageSize: 10 }:{ pageNo: 1, pageSize: 10 };
          dispatch({
            type: 'gettypelist'
           })
          // dispatch({
          //   type: 'getsitelist'
          //  })  
          dispatch({
            type: 'query',
            payload,
          })
        }else if(location.pathname === '/bronk/video/detail'){
           var mess=location.state;
           if(!mess){
              dispatch({
                type: 'resourceGather'
               }) 
             
           }
           dispatch({
            type: 'gettypelist'
           }) 
           dispatch({
            type: 'updateState',
            payload : {currentItem:mess.currentItem,modalType:mess.modalType},
          })  
           //
          dispatch({
            type: 'aliupload'
           }) 
           dispatch({
            type: 'aliuploadVideo'
           }) 
            
        }
      })
    },
  },
  effects: {
      
      * aliuploadVideo ({ payload = {} }, { call, put, select }) {
            const data = yield call(cms_api.aliuploadVideo, payload)
           if(data.code===200){
                const auth = {
                    uploadAddress:data.data.uploadAddress,
                    uploadAuth:data.data.uploadAuth,
                    videoId:data.data.videoId
                };
                yield put({
                    type: 'updateState',payload:{
                        videoAuth:auth
                     }
                })
           } 
     },
       * aliupload ({ payload = {} }, { call, put, select }) {
       
        const {clientOss,aliExpiration} = yield select(_ => _.cms_resourceVideo)
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
     * resourceGather ({ payload = {} }, { call, put, select }) {
      yield put( routerRedux.push({
                pathname: '/bronk/resourceGather'
              }))
     },
     * getsitelist ({ payload = {} }, { call, put, select }) {
       const data = yield call(cms_api.queryList, payload)
       if(data.code===200){
          let sitelist=data.data  
          yield put({ type: 'updateState', payload: {sitelist} })
       }
       
        
     },
     * gettypelist ({ payload = {} }, { call, put, select }) {
 
       const data = yield call(column_api.GetColumnList, {})
       if(data.code===200){
          let typelist=data.data
          yield put({ type: 'updateState', payload: {typelist} })
       }
       
        
     },
     * query ({ payload = {} }, { call, put }) {
      const data = yield call(query, payload)
      if (data.code===200) {
        yield put({
          type: 'querySuccess',
          payload: {
            searchlist:payload,
            list:data.data.results,
            pagination: {
              current: Number(payload.pageNo) || 1,
              pageSize: Number(payload.pageSize) || 10,
              total:data.data.totalRecord,
              showTotal: (total, range) => `共 ${total}条,当前是${range}条`,
            },
          },
        })
      }
    },
   * delete ({ payload }, { call, put, select }) {
      const data = yield call(deleteone,{id:payload})
      const { selectedRowKeys } = yield select(_ => _.cms_resourceVideo)
      if (data.code===200) {
        yield put({ type: 'updateState', payload: { selectedRowKeys: selectedRowKeys.filter(_ => _ !== payload) } })
        yield put(routerRedux.push({
          pathname: '/bronk/video'
        }))
      } else {
        throw data
      }
    },

    * hide ({ payload }, { call, put }) {
       const {contorlLimit,serchlist}  =   yield select(_ => _.cms_resourceVideo)
       alert(222)
      const data = yield call(hide, payload)
      if (data.code===200) {
        yield put({ type: 'updateState', payload: { selectedRowKeys: [] } })
        yield put(routerRedux.push({
          pathname: '/bronk/video',
          state:{
            serchlist,
            controlState:{
               buttonState:contorlLimit
            }
          }
        }))
      } else {
        throw data
      }
    },

    * create ({ payload }, { select, call, put }) {
      const creator = yield select(({ app }) => app.user.username)
      const newUser = { ...payload.datas,creator }
      const data = yield call(create, newUser)
      if (data.code===200) {
        yield put({ type: 'hideDetails',payload:{state:payload.state} }) 
      } else {
        throw data
      }
    },

    * update ({ payload }, { select, call, put }) {
      const id = yield select(({ cms_resourceVideo }) => cms_resourceVideo.currentItem.id)
      const changer = yield select(({ app }) => app.user.username)
      const newUser = { ...payload.datas, id,changer }
      const data = yield call(update, newUser)
      if (data.code===200) {
        yield put({ type: 'hideDetails',payload:{state:payload.state} })
        yield put({ type: 'hideModalupdate' })

      } else {
        throw data
      }
    },
    * dialogpublishSource({ payload }, { select, call, put }){
        yield put({ type: 'showModalupdate' })
    },
    * upsync({ payload }, { select, call, put }){
        yield put({ type: 'showModalupdateSync' })
    },
    * updateSync({ payload }, { select, call, put }) { //修改并同步已发布的更新
      const id = yield select(({ cms_resourceVideo }) => cms_resourceVideo.currentItem.id)
      const newUser = { ...payload.datas, id }
      const data = yield call(updateSync, newUser)
      if (data.code===200) {
        yield put({ type: 'success',payload:'修改成功！' })
        yield put({ type: 'hideDetails',payload:{state:payload.state} })
        yield put({ type: 'hideModalupdateSync' })
 
      } else {
        throw data
      }
    },
    * publishSource ({ payload }, { select, call, put }) {
       
       //发布资源
       const data = yield call(cms_resourcePublication.create, payload)
       if (data.code==1011) {
          yield put({ type: 'error',payload:data.info })
       }else if (data.code===200){
          yield put({ type: 'success',payload:'发布成功！' })
          yield put({ type: 'hidePushlish' })
       }
    },
    * showdetail ({ payload }, { select, call, put }) {
       yield put({ type: 'showModal',payload:payload})
       yield put(routerRedux.push({
          pathname: '/bronk/video/detail',
          state:payload,
        }))
    },
    * hideDetails ({ payload }, { select, call, put }) {
       yield put({ type: 'hideModal' })
       const {state}=payload
        yield put(routerRedux.push({
          pathname: '/bronk/video',
          state:state.searchlist
        }))
         // yield put({ type: 'query' })
    },
    * serchlist ({ payload }, { select, call, put }) {
      const stateOrigin = payload.state 
      const serchlist = payload.serchlist 
        yield put({ type: 'updateSearch' , payload :{ serchlist}}) 
        yield put(routerRedux.push({
          pathname: '/bronk/video',
          state:{...stateOrigin,serchlist},
        }))
    },
    * modalup_hide ({ payload }, { select, call, put }) {
         yield put({ type: 'hideModalupdateSync' })
         yield put({ type: 'hideModalupdate' })
    },
  },

  reducers: {
    editorContent (state, { payload }) {
       return { ...state, ...payload}
    },
    showModal (state, { payload }) {
      return { ...state, ...payload}
    },
    hideModal (state) {
      return { ...state, modalVisible: false }
    },
    showPushlish (state, { payload }) {
      return { ...state, ...payload, modalVisible: true}
    },
    hidePushlish (state) {
      return { ...state, modalVisible: false }
    },
    showModalupdateSync (state, { payload }) {
      return { ...state, ...payload, modalupdateSync: true }
    },
    hideModalupdateSync(state) {
      return { ...state, modalupdateSync: false }
    },
    showModalupdate (state, { payload }) {
      return { ...state, ...payload, modalupdate: true }
    },
    hideModalupdate (state, { payload }) {
      return { ...state, ...payload, modalupdate: false }
    },
    showModal2 (state, { payload }) {
      return { ...state, ...payload, modal2Visible: true }
    },
    hideModal2 (state) {
      return { ...state, modal2Visible: false }
    },
    switchIsMotion (state) {
      window.localStorage.setItem(`${prefix}userIsMotion`, !state.isMotion)
      return { ...state, isMotion: !state.isMotion }
    },

  },
})
