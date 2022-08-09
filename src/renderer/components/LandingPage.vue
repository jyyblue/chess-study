<template>
  <Layout :title="title">
    <div
      class="main-container"
    >
      <GameBoards id="gameboards" />
    </div>
  </Layout>
</template>

<script>
import GameBoards from './GameBoards'
import Layout from './Layout'

export default {
  name: 'LandingPage',
  components: {
    GameBoards,
    Layout
  },
  data () {
    return {
      title: 'Home'
    }
  },
  methods: {

  }
}
</script>

<style>
</style>
