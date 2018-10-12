const ExifImage = require('exif').ExifImage;

const fs = require("fs")
const path = require("path")


const imagesPath = '/home/arousseau/Images/2018/italie/'


const getPicturesWithGPS = () => new Promise((resolve, reject) => {})

fs.readdir(imagesPath, function(err, items) {
  if (err) {
    return console.error(err)
  }

  items.forEach((item) => {
    let itemPath = path.join(imagesPath, item)

    new ExifImage({
      image: itemPath
    }, function(error, exifData) {
      // handle error
      if (error) {
        return console.error(`Error with ${itemPath}: ${error.message}`)
      }
      // check GPS data
      if (exifData.gps === undefined || Object.keys(exifData.gps).length === 0) {
        return console.error(`Error with ${itemPath}: picture have no GPS data`)
      }

      console.log(exifData.gps); // Do something with your data!
    })
  })
})