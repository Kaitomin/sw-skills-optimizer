<template>
  <div class="home" :style="containerHeight">
    <div class="contact">
      <p>- Admin - <br> Kaitomin</p>
      <p>- Editor - <br> Tatufo</p> 
      <p>- Contact - <br>
        <i class="fa-brands fa-discord"></i> Kaitomin#6973<br>
        <i class="fa-brands fa-discord"></i> Tatufo#0001
      </p>
      <p>Special thanks : <br> AFN, Yayathic, Eden, jumpi, Tatufo, Kitai, Yukawa, Restia & Asvra</p>
      <p class="copyrights"><i>All images used belong to <a href="http://www.liongames.co.kr/" target="_blank">LIONS GAMES</a> licensed under <a href="https://creativecommons.org/licenses/by-nc-sa/3.0/" target="_blank">CC BY-NC-SA 3.0</a></i></p>
    </div>
    <!-- <div class="contact">
      <p>sw-skills is currently under maintenance</p>
    </div> -->
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
    const pageY = document.querySelector('.home')
    this.containerH = (pageY.offsetHeight > window.innerHeight) ? document.querySelector('.home').offsetHeight + 'px' : window.innerHeight + 'px'
  },
}
</script>

<style scoped>
  .home {
    padding-top: 2em;
    /* height: var(--container-height); */
    /* height: 100%; */
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .home::before {
    content: ' ';
    display: block;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    z-index: -999;
    opacity: 0.4;
    background: url('../assets/img/homepage.webp');
    background-repeat: no-repeat;
    height: 100%;
  }
  .contact {
    border: 1px solid white;
    color: white;
    text-align: left;
    background-color: #003434ad;
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
