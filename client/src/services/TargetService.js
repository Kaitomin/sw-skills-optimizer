import Api from '@/services/Api'

export default {
  getTargets() {
    return Api().get('/target');
  },
  getTargetInfo(data) {
    return Api().get('/target/' +  data);
  },
}