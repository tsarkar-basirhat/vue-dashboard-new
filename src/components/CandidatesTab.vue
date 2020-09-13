<template>
  <div>
    <div v-show="searchCandidate.length===0" class="text-center pt-8 text-h6 blue-grey--text text--darken-2">
      <span> No Results </span>
    </div>
   <perfect-scrollbar>
    <v-list class="pa-0">
      <v-list-item-group color="blue darken-4" mandatory v-model=model>
        <v-list-item
          three-line
          v-for="(candidate, index) in searchCandidate"
          :key="index"
          @click="candidateSelected(candidate._id)"
        >
        <v-checkbox></v-checkbox>
        <div class="scIcon"><span>22 May</span> <img src="../assets/images/whatsapp.svg" alt=""></div>
          <v-list-item-avatar>
              <v-avatar :color="(candidate.score >= 75)?'green': (candidate.score >= 50)?'blue': (candidate.score >= 25)? 'yellow darken-4' : 'red'"
              v-if="candidate.avatar === undefined">
                  <span class="white--text">{{getInitials(candidate.name)}}</span>
              </v-avatar>
            <v-img :src="candidate.avatar" v-else></v-img>
            </v-list-item-avatar>

            <v-list-item-content>
            <v-list-item-title v-text="candidate.name"></v-list-item-title>
            <v-list-item-subtitle>
            <span v-if="candidate.currentPosition">{{candidate.currentPosition}}</span>
            <span v-if="candidate.currentCompany"> @ {{candidate.currentCompany}}</span>
            </v-list-item-subtitle>
            <v-list-item-subtitle>
            <span v-if="candidate.currentLocation">{{candidate.currentLocation}}</span>
            </v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-icon>
            <!-- <v-icon :color="item.active ? 'deep-purple accent-4' : 'grey'">mdi-chat</v-icon> -->
            <v-chip
                dark
                small
                :color="(candidate.score >= 75)?'green': (candidate.score >= 50)?'blue': (candidate.score >= 25)? 'yellow darken-4' : 'red'"
            >
                {{candidate.score}} %
            </v-chip>
            </v-list-item-icon>
          </v-list-item>
      </v-list-item-group>
    </v-list>
    </perfect-scrollbar>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  props: {
    search: String,
    type: String,
    state: String
  },
  data: () => ({
    model: 0
  }),
  computed: {
    ...mapGetters(['getCandidates']),
    searchCandidate () {
      return this.getCandidates.filter(candidate => {
        if (!this.search) {
          if (this.type === candidate.chatType && this.state === candidate.chatState) {
            return true
          }
        } else {
          if (this.type === candidate.chatType && this.state === candidate.chatState) {
            return candidate.name.toUpperCase().match(this.search.toUpperCase())
          }
        }
      })
    },
    height () {
      if (this.$vuetify.breakpoint.name === 'xl') {
        return '83vmin'
      }
      if (this.$vuetify.breakpoint.name === 'lg') {
        return '79vmin'
      }
      if (this.$vuetify.breakpoint.name === 'md') {
        return '25vmin'
      }
      if (this.$vuetify.breakpoint.name === 'sm') {
        return '13vmin'
      }
      return '35vmin'
    }
  },
  watch: {
    searchCandidate () { // when a new vacancy is selected this will reset the current selected candidate to 1st position
      this.model = 0
    }
  },
  methods: {
    ...mapActions(['setCurrentCandidate']),
    candidateSelected (id) {
      this.setCurrentCandidate(id)
    },
    getInitials (string) { // get the initials from the name to display instead of profile picture
      const names = string.split(' ')
      let initials = names[0].substring(0, 1).toUpperCase()
      if (names.length > 1) {
        initials += names[names.length - 1].substring(0, 1).toUpperCase()
      }
      return initials
    }
  }
}
</script>
