<template>
  <div id="nav">
    <router-link to="/" class="logo">
      <img src="@/assets/img/logo_130x70.png" alt="soulworker logo" width="130" height="70">
    </router-link>
    <div class="menu">
      <router-link to="/character/Iris">
        <img src="@/assets/img/iris_nav.png" alt="iris icon" width="120" height="50">
      </router-link>
      <router-link to="/character/Lily">
        <img src="@/assets/img/lily_nav.png" alt="lily icon" width="120" height="50">
      </router-link>
      <router-link to="/character/Haru">
        <img src="@/assets/img/haru_nav.png" alt="haru icon" width="120" height="50">
      </router-link>
      <router-link to="/character/Stella">
        <img src="@/assets/img/stella_nav.png" alt="stella icon" width="120" height="50">
      </router-link>
      <router-link to="/character/Ephnel">
        <img src="@/assets/img/ephnel_nav.png" alt="ephnel icon" width="120" height="50">
      </router-link>
      <router-link to="/character/Chii">
        <img src="@/assets/img/chii_nav.png" alt="chii icon" width="120" height="50">
      </router-link>
      <router-link to="/character/Nabi">
        <img src="@/assets/img/nabi_nav.png" alt="nabi icon" width="120" height="50">
      </router-link>
      <router-link to="/character/Dana">
        <img src="@/assets/img/dana_nav.png" alt="dana icon" width="120" height="50">
      </router-link>
      <router-link to="/character/Erwin">
        <img src="@/assets/img/erwin_nav.png" alt="erwin icon" width="120" height="50">
      </router-link>
    </div>
    <div>
      <router-link to="/calculator"><i class="fa-solid fa-calculator"></i> Calculator</router-link>
    </div>
  </div>
</template>

<script>

export default {}
</script>

<style scoped>
  /* Responsive */
  @media screen and (max-width: 1380px) {
    #nav {
      flex-direction: column;
    }
  }
</style>