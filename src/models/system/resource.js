import dva from 'dva';
import modelExtend from 'dva-model-extend'
import { pageModel } from '../common'
import { routerRedux } from 'dva/router'
import { config} from 'utils'
import {query,create,remove,update,queryALL} from 'services/system_resource'
export default modelExtend(pageModel, {
 namespace: 'resource',
 state: {
   list: [],
  currentItem: {},
  modalType: 'create',
  source_menu:[]
 },
 subscriptions: {  //监听页面刚进入的状态
  setup ({ dispatch, history }) {
    history.listen((location) => { 
       if (location.pathname === '/bronk/resource') {
         const payload =location.state?location.state.searchlist? location.state.searchlist:{ pageNo: 1, pageSize: 10 }:{ pageNo: 1, pageSize: 10 };
     
         dispatch({
            type: 'query',
            payload
         })
         dispatch({
            type: 'queryALL'
         })
         
       }else if(location.pathname === '/bronk/resource/detail'){   
              var mess=location.state;
              let source_menu=mess?mess.source_menu:null
              dispatch({
              type: 'updateState',
              payload : {
                currentItem:mess.currentItem,
                modalType:mess.modalType,
              },
            })   
              if(!source_menu){
                dispatch({
                  type: 'queryALL'
                })
              }
              
       }
    })
  }
 }, 
 effects: {
  * queryALL({ payload = {} }, { call, put, select }) {
      const data = yield call(queryALL, payload)
      if(data.code==0){

               yield put({
                  type: 'updateState',
                  payload: {
                    source_menu:data.data.authList
                  },
              })
      }
  },
  * query ({ payload = {} }, { call, put, select }) {
      const data = yield call(query, payload)
      if(data.code==0){
               let sitelist=data.data.page.results; 
               yield put({
                  type: 'querySuccess',
                  payload: {
                    searchlist:payload,
                    list:sitelist,
                    pagination: {
                      current: Number(payload.pageNo) || 1,
                      pageSize: Number(payload.pageSize) || 10,
                      total: data.data.page.totalRecord,
                      showTotal: (total, range) => `共 ${total}条,当前是${range}条`,
                    },
                  },
              })
      }
  },

    * update ({ payload }, { select, call, put }) {
      const data = yield call(update, payload)
      if (data.code===0) {
       
            yield put(routerRedux.push({
              pathname: '/bronk/resource'
            }))

      } else {
        throw data
      }
    },
   * serchlist ({ payload }, { select, call, put }) {
        const stateOrigin = payload.state 
        const searchlist = payload.searchlist 

        yield put({ type: 'updateSearch' , payload :{ searchlist}}) 
        yield put({ type: 'query' , payload :{...searchlist}})
      },
    * create ({ payload }, { select, call, put }) {

        const newUser = { ...payload}
        const data = yield call(create, payload)
        if (data.code===0) {
 
          yield put(routerRedux.push({
            pathname: '/bronk/resource'
          }))
        } else {
          throw data
        }
      },
      * delete ({ payload }, { call, put, select }) {
        const data = yield call(remove,payload)
        if (data.code===0) {
          yield put(routerRedux.push({
            pathname: '/bronk/resource'
          }))
        } else {
          throw data
        }
      },
      * showdetail ({ payload }, { select, call, put }) {

        yield put(routerRedux.push({
           pathname: '/bronk/resource/detail',
           state:payload,
         }))
     },
     * hideDetails ({ payload }, { select, call, put }) {
     yield put({ type: 'hideModal' })
     const {state}=payload
      yield put(routerRedux.push({
        pathname: '/bronk/resource',
        state:state.searchlist
      }))
       yield put({ type: 'query' })
  },
 },
 reducers: {
   'delete'(state, { payload: id }) {
     return state.filter(item => item.id !== id);
   },
 },
});