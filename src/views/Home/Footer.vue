<template>
  <div class="row mx-0 flex-row-reverse justify-content-around align-items-center text-white">
    <span class="px-2 smallText text-white font-weight-light">versão:
      {{ require('@/../package.json').version }}</span>
    <div>
      <span v-for="(item,i) in contact" :key="i" :id="`icon-${i}`" class="px-2">
        <a :href="item.link" :target="(item.icon != 'fas fa-envelope')?'_blank':'_self'">
          <i :class="item.icon" class="text-white social"></i>
        </a>
        <b-tooltip :target="`icon-${i}`" triggers="hover" noninteractive> {{ item.name }} </b-tooltip>
      </span>
    </div>
    <span class="mt-2 px-2 smallerText font-weight-light text-white">Desenvolvido por: Bruno Giacon</span>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        contact: [{
          name: 'giacon_bruno@hotmail.com',
          link: 'mailto:giacon_bruno@hotmail.com',
          icon: 'fas fa-envelope'
        }, {
          name: 'GiaconBruno',
          link: 'https://github.com/GiaconBruno/',
          icon: 'fab fa-github'
        }, {
          name: '@brunogiacon',
          link: 'https://www.instagram.com/brunogiacon/',
          icon: 'fab fa-instagram'
        }, {
          name: '@GiaconBruno',
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