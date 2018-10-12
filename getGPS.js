const fs = require('fs')

const NodeGeocoder = require('node-geocoder')




const geocoder = NodeGeocoder({
  provider: 'openstreetmap',
  // httpAdapter: 'https', // Default
  // apiKey: 'YOUR_API_KEY', // for Mapquest, OpenCage, Google Premier
  // formatter: 'gpx' // 'gpx', 'string', ...
})


fs.readFile('data.json', (err, data) => {

  if (err) {
    return console.error(err)
  }

  let dataObject = JSON.parse(data)

  for (let i = 0; i < dataObject.length; i++) {
    let item = dataObject[i]
    let address = item.address

    geocoder.geocode(address, function(geocodeErr, res) {

      if (err) {
        return console.error(geocodeErr)
      }

      if (res.length === 0) {
        return console.error(`Could not find data for ${address.address}`)
      }

      let firstRes = res[0]

      dataObject[i]['latitude'] = firstRes.latitude
      dataObject[i]['longitude'] = firstRes.longitude

      console.log(dataObject)
    });

  }


  // console.log(dataObject)


})