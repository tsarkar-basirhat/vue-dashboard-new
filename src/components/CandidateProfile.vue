<template>
<div class="">
  <div class="notiFic">
      <ul>
        <li><img src="../assets/images/message.svg" alt=""></li>
        <li><img src="../assets/images/noti.svg" alt=""></li>
        <li><v-list-item-avatar>
          <v-avatar :color="(currentCandidate.score >= 75)?'green': (currentCandidate.score >= 50)?'blue': (currentCandidate.score >= 25)? 'yellow darken-4' : 'red'"
            v-if="currentCandidate.avatar === undefined">
            <span class="white--text">{{getInitials(currentCandidate.name)}}</span>
          </v-avatar>
          <v-img :src="currentCandidate.avatar" v-else></v-img>
        </v-list-item-avatar></li>
      </ul>
    </div>
        <v-card-actions class="mb-8">
        <!-- <v-row justify="space-around">
        <v-btn color="success" dark>Accept</v-btn>
        <v-btn color="error" dark>Reject</v-btn>
        </v-row> -->
      </v-card-actions>
      <div justify="center" align="center">
      <div class="proBar">
        <v-progress-circular
          :value= currentCandidate.score
          size= 175
          rotate="48"
          :indeterminate="loading"
          :color= "(currentCandidate.score >= 75)?'green': (currentCandidate.score >= 50)?'blue': (currentCandidate.score >= 25)? 'yellow darken-4' : 'red'"
        >
        <v-badge
            :content= currentCandidate.score
            :color="(currentCandidate.score >= 75)?'green': (currentCandidate.score >= 50)?'blue': (currentCandidate.score >= 25)? 'yellow darken-4' : 'red'"
            bottom
            label
            tile
            offset-x="12"
            offset-y="12"
            v-if="!loading"
          >
        <v-avatar size="150">
          <span class="text-h2" v-if="currentCandidate.avatar === undefined">{{getInitials(currentCandidate.name)}}</span>
          <img
            :src=currentCandidate.avatar
            :alt=currentCandidate.name
            v-else
          >
        </v-avatar>
        </v-badge>
        </v-progress-circular>
      </div>
      </div>
      <div class="text-center mt-5 candidate-name" v-if="!loading">{{ currentCandidate.name }}</div>
      <div class="text-center candidate-designation">UI/UX Designer</div>
     <perfect-scrollbar>
      <div class="candidate-info block-pad">
        <h2 class="info-title">Informations</h2>
        <p><span>PHONE</span> - {{currentCandidate.phone}}</p>
        <p><span>EMAIL</span> - {{currentCandidate.email}}</p>
        <p><span>USER ID</span> - {{currentCandidate.uid}} </p>
      </div>

      <!-- <v-card-subtitle class="text-center pt-0" v-if="!loading"><v-icon size="medium">mdi-account-box</v-icon> {{currentCandidate.phone}}<span v-show="currentCandidate.email">, {{currentCandidate.email}}</span></v-card-subtitle>
      <v-card-subtitle class="text-center pt-0" v-if="!loading"><v-icon size="medium">mdi-card-account-details</v-icon> {{currentCandidate.uid}}</v-card-subtitle> -->
      <div justify="space-around" class="mb-5" v-if="!loading">
          <!-- <v-btn
            color="blue"
            class="white--text"
            v-if="currentCandidate.resume"
            @click="downloadWithAxios(currentCandidate.resume)"
          >
            Resume
            <v-icon> mdi-download </v-icon>
          </v-btn> -->
      </div>
      <div class="noTes block-pad">
        <p><span>NOTES</span></p>
        <v-textarea placeholder="Add notes here" v-model="note" v-if="!loading"></v-textarea>
      <div v-if="!loading">
        <v-btn
          color="themeBtn small"
          @click="postNotes(currentCandidate._id)"
          :loading="saving"
          :disabled="saving"
        >
          Save
        </v-btn>
      </div>
      <v-alert :type="save" dense v-if="msg">
          {{msg}}
        </v-alert>
      </div>
      <div class="btnBlock block-pad">
        <v-row>
          <v-col lg="6" md="6" v-if="currentCandidate.resume"><a @click="downloadWithAxios(currentCandidate.resume)">Resume</a></v-col>
          <v-col lg="6" md="6"><a class="btnSc">Schedule</a></v-col>
          <v-col lg="6" md="6"><a class="btnDq">Disqualify</a></v-col>
          <v-col lg="6" md="6"><a class="btnAf">Assess Further</a></v-col>
        </v-row>
      </div>
      <div class="sec-files block-pad">
        <h2 class="info-title">Files</h2>
        <ul>
          <li><a href=""><img src="../assets/images/files.svg" alt=""></a></li>
          <li><a href=""><img src="../assets/images/files.svg" alt=""></a></li>
        </ul>
      </div>
      </perfect-scrollbar>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import axios from 'axios'
export default {
  data: () => ({
    note: '',
    saving: false,
    save: '',
    msg: ''
  }),
  computed: {
    ...mapState(['currentCandidate', 'loading']),
    height () {
      if (this.$vuetify.breakpoint.name === 'xl') {
        return '100vmin'
      }
      if (this.$vuetify.breakpoint.name === 'lg') {
        return '100vmin'
      }
      if (this.$vuetify.breakpoint.name === 'md') {
        return '62vmin'
      }
      return '60vmin'
    }
  },
  watch: {
    currentCandidate () {
      this.note = this.currentCandidate.notes
    },
    msg () {
      if (this.msg) {
        setTimeout(() => {
          this.msg = ''
        }, 3000)
      }
    }
  },
  methods: {
    ...mapActions(['addNotes']),
    getInitials (string) {
      const names = string.split(' ')
      let initials = names[0].substring(0, 1).toUpperCase()
      if (names.length > 1) {
        initials += names[names.length - 1].substring(0, 1).toUpperCase()
      }
      return initials
    },
    async postNotes (id) {
      this.saving = true
      const notes = {
        id: id,
        text: this.note
      }
      await this.addNotes(notes)
      if (this.currentCandidate.notes === this.note) {
        this.msg = 'Save Successful'
        this.save = 'success'
        this.saving = false
      } else {
        this.msg = 'Saving Failed'
        this.save = 'error'
        this.saving = false
      }
    },
    forceFileDownload (response, title) {
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', title)
      document.body.appendChild(link)
      link.click()
    },
    downloadWithAxios (url) {
      const title = url.split('/')[1]
      url = process.env.VUE_APP_REST_SERVER + url
      axios({
        method: 'get',
        url,
        responseType: 'arraybuffer'
      })
        .then((response) => {
          this.forceFileDownload(response, title)
        })
        .catch(() => console.log('error occured'))
    }
  }
}
</script>
