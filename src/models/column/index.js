import dva from 'dva';
import modelExtend from 'dva-model-extend'
import { pageModel } from '../common'
import { routerRedux } from 'dva/router'
import { config} from 'utils'
import {GetColumnHide,GetColumnList,GetColumnDel,GetColumnUpdata,UploadFileAuth,GetColumnAdd} from 'services/column_api' 
import {message} from 'antd'
export default modelExtend(pageModel, {
 namespace: 'column',
 state: {
   list: [],
  currentItem: {},
  modalType: 'create',
  source_menu:[],
  menu:[],
 },
 subscriptions: {  //监听页面刚进入的状态
  setup ({ dispatch, history }) {
    history.listen((location) => { 
       if (location.pathname === '/bronk/column') {
         const payload =location.state?location.state.searchlist? location.state.searchlist:{ pageNo: 1, pageSize: 10}:{ pageNo: 1, pageSize: 10};
         dispatch({
            type: 'query',
            payload
         })
         dispatch({
            type: 'querymenu',
            payload
         })
        
       }
    })
  }
 }, 
 effects: {
  * aliupload ({ payload = {} }, { call, put, select }) {
      const {clientOss,aliExpiration} = yield select(_ => _.column)
      const timeNOW =  (new Date()).getTime();  //当前时间
    if(!clientOss || aliExpiration&&timeNOW>aliExpiration  || !aliExpiration){
          const data = yield call(UploadFileAuth, payload)
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
  * queryALL({ payload = {} }, { call, put, select }) {
      const data = yield call(GetColumnList, payload)
      if(data.code==0){
               yield put({
                  type: 'updateState',
                  payload: {
                    source_menu:data.data.authList
                  },
              })
      }
  },
  *create ({ payload = {} }, { call, put, select }) {

    // const creator = yield select(({ app }) => app.user.username)
    //   const newUser = { ...payload.datas,creator }
      const data = yield call(GetColumnAdd,payload)
     
      if (data.code==200) {
        yield put({ 
          type: 'hideDetails',
          payload:{
            state:payload
          } 
        }) 
      } else {
        throw data
      }
  },
  *update ({ payload = {} }, { call, put, select }) {

      const data = yield call(GetColumnUpdata,payload)
     
      if (data.code==200) {
        yield put({ 
          type: 'hideDetails',
          payload:{
            state:payload
          } 
        }) 
      } else {
        throw data
      }
  },
  * querymenu({ payload = {} }, { call, put, select }) {
      const data = yield call(GetColumnList, {})
      
      if(data.code==200){
        console.log(data.data)
               let sitelist=data.data; 
               yield put({
                  type: 'updateState',
                  payload: {
                    menu:sitelist
                  },
              })
      }
  },
  * query ({ payload = {} }, { call, put, select }) {
      const data = yield call(GetColumnList, payload)
      console.log('栏目列表',data)
      if(data.code==200){
               let sitelist=data.data.results; 
               yield put({
                  type: 'querySuccess',
                  payload: {
                    searchlist:payload,
                    list:sitelist,
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
   * serchlist ({ payload }, { select, call, put }) {
      const stateOrigin = payload.state 
      const searchlist = payload.searchlist 
      yield put({ type: 'updateSearch' , payload :{ searchlist}}) 
      yield put({ type: 'query' , payload :{...searchlist}})
    },
      * delete ({ payload }, { call, put, select }) {//删除栏目
        const data = yield call(GetColumnDel,payload)
         const {contorlLimit,searchlist}  =   yield select(_ => _.column)
        if (data.code==200) {
          yield put(routerRedux.push({
            pathname: '/bronk/column',
          state:{
            searchlist,
            controlState:{
               buttonState:contorlLimit
            }
          }
          }))
        } else {
         // throw data
         message.error(data.info);
        }
      },
      * hide ({ payload }, { call, put, select }) {//隐藏栏目
        const {contorlLimit,searchlist}  =   yield select(_ => _.column)
        const data = yield call(GetColumnHide,payload)
        if (data.code==200) {
          yield put(routerRedux.push({
            pathname: '/bronk/column',
          state:{
            searchlist,
            controlState:{
               buttonState:contorlLimit
            }
          }
          }))
        } else {
        // throw data
        message.error(data.info);
        }
      },
      * showdetail ({ payload }, { select, call, put }) {
         yield put({ type: 'showModal',payload:payload})
      },
      * showAdd ({ payload }, { select, call, put }) {
          yield put({ type: 'showAddModal',payload:payload})
      },
      * hideDetails ({ payload }, { select, call, put }) {
        const {contorlLimit,searchlist}  =   yield select(_ => _.column)
         yield put({ type: 'hideModal' })
          yield put(routerRedux.push({
            pathname: '/bronk/column',
          state:{
            searchlist,
            controlState:{
               buttonState:contorlLimit
            }
          }
          }))
      },
 },
 reducers: {
  showModal (state, { payload }) {
    return { ...state, ...payload,modalVisible: true}
  },
  hideModal (state) {
    return { ...state, modalVisible: false }
  },
 },
});