const ExifImage = require('exif').ExifImage;

const fs = require("fs")
const path = require("path")
const gpsUtil = require('gps-util')
const mv = require('mv');
const sanitize = require("sanitize-filename")
const moment = require('moment')

const NEAR_AREA = 50

// ensure database is set
try {
    fs.statSync('data.json').isFile()
} catch ( e ) {
    fs.writeFileSync('data.json', '[]')
}


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


function move(oldPath, newPath) {
    mv(oldPath, newPath, {
        mkdirp: true
    }, error => {
        if (error) {
            return console.error(error);
        }
    })
}


// if not found move it into "./not_found" folder
function moveToNotFound(imagePath, reason) {
    let newPath = path.join(
        path.dirname(imagePath),
        'errors',
        reason,
        path.basename(imagePath)
    )

    move(imagePath, newPath)
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
        moveToNotFound(imagePath, 'no_project')

        return false
    }

    let shootTime = moment(exifData.exif.DateTimeOriginal, "YYYY:MM:DD HH:mm:ss")

    let intervention = project.interventions.find(intervention => {
        let start = moment(intervention.start)
        let end = moment(intervention.end)

        return shootTime > start && shootTime < end
    })

    let newPath = null

    if (intervention !== undefined && intervention.reference) {
        newPath = path.join(
            path.dirname(imagePath),
            sanitize(project.name),
            sanitize(intervention.reference),
            path.basename(imagePath)
        )

    } else {
        newPath = path.join(
            path.dirname(imagePath),
            sanitize(project.name),
            'not_found',
            path.basename(imagePath)
        )
    }

    move(imagePath, newPath)
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
                moveToNotFound(imagePath, 'no_data')
                return console.error(`${imagePath} : ${exifError}`)
            }
            // check GPS data
            if (exifData.gps === undefined || Object.keys(exifData.gps).length === 0) {
                moveToNotFound(imagePath, 'no_gps')
                return console.error(`${imagePath} : picture have no GPS data`)
            }

            organizeImage(imagePath, exifData)
        })
    })
})
}

// for testing purpose
// module.exports.run('/home/apprenant/Images/a')