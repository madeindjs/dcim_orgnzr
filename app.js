const fs = require('fs')
const NodeGeocoder = require('node-geocoder')
const Vue = require('vue/dist/vue.common')

const geocoder = NodeGeocoder({
  provider: 'openstreetmap',
})

const app = new Vue({
  el: '#app',
  // load JSON data
  mounted: function() {
    fs.readFile('data.json', (err, data) => {
      if (err) {
        return console.error(`cannot find database`)
      }

      this.projects = JSON.parse(data)
    })
  },
  methods: {
    // save vue app data as JSON
    save: function(value) {
      fs.writeFile('data.json', JSON.stringify(this.projects), (err) => {
        if (err) {
          return console.error(`cannot find database`)
        }
        console.log(`Saved :)`)
      })
    },
    searchCoordinates: function(index) {
      let app = this
      let project = this.projects[index]
      geocoder.geocode(project.address, function(geocodeErr, res) {

        if (geocodeErr) {
          return console.error(geocodeErr)
        }

        if (res.length === 0) {
          return console.error(`Could not find data for ${project.address}`)
        }

        let firstRes = res[0]
        console.log(`Coordinates resolved for ${project.address}`)

        app.projects[index]['latitude'] = firstRes.latitude
        app.projects[index]['longitude'] = firstRes.longitude
        app.save()
      });

    },
    addProject: function() {
      this.projects.push({
        name: "",
        address: "",
        interventions: [],
      })
    },
    addIntervention: function() {
      this.projects[this.selectedProject].interventions.push({
        reference: "",
        start: "",
        end: "",
      })
      this.save()
    }

  },
  data: {
    projects: {},
    selectedProject: null,
  }
})