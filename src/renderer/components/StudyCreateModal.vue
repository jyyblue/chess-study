<!-- eslint-disable vue/component-name-in-template-casing -->
<!-- eslint-disable vue/html-self-closing -->
<template>
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">
      </p>
    </header>
    <section class="modal-card-body">
      <b-field>
        <template #label>
          Study Name
          <span class="has-text-primary text-danger">*</span>
        </template>
        <b-input
          v-model="name"
          aria-placeholder="Study Name"
        ></b-input>
      </b-field>
    </section>
    <footer
      class="modal-card-foot text-right"
    >
      <b-button
        label="Close"
        class="is-pulled-right"
        @click="$parent.close()"
      />
      <b-button
        label="Create"
        class="is-pulled-right"
        type="is-info"
        @click="createStudy"
      />
    </footer>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { uuid } from 'vue-uuid'

export default {
  name: 'StudyCreateModal',
  components: { },
  data () {
    return {
      name: ''
    }
  },
  computed: {
    ...mapGetters(['PvE', 'active', 'turn', 'multipv', 'depth'])
  },
  watch: {},
  methods: {
    createStudy () {
      console.log('create study')
      const newId = uuid.v4()
      const newStudy = {
        id: newId,
        name: this.name
      }
      this.$addStudy(newStudy)
      this.$emit('create')
      this.$parent.close()
    },
    openingSuit () {

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
