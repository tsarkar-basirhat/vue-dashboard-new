<template>
<perfect-scrollbar class="pageScroll">
<div class="grey lighten-3 fill-height inPage">
  <v-row>
    <v-col lg="3" md="3">
      <div class="secUplod">
        <h2>Upload <br> Contact List</h2>
        <p>Drag and Drop</p>
        <v-btn color="themeBtn alt">IMPORT</v-btn>
      </div>
      <div class="or">
        <img src="../assets/images/or.svg" alt="">
        <p>Add Candidates one by one</p>
      </div>
    </v-col>
    <v-col lg="9" md="9">
      <div class="secUplod-right">
        <v-tabs class="tabSt">
        <v-tab>Contact</v-tab>
        <v-tab>List</v-tab>
        <v-tab>Template</v-tab>
        <v-tab-item>
          <div class="tabItemIn">
            <div class="candidateType">
              <h2>Add candidate one by one</h2>
              <p>Add Candidates to be contacted</p>
              <div class="addCandidate">
                <v-form
              ref="form"
              v-model="valid"
            >
            <div class="addCandidate-main">
              <div class="addIco"><img src="../assets/images/pls-ico.svg" alt=""></div>
            <v-row class="modified alt">
              <v-col lg="6">
                <v-text-field
                v-model="candidate.name"
                label="Name"
                placeholder="Enter Candidate Name"
                :rules="[v => !!v || 'Name is required']"
                required
              ></v-text-field>
              </v-col>
              <v-col lg="6">
                <v-text-field
                v-model="candidate.phone"
                label="Phone"
                placeholder="Enter Candidate Email"
                :rules="phoneRules"
                maxlength="13"
                required
              ></v-text-field>
              </v-col>
              <v-col lg="6">
                <v-text-field
                v-model="candidate.email"
                :rules="emailRules"
                label="Email"
                placeholder="Enter Candidate Phone"
                required
              ></v-text-field>
              </v-col>
              <v-col lg="6">
                <v-select
                v-model="candidate.jobId"
                :items="getPositions"
                label="Applying Position"
                placeholder="Select Position Here"
                multiple
              ></v-select>
              </v-col>
              </v-row>
              </div>
              <div class="candidateList">
                <h2>Candidate List</h2>
                <table class="table">
                  <tr>
                    <td>MKevin R. Hunter</td>
                    <td>kevinrhunter@gmail.com</td>
                    <td>+91 417-567-4646</td>
                    <td class="text-center"><v-icon>mdi-delete</v-icon></td>
                  </tr>
                  <tr>
                    <td>Brent J. Gibson</td>
                    <td>brentjgibson@gmail.com</td>
                    <td>+95 231-437-6129</td>
                    <td class="text-center"><v-icon>mdi-delete</v-icon></td>
                  </tr>
                  <tr>
                    <td>Sommer R. Dawson</td>
                    <td>sommerrdawson@teleworm.us</td>
                    <td>+91 703-438-2680</td>
                    <td class="text-center"><v-icon>mdi-delete</v-icon></td>
                  </tr>
                  <tr>
                    <td>Anthony R. Nichols</td>
                    <td>anthonyrnichols@armyspy.com</td>
                    <td>+91 570-885-0632</td>
                    <td class="text-center"><v-icon>mdi-delete</v-icon></td>
                  </tr>
                  <tr>
                    <td>Manuel J. Phillips</td>
                    <td>phillips@gmail.com</td>
                    <td>+91 5658945236</td>
                    <td class="text-center"><v-icon>mdi-delete</v-icon></td>
                  </tr>
                </table>
              </div>
              <v-card-actions class="subBtn">
                <v-btn
                large
                color="themeBtn"
                @click="addCandidate"
              >
                REACH OUT
              </v-btn>
              <v-btn
                large
                color="themeBtn blank"
                class="mr-4"
                @click="reset"
              >
                CANCEL
              </v-btn>
              </v-card-actions>
            </v-form>
              </div>
            </div>
          </div>
        </v-tab-item>

        <v-tab-item>
          <div class="tabItemIn"><h2>No List Data</h2></div>
        </v-tab-item>

        <v-tab-item>
          <div class="tabItemIn"><h2>No Template Data</h2></div>
        </v-tab-item>

        </v-tabs>
      </div>
    </v-col>
  </v-row>

  <v-row align="center" class="fill-height d-none">
    <v-col>
  <v-row justify="center" class="mb-8">
    <v-card min-width="35vmax" tile>
      <v-container>
        <v-row justify="space-around">
        <v-card-title>
          <v-btn x-large outlined color="primary">Upload Contact List</v-btn>
        </v-card-title>
        </v-row>
        <v-row justify="space-around" align="center">
        <v-card-subtitle> Upload Excel/Csv Contact list files </v-card-subtitle>
        </v-row>
      </v-container>
    </v-card>
  </v-row>
  <v-row justify="center">
  <div class="center-separator">
    OR
  </div>
  </v-row>
  <v-row class="mt-8" justify="center">
        <v-card :style="{minWidth: '70vmin'}" tile>
          <v-container fluid>
          <v-card-title > Single Contact </v-card-title>
          <v-card-subtitle> Add Candidates to be contacted </v-card-subtitle>
          <v-card-text>
            <v-form
              ref="form"
              v-model="valid"
            >
              <v-text-field
                v-model="candidate.name"
                label="Name"
                :rules="[v => !!v || 'Name is required']"
                required
              ></v-text-field>
              <v-text-field
                v-model="candidate.phone"
                label="Phone"
                :rules="phoneRules"
                maxlength="13"
                required
              ></v-text-field>

              <v-text-field
                v-model="candidate.email"
                :rules="emailRules"
                label="Email"
                required
              ></v-text-field>
              <v-select
                v-model="candidate.jobId"
                :items="getPositions"
                label="Applying Position"
                multiple
              ></v-select>
              <v-card-actions>
              <v-btn
                large
                color="warning"
                class="mr-4"
                @click="reset"
              >
                Reset
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn
                large
                color="success"
                @click="addCandidate"
              >
                Submit
              </v-btn>
              </v-card-actions>
            </v-form>
          </v-card-text>
          </v-container>
        </v-card>
        <v-dialog v-model="dialog" persistent max-width="25vmax">
          <v-card>
            <v-card-title>Candidate Added</v-card-title>
            <v-card-actions>
              <v-btn color="yellow darken-4" text to="/">Chat</v-btn>
              <v-spacer></v-spacer>
              <v-btn color="red darken-1" text @click="dialog = false">Close</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
  </v-row>
    </v-col>
  </v-row>
