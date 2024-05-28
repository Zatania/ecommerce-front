const navigation = () => [
  {
    title: 'Home',
    path: '/home',
    action: 'read',
    subject: 'home',
    icon: 'mdi:home-outline'
  },
  {
    title: 'Users',
    path: '/users',
    action: 'read',
    subject: 'user-page',
    icon: 'mdi:people'
  },
  {
    title: 'Products',
    path: '/products',
    action: 'read',
    subject: 'product-page',
    icon: 'mdi:invoice-list-outline'
  }
]

export default navigation
