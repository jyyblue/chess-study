<template>
  <Layout :title="title">
    <div class="main-container">
      <StudyDetailBoard
        v-if="id !== ''"
        id="gameboards"
        :study-id="id"
      />
    </div>
  </Layout>
</template>

<script>
import StudyDetailBoard from './StudyDetailBoard'
import Layout from './Layout'

export default {
  name: 'StudyDetailPage',
  components: {
    StudyDetailBoard,
    Layout
  },
  data () {
    return {
      id: '',
      title: 'Study'
    }
  },
  mounted () {
    const toParams = this.$route.params
    this.id = toParams.id
    console.log('dddddddddddddddddddd', this.id)
  },
  methods: {
    initDate () {
    }
  }
}
</script>

<style>
</style>
