import Api from '@/services/Api'

export default {
  getLogger() {
    return Api().get('/logger')
  },
  setLogger(obj) {
    return Api().post('/logger', obj);
  },
}