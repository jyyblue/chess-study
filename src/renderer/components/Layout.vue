<template>
  <div class="page">
    <MenuBar id="menubar">
      <div class="m-auto" slot="title">{{ title }}</div>
    </MenuBar>
    <div class="position-relative">
      <LeftMenu />
      <div
        class="layout-body"
        :class="activeMenu()"
      >
        <slot />
      </div>
    </div>
  </div>
</template>

<script>
import MenuBar from './MenuBar.vue'
import LeftMenu from './LeftMenu'
import { mapState } from 'vuex'

export default {
  name: 'Layout',
  components: {
    MenuBar,
    LeftMenu
  },
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  computed: {
    ...mapState(['showMenu'])
  },
  methods: {
    open (link) {
      this.$electron.shell.openExternal(link)
    },
    activeMenu () {
      return this.showMenu === true ? 'menu-active' : ''
    }
  }
}
</script>

<style>
@import '../assets/cssVars.css';

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body { font-family: Avenir, Helvetica, Arial, sans-serif; }

#app {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: var(--main-text-color, black);
  background-color: var(--main-bg-color, white);
  font-weight: 800;
  font-size: 12pt;
  overflow: auto;
}

#menubar {
  text-align: center;
  margin-bottom: 5px;
}
</style>
