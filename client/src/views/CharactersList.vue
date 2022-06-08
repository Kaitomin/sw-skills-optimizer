<template>
  <div class="characters-list">
    <!-- <div :class="char.name == 'Nabi' ? 'hidden' : ''" v-for="char in charList" :key="char._id"> -->
    <div :class="(char.name == 'Dana' || char.name == 'Erwin') ? 'hidden' : ''" v-for="char in charList" :key="char._id">
      <router-link :to="'/character/' + char.name">
        <img
          :src="getImgUrl(char.icon)"
          :alt="char.name + ' icon'"
          width="150"
          height="150"
        >
      </router-link>
    </div>
  </div>
  <div class="contact">
    <p>For any question or suggestion, <br> you can contact me on discord : Kaitomin#6973</p>
    <p>Special thanks : <br> AFN, Yayathic, Eden, jumpi, Tatufo, Kitai, Yukawa & Restia</p>
    <p class="copyrights"><i>All images used belong to <a href="http://www.liongames.co.kr/">LIONS GAMES</a> licensed under <a href="https://creativecommons.org/licenses/by-nc-sa/3.0/">CC BY-NC-SA 3.0</a></i></p>
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
      return require('@/assets/uploads/characters/' + iconUrl.split('.')[0] + '.png')
    },
    // updatePoints(points){
    //   this.$store.commit('updatePoints', points)
    // }
  },
  // computed: {
  //   points() {
  //     return this.$store.state.points;
  //   }
  // },
  created() {
    this.getAllCharacters();
  }
}
</script>

<style scoped>
  .hidden {
    display: none;
  }
  .characters-list {
    display: flex;
    justify-content: space-around;
    align-items: center;
    flex-wrap: wrap;
    max-width: 500px;
    margin: 0 auto;
    margin-bottom: 5em;
    gap: 10px;
    padding-top: 3em;
  }
  .characters-list > div {
    border: 1px solid #ffffff3d;
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
  .contact {
    max-width: 400px;
    margin: 0 auto;
    border-top: 1px solid white;
    color: white;
    padding-top: 10px;
    text-align: left;
  }
  .contact p {
    margin-bottom: 0;
    padding: 10px 5px;
  }
  .copyrights a {
    text-decoration: none;
  }
  @media screen and (max-width: 500px) {
    .contact {
      max-width: 90%;
      text-align: center;
    }
  }
</style>
