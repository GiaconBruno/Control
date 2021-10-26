<template>
  <div class="row mt-3 mt-lg-4 mx-0 flex-row-reverse justify-content-around align-items-center text-white">
    <span class="px-2 smallText text-white font-weight-light">versão:
      {{ require('@/../package.json').version }}</span>
    <div>
      <span v-for="(item,i) in contact" :key="i" class="px-2">
        <a :href="item.link" :target="(item.icon != 'fas fa-envelope')?'_blank':'_self'">
          <i :class="item.icon" class="text-white social"></i>
        </a>
      </span>
    </div>
    <span class="px-2 smallerText font-weight-light">Desenvolvido por: Bruno Giacon</span>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        contact: [{
          link: 'mailto:giacon_bruno@hotmail.com',
          icon: 'fas fa-envelope'
        }, {
          link: 'https://github.com/GiaconBruno/',
          icon: 'fab fa-github'
        }, {
          link: 'https://www.instagram.com/brunogiacon/',
          icon: 'fab fa-instagram'
        }, {
          link: 'https://www.facebook.com/GiaconBruno/',
          icon: 'fab fa-facebook'
        }]
      }
    }
  }
</script>

<style scoped>
.social:hover {
  transform: scale(1.5);
  transition: all 0.3s;
}

.smallText {
  font-size: smaller;
}

@media screen and (max-width: 992px) {
  .smallerText {
    font-size: smaller;
  }
}
</style>