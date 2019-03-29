import modelExtend from 'dva-model-extend'
import { config } from 'utils'
import pathToRegexp from 'path-to-regexp'
import { query,create,remove,update,top} from 'services/cms_special_api'
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


  namespace: 'cms_special',
 
  state: {
    currentItem: {},
    publishItem: {},
    modalVisible: false,
    modal2Visible:false,
    modalupdateSync:false,
    modalupdate:false,
    modalType: 'create',
    typelist:[],//资源类型
    editorContent: null,
    searchlist:null,
    publishId:null,
    isMotion: window.localStorage.getItem(`${prefix}userIsMotion`) === 'true',
    videoAuth:{},//视频上传凭证
    
    serachColumnId:undefined,
    resourcelist:[],
    resource_pageNo:1,
    resource_pageSize:10,
    resourcepagination:{
      showSizeChanger: false,
      showQuickJumper: false,
      showTotal: total => `Total ${total} Items`,
      current: 1,
      total: 0,
    },
    chapter:[{name:(new Date()).getTime()}],  //小节数组  
    selectedRowKeys: [], //选中的key
    selectedRow: [], //选中的项
    releaseIds:undefined, // 文章id集合 数组
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/bronk/special') {
          const payload =location.state?location.state.serchlist? location.state.serchlist:{ pageNo: 1, pageSize: 10 }:{ pageNo: 1, pageSize: 10 };
          dispatch({
            type: 'gettypelist'
           })
          // dispatch({
          //   type: 'getsitelist'
          //  }) 
          if(!payload.pageNo){
            payload.pageNo=1
          } 
          if(!payload.pageSize){
            payload.pageSize=10
          } 
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
        }else if(location.pathname === '/bronk/special/detail'){
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
           // 根据选中的 item 更新chapter chans  releaseds对象
           console.log(mess)
           if(mess.currentItem&&mess.currentItem.chans){
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
      * resourcelist ({ payload = {} }, { call, put, select }) {
          const data = yield call(cms_resourcePublication.query,payload)
          const {resourcepagination} = yield select(_ => _.cms_special)
          
          if (data.code===200) {
               
            console.log(payload)   
            yield put({
              type: 'updateState', 
              payload: {
                resource_serchlist:payload,
                resource_pageSize:payload.pageNo,
                resource_No:payload.pageSize,
                resourcelist:data.data.results,
                resourcepagination: {...resourcepagination,
                  current: Number(payload.pageNo) || 1,
                  pageSize: Number(payload.pageSize) || 10,
                  total:data.data.totalRecord,
                  showTotal: (total, range) => `共 ${total}条,当前是${range}条`,
                },
              },
            })
          }
     },
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
       
        const {clientOss,aliExpiration} = yield select(_ => _.cms_special)
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
                pathname: '/bronk/special'
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
  
       const data = yield call(column_api.GetColumnList, payload)
       if(data.code===200){
          let typelist=data.data
          yield put({ type: 'updateState', payload: {typelist} })
       } 
        
     },
     * query ({ payload = {} }, { call, put }) {
      let chaP = {...payload,isCha:1};// 查询专题用 发布池接口
      const data = yield call(cms_resourcePublication.query, chaP)
      if (data.code===200) {
        yield put({
          type: 'querySuccess',
          payload: {
            serchlist:payload,
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
     const {contorlLimit,serchlist}  =   yield select(_ => _.cms_special)
      const data = yield call(cms_resourcePublication.remove,payload)
      const { selectedRowKeys } = yield select(_ => _.cms_special)
      if (data.code===200) {
        yield put({ type: 'updateState', payload: { selectedRowKeys: selectedRowKeys.filter(_ => _ !== payload) } })
        yield put(routerRedux.push({
          pathname: '/bronk/special',
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

    * multiDelete ({ payload }, { call, put }) {
      const data = yield call(remove, payload)
      if (data.code===200) {
        yield put({ type: 'updateState', payload: { selectedRowKeys: [] } })
        yield put(routerRedux.push({
          pathname: '/bronk/special'
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
      const id = yield select(({ cms_special }) => cms_special.currentItem.id)
      const newUser = { ...payload.datas, id }
      const data = yield call(update, newUser)
      console.log(12222266666666666666)
      if (data.code===200) {
        yield put({ type: 'hideDetails',payload:{state:payload.state} })
        yield put({ type: 'hideModalupdate' })

      }  
    },
 
    * top ({ payload }, { select, call, put }) {
      const {contorlLimit,serchlist}  =   yield select(_ => _.cms_special)
      const data = yield call(top, payload)
      if (data.code===200) {
            yield put(routerRedux.push({
              pathname: '/bronk/special',
              state:{
                serchlist,
                controlState:{
                   buttonState:contorlLimit
                }
              }
            }))
      } 
    },
    * showdetail ({ payload }, { select, call, put }) {
       yield put({ type: 'showModal',payload:payload})
       yield put(routerRedux.push({
          pathname: '/bronk/special/detail',
          state:{...payload},
        }))
    },
    * hideDetails ({ payload }, { select, call, put }) {
      const {contorlLimit,serchlist}  =   yield select(_ => _.cms_special)

       yield put({ type: 'hideModal' })
       const {state}=payload
       console.log(state)
        yield put(routerRedux.push({
          pathname: '/bronk/special',
          state:{
            ...state
          }
        }))
         // yield put({ type: 'query' })
    },
    * serchlist ({ payload }, { select, call, put }) {
      const stateOrigin = payload.state 
      const serchlist = payload.serchlist 
        yield put({ type: 'updateSearch' , payload :{ serchlist}}) 
        yield put(routerRedux.push({
          pathname: '/bronk/special',
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
