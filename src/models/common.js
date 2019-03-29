import modelExtend from 'dva-model-extend'
import { message } from 'antd';
import { arrayToTree, queryArray, createTrees,createTreesMutiple,parentUrl, sitelist,detailExp} from 'utils'
 
import { routerRedux } from 'dva/router'
import lodash from 'lodash'
import pathToRegexp from 'path-to-regexp' 
const personMock_data=[]
//console.log(personMock_data)
const model = {
  reducers: {
    updateState (state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },
  },
}
const  initBuutton =[
      {
        text:'导出',
        name:'hideExportButton'
      },
      {
        text:'导入',
        name:'hideImportButton'
      },
      {
        text:'修改',
        name:'hideEditButton'
      },
      {
        text:'增加',
        name:'hideAddButton'
      },
      {
        text:'删除',
        name:'hideDeleteButton'
      },
      {
        text:'隐藏',
        name:'hideHideButton'
      },
      {
        text:'封禁',
        name:'hideProhibitionButton'    
      },
      {
        text:'发布',
        name:'hideReleaseButton'
      },
      {
        text:'同步发布',
        name:'hideUpReleaseButton'
      },
      {
        text:'置顶',
        name:'hideTopButton'
      },
      {
        text:'审核',
        name:'hideTrialButton'
      },
      {
        text:'配置',
        name:'hideConfigButton'
      },
      {
        text:'重置',
        name:'hideResetButton'
      },
      {
        text:'增加人员',
        name:'hideAddPersonButton'
      },
      {
        text:'批量移动',
        name:'hideBatchMoveButton'    
      },
      {
        text:'授权',
        name:'hideGrantButton'
      },
      {
        text:'编辑成员',
        name:'hideGrantAddButton'
      },
      {
        text:'绑定人员',
        name:'hideBangButton'
      },
      {
        text:'重置密码',
        name:'hideChangePwdButton' 
      },
      {
        text:'开启控制台',
        name:'hideControlButton'
      },
      {
        text:'角色管理',
        name:'hideRolemanagementButton'
      }
    ]
