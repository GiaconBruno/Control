<template>
  <div :class="{'col-md-10':dash}" class="col-12 col-md-6 pb-2 px-0">
    <div :class="{'py-md-2':dash}" class="row justify-content-around rounded border border-dark p-0 m-0">
      <div @click="$emit('CV','dashboard');" :class="(dash)?'disabled':''" class="btn col col-md-auto px-0 py-1">
        <!-- <i  id="home" :class="{'fa-2x':dash}" class="fa fa-home text-secundary"></i> -->
        <b-icon id="home" icon="house-door-fill" :font-scale="(dash)?'2.5':'1.3'" variant="secundary" />
        <b-tooltip v-if="!dash" target="home" triggers="hover" noninteractive> Início </b-tooltip>
        <p v-if="(dash)" class="pt-md-1 m-0">Início</p>
      </div>
      <div v-if="(usuario.permissao)" @click="$emit('CV','usuarios');" class="btn col col-md-auto px-0 py-1">
        <!-- <i id="todosUsuarios" :class="{'fa-2x':dash}" class="fa fa-user-friends text-dark"></i> -->
        <b-iconstack id="todosUsuarios" :font-scale="(dash)?'2.5':'1.3'">
          <b-icon stacked icon="person-fill" shift-h="4" shift-v="1" variant="dark" />
          <b-icon stacked icon="person-fill" shift-h="-4" shift-v="-1" variant="secundary" />
        </b-iconstack>
        <b-tooltip v-if="!dash" target="todosUsuarios" triggers="hover" noninteractive> Usuários </b-tooltip>
        <p v-if="(dash)" class="pt-md-1 m-0">Usuários</p>
      </div>
      <div v-if="(usuario.permissao)" @click="$emit('CV','usuario')" class="btn col col-md-auto px-0 py-1">
        <!-- <i id="criarUsuario" :class="{'fa-2x':dash}" class="fa fa-user-plus text-success"></i> -->
        <!-- <b-iconstack id="criarUsuario" :font-scale="(dash)?'2.5':'1.3'" variant="success">
          <b-icon stacked icon="plus" shift-h="6" shift-v="1" />
          <b-icon stacked icon="person-fill" shift-h="-2" shift-v="-1" />
        </b-iconstack> -->
        <b-icon id="criarUsuario" icon="person-plus-fill" :font-scale="(dash)?'2.5':'1.3'" variant="success" />
        <b-tooltip v-if="!dash" target="criarUsuario" triggers="hover" noninteractive> Criar Usuários </b-tooltip>
        <p v-if="(dash)" class="pt-md-1 m-0">Criar</p>
      </div>
      <div @click="$emit('SEU', usuario.id)" class="btn col col-md-auto px-0 py-1">
        <!-- <i id="editarUsuario" :class="{'fa-2x':dash}" class="fa fa-user-edit text-warning"></i> -->
        <b-iconstack id="editarUsuario" :font-scale="(dash)?'2.5':'1.3'" variant="warning">
          <b-icon stacked icon="pencil-fill" shift-h="7" shift-v="1" scale="0.3" />
          <b-icon stacked icon="person-fill" />
        </b-iconstack>
        <b-tooltip v-if="!dash" target="editarUsuario" triggers="hover" noninteractive> Editar Usuário </b-tooltip>
        <p v-if="(dash)" class="pt-md-1 m-0">Editar</p>
      </div>
      <div @click="$emit('CV','todas-contas')" v-if="(usuario.permissao)" class="btn col col-md-auto px-0 py-1">
        <!-- <i id="TodasConta" :class="{'fa-2x':dash}" class="fa fa-file-alt text-primary"></i> -->
        <b-icon id="TodasConta" icon="layers" :font-scale="(dash)?'2.5':'1.3'" variant="dark" />
        <b-tooltip v-if="!dash" target="TodasConta" triggers="hover" noninteractive> Todas as Conta </b-tooltip>
        <p v-if="(dash)" class="pt-md-1 m-0">Contas</p>
      </div>
      <div @click="$emit('CV','entradas')" class="btn col col-md-auto px-0 py-1">
        <!-- <i id="contaUp" :class="{'fa-2x':dash}" class="fas file-upload text-success"></i> -->
        <b-icon id="contaUp" icon="file-earmark-arrow-up-fill" :font-scale="(dash)?'2.5':'1.3'" variant="success" />
        <b-tooltip v-if="!dash" target="contaUp" triggers="hover" noninteractive> Entradas </b-tooltip>
        <p v-if="(dash)" class="pt-md-1 m-0">Entradas</p>
      </div>
      <div @click="$emit('CV','saidas')" class="btn col col-md-auto px-0 py-1">
        <!-- <i id="contaDown" :class="{'fa-2x':dash}" class="fas fa-folder-download text-danger"></i> -->
        <b-icon id="contaDown" icon="file-earmark-arrow-down-fill" :font-scale="(dash)?'2.5':'1.3'" variant="danger" />
        <b-tooltip v-if="!dash" target="contaDown" triggers="hover" noninteractive> Saídas </b-tooltip>
        <p v-if="(dash)" class="pt-md-1 m-0">Saídas</p>
      </div>
      <div @click="$emit('CV','conta')" class="btn col col-md-auto px-0 py-1">
        <!-- <i id="criarConta" :class="{'fa-2x':dash}" class="fa fa-folder-plus text-primary"></i> -->
        <b-icon id="criarConta" icon="file-earmark-plus-fill" :font-scale="(dash)?'2.5':'1.3'" variant="primary" />
        <b-tooltip v-if="!dash" target="criarConta" triggers="hover" noninteractive> Criar Conta </b-tooltip>
        <p v-if="(dash)" class="pt-md-1 m-0">Criar Conta</p>
      </div>
      <div v-if="(['/dashboard','/entradas','/saidas','/usuarios','/todas-contas'].includes($route.path))"
        @click="$emit('R')" class="btn col col-md-auto px-0 py-1">
        <!-- <i id="atualizar" :class="{'fa-2x':dash}" class="fa fa-redo-alt text-green"></i> -->
        <!-- <b-icon id="atualizar" icon="arrow-clockwise" :font-scale="(dash)?'2.5':'1.3'" variant="dark" :animation="(loading)?'spin':''" /> -->
        <b-iconstack id="atualizar" :font-scale="(dash)?'2.5':'1.3'" variant="dark">
          <b-icon stacked icon="dot" shift-h="-9" shift-v="0" />
          <b-icon stacked icon="dot" shift-h="-8" shift-v="-4" />
          <b-icon stacked icon="dot" shift-h="-5" shift-v="-7" />
          <b-icon stacked icon="dot" shift-h="-1" shift-v="-8" scale="0.95" />
          <b-icon stacked icon="dot" shift-h="3" shift-v="-7" scale="0.9" />
          <b-icon stacked icon="dot" shift-h="6" shift-v="-4" scale="0.85" />
          <b-icon stacked icon="dot" shift-h="7" shift-v="0" scale="0.8" />
          <b-icon stacked icon="dot" shift-h="6" shift-v="4" scale="0.65" />
          <b-icon stacked icon="dot" shift-h="3" shift-v="7" scale="0.6" />
          <b-icon stacked icon="dot" shift-h="-1" shift-v="8" scale="0.55" />
          <b-icon stacked icon="dot" shift-h="-5" shift-v="7" scale="0.5" />
        </b-iconstack>
        <b-tooltip v-if="!dash" target="atualizar" triggers="hover" noninteractive> Atualizar </b-tooltip>
        <p v-if="(dash)" class="pt-md-1 m-0">Atualizar</p>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    computed: {
      usuario() {
        return this.access.auth;
      },
      dash() {
        return (this.$route.path == '/dashboard')
      }
    },
  }
</script>

<style scoped>
.btn.col-md-auto.disabled > * {
  cursor: not-allowed;
}

.btn.col-md-auto:not(.disabled) .btn.fa:hover,
.b-icon:hover {
  transition: all 0.3s;
  transform: scale(1.25);
}

.b-icon {
  vertical-align: middle !important;
  padding: 0;
}

@media screen and (max-width: 768px) {
  .border-dark .b-icon {
    font-size: small !important;
  }

  .border-dark p {
    font-size: x-small;
    padding: 0;
  }
}
</style>