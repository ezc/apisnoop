import { combineReducers } from 'redux'

import EndpointsReducer from './endpoints'
import TestsReducer from './tests'
import ChartsReducer from './charts'
import RoutingReducer from './routing'

const reducers = {
  charts: ChartsReducer,
  endpoints: EndpointsReducer,
  tests: TestsReducer,
  routing: RoutingReducer
}

const rootReducer = combineReducers(reducers)

export default rootReducer
