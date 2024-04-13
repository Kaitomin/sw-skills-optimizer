import Api from '@/services/Api'

export default {
  getVersion() {
    return Api().get('/version')
  }
}