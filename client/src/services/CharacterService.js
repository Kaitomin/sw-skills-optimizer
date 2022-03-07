import Api from '@/services/Api'

export default {
  getAllCharacters() {
    return Api().get('/');
  },
  getCharacterInfo(data) {
    return Api().get('/character/' +  data);
  },
  addNewCharacter(data) {
    return Api().post('/add-new-char', data);
  }
}