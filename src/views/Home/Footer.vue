<template>
  <div class="col-12 px-0 mx-auto smallerText">
    <div class="row mx-0 justify-content-center align-items-center text-white">
      <div class="col-auto px-0 mx-lg-2">
        <span v-for="(item,i) in contact" :key="i" :id="`icon-${i}`">
          <a :href="item.link" :target="(item.icon != 'fas fa-envelope')?'_blank':'_self'" :title="item.name">
            <i :class="item.icon" class="mx-1 text-white social" />
          </a>
        </span>
      </div>
      <div class="col-auto px-0 mx-lg-2">@GiaconBruno</div>
      <div v-if="mobile" class="col-auto px-0 mx-lg-2">giacon_bruno@hotmail.com</div>
      <div class="col-auto px-0 mx-lg-2 text-white font-weight-light small">
        Desenvolvido por: Bruno Giacon - versão: {{ appVersion }} </div>
    </div>
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
    },
    computed: {
      mobile() {
        return window.innerWidth < 992;
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

  @media screen and (max-width: 1024px) {
    .smallerText {
      font-size: smaller;
    }
  }
</style>