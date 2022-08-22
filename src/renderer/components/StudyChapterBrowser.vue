<template>
  <div>
    <div id="gameselect">
      <div class="p-3 card-header">
        <h3>Chapter</h3>
      </div>
      <div class="search">
        <input
          id="gamefilter"
          v-model="gameFilter"
          type="text"
          name="gamefilter"
          placeholder="Filter Study"
        >
        <span
          id="icon"
          slot="extra"
          class="icon mdi mdi-magnify"
        />
        <i
          id="icon"
          class="icon mdi mdi-filter-menu-outline"
        />
        <i
          id="icon"
          class="icon mdi mdi-plus-box-outline"
          @click="openCreateModal()"
        />
      </div>
      <div>
        <AddPgnModal
          v-if="AddPgnModal.visible"
          :title="AddPgnModal.title"
          @close="AddPgnModal.visible = false"
        />
      </div>
      <div class="pgnList">
        <div
          v-for="(chapter) in chapterList"
          :key="`${chapter.name} ${chapter.fen}`"
        >
          <div
            class="browserelement roundseperator"
            :class="{ active : selectedGame && selectedGame.headers('Round') === chapter.name && selectedGame.headers('Event') === chapter.name }"
            :title="chapter.name"
            @click="selectChapter(chapter)"
          >
            Round {{ chapter.name }}
            <span
              slot="extra"
              class="icon mdi mdi-delete"
              style="float: right;"
              @click="deleteChapter(chapter)"
            />
          </div>
        </div>

        <template v-if="groupByRound">
          <div
            v-for="(round) in rounds"
            :key="`${round.name} ${round.eventName}`"
          >
            <div
              class="browserelement roundseperator"
              :class="{ active : selectedGame && selectedGame.headers('Round') === round.name && selectedGame.headers('Event') === round.eventName }"
              :title="round.eventName"
              @click="round.visible = !round.visible"
            >
              Round {{ round.name }} <span style="font-size: 0.65em"> ({{ round.eventName.substring(0, 15) }}...) </span>
              <span
                slot="extra"
                class="icon mdi"
                :class="[round.visible ? 'mdi-menu-up' : 'mdi-menu-down']"
                style="float: right;"
              />
            </div>
            <div v-show="round.visible">
              <div
                v-for="(game) in loadedGames"
                :key="game.id"
              >
                <div
                  v-if="game.headers('Round') === round.name && game.headers('Event') === round.eventName && isGameVisible(game)"
                  class="browserelement gameoption ml-2"
                  :class="{ active : game === selectedGame, unsupported: !game.supported }"
                  @click="selectedGame = game"
                >
                  {{ game ? game.headers("White") : 'unknown' }} <br> vs {{ game ? game.headers("Black") : 'unknown' }}
                </div>
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <div
            v-for="game in loadedGames"
            :key="game.id"
          >
            <div
              v-if="isGameVisible(game)"
              class="browserelement gameoption"
              :class="{ active : game === selectedGame, unsupported: !game.supported }"
              @click="selectedGame = game"
            >
              {{ game ? game.headers("White") : 'unknown' }} <br> vs {{ game ? game.headers("Black") : 'unknown' }}
            </div>
          </div>
        </template>
      </div>
    </div>
    <div
      class="text-center"
      @click="removeSafedPGN"
    >
      <em class="icon mdi mdi-trash-can-outline" />
    </div>
  </div>
</template>

<script>
import electron, { remote } from 'electron'
import { mapGetters } from 'vuex'
import { bus } from '../main'
import AddPgnModal from './AddPgnModal'
import { engine } from '../engine'
import StudyChapterCreateModal from './StudyChapterCreateModal'

