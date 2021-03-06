const { keyBy } = require('lodash')
const initialState = {
  byId: {},
  isLoading: false,
  hasLoaded: false,
  errors: {}
}

export default (state = initialState, action = {}) => {
  switch(action.type) {
  case 'FETCH_ENDPOINTS_PENDING': {
    return {
      ...state,
      isLoading: true
    }
  }
  case 'FETCH_ENDPOINTS_FULFILLED': {
    return {
      ...state,
      byId: {
        ...state.byId,
        ...keyBy(action.payload.data, '_id')
      },
      isLoading: false,
      hasLoaded: true
    }
  }
  default:
    return state;
  }
}
