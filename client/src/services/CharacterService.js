import Api from '@/services/Api'
import axios from 'axios'

export default {
  async getAllCharacters() {
    return Api().get('/')
  },
  getCharacterInfo(data) {
    return Api().get('/character/' + data)
  },
  addNewCharacter(data) {
    return Api().post('/add-new-char', data)
  }
}