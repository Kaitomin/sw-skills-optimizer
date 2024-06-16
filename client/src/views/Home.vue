<template>
  <div class="home">
    <div class="contact">
      <p>- Admin - <br> Kaitomin</p>
      <p>- Editor - <br> AFN</p> 
      <p>- Contact - <br>
        <i class="fa-brands fa-discord"></i> kaitomin<br>
        <i class="fa-brands fa-discord"></i> afn99
      </p>
      <p>Special thanks : <br> AFN, Yayathic, Eden, jumpi, Tatufo, Kitai, Yukawa, Restia & Asvra</p>
      <p class="copyrights">
        <i>
          All images used belong to 
          <a href="http://www.liongames.co.kr/" target="_blank">LIONS GAMES</a> 
          licensed under 
          <a href="https://creativecommons.org/licenses/by-nc-sa/3.0/" target="_blank">CC BY-NC-SA 3.0</a>
        </i>
      </p>
    </div>
    <!-- <div class="contact">
      <p>sw-skills is currently under maintenance</p>
    </div> -->
  </div>
</template>

<script setup>
</script>

<style scoped>
  .home {
    padding-top: 5em;
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
    background-repeat: no-repeat;
    height: 100%;
  }
  .contact {
    border: 1px solid #95989e;
    color: white;
    text-align: left;
    background-color: #2d343f;
    border-radius: 5px;
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
