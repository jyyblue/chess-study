<template>
  <div
    class="position-relative"
  >
    <div class="logo-container d-flex position-absolute">
      <img class="logo" src="../assets/images/engines/crazyara.png"/>
      <div class="name mt-auto mb-auto ml-2">
        <div class="app_title">Classlab</div>
        <div class="subtext">Lorem is set</div>
      </div>
    </div>
    <nav class="navbar">
      <div class="container-fluid">
        <div class="bar">
          <button
            class="btn navbar-toggler mr-3"
            @click="toggleMenu"
          >
            <i class="fa fa-bars" />
          </button>
          <slot name="title" />
        </div>
        <div class="bar">
          <div class="form-outline">
            <i class="fas fa-search trailing"></i>
            <input type="text" id="form1" class="form-control form-icon-trailing" />
          </div>
        </div>
        <div class="bar">
          <!-- Left links -->
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <a
                class="nav-link"
                @click="openPgn"
              >News</a>
            </li>
            <li class="nav-item">
              <a
                class="nav-link"
                @click="openAboutTabModal"
              >About</a>
            </li>
            <AboutTabModal
              v-if="modal.visible"
              :title="modal.title"
              @close="modal.visible = false"
            />
            <li class="nav-item">
              <a
                class="nav-link"
                @click="startQuickTour"
              >Help</a>
            </li>
            <QuicktourModal
              v-if="quicktourModal.visible"
              :title="quicktourModal.title"
              @close="quicktourModal.visible = false"
            />
          </ul>
          <!-- Left links -->
        </div>
        <div class="bar">
          <div class="icon-item m-auto">
            <i
              class="icon mdi mdi-bell"
            />
            <span class="badge">1</span>
          </div>
          <div
            class="icon-item m-auto"
            @click="changeTab"
          >
            <i
              class="icon mdi mdi-cog"
            />
            <span class="badge">2</span>
          </div>
          <div class="icon-item m-auto">
            <button class="btn btn-outline-main rounded-pill">
              Sign In
            </button>
          </div>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
import fs from 'fs'
import { mapGetters } from 'vuex'
import ffish from 'ffish'
import AboutTabModal from './AboutTabModal'
import QuicktourModal from './QuicktourModal'

export default {
  name: 'MenuBar',
  components: { AboutTabModal, QuicktourModal },
  data () {
    return {
      modal: {
        visible: false,
        title: '',
        save: () => {}
      },
      error: 'none',
      pgnString: '',
      quicktourModal: {
        visible: false,
        title: '',
        save: () => {}
      }
    }
  },
  computed: {
    ...mapGetters(['viewAnalysis', 'initialized', 'variantOptions'])
  },
  mounted () {
    // this.$router.afterEach(() => {
    //   this.isMenuNavBarActive = false
    //   this.$store.commit('toggleLeftMenu', false)
    // })
  },
  methods: {
    changeTab () {
      this.$store.commit('viewAnalysis', !this.viewAnalysis)
    },
    openPgn () { // TODO: seperate the openPgn Funktions from here and AddPgnModal and import instead
      this.$electron.remote.dialog.showOpenDialog({
        title: 'Open PGN file',
        properties: ['openFile'],
        filters: [
          { name: 'PGN Files', extensions: ['pgn'] },
          { name: 'All Files', extensions: ['*'] }
        ]
      }).then(result => {
        if (!result.canceled) {
          localStorage.PGNPath = JSON.stringify(result.filePaths[0])
          this.openPGNFromPath(result.filePaths[0])
        }
      }).catch(err => {
        console.log(err)
      })
    },
    openPGNFromPath (path) {
      fs.readFile(path, 'utf8', (err, data) => {
        if (err) {
          return console.log(err)
        }

        // convert CRLF to LF
        data = data.replace(/\r\n/g, '\n')
        this.convertAndStorePgn(data)
      })
    },
    convertAndStorePgn (data) {
      const regex = /(?:\[.+ ".*"\]\r?\n)+\r?\n+(?:.+\r?\n)*/gm
      let games = []
      if (this.$store.getters.loadedGames) {
        games = this.$store.getters.loadedGames
      }
      let numOfUnparseableGames = 0
      let m
      const maxGames = 30
      let currentGameCount = 0
      while ((m = regex.exec(data)) !== null && currentGameCount !== maxGames) {
        if (m.index === regex.lastIndex) {
          regex.lastIndex++
        }
        m.forEach((match, groupIndex) => {
          let game
          try {
            game = ffish.readGamePGN(match)
          } catch (error) {
            numOfUnparseableGames = numOfUnparseableGames + 1
            return
          }
          currentGameCount++
          games.push(game)
        })
      }

      if (numOfUnparseableGames !== 0) {
        alert(numOfUnparseableGames + ' games could not be parsed.')
      }

      games = games.map((curVal, idx, arr) => {
        curVal.id = idx
        curVal.supported = this.variantOptions.revGet(curVal.headers('Variant').toLowerCase()) !== undefined || !curVal.headers('Variant')
        return curVal
      })

      this.$store.dispatch('loadedGames', games)
    },
    startQuickTour () {
      this.quicktourModal = {
        visible: true,
        title: 'Welcome to our Quickguide'
      }
    },
    openAboutTabModal () {
      this.modal = {
        visible: true,
        title: 'LiGround'
      }
    },
    toggleMenu () {
      this.$store.commit('toggleLeftMenu')
    }
  }
}
</script>

<style scoped>
.form-control {
    background: var(--main-bg-color) !important;
    color: var(--main-text-color) !important;
}
#menubar {
  background: var(--nav-background) !important;
}
.navbar{
  background: var(--nav-background) !important;
}
.logo-container {
  width: var(--menu-width);
  height: 70px;
  justify-content: center;
}
.navbar {
  margin-left: var(--menu-width);
  padding-left: 10px;
  height: 70px;
}
.navbar-toggler{
  color: var(--main-text-color);
}
.navbar-nav {
    flex-direction: row;
}
.navbar-nav .nav-link {
    padding-right: 0.5rem;
    padding-left: 0.5rem;
}
.nav-link {
    display: block;
    padding: 0.5rem 1rem;
    color: var(--main-text-color);
    text-decoration: none;
    cursor: pointer;
    font-size: .8rem;
    margin: 3px;
    border-radius: 50px;
    transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out;
}
.nav-link:hover {
  background-color: var(--hover-color);
}
.icon-item{
    padding: 0.5rem 1rem;
    color: var(--main-text-color);
    text-decoration: none;
    cursor: pointer;
    margin: 3px;
}
.badge {
    position: absolute;
    font-size: .7rem;
    margin-top: -0.3rem;
    margin-left: -0.5rem;
    padding: 0.2em 0.45em;
    border-radius: 1rem;
    background: var(--color-green);
}
.logo {
  width: 50px;
  height: 50px;
  object-fit:cover;
  margin-top: auto;
  margin-bottom: auto;
  border-radius: 100%;
}
.app_title {
  font-size: 1rem;
}
.subtext {
  font-size: 0.6rem;
}
.bar {
  position: relative;
  display: flex;
  justify-content: flex-end
}
.item {
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 1px;
  padding-bottom: 1px;
  display: inline-block;
  color: var(--light-text-color);;
  font-size: 14px;
  cursor: pointer;
}
.item:hover {
  background-color: var(--hover-color);
}
.item.active {
  background-color: var(--menubar-activetab-color);
}
</style>
