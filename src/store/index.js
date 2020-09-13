import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
// import tempFakeData from './tempFakeData'

Vue.use(Vuex)
const server = process.env.VUE_APP_REST_SERVER
const candidateUrl = server + 'api/candidates/'
const vacancyUrl = server + 'api/vacancies/'
const chatUrl = server + 'api/conversation/'
let chatCancelToken = null

export default new Vuex.Store({
  state: {
    vacancies: [],
    candidates: [],
    selectedVacancyId: false, // The currently selected vacancy jobid
    currentCandidate: { _id: null, name: '', score: '', active: '', jobId: '', notes: '', chat: [] },
    globalError: '',
    loading: false,
    recruiter: null
  },
  getters: {
    getCurrentChat: state => state.currentCandidate.chat,
    getCandidates: state => {
      if (state.selectedVacancyId === 'unassigned') {
        return state.candidates.filter((candidate) => {
          if (candidate.jobId.length === 0) {
            return true
          }
        })
      } else {
        return state.candidates.filter((candidate) => {
          if (candidate.jobId.includes(state.selectedVacancyId)) {
            return true
          }
        })
      }
    },
    findFirstCandidate: state => {
      if (state.selectedVacancyId === 'unassigned') {
        return state.candidates.find(candidate => candidate.jobId.length === 0 && candidate.chatType === 'outbound') //  unassigned candidates will have empty array of jobId
      } else {
        return state.candidates.find(candidate => candidate.jobId.includes(state.selectedVacancyId) && candidate.chatType === 'outbound')
      }
    }
  },
  mutations: {
    setVacancies: (state, payload) => {
      state.vacancies = payload
    },
    setCandidates: (state, payload) => {
      state.candidates = payload
    },
    setSelectedVacancy: (state, payload) => {
      state.selectedVacancyId = payload
    },
    setCurrentCandidate: (state, payload) => {
      state.currentCandidate = {}
      state.currentCandidate = Object.assign({}, state.currentCandidate, { id: null, lastSeen: 'NA', name: '', score: '', chatState: '', jobId: '', notes: '', chat: [] })
      if (payload.id) {
        const candidate = state.candidates.find(candidate => candidate._id === payload.id)
        if (payload.chat.length) {
          candidate.chat = payload.chat
          candidate.chat.forEach(msg => {
            if (msg.sender === 'user') {
              candidate.lastSeen = new Date(msg.createdAt).toLocaleDateString('en-GB') + ' ' + new Date(msg.createdAt).toLocaleTimeString()
            }
          })
        } else {
          candidate.chat = []
        }
        state.currentCandidate = Object.assign({}, state.currentCandidate, candidate)
      }
    },
    updateChat: (state, chat) => {
      if (state.currentCandidate.chat.length < chat.length) {
        state.currentCandidate.chat = chat
        chat.forEach(msg => {
          if (msg.sender === 'user') {
            state.currentCandidate.lastSeen = new Date(msg.createdAt).toLocaleDateString('en-GB') + ' ' + new Date(msg.createdAt).toLocaleTimeString()
          }
        })
      }
    },
    sentMessage: (state, message) => {
      const chat = {
        sender: 'recruiter',
        text: message
      }
      state.currentCandidate.chat.push(chat)
    },
    addCandidates: (state, payload) => {
      payload.forEach(candidate => {
        if (candidate.jobId.length === 0) {
          const vacancy = state.vacancies.find(vacancy => vacancy._id === 'unassigned')
          vacancy.applicationReceived += 1
        } else {
          candidate.jobId.forEach(jobid => {
            const vacancy = state.vacancies.find(vacancy => vacancy._id === jobid)
            vacancy.applicationReceived += 1
          })
        }
        state.candidates.push(candidate)
      })
    },
    addVacancy: (state, payload) => {
      if (payload._id === 'unassigned') {
        if (state.vacancies.find(vacancy => vacancy._id === 'unassigned')) {
          return
        }
      }
      state.vacancies.push(payload)
    },
    addNotes: (state, payload) => {
      state.candidates.forEach(candidate => {
        if (candidate._id === payload._id) {
          candidate.notes = payload.notes
        }
      })
      state.currentCandidate.notes = payload.notes
    },
    setglobalError: (state, payload) => {
      state.globalError = payload
    },
    toggleLoading: (state) => {
      state.loading = !state.loading
    },
    setRecruiter: (state, recruiter) => {
      state.recruiter = recruiter
    },
    changeState: (state, chatState) => {
      state.currentCandidate.chatState = chatState
      state.candidates.find(candidate => candidate._id === state.currentCandidate._id).chatState = chatState
    }
  },
  actions: {
    fetchData: async context => {
      await fetch(vacancyUrl).then(res => res.json()).then(data => {
        context.commit('setVacancies', data)
        context.commit('setSelectedVacancy', data[0]._id)
      }).catch(err => {
        console.log(err)
        context.commit('setglobalError', 'Failed to connect to the server !')
      })
      await fetch(candidateUrl).then(res => res.json()).then(data => {
        context.commit('setCandidates', data)
        context.dispatch('setCurrentCandidate', context.getters.findFirstCandidate._id)
        const unassigned = {
          _id: 'unassigned',
          jobTitle: 'Unassigned',
          applicationReceived: context.state.candidates.filter((candidate) => {
            if (candidate.jobId.length === 0) {
              return true
            }
          }).length
        }
        context.commit('addVacancy', unassigned)
        context.dispatch('fetchNewData')
      }).catch(err => {
        console.log(err)
        context.commit('setglobalError', 'Failed to connect to the server !')
      })
    },
    fetchNewData: async context => {
      await fetch(vacancyUrl).then(res => res.json()).then(async data => {
        data.forEach(vac => {
          if (!context.state.vacancies.find(vacancy => vacancy._id === vac._id)) {
            context.commit('addVacancy', vac)
          }
        })
        await fetch(candidateUrl).then(res => res.json()).then(data => {
          const newCandidates = []
          data.forEach(cand => {
            if (!context.state.candidates.find(candidate => candidate._id === cand._id)) {
              newCandidates.push(cand)
            }
          })
          if (newCandidates.length > 0) {
            context.commit('addCandidates', newCandidates)
          }
        }).catch(err => {
          console.log(err)
        })
        setTimeout(() => {
          context.dispatch('fetchNewData')
        }, 20000)
      }).catch(err => {
        console.log(err)
        context.dispatch('fetchNewData')
      })
    },
    setSelectedVacancy: (context, jobid) => {
      context.commit('setSelectedVacancy', jobid)
      const firstCandidate = context.getters.findFirstCandidate
      context.dispatch('setCurrentCandidate', (firstCandidate) ? firstCandidate._id : null)
    },
    setCurrentCandidate: async (context, id) => {
      if (id) {
        if (chatCancelToken) {
          chatCancelToken.cancel()
        }
        chatCancelToken = axios.CancelToken.source()
        context.commit('toggleLoading')
        await fetch(`${chatUrl}${id}`)
          .then(res => res.json()).then(chat => {
            context.commit('setCurrentCandidate', { id, chat })
            context.commit('toggleLoading')
            context.dispatch('fetchNewChat')
          }).catch(err => { console.log(err) })
      } else {
        const chat = []
        context.commit('setCurrentCandidate', { id, chat })
      }
    },
    fetchNewChat: async context => {
      const id = context.state.currentCandidate._id
      axios.get(`${chatUrl}${id}?size=${context.state.currentCandidate.chat.length}`, { cancelToken: chatCancelToken.token }).then(response => {
        if (response.data && id === context.state.currentCandidate._id) {
          context.commit('updateChat', response.data)
        }
        context.dispatch('fetchNewChat')
      }).catch(err => {
        if (!axios.isCancel(err)) {
          console.log(err)
          context.dispatch('fetchNewChat')
        }
      })
      // await fetch(`${chatUrl}${id}`).then(res => res.json()).then(chat => {
      //   if (chat && id === context.state.currentCandidate._id) {
      //     context.commit('updateChat', chat)
      //   }
      // }).catch(err => { console.log(err) })
    },
    sendMessage: async (context, message) => {
      const msg = {
        text: message.body,
        to: context.state.currentCandidate.phone,
        channel: message.type,
        uid: context.state.currentCandidate.uid,
        sender: 'recruiter'
      }
      if (message.type === 'whatsapp') {
        msg.to = message.type + ':' + msg.to
      }
      await fetch(`${chatUrl}${context.state.currentCandidate._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(msg)
      }).then(res => res.json()).then(response => {
        let msg = 'Error Occured, Please try again'
        if (response.text !== undefined) {
          msg = response.text
        }
        context.commit('sentMessage', msg)
      }).catch(err => {
        console.error(err)
      })
    },
    addCandidates: async (context, candidates) => {
      await fetch(candidateUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(candidates[0])
      }).then(res => res.json()).then(data => {
        context.commit('addCandidates', [data.createdCandidate])
      }).catch(err => console.log(err))
    },
    addVacancy: async (context, vacancy) => {
      await fetch(vacancyUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(vacancy)
      }).then(res => res.json()).then(data => {
        context.commit('addVacancy', data.createdVacancy)
      }).catch(err => console.log(err))
    },
    addNotes: async (context, notes) => {
      await fetch(candidateUrl + notes.id, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ notes: notes.text })
      }).then(res => res.json()).then(data => {
        context.commit('addNotes', data.updatedCandidate)
      }).catch(err => console.log(err))
    },
    setRecruiter: (context, recruiter) => {
      context.commit('setRecruiter', recruiter)
    },
    candidateStateChange: async (context, chatState) => {
      await fetch(candidateUrl + context.state.currentCandidate._id, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ chatState })
      }).then(res => res.json()).then(data => {
        context.commit('changeState', chatState)
      }).catch(err => console.log(err))
    }
  },
  modules: {
  }
})
