<template>
  <div
    id="leftmenu"
    class="leftmenu"
    :class="activeMenu()"
  >
    <ul class="sidenav-menu">
      <li
        class="sidenav-item"
        :class="activeMenuItem('landing-page')"
        @click="navigate('landing-page')"
      >
        <a class="sidenav-link">
          <div class="icon">
            <i class="mdi mdi-home" />
          </div>
          <span>
            Home
          </span>
        </a>
        <div class="vertical-bar" />
      </li>
      <li
        class="sidenav-item"
        :class="activeMenuItem('study-all')"
        @click="navigate('study-all')"
      >
        <a class="sidenav-link">
          <div class="icon">
            <i class="mdi mdi-magnify" />
          </div>
          <span>
            All Studies
          </span>
        </a>
        <div class="vertical-bar" />
      </li>
      <li class="sidenav-item">
        <a class="sidenav-link">
          <div class="icon">
            <i class="mdi mdi-puzzle" />
          </div>
          <span>
            Topics
          </span>
        </a>
        <div class="vertical-bar" />
      </li>
      <li class="sidenav-item">
        <a class="sidenav-link">
          <div class="icon">
            <i class="mdi mdi-chat-processing-outline" />
          </div>
          <span>
            Discussion
          </span>
        </a>
        <div class="vertical-bar" />
      </li>
      <li class="sidenav-item">
        <a class="sidenav-link">
          <div class="icon">
            <i class="mdi mdi-chart-pie" />
          </div>
          <span>
            Statistics
          </span>
        </a>
        <div class="vertical-bar" />
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'LeftMenu',
  props: {},
  computed: {
    ...mapState(['showMenu'])
  },
  watch: {
    showMenu: {
      handler (newVal) {
        // console.log('showmenu', newVal)
      },
      immediate: true // make this watch function is called when component created
    }
  },
  methods: {
    activeMenu () {
      return this.showMenu === true ? 'active' : ''
    },
    navigate (name) {
      console.log(this.$router.currentRoute.path)
      if (this.$route.name === name) {
        return
      }
      this.$router.push({
        name
      })
    },
    activeMenuItem (name) {
      return this.$route.name === name ? 'active' : ''
    }
  }
}
</script>
<style scoped>

</style>
