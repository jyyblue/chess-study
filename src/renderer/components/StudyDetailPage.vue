<template>
  <Layout :title="title">
    <StudyDetailBoard id="gameboards" />
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
    this.initDate()
  },
  methods: {
    initDate () {
      const data = this.$getStudy(this.id)
      console.log(data)
    }
  }
}
</script>

<style>
</style>
