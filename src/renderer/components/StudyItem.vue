<!-- eslint-disable vue/html-self-closing -->
<template>
  <div class="study-card" @click="openDetail">
    <div
      class="study-card-top"
    >
      <img src="../assets/images/engines/crazyara.png" />
      <div
        class="study-card-top-right"
      >
        <div
          class="study-card-title"
        >
          {{ study ? study.name : '' }}
        </div>
        <div
          class="study-card-like"
        >
          <i class="mr-2 fa fa-heart" />
          <span class="mr-2">ReyEnigma</span>
          <span>1 week ago</span>
        </div>
      </div>
    </div>
    <div class="chr" />
    <div
      class="study-card-bottom"
    >
      <div>
        <div>
          <i class="fa fa-circle" />
          <span>{{ $limitString('Lorem sentence') }}</span>
        </div>
        <div>
          <i class="fa fa-circle" />
          <span>{{ $limitString('Lorem sentence') }}</span>
        </div>
        <div>
          <i class="fa fa-circle" />
          <span>{{ $limitString('Lorem sentence') }}</span>
        </div>

        <div>
          <i class="fa fa-circle" />
          <span>{{ $limitString('Lorem sentence') }}</span>
        </div>
      </div>

      <div>
        <div>
          <i class="fa fa-circle" />
          <span>{{ $limitString('Lorem sentence', 10) }} </span>
        </div>
        <div>
          <i class="fa fa-circle" />
          <span>Lorem </span>
        </div>
        <div>
          <i class="fa fa-circle" />
          <span>Lorem </span>
        </div>

        <div>
          <i class="fa fa-circle" />
          <span>Lorem </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'StudyItem',
  components: { },
  props: {
    study: {
      type: Object,
      default: null
    }
  },
  data () {
    return {}
  },
  computed: {
    ...mapGetters(['PvE', 'active', 'turn', 'multipv', 'depth'])
  },
  watch: {},
  methods: {
    onClick () {

    },
    openDetail () {
      this.$emit('click')
    }
  }
}
</script>

<style  scoped>
/* The switch - the box around the slider */
.study-card {
  background: var(--nav-background);
  border: 0;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 1rem;
}
.study-card-top{
  padding: 1rem;
  display: flex;
}
.study-card-top img{
  width: 70px;
  height: 70px;
  object-fit: cover;
  margin-right: 0.5rem;
  border-radius: 1rem;
}
.study-card-top .study-card-top-right{
  margin: auto;
}
.study-card-like{
  font-size: 0.8rem;
  display: flex;
  color: var(--color-green);
}

.study-card-like > * {
  margin-top: auto;
  margin-bottom: auto;
}
.chr {
    border: 0;
    border-top: 1px solid rgba(0,0,0,.1);
}

.study-card-bottom{
  display: flex;
  padding: 1rem;
  justify-content: space-between;
  font-size: 0.8rem;
}
</style>
