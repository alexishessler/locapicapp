export default function(user = {}, action) {
  if(action.type == 'signin') {
      return action.user;
  } else {
      return user;
  }
}