</div>
</perfect-scrollbar>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  name: 'Outreach',
  data: () => ({
    dialog: false,
    valid: true,
    candidate: {
      name: '',
      email: '',
      phone: '',
      jobId: '',
      avatar: '',
      currentPosition: '',
      currentCompany: '',
      currentLocation: '',
      chatType: 'outbound'
    },
    emailRules: [
      v => !!v || 'E-mail is required',
      v => /.+@.+\..+/.test(v) || 'E-mail must be valid'
    ],
    phoneRules: [
      v => !!v || 'Phone is required',
      v => (v || '').length >= 10 || '10 characters required'
    ]
  }),
  computed: {
    ...mapState(['vacancies', 'recruiter']),
    getPositions () {
      const positions = this.vacancies.map(vacancy => { // this will add the location to the position title in the select menu
        return {
          text: vacancy.jobTitle + ' - ' + vacancy.location,
          value: vacancy._id
        }
      })
      return positions
    }

  },
  methods: {
    ...mapActions(['addCandidates', 'fetchData']),
    reset () {
      this.$refs.form.reset()
    },
    addCandidate () {
      if (this.$refs.form.validate()) {
        const candidate = {}
        Object.keys(this.candidate).forEach((prop) => {
          if (this.candidate[prop]) { candidate[prop] = this.candidate[prop] }
        })
        // this.addCandidate(candidate)
        this.addCandidates([candidate])
        this.reset()
        this.dialog = true
      }
    }
  },
  mounted () {
    this.fetchData()
  },
  created () {
    if (!this.recruiter) {
      this.$router.push('/')
    }
  }
}
</script>
<style scoped>
.center-separator {
    display: flex;
  line-height: 1em;
  color: gray;
}

.center-separator::before, .center-separator::after {
    content: '';
    display: inline-block;
    flex-grow: 1;
    margin-top: 0.5em;
    background: gray;
    height: 1px;
    margin-right: 10px;
    margin-left: 10px;
  }
</style>
