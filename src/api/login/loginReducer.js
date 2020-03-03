import { DELETE_CURRENT_USER, SUCCESS, FAILURE, LOGIN, GET_DRIVERS } from './loginActions'
import { LOGIN_INVALID_CREDENTIALS } from './loginProperties'
import {CHANGE_USER_TO_BUSY} from "../task/taskActions";

const initialState = {
    isAuthenticated: false,
    user: {},
    list: []
};

const loginReducer = (state = initialState, action = {}) => {

  switch (action.type) {

    case LOGIN + FAILURE:
      return {
        ...state,
        isAuthenticated: false,
        user: {errors: LOGIN_INVALID_CREDENTIALS}
      };

    case LOGIN + SUCCESS:

      return {
        ...state,
        isAuthenticated: true,
        user: {...action.response.result}
      };

    case GET_DRIVERS + FAILURE:
      return  {
        ...state,
        list: []
      };

    case GET_DRIVERS + SUCCESS:
      return  {
        ...state,
        list: action.response.result
      };

    case DELETE_CURRENT_USER:

      return {
        ...state,
        isAuthenticated: false,
        user: {}
      };

    case CHANGE_USER_TO_BUSY:
      console.log("CHANGE_USER_TO_BUSY = ", {...state.user, userStatus: 'BUSY'})
      return {
        ...state,
        user: {...state.user, userStatus: 'BUSY'}
      };

    default:
      return state;
  }

}
export default loginReducer
