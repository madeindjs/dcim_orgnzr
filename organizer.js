const ExifImage = require('exif').ExifImage;

const fs = require("fs")
const path = require("path")
const gpsUtil = require('gps-util')
const mv = require('mv');
const sanitize = require("sanitize-filename")

const NEAR_AREA = 50

const projectsData = fs.readFileSync('data.json')

if (!projectsData) {
  throw ('Could not open data.json')
}

const projects = JSON.parse(projectsData)

/**
 * Find project who match to GPS data
 * @param  {float} latitude
 * @param  {float} longitude
 * @return {Project|null}           [description]
 */
function findProject(latitude, longitude) {
  return projects.filter(project => project.latitude && project.longitude)
    .find(project => {
      let distance = gpsUtil.getDistance(longitude, latitude, project.longitude, project.latitude)
      return distance < NEAR_AREA
    })
}

/**
 * [organizeImage description]
 * @param  {String} imagePath
 * @param  {Object} exifData
 * @return {Boolean}
 */
function organizeImage(imagePath, exifData) {
  // convert longitude
  let logitudeDms = exifData.gps.GPSLongitude
  let longitude = gpsUtil.toDD(logitudeDms[0], logitudeDms[1], logitudeDms[2])
  // convert latitude
  let latitudeDms = exifData.gps.GPSLatitude
  let latitude = gpsUtil.toDD(latitudeDms[0], latitudeDms[1], latitudeDms[2])

  let project = findProject(latitude, longitude)

  if (project === undefined) {


    let newPath = path.join(
      path.dirname(imagePath),
      'not_found',
      path.basename(imagePath)
    )


    return false
  }

  let newPath = path.join(
    path.dirname(imagePath),
    sanitize(project.name),
    path.basename(imagePath)
  )

  mv(imagePath, newPath, {
    mkdirp: true
  }, error => {
    if (error) {
      return console.error(error);
    }
  })

  return true
}

/**
 * Will organize all file at the root of the given folder path
 * @param  {String} imagesPath [description]
 * @return {void}            [description]
 */
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

// for testing purpose
// module.exports.run('/home/apprenant/Images/a')