<template>
  <div class="row mx-0 flex-row-reverse justify-content-center align-items-center text-white">
    <div>
      <span v-for="(item,i) in contact" :key="i" class="px-2">
        <a :href="item.link" :target="(item.icon != 'fas fa-envelope')?'_blank':'_self'">
          <i :class="item.icon" class="text-white social"></i>
        </a>
      </span>
    </div>
    <span class="px-2 font-weight-light">Desenvolvido por: Bruno Giacon</span>
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
.position-fixed {
  top: auto !important;
  bottom: 1rem;
  left: 0 !important;
  right: 0;
}

.social:hover {
  transform: scale(1.5);
  transition: all 0.3s;
}
</style>