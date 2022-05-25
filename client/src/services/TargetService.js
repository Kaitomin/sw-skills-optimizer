import Api from '@/services/Api'

export default {
  getTargetInfo(data) {
    return Api().get('/target/' +  data);
  },
}