<template>
  <div class="grey lighten-3 fill-height inPage inPageAlt">
    <v-data-iterator
      :items="candidates"
      :items-per-page.sync="itemsPerPage"
      :page="page"
      :search="search"
      :sort-by="sortBy.toLowerCase()"
      :sort-desc="sortDesc"
      hide-default-footer
    >
      <template v-slot:header>
        <v-toolbar class="siteTool"
          color="theme-light"
        >
        <div class="top-search alt">
          <v-text-field
            v-model="search"
            clearable
            flat
            hide-details
            append-icon="mdi-magnify"
            placeholder="Search"
          ></v-text-field>
        </div>
          <template v-if="$vuetify.breakpoint.mdAndUp">
            <div class="top-search alt">
            <v-select
              v-model="sortBy"
              flat
              hide-details
              :items="keys"
              append-icon="mdi-magnify"
              placeholder="Sort by"
            ></v-select>
            </div>
            <v-spacer></v-spacer>
            <v-btn-toggle
              v-model="sortDesc"
              mandatory
            >
              <v-btn
                depressed
                color="white"
                :value="false"
              >
                <v-icon>mdi-arrow-up</v-icon>
              </v-btn>
              <v-btn
                depressed
                color="white"
                :value="true"
              >
                <v-icon>mdi-arrow-down</v-icon>
              </v-btn>
            </v-btn-toggle>
          </template>
        </v-toolbar>
      </template>

      <template v-slot:default="props">
        <perfect-scrollbar class="canList">
        <v-row>
          <v-col
            v-for="item in props.items"
            :key="item._id"
            cols="12"
            sm="6"
            md="4"
            lg="3"
          >
            <v-card>
              <v-card-title class="subheading font-weight-bold">
                <v-list-item>
                  <v-list-item-avatar>
                    <v-avatar :color="(item.score >= 75)?'green': (item.score >= 50)?'blue': (item.score >= 25)? 'yellow darken-4' : 'red'"
                      v-if="item.avatar === undefined">
                        <span class="white--text">{{getInitials(item.name)}}</span>
                    </v-avatar>
                        <v-img :src="item.avatar" v-else></v-img>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title v-text="item.name"></v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-card-title>

              <v-divider></v-divider>

              <v-list dense>
                <v-list-item
                  v-for="(key, index) in filteredKeys"
                  :key="index"
                >
                  <v-list-item-content :class="{ 'blue--text': sortBy === key }">{{ key }}:</v-list-item-content>
                  <v-list-item-content :class="{ 'blue--text': sortBy === key }">{{ item[key] }}</v-list-item-content>
                </v-list-item>
              </v-list>
            </v-card>
          </v-col>
        </v-row>
        </perfect-scrollbar>
      </template>

      <template v-slot:footer>
        <v-row class="tableFoot" align="center" justify="center">
          <span class="grey--text">Items per page</span>
          <v-menu offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                dark
                text
                color="primary"
                class="ml-2"
                v-bind="attrs"
                v-on="on"
              >
                {{ itemsPerPage }}
                <v-icon>mdi-chevron-down</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item
                v-for="(number, index) in itemsPerPageArray"
                :key="index"
                @click="updateItemsPerPage(number)"
              >
                <v-list-item-title>{{ number }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>

          <v-spacer></v-spacer>

          <v-btn
            icon
            large
            dark
            color="blue darken-3"
            class="mr-1"
            @click="formerPage"
          >
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
          <span
            class="mr-4
            grey--text"
          >
            Page {{ page }} of {{ numberOfPages }}
          </span>
          <v-btn
            icon
            large
            dark
            color="blue darken-3"
            class="ml-1"
            @click="nextPage"
          >
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn>
        </v-row>
      </template>
    </v-data-iterator>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  data () {
    return {
      itemsPerPageArray: [25, 50, 100],
      search: '',
      filter: {},
      sortDesc: true,
      page: 1,
      itemsPerPage: 25,
      sortBy: 'score',
      keys: [
        'name',
        'email',
        'phone',
        'currentPosition',
        'currentCompany',
        'currentLocation',
        'score'
      ]
    }
  },
  computed: {
    ...mapState(['candidates', 'recruiter']),
    numberOfPages () {
      return Math.ceil(this.candidates.length / this.itemsPerPage)
    },
    filteredKeys () {
      return this.keys.filter(key => key !== 'name')
    }
  },
  methods: {
    ...mapActions(['fetchData']),
    nextPage () {
      if (this.page + 1 <= this.numberOfPages) this.page += 1
    },
    formerPage () {
      if (this.page - 1 >= 1) this.page -= 1
    },
    updateItemsPerPage (number) {
      this.itemsPerPage = number
    },
    getInitials (string) { // get the initials from the name to display instead of profile picture
      const names = string.split(' ')
      let initials = names[0].substring(0, 1).toUpperCase()
      if (names.length > 1) {
        initials += names[names.length - 1].substring(0, 1).toUpperCase()
      }
      return initials
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
