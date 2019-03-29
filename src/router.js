import React from 'react'
import PropTypes from 'prop-types'
import { Switch, Route, Redirect, routerRedux } from 'dva/router'
import dynamic from 'dva/dynamic'
import App from 'routes/app'
import './css/style.less'
import routes from './routerpath'
const { ConnectedRouter } = routerRedux

const Routers = function ({ history, app }) {
  const error = dynamic({
    app,
    component: () => import('./routes/error'),
  })
  const requireCredentials = () => {
  }
  return (
    <ConnectedRouter history={history}>
      <App>
        <Switch>
          <Route exact onEnter={requireCredentials} path="/" render={() => (<Redirect to="/bronk/homepage" />)} />
          {
            routes.map(({ path, ...dynamics }, key) => (
              <Route key={key}
                onEnter={requireCredentials}
                exact
                path={path}
                component={dynamic({
                  app,
                  ...dynamics,
                })}

              />
            ))
          }
          <Route component={error} />
        </Switch>
      </App>
    </ConnectedRouter>
  )
}

Routers.propTypes = {
  history: PropTypes.object,
  app: PropTypes.object,
}

//权限控制的中间服务
function requireCredentials(nextState, replace, next) {
  //获取传输过来的数据
  const repathname = nextState.location.pathname;
  if (hadINDEX(repathname)) {
    next()
  } else {
    replace('/404')
    next()
  }
}
export default Routers


