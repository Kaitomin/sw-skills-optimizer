<template>
  <div class="characters-container" :style="containerHeight">
    <!-- <div class="characters-list">
      <div :class="(char.name == 'Jin') ? 'hidden' : ''" v-for="char in charList" :key="char._id">
        <router-link :to="'/character/' + char.name">
          <img
            :src="getCharacterIcon(char.icon)"
            :alt="char.name + ' icon'"
            width="150"
            height="150"
          >
        </router-link>
      </div>
    </div> -->
    <div class="contact">
      <p>- Website author - <br> Kaitomin</p>
      <p>- Skills editor - <br> Tatufo</p> 
      <p>- Contact - <br>
        <i class="fa-brands fa-discord"></i> Kaitomin#6973<br>
        <i class="fa-brands fa-discord"></i> Tatufo#0001
      </p>
      <p>Special thanks : <br> AFN, Yayathic, Eden, jumpi, Tatufo, Kitai, Yukawa, Restia & Asvra</p>
      <p class="copyrights"><i>All images used belong to <a href="http://www.liongames.co.kr/" target="_blank">LIONS GAMES</a> licensed under <a href="https://creativecommons.org/licenses/by-nc-sa/3.0/" target="_blank">CC BY-NC-SA 3.0</a></i></p>
    </div>
  </div>
</template>

<script>
import { useGetCharacterIcon, useGetCharactersIcons } from '../composable/functions';

export default {
  data() {
    return {
      charList: [],
      containerH: ''
    }
  },
  methods: {
    async getAllCharacters() {
      this.charList = await useGetCharactersIcons()
    },
    getCharacterIcon(iconUrl) {
      return useGetCharacterIcon(iconUrl)
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
    this.containerH = (pageY.offsetHeight > window.innerHeight) ? document.querySelector('.characters-container').offsetHeight + 'px' : window.innerHeight + 'px'
  },
}
</script>

<style scoped>
  .hidden {
    display: none;
  }
  #nav .menu {
    display: none;
  }
  .characters-container {
    /* max-width: 500px; */
    /* margin: 0 auto; */
    height: var(--container-height);
    display: flex;
    justify-content: center;
    align-items: center;
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
    background-repeat: no-repeat;
    height: var(--container-height);
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
    /* max-width: 400px; */
    border: 1px solid white;
    color: white;
    text-align: left;
  }
  .contact p {
    margin-bottom: 0;
    padding: 10px;
  }
  .copyrights a {
    text-decoration: none;
  }





  /* ---------- */
  /* Responsive */
  /* ---------- */
  @media screen and (max-width: 500px) {
    .contact {
      max-width: 90%;
      text-align: center;
    }
  }
</style>
