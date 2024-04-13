import Api from '@/services/Api'

export default {
  getTargets() {
    return Api().get('/target');
  },
  getTargetInfo(slug) {
    return Api().get('/target/' +  slug);
  },
}