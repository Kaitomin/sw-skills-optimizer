import Api from '@/services/Api'
 
export default {
  add(skill) {
    return Api().post('/add-skill', skill)
  },
  update(skill) {
    return Api().put('/update-skill', skill)
  },
  delete(skill) {
    return Api().post('/delete-skill', skill)
  }
}