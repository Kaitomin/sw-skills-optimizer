<template>
  <div id="nav">
    <router-link to="/" class="logo">
      <img src="/logo_130x70.png" alt="soulworker logo" width="130" height="70">
    </router-link>
    <div class="menu">
      <router-link 
        v-for="character in characters"
        :key="character._id"
        :to="'/character/' + character.name"
        class="character"
      >
        <img
          v-if="(character.name != 'tmpChar' && character.name != 'Jin')"
          :src="'/' + character.name.toLowerCase() + '_nav.png'"
          :alt="character.name + ' avatar'"
          width="120" 
          height="50"
        >
      </router-link>
    </div>
    <div>
      <router-link to="/calculator">
        <i class="fa-solid fa-calculator"></i> 
        Calculator
      </router-link>
    </div>
  </div>
</template>

<script setup>
  import CharacterService from '../services/CharacterService'

  let characters = []

  const res = await CharacterService.getAllCharacters()
  characters = res.data.charList
</script>

<style scoped>
  #nav a.router-link-exact-active {
    color: #00ffff8f;
  }
  #nav {
    display: flex;
    align-items: center;
    flex-direction: column;
    gap: 4em 0;
    background: #2d343f;
    padding: 10px 25px;
    border-right: 1px solid #95989e;
    position: fixed;
    width: 145px;
    height: 100vh;
    overflow-y: scroll;
    z-index: 5;
  }
  ::-webkit-scrollbar {
    width: 0px;
    background: transparent; /* make scrollbar transparent */
  }
  #nav a {
    color: #d9d9d9;
    text-decoration: none;
  }
  #nav > a {
    display: block;
    width: max-content;
  }
  .menu {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    flex-wrap: wrap;
    margin: 0;
  }
  .menu a {
    display: block;
    padding: 0.5em 0;
  }
  .router-link-active.character {
    border-radius: 5px;
    background-color: #00ffff75;
  }
  
  /* Responsive */
  @media screen and (max-width: 1380px) {
    #nav {
      flex-direction: column;
    }
  }
</style>