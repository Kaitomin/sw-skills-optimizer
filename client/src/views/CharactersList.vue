<template>
  <div class="characters-container" :style="containerHeight">
    <div class="characters-list">
      <!-- <div :class="(char.name == 'Dana') ? 'hidden' : ''" v-for="char in charList" :key="char._id"> -->
      <div v-for="char in charList" :key="char._id">
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
      <p class="copyrights"><i>All images used belong to <a href="http://www.liongames.co.kr/" target="_blank">LIONS GAMES</a> licensed under <a href="https://creativecommons.org/licenses/by-nc-sa/3.0/" target="_blank">CC BY-NC-SA 3.0</a></i></p>
    </div>
  </div>
</template>

<script>

import CharacterService from '../services/CharacterService';

export default {
  data() {
    return {
      charList: [],
      containerH: ''
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
  },
  computed: {
    containerHeight() {
      return {
        '--container-height': this.containerH
      }
    },
  },
  created() {
    this.getAllCharacters();
  },
  mounted() {
    // Get client window Y to set background height
    const pageY = document.querySelector('.characters-container')
    // setTimeout(() => {
      this.containerH = (pageY.offsetHeight > window.innerHeight) ?
      document.querySelector('.characters-container').offsetHeight + 'px' :
      window.innerHeight + 'px'
    // }, 200)
  },
}
</script>

<style scoped>
  .hidden {
    display: none;
  }
  .characters-container::before {
    content: ' ';
    display: block;
    position: absolute;
    left: 0;
    width: 100%;
    z-index: -999;
    opacity: 0.4;
    background: url('../assets/img/homepage.webp');
    /* background-position: center; */
    background-repeat: no-repeat;
    height: var(--container-height);
    /* animation: 2s ease-in 0s fadeIn; */
  }
  @-webkit-keyframes fadeIn { 
    0% { opacity: 0; }
    100% { opacity: 0.5; }  
  }
  @keyframes fadeIn { 
    0% { opacity: 0; }
    100% { opacity: 0.5; } 
  }
  .characters-container {
    max-width: 500px;
    margin: 0 auto;
  }
  .characters-list {
    display: flex;
    justify-content: space-around;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px;
    max-width: inherit;
    padding-top: 3em
  }
  .characters-list > div {
    border: 1px solid #ffffff3d;
    opacity: 1;
    transition: opacity 0.2s;
  }
  .characters-list > div :hover {
    opacity: 0.9;
  }
  .characters-list img {
    width: 150px;
    height: auto;
  }
  .contact {
    max-width: 400px;
    margin: 3em auto 0 auto;
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
