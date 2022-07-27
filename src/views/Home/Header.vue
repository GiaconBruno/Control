<template>
  <div :class="{'col-md-10':extra}" class="col-12 col-md-6 px-0 pb-2 pb-lg-0">
    <div class="row justify-content-around rounded border border-dark p-0 m-0">
      <div @click="$emit('CV','dashboard');" :class="{'disabled':$route.path=='/dashboard'}"
        class="btn col col-md-auto px-0 py-1">
        <!-- <i  id="home" :class="{'fa-2x':extra}" class="fa fa-home text-secundary"></i> -->
        <b-icon id="home" icon="house-door-fill" :font-scale="(extra)?'2.5':'1.3'" variant="secundary" />
        <b-tooltip v-if="!extra" target="home" triggers="hover" noninteractive> Início </b-tooltip>
        <p v-else class="m-0">Início</p>
      </div>
      <template v-if="!['/settings', '/logs'].includes($route.path)">
        <div @click="$emit('SEU', usuario.id)" class="btn col col-md-auto px-0 py-1">
          <!-- <i id="editarUsuario" :class="{'fa-2x':extra}" class="fa fa-user-edit text-warning"></i> -->
          <b-iconstack id="editarUsuario" :font-scale="(extra)?'2.5':'1.3'" variant="warning">
            <b-icon stacked icon="pencil-fill" shift-h="7" shift-v="1" scale="0.3" />
            <b-icon stacked icon="person-fill" />
          </b-iconstack>
          <b-tooltip v-if="!extra" target="editarUsuario" triggers="hover" noninteractive> Editar Usuário </b-tooltip>
          <p v-else class="m-0">Editar</p>
        </div>
        <div @click="$emit('CV','entradas')" class="btn col col-md-auto px-0 py-1">
          <!-- <i id="contaUp" :class="{'fa-2x':extra}" class="fas file-upload text-success"></i> -->
          <b-icon id="contaUp" icon="file-earmark-arrow-up-fill" :font-scale="(extra)?'2.5':'1.3'" variant="success" />
          <b-tooltip v-if="!extra" target="contaUp" triggers="hover" noninteractive> Entradas </b-tooltip>
          <p v-else class="m-0">Entradas</p>
        </div>
        <div @click="$emit('CV','saidas')" class="btn col col-md-auto px-0 py-1">
          <!-- <i id="contaDown" :class="{'fa-2x':extra}" class="fas fa-folder-download text-danger"></i> -->
          <b-icon id="contaDown" icon="file-earmark-arrow-down-fill" :font-scale="(extra)?'2.5':'1.3'"
            variant="danger" />
          <b-tooltip v-if="!extra" target="contaDown" triggers="hover" noninteractive> Saídas </b-tooltip>
          <p v-else class="m-0">Saídas</p>
        </div>
        <div @click="$emit('CV','conta')" class="btn col col-md-auto px-0 py-1">
          <!-- <i id="criarConta" :class="{'fa-2x':extra}" class="fa fa-folder-plus text-primary"></i> -->
          <b-icon id="criarConta" icon="file-earmark-plus-fill" :font-scale="(extra)?'2.5':'1.3'" variant="primary" />
          <b-tooltip v-if="!extra" target="criarConta" triggers="hover" noninteractive> Criar Conta </b-tooltip>
          <p v-else class="m-0">Criar</p>
        </div>
        <div @click="$emit('CV','mensagens')" class="btn col col-md-auto px-0 py-1 position-relative">
          <b-icon id="mensagens" icon="chat-left-dots" :font-scale="(extra)?'2.5':'1.3'" style="color:#01a3a4" />
          <b-badge v-if="extra && notifyCount" pill variant="danger" class="position-absolute font-weight-normal px-1"
            :style="`font-size:${(extra)?'14':'10'}px; top:3px;`"> {{ notifyCount }} </b-badge>
          <b-tooltip v-if="!extra" target="mensagens" triggers="hover" noninteractive> Info </b-tooltip>
          <p v-else class="m-0">Info</p>
        </div>
        <div v-if="(usuario.permissao)" @click="$emit('CV','settings')" class="btn col col-md-auto px-0 py-1">
          <b-icon id="settings" icon="tools" :font-scale="(extra)?'2.5':'1.3'" style="color: #7952b3;" />
          <b-tooltip v-if="!extra" target="settings" triggers="hover" noninteractive> Settings </b-tooltip>
          <p v-else class="m-0">Settings</p>
        </div>
      </template>
      <template v-else-if="usuario.permissao">
        <div @click="$emit('CV','usuario')" class="btn col col-md-auto px-0 py-1">
          <!-- <i id="criarUsuario" :class="{'fa-2x':extra}" class="fa fa-user-plus text-success"></i> -->
          <!-- <b-iconstack id="criarUsuario" :font-scale="(extra)?'2.5':'1.3'" variant="success">
            <b-icon stacked icon="plus" shift-h="6" shift-v="1" />
            <b-icon stacked icon="person-fill" shift-h="-2" shift-v="-1" />
          </b-iconstack> -->
          <b-icon id="criarUsuario" icon="person-plus-fill" :font-scale="(extra)?'2.5':'1.3'" variant="success" />
          <b-tooltip v-if="!extra" target="criarUsuario" triggers="hover" noninteractive> Criar Usuários </b-tooltip>
          <p v-else class="m-0">Criar</p>
        </div>
        <div @click="$emit('CV','usuarios');" class="btn col col-md-auto px-0 py-1">
          <!-- <i id="todosUsuarios" :class="{'fa-2x':extra}" class="fa fa-user-friends text-dark"></i> -->
          <b-iconstack id="todosUsuarios" :font-scale="(extra)?'2.5':'1.3'">
            <b-icon stacked icon="person-fill" shift-h="4" shift-v="1" variant="info" />
            <b-icon stacked icon="person-fill" shift-h="-4" shift-v="-1" style="color:#007bff" />
          </b-iconstack>
          <b-tooltip v-if="!extra" target="todosUsuarios" triggers="hover" noninteractive> Usuários </b-tooltip>
          <p v-else class="m-0">Usuários</p>
        </div>
        <div @click="$emit('CV','todas-contas')" class="btn col col-md-auto px-0 py-1">
          <!-- <i id="TodasConta" :class="{'fa-2x':extra}" class="fa fa-file-alt text-primary"></i> -->
          <b-icon id="TodasConta" icon="card-list" :font-scale="(extra)?'2.5':'1.3'" style="color:#fd7e14" />
          <b-tooltip v-if="!extra" target="TodasConta" triggers="hover" noninteractive> Todas as Conta </b-tooltip>
          <p v-else class="m-0">Contas</p>
        </div>
        <div @click="$emit('CV','logs')" class="btn col col-md-auto px-0 py-1">
          <b-icon id="logs" icon="card-checklist" :font-scale="(extra)?'2.5':'1.3'" style="color:#dc3545" />
          <b-tooltip v-if="!extra" target="logs" triggers="hover" noninteractive> Logs </b-tooltip>
          <p v-else class="m-0">Logs</p>
        </div>
      </template>
        <div v-if="(['/dashboard','/entradas','/saidas','/usuarios','/todas-contas', '/logs'].includes($route.path))"
          @click="$emit('R')" class="btn col col-md-auto px-0 py-1">
          <!-- <i id="atualizar" :class="{'fa-2x':extra}" class="fa fa-redo-alt text-green"></i> :animation="(loading)?'spin':''" -->
          <b-icon id="atualizar" icon="arrow-clockwise" :font-scale="(extra)?'2.5':'1.3'" variant="dark" rotate="90" />
          <!-- <b-iconstack id="atualizar" :font-scale="(extra)?'2.5':'1.3'" variant="dark">
            <b-icon stacked icon="dot" shift-h="-7" shift-v="1" />
            <b-icon stacked icon="dot" shift-h="-6" shift-v="-2.5" />
            <b-icon stacked icon="dot" shift-h="-3" shift-v="-5" />
            <b-icon stacked icon="dot" shift-h="0.5" shift-v="-6" scale="0.9" />
            <b-icon stacked icon="dot" shift-h="3.5" shift-v="-4" scale="0.85" />
            <b-icon stacked icon="dot" shift-h="6" shift-v="-1" scale="0.8" />
            <b-icon stacked icon="dot" shift-h="6" shift-v="3" scale="0.65" />
            <b-icon stacked icon="dot" shift-h="4" shift-v="6" scale="0.6" />
            <b-icon stacked icon="dot" shift-h="1.5" shift-v="8" scale="0.55" />
            <b-icon stacked icon="dot" shift-h="-2" shift-v="8" scale="0.5" />
          </b-iconstack> -->
          <b-tooltip v-if="!extra" target="atualizar" triggers="hover" noninteractive> Atualizar </b-tooltip>
          <p v-else class="m-0">Atualizar</p>
        </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        notifyCount: 0,
      }
    },
    beforeMount() {
      this.$store.dispatch('getNotifyCount')
        .then(response => this.notifyCount= response)
        .catch(er => this.toast(er.data.mensagem, 'times'))
    },
    computed: {
      usuario() {
        return this.access.auth;
      },
      extra() {
        return ['/dashboard', '/settings', '/logs'].includes(this.$route.path)
      }
    }
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