export default {
  name: 'StudyChapterBrowser',
  components: { AddPgnModal },
  props: {
    studyId: {
      type: String,
      default: ''
    }
  },
  data: function () {
    return {
      lines: [], // array to store engine calculation result
      currentEngine: 1,
      showOnlyOnePvLine: false,

      chapterList: [],
      AddPgnModal: {
        visible: false,
        title: ''
      },
      gameFilter: '',
      rounds: [],
      groupByRound: true,
      displayUnsupported: false,
      menu: undefined,
      contextMenuEvents: undefined,
      ipc: null
    }
  },
  computed: {
    selectedGame: {
      get: function () {
        return this.$store.getters.selectedGame
      },
      set: function (newVal) {
        if (newVal.supported) {
          this.$store.dispatch('loadGame', { game: newVal })
        }
      }
    },
    loadedGames: {
      get: function () {
        return this.$store.getters.loadedGames
      }
    },
    currentMove () {
      for (let num = 0; num < this.moves.length; num++) {
        if (this.moves[num].fen === this.fen) {
          return this.moves[num]
        }
      }
      return null
    },
    ...mapGetters(['variantOptions', 'multipv', 'moves', 'fen', 'engineSettings', 'enginetime',
      'PvEInput', 'PvE', 'active', 'turn', 'PvEValue', 'depth', 'seldepth',
      'studyStep', 'currentStudyStep', 'studySolution'
    ])
  },
  watch: {
    loadedGames: function () {
      if (this.$store.getters.loadedGames) {
        // get distinct rounds
        this.rounds = this.$store.getters.loadedGames.map((value, idx, arr) => {
          return `${value.headers('Round')} ${value.headers('Event')}`
        // distinct
        }).filter((value, idx, arr) => {
          return arr.indexOf(value) === idx
        // add visibility attribute for dropdown
        }).map((value, idx) => {
          const firstSpace = value.indexOf(' ')
          const round = value.substring(0, firstSpace)
          const event = value.substring(firstSpace + 1)
          return { name: round, eventName: event, visible: idx === 0 }
        })

        this.$store.dispatch('rounds', this.rounds)
      }
    },
    engineSettings () {
      // this.originalMultiPV = this.engineSettings.MultiPV
      this.updateLines()
    },
    multipv () {
      // get engine calcualtion result list
      this.updateLines()
    },
    enginetime () {
      // time interval to calculate engine calculation
      if (this.active && this.PvE && !this.turn) {
        if (this.PvEValue === 'time') {
          if (this.enginetime >= this.PvEInput) {
            if (this.lines[0] != null) {
              this.onClick(this.lines[0])
            }
          }
        } else if (this.PvEValue === 'nodes') {
          if (this.enginetime === 60000) {
            this.onClick(this.lines[0])
          }
        } else if (this.PvEValue === 'depth') {
          if (this.enginetime === 60000) {
            this.onClick(this.lines[0])
          }
          if (this.enginetime >= 5000 && this.depth === this.seldepth) {
            this.onClick(this.lines[0])
          }
        }
      }
      if (this.active) {
        if (this.enginetime >= this.PvEInput) {
          if (this.lines[0] != null) {
            if (!this.turn) {
              this.onClick(this.lines[0])
            } else {
              console.log('this.enginetime', this.enginetime)
              if (this.enginetime < 5000) {
                // console.log(this.lines[0])
                this.$store.dispatch('saveStudySolution', this.lines[0])
                // set new solution is set
                this.$store.commit('setNewSolutionAvailable', true)
              }
            }
          }
        }
      }
    }
  },
  created: function () {
    bus.$on('toggleGroup', (newVal) => {
      this.groupByRound = newVal
    })

    bus.$on('toggleUnsupported', (newVal) => {
      this.displayUnsupported = newVal
    })

    bus.$on('openAllRounds', () => this.setVisibilityOfAllRounds(true))

    bus.$on('collapseAllRounds', () => this.setVisibilityOfAllRounds(false))

    const menuTemplate = [
      {
        label: 'Group by rounds',
        type: 'checkbox',
        checked: this.groupByRound,
        click: function (item, browserWindow, event) {
          bus.$emit('toggleGroup', item.checked)
        }
      },
      {
        label: 'Display unsupported',
        type: 'checkbox',
        checked: this.displayUnsupported,
        click: function (item, browserWindow, event) {
          bus.$emit('toggleUnsupported', item.checked)
        }
      },
      {
        label: 'Open all rounds',
        type: 'normal',
        click: function () {
          bus.$emit('openAllRounds')
        }
      },
      {
        label: 'Collapse all rounds',
        type: 'normal',
        click: function () {
          bus.$emit('collapseAllRounds')
        }
      }
    ]

    this.menu = remote.Menu.buildFromTemplate(menuTemplate)
  },
  beforeDestroy () {
    this.$store.dispatch('PvEfalse')
    engine.send('stop')
  },
  mounted () {
    this.ipc = electron.ipcRenderer
    console.log(this.ipc)
    this.ipc.send('loadStudyChapterList', this.studyId)
    const vm = this
    this.ipc.on('getStudyChapterList', function (evt, result) {
      console.log(result, 'result')
      vm.setStudyChapterList(result)
    })
    setTimeout(() => {
      this.selectChapter()
    }, 1000)
  },
  methods: {
    setStudyChapterList (data) {
      // get chapters for study
      console.log('call set all study')
      this.chapterList = data
    },
    openCreateModal () {
      const vm = this
      this.$buefy.modal.open({
        component: StudyChapterCreateModal,
        // fullScreen: true,
        parent: this,
        hasModalCard: true,
        props: {
          studyId: this.studyId
        },
        events: {
          create (newChapter) {
            vm.addNewChapter(newChapter)
          }
        }
      })
    },
    addNewChapter (newChapter) {
      this.ipc.send('addStudyChapter', newChapter)
    },
    async selectChapter (chapter = null, flag = true) {
      await this.initStudy()

      setTimeout(() => {
        const fen = chapter ? chapter.fen : this.$store.state.fen
        this.$store.state.fen = fen

        if (flag === true) {
          this.$store.commit('setStudyFen', fen)
          this.$store.dispatch('updateBoard')
          this.$store.dispatch('position')
        }
        this.$store.dispatch('goEngine')
      }, 100)
    },
    deleteChapter (chapter) {
      const chapterId = chapter.uid
      this.ipc.send('deleteStudyChapter', chapterId)
    },

    async initStudy () {
      console.log('he')
      await engine.send('stop')
      await this.$store.commit('newBoard')
      await this.$store.commit('initCurrentStudyStep')
      await this.$store.dispatch('PvEfalse')
      await this.$store.dispatch('setActiveTrue')
    },
    updateLines () {
      // get added line from multipv
      if (this.currentEngine === 1) {
        const count = this.engineSettings.MultiPV
        const lines = this.multipv.filter(el => typeof el.pv === 'string' && el.pv.length > 0)
        this.lines = lines.concat(Array(count ? Math.max(0, count - lines.length) : 0).fill(null))
        if (this.showOnlyOnePvLine) {
          this.lines = this.lines.slice(1, 2)
        }
        // console.log(this.lines)
      }
    },
    onClick (line) {
      // add engine calculated result to pgn history
      this.$store.commit('hoveredpv', -1)
      const prevMov = this.currentMove
      this.$store.dispatch('push', { move: line.ucimove, prev: prevMov })
      // console.log('line.ucimove', line.ucimove)
      // console.log('prevMov', prevMov)
    },
    isGameVisible (game) {
      if ((game.headers('White').toLowerCase().indexOf(this.gameFilter.toLowerCase()) !== -1 ||
        game.headers('Black').toLowerCase().indexOf(this.gameFilter.toLowerCase()) !== -1) &&
        (this.displayUnsupported || game.supported)) {
        return true
      } else {
        return false
      }
    },
    openContextMenu () {
      this.menu.popup(remote.getCurrentWindow())
    },
    setVisibilityOfAllRounds (value) {
      this.rounds.forEach(round => {
        round.visible = value
      })
    },
    openAddPgnModal () {
      this.AddPgnModal = {
        visible: true,
        title: 'Add new PGN'
      }
    },
    removeSafedPGN () {
      if (confirm('Do you really want to remove the safed PGNs and reset the board?')) {
        document.dispatchEvent(new Event('resetPlot'))
        this.$store.dispatch('resetBoard', { is960: false }) // used to exit 960 Mode
      }
      if (this.$store.getters.loadedGames) {
        const games = []
        this.$store.dispatch('loadedGames', games)
      }
    }
  }
}
</script>

