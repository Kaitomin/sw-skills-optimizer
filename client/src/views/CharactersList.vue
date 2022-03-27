<template>
  <div class="characters-list">
    <div v-for="char in charList" :key="char._id">
      <!-- <h1>{{ char.name }}</h1> -->
        <img 
          :src="getImgUrl(char.icon)"
          alt="character icon"
          @click="this.$router.push({ name: 'CharacterDetails', params: { id: char._id, name: char.name } })">
    </div>
  </div>
</template>

<script>

import CharacterService from '../services/CharacterService';

export default {
  data() {
    return {
      charList: []
    }
  },
  methods: {
    async getAllCharacters() {
      try {
        const res = await CharacterService.getAllCharacters();
        this.charList = res.data.charList;
      } catch (error) {
        console.log('Error :', error);
      }
    },
    getImgUrl(iconUrl) {
      return require('@/assets/uploads/characters/' + iconUrl)
    },
    updatePoints(points){
      this.$store.commit('updatePoints', points)
    }
  },
  computed: {
    points() {
      return this.$store.state.points;
    }
  },
  created() {
    this.getAllCharacters();
  }
}
</script>

<style scoped>
  .characters-list {
    display: flex;
    justify-content: center;
    align-items: center;
    max-width: 500px;
    margin: 0 auto;
  }
  .characters-list img {
    width: 200px;
    height: auto;
  }
</style>
