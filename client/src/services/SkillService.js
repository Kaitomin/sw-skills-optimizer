import Api from '@/services/Api'
 
export default {
  addNewSkill_get() {
    return Api().get('/add-new-skill');
  },
  addNewSkill(data) {
    return Api().post('add-new-skill', data);
  },
  updateSkill(skill) {
    return Api().put('/dashboard', skill)
  }
}