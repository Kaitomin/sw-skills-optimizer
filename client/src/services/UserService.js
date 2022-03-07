import Api from '@/services/Api'

export default {
  register(credentials) {
    return Api().post('/register', credentials);
  },
  loginGet() {
    return Api().get('/login');
  },
  login(credentials) {
    return Api().post('/login', credentials);
  },
  logout_post() {
    return Api().post('/logout')
  },
  getCurrentUser() {
    return Api().get('/session');
  },
  setTemplate_post(templates) {
    return Api().post('/save-template', templates)
  }
}