<style scoped>
#gameselect {
  overflow-y: auto;
  overflow-x: auto;
  height: 95%;
  border: 0px solid var(--main-border-color);
}
.card-header {
  background: #464668;
}
.pgnList{
  height: 500px;
  overflow: auto;
}
.optionlabel {
  font-size: 0.75em;
}

#gamefilter {
  max-width: 55%;
  background-color: var(--second-bg-color);
  color: var(--main-text-color);
}
#gamefilter::placeholder {
  color: var(--main-text-color);
}

.roundseperator {
  border-top: 2px solid var(--main-border-color);
}

.browserelement {
  text-decoration: none;
  display: block;
  border-bottom: 1px solid var(--main-border-color);
  font-size: 0.75em;
  font-weight: 600;
  text-align: left;
  padding: 6px;
}

.gameoption:hover:not(.unsupported), .roundseperator:hover {
  background-color: #2196F3;
  color: white;
  cursor: pointer;
}

.gameoption.active, .roundseperator.active {
  background-color:#444;
  color: white;
}

.icon {
  color: white;
  cursor: pointer;
}

.icon:hover {
  background-color: var(--hover-color);
  border-radius: 8px;
  cursor: pointer;
}

.search {
  background-color: var(--button-color);
  border-bottom: 1px solid var(--main-border-color);
  padding: 2px 2px;
  white-space: nowrap;
  width: 100%;
}

.footer {
  border-top: 1px solid var(--main-border-color);
  background-color: var(--button-color);
  height: 5%;
}
.footer:hover {
  background-color: var(--hover-color);
}
.icon.mdi-trash-can-outline {
  font-size: 100%;

}

.unsupported {
  background-color: #999;
  color: #555;
  cursor: not-allowed;
}
</style>
