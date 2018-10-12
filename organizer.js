const ExifImage = require('exif').ExifImage;

const fs = require("fs")
const path = require("path")
const gpsUtil = require('gps-util');



const projectsData = fs.readFileSync('data.json')

if (!projectsData) {
  throw ('Could not open data.json')
}

const projects = JSON.parse(projectsData)



function organizeImage(imagePath, exifData) {

  let logitudeDms = exifData.gps.GPSLongitude
  let longitude = gpsUtil.toDD(logitudeDms[0], logitudeDms[1], logitudeDms[2])

  let latitudeDms = exifData.gps.GPSLatitude
  let latitude = gpsUtil.toDD(latitudeDms[0], latitudeDms[1], latitudeDms[2])

  projects.filter(project => project.latitude && project.longitude)
    .forEach(project => {
      let distance = gpsUtil.getDistance(longitude, latitude, project.longitude, project.latitude)
      console.log(distance)
    })

  // gpsUtil.imageGpsInfo(imagePath, function(gps) {
  //   console.log(gps)
  // })


}


module.exports.run = function organizeImages(imagesPath) {

  fs.readdir(imagesPath, function(err, items) {
    if (err) {
      throw (err)
    }

    items.forEach((item) => {
      let imagePath = path.join(imagesPath, item)

      new ExifImage({
        image: imagePath
      }, function(exifError, exifData) {
        // handle error
        if (exifError) {
          return console.error(`${imagePath} : ${exifError}`)
        }
        // check GPS data
        if (exifData.gps === undefined || Object.keys(exifData.gps).length === 0) {
          return console.error(`${imagePath} : picture have no GPS data`)
        }

        organizeImage(imagePath, exifData)
      })
    })
  })
}



// module.exports.run('/home/apprenant/Images')