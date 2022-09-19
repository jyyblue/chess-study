<template>
  <div class="user-turn">
    <div class="king">
      <img
        src="../../assets/images/analysis/king.png"
        alt="king"
        />
    </div>
    <div class="">
      <h3>Your Turn</h3>
      <h4 style="font-size: 0.6rem;">
        Find the best move for white
      </h4>
      <button
        v-if="newSolution && studyStep > currentStudyStep"
        class="btn btn_solution"
        @click="onClick()"
      >
        <i class="fa fa-check" />
        View Solution
      </button>
      <button
        v-if="!newSolution || studyStep <= currentStudyStep"
        disabled
        class="btn btn_solution"
      >
        <i class="fa fa-check" />
        View Solution
      </button>
      <div
        class="d-flex"
        style="align-items: center; margin-top: 10px;"
      >
        <h4 style="font-size: 0.8rem;">
          Turn on Engine
        </h4>
        <div class="panel">
          <label class="switch">
            <input
              type="checkbox"
              :checked="studyEngineOn"
              @click="onClickSwitch"
            >
            <span class="slider round" />
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// raw vue component
// TODO: use HookIcon component?
// import HookIcon from 'mdi-vue/Hook.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'UserTurn',
  components: {
    // HookIcon
  },
  computed: {
    currentMove () { // returns undefined when the current fen doesnt match a move from the history, otherwise it returns move from the moves array that matches the current fen
      for (let num = 0; num < this.moves.length; num++) {
        if (this.moves[num].fen === this.fen) {
          return this.moves[num]
        }
      }
      return undefined
    },
    variant () {
      return this.$store.getters.variant
    },
    moves () {
      return this.$store.getters.moves
    },
    fen () {
      return this.$store.getters.fen
    },
    ...mapGetters(['showSolution', 'newSolution',
      'studyStep', 'currentStudyStep', 'studyEngineOn'
    ])
  },
  mounted () {
    this.$store.commit('setStudyEngineOn', false)
  },
  methods: {
    onClick () {
      console.log('------------')
      this.$store.commit('setShowSolution', true)
    },
    onClickSwitch () {
      const flag = !this.studyEngineOn
      this.$store.commit('setStudyEngineOn', flag)
    }
  }
}
</script>

<style scoped>
i {
  text-align: center;
}
.user-turn {
  display: flex;
  background: var(--nav-background);
  padding: 10px;
  border-radius: 10px;
  margin-top: 10px;
  font-size: 14px;
}
.king {
  width: 50px;
  height: 50px;
  padding: 5px;
  border-radius: 50px;
  margin-top: auto;
  margin-bottom: auto;
  margin-left: 10px;
  margin-right: 20px;
  background: var(--card-header);
}
.jump {
  align-items: center;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  align: center;
  font-size: 24pt;
  width: 45px;
  color: var(--main-text-color);
  border-radius: 100%;
}
.jump:hover {
  background-color: var(--hover-highlight-color);
  color: var(--color-green);
}
.round {
  border-radius: 90%;
}
.grey {
  color:gray
}
.grey:hover {
  background-color: var(--main-bg-color);
  color: gray;
  cursor: default;
}
.btn_solution{
  color: white;
  background: var(--main-bg-color);
  margin-top: 10px;
  border-radius: 10px;
  padding: 2px 20px 2px 20px;
}

.btn_solution:hover{
  color: var(--color-green);
}

/* switch style */
.switch {
 margin: 0px 0px 0px 7px;
 position: relative;
 display: inline-block;
 width: 46px;
 height: 24px;
}

/* Hide default HTML checkbox */
.switch input {
 opacity: 0;
 width: 0;
 height: 0;
}

/* The slider */
.slider {
 position: absolute;
 cursor: pointer;
 top: 0;
 left: 0;
 right: 0;
 bottom: 0;
 background-color: #ccc;
 -webkit-transition: .4s;
 transition: .4s;
}

.slider:before {
 position: absolute;
 content: '';
 height: 20px;
 width: 20px;
 left: 4px;
 bottom: 2px;
 background-color: var(--second-bg-color);
 -webkit-transition: .4s;
 transition: .4s;
}

input:checked + .slider {
 background-color: var(--highlight-color);
}

input:focus + .slider {
 box-shadow: 0 0 1px var(--highlight-color);
}

input:checked + .slider:before {
 -webkit-transform: translateX(19px);
 -ms-transform: translateX(19px);
 transform: translateX(19px);
}

/* Rounded sliders */
.slider.round {
 border-radius: 34px;
}

.slider.round:before {
 border-radius: 50%;
}
</style>