const pageModel = modelExtend(model, {
  
  state: {
    list: [],
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => `Total ${total} Items`,
      current: 1,
      total: 0,
    },
    Personpagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => `Total ${total} Items`,
      current: 1,
      total: 0,
    },
    Ahtoritypagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => `Total ${total} Items`,
      current: 1,
      total: 0,
    },
    RoleLISTpagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => `Total ${total} Items`,
      current: 1,
      total: 0,
    },
    controlButtonArr:initBuutton
  },
  subscriptions: {

    setupHistory ({ dispatch, history }) {
      history.listen((location) => {

        // let contorlButton=[];
        // if(location.state){
        //     contorlButton = location.state.controlState?location.state.controlState.buttonState:[]
        // }
        // if(contorlButton&&contorlButton.length>0){
        //      dispatch({ 
        //         type: 'setcontorlButton',
        //         payload: {
        //           contorlButton
        //         } 
        //      }) 
        // }
        //控制按钮
         dispatch({
              type: 'setConcom',
              payload:{location}
           })
      })
    }
  },
  effects: {
    * setConcom ({ payload = {} }, { call, put, select }) {
        const {location} = payload
       let contorlButton=[];
 
        if(location.state){
            contorlButton = location.state.controlState?(location.state.controlState.buttonState||[]):[]
        }
        //从app  menu 里获取控制按钮  
        const { menu } = yield select(_ => _.app)
        let  menulist =lodash.cloneDeep(menu) || [];
        let pathname = location.pathname||'我是空';
        const current = menulist.filter(  //父路由或者 details路由 pathToRegexp( item.details ||'').exec(pathname)
          item => pathToRegexp( item.route ||'').exec(pathname) || detailExp(item,pathname)
        )

        if(current.length>0){
           if(current[0].authority&&current[0].authority.list){
              contorlButton=current[0].authority.list
                 yield put({
                        type: 'updateState',
                        payload:{
                            contorlLimit:current[0].authority.list
                        } 
                 })
           }
          
        }else{
          yield put({
                type: 'updateState',payload:{
                    contorlLimit:contorlButton
                } 
         })
        }
        if(contorlButton){
             yield put({ 
                type: 'setcontorlButton',
                payload: {
                  contorlButton
                } 
             }) 
        }
    },
    * setcontorlButton ({ payload = {} }, { call, put, select }) {
         //设置隐藏按钮
        let {contorlButton} = payload
        if(contorlButton){
            
             let newData = initBuutton.filter((element) => {
                    let had=contorlButton.includes(element.text);
                    return !had
                  })
             let newDataHad = initBuutton.filter((element) => {
                    let had=contorlButton.includes(element.text);
                    return had
                  })
             let buttonControlS ={};
             let buttonControlSHad={};
             newData.forEach((item)=>{
                     buttonControlS[item.name]=true
             })
             newDataHad.forEach((item)=>{
                     buttonControlSHad[item.name]=false
             })
             yield put({
                type: 'updateState',payload:{...buttonControlS,...buttonControlSHad} 
             })      
        }
    },
    *  success ({ payload = {} }, { call, put, select }) {
      message.success(payload||'This is a message of success');
    },
    * error ({ payload = {} }, { call, put, select }) {
      message.error(payload||'This is a message of error');
    },
    * warning  ({ payload = {} }, { call, put, select }) {
      message.warning (payload||'This is a message of error');
    },
    *com_getdepartment_menu ({ payload = {} }, { call, put, select }){
         const data = yield call(company_department_api.query,payload)
         if(data.code===0){
            let sitelist=data.data.list; 
            let departmentTree = null
                // 生成树状
            if(sitelist){  
              departmentTree = arrayToTree(sitelist.filter(_ => _.mpid !== '-1'), 'id', 'organizationSuper')
            }    
            

           yield put({
              type: 'updateSearch',payload:{department_menu:sitelist,departmentTree:departmentTree} 
           })
         }
     }, 
    *com_queryPerson ({ payload = {} }, { call, put, select }) {
         yield put({
              type: 'updateSearch',payload:{person_menu:personMock_data}
           })
         const data = yield call(company_personnel_api.query,payload)
         if(data.code===0){
            let sitelist=data.data.list; 
           yield put({
              type: 'updateSearch',payload:{person_menu:sitelist}
           })
         }else{
           yield put({
              type: 'updateSearch',payload:{person_menu:personMock_data}
           })
             
         }
          
    },
    *showPersondetail({ payload = {} }, { call, put, select }) {
       yield put(routerRedux.push({
          pathname: '/company/personnel/detail',
          state:payload, 
        }))
    },  
  },
  reducers: {
    querySuccessRoleLIST (state, { payload }) {   
      const { RoleLIST_list, RoleLISTpagination ,searchlistRoleLIST} = payload
      return {
        ...state,
        ...searchlistRoleLIST,
        searchlistRoleLIST: searchlistRoleLIST,
        RoleLIST_list,
        RoleLISTpagination: {
          ...state.RoleLISTpagination,
          ...RoleLISTpagination,
        },
      }
    },
    querySuccess (state, { payload }) {
      const { list, pagination ,searchlist} = payload
      return {
        ...state,
        ...searchlist,
        searchlist: searchlist,
        list,
        pagination: {
          ...state.pagination,
          ...pagination,
        },
      }
    },
    querySuccessPerson (state, { payload }) {
      const { List_Person, Personpagination ,searchlistPerson} = payload
      return {
        ...state,
        ...searchlistPerson,
        searchlistPerson: searchlistPerson,
        List_Person,
        Personpagination: {
          ...state.Personpagination,
          ...Personpagination, 
        },
      }
    },    
    querySuccessAhtory (state, { payload }) {
      const { List_Ahtority, Ahtoritypagination ,searchlistAhtority} = payload
      return {
        ...state,
        ...searchlistAhtority,
        searchlist: searchlistAhtority,
        List_Ahtority,
        Ahtoritypagination: {
          ...state.Ahtoritypagination,
          ...Ahtoritypagination,
        },
      }
    },
    updateSearch (state, { payload }) {
      return { ...state, ...payload}
    },
    modalPersonComShow (state, { payload }) {
      return { ...state, ...payload,modalPersonComVisible:true}
    },
    modalPersonComHide (state, { payload }) {
      return { ...state, ...payload,modalPersonComVisible:false}
    },
  }

})


module.exports = {
  model,
  pageModel,
}
