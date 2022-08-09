<!-- eslint-disable vue/component-name-in-template-casing -->
<template>
  <Layout :title="title">
    <div class="main-container">
      <div
        class="row mt-5"
      >
        <div class="col-md-9">
          <div
            class="d-flex search-group"
          >
            <select
              class="form-control border-0"
              style="flex: 1 1 0;"
            >
              <option value="test">
                test
              </option>
            </select>
            <div class="vertical-bar" />
            <input
              class="form-control border-0"
              style="flex: 2 1 0;"
            />
            <button
              class="btn btn-info rounded-pill"
              style="flex: 1 1 0;"
            >
              Search
              <i class="mdi mdi-magnify" />
            </button>
          </div>
        </div>
        <div class="col-md-3">
          <button
            class="btn btn-outline-info rounded-pill btn-block"
            @click="openCreateModal"
          >
            <span>
              Create Study
            </span>
            <i class="mdi mdi-plus" />
          </button>
        </div>
      </div>
      <div class="mt-4">
        <div class="tb-setting">
          <div class="page-info">
            <div>Showing <span id="showSize">23</span> of <span id="total">123</span></div>
            <div class="small">
              Based your preferences
            </div>
          </div>
          <div class="sort">
            <div class="bar">
              <div class="icon-item m-auto">
                <i
                  class="icon mdi mdi-format-list-bulleted-square"
                />
              </div>
              <div
                class="icon-item m-auto"
              >
                <i
                  class="icon mdi mdi-view-grid-outline"
                />
              </div>
              <div class="m-auto">
                <select class="form-control border-0 sort-select">
                  <option value="hot">
                    Hot
                  </option>
                  <option value="save">
                    Save
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <div class="row mt-4">
          <div
            v-for="item of studies"
            :key="item.id"
            class="col-md-3"
          >
            <StudyItem
              :study="item"
              @click="studyDetail(item.id)"
            />
          </div>
        </div>
      </div>
      <div>
        <b-pagination
          :total="total"
          v-model="current"
          :range-before="rangeBefore"
          :range-after="rangeAfter"
          :order="order"
          :size="size"
          :simple="isSimple"
          :rounded="isRounded"
          :per-page="perPage"
          :icon-prev="prevIcon"
          :icon-next="nextIcon"
          aria-next-label="Next page"
          aria-previous-label="Previous page"
          aria-page-label="Page"
          aria-current-label="Current page"
          :page-input="hasInput"
          :page-input-position="inputPosition"
          :debounce-page-input="inputDebounce"
          @change="changePage"
        >
          <template #previous="props">
            <b-pagination-button
              :page="props.page"
              tag="button"
            >
              Prev
            </b-pagination-button>
          </template>

          <template #next="props">
            <b-pagination-button
              :page="props.page"
              tag="button"
            >
              Next
            </b-pagination-button>
          </template>
        </b-pagination>
      </div>
    </div>
  </Layout>
</template>

<script>
import Layout from './Layout'
import StudyItem from './StudyItem'
import StudyCreateModal from './StudyCreateModal'
export default {
  name: 'StudyAllPage',
  components: {
    Layout,
    StudyItem
  },
  data () {
    return {
      title: 'All Studies',
      studies: [
        
      ],
      current: 1,
      perPage: 10,
      rangeBefore: 1,
      rangeAfter: 1,
      order: 'is-centered',
      size: '',
      isSimple: false,
      isRounded: true,
      hasInput: false,
      prevIcon: 'chevron-left',
      nextIcon: 'chevron-right',
      inputPosition: '',
      inputDebounce: ''
    }
  },
  computed: {
    total () {
      return this.studies.length
    }
  },
  mounted () {
    this.getAllStudy()
  },
  methods: {
    changePage () {
      console.log(this.current)
    },
    studyDetail (id) {
      this.$router.push(`/study/${id}/detail`)
    },
    openCreateModal () {
      const vm = this
      this.$buefy.modal.open({
        component: StudyCreateModal,
        // fullScreen: true,
        parent: this,
        hasModalCard: true,
        props: {},
        events: {
          create () {
            vm.getAllStudy()
          }
        }
      })
    },
    getAllStudy () {
      this.$getAllStudy()
    }
  }
}
</script>

<style scoped>
.search-group{
  background: var(--nav-background) !important;
  border-radius: 100px;
  overflow: hidden;
  padding: 3px;
}
.form-control {
    background: var(--nav-background) !important;
    color: var(--main-text-color) !important;
    box-shadow: 0px 0px 0px 0 rgba(0,123,255,.25);
}
.vertical-bar{
    width: 2px;
    background: #616161;
    margin: 5px;
}
/* setting bar */
.tb-setting {
  display: flex;
  justify-content: space-between;
}
.bar {
  position: relative;
  display: flex;
  justify-content: flex-end
}
.icon-item{
  padding-right: 10px;
  font-size: 1.4rem;
}
.sort-select{
  background: transparent !important;
}
</style>
