export const initialStore=()=>{
  return{
    message: null,
    user: null,
    isAuthenticated: !!localStorage.getItem("token"),
    token: localStorage.getItem("token")
  }
}

export default function storeReducer(store, action = {}) {
  switch(action.type){

    // Login action

    case 'login':
      const { token, user } = action.payload
      return {
        ...store,
        token: token,
        user: user,
        isAuthenticated: true
      };
    
    // Logout action

    case 'logout':
      localStorage.removeItem("token");
      return {
        ...store,
        token: null,
        user: null,
        isAuthenticated: false
      };

      default:
        throw Error('Unkown action: ' + action.type);
  }    
}