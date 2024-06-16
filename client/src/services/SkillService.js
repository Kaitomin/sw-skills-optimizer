import Api from '@/services/Api'
 
export default {
  // addNewSkill_get() {
  //   return Api().get('/add-new-skill');
  // },
  add(skill) {
    return Api().post('/add-skill', skill)
  },
  update(skill) {
    return Api().put('/update-skill', skill)
  }
}