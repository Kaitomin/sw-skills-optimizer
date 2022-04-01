<template>
  <div class="characters-list">
    <div v-for="char in charList" :key="char._id">
      <router-link :to="'/character/' + char.name">
        <img 
          :src="getImgUrl(char.icon)"
          :alt="char.name + ' icon'"         
        >
      </router-link>
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
        const res = await CharacterService.getAllCharacters()
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
    justify-content: space-around;
    align-items: center;
    max-width: 500px;
    margin: 0 auto;
  }
  .characters-list > div {
    border: 1px solid white;
    opacity: 1;
    transition: opacity 0.2s;
  }
  .characters-list > div:hover {
    opacity: 0.8;
  }
  .characters-list img {
    width: 150px;
    height: auto;
  }
</style>
