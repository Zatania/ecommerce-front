/**
 *  Set Home URL based on User Roles
 */
const getHomeRoute = role => {
  if (role === 'super_admin') return '/home'
  else if (role === 'admin') return '/home'
  else if (role === 'customer') return '/home'
  else return '/login'
}

export default getHomeRoute
