
# dcim-orgnzr

Organize your picture library according to EXIF data.


## Usage

`dcim-orgnzr --path='./dcim' --pattern='<exif.CreateDate:YYYY>/<exif.CreateDate:MM>'`


# Setup

Install simply using NPM: `npm install dcim-orgnzr`.
You can also clone this repository and build it yourself.


## Options

| Argument | Alias | Type | Description |
|-|-|-|-|
| **path** | | string | Path where images are located |
| **dryRun** | | boolean | Not apply modifications |
| **skipBackupScript** | | boolean | Avoid to generate the backup script |
| **pattern** | **p** | string | Pattern |
| **help** | **h** | boolean | Prints this usage guide |


## Patterns




### exif.ApertureValue


```diff  
- <exif.ApertureValue>  
+ 1.85/test.jpg  
```


### exif.BrightnessValue


```diff  
- <exif.BrightnessValue>  
+ 6.9/test.jpg  
```


### exif.ColorSpace


```diff  
- <exif.ColorSpace>  
+ 1/test.jpg  
```


### exif.CreateDate

Parse the date and format according to format given (see https://day.js.org/docs/en/display/format for formatting)
```diff  
- <exif.CreateDate:YYYY>/<exif.CreateDate:MM>  
+ 2021/02/test.jpg  
```


### exif.DateTimeOriginal

Parse the date and format according to format given (see https://day.js.org/docs/en/display/format for formatting)
```diff  
- <exif.DateTimeOriginal:YYYY>/<exif.DateTimeOriginal:MM>  
+ 2021/02/test.jpg  
```


### exif.ExifImageHeight


```diff  
- <exif.ExifImageHeight>  
+ 3096/test.jpg  
```


### exif.ExifImageWidth


```diff  
- <exif.ExifImageWidth>  
+ 4128/test.jpg  
```


### exif.ExposureCompensation


```diff  
- <exif.ExposureCompensation>  
+ 0/test.jpg  
```


### exif.ExposureProgram


```diff  
- <exif.ExposureProgram>  
+ 2/test.jpg  
```


### exif.ExposureTime


```diff  
- <exif.ExposureTime>  
+ 0.0029239766081871343/test.jpg  
```


### exif.FNumber


```diff  
- <exif.FNumber>  
+ 1.9/test.jpg  
```


### exif.Flash


```diff  
- <exif.Flash>  
+ 0/test.jpg  
```


### exif.FocalLength


```diff  
- <exif.FocalLength>  
+ 3.7/test.jpg  
```


### exif.FocalLengthIn35mmFormat


```diff  
- <exif.FocalLengthIn35mmFormat>  
+ 28/test.jpg  
```


### exif.ISO


```diff  
- <exif.ISO>  
+ 64/test.jpg  
```


### exif.InteropOffset


```diff  
- <exif.InteropOffset>  
+ 3186/test.jpg  
```


### exif.LightSource


```diff  
- <exif.LightSource>  
+ 0/test.jpg  
```


### exif.MaxApertureValue


```diff  
- <exif.MaxApertureValue>  
+ 1.85/test.jpg  
```


### exif.MeteringMode


```diff  
- <exif.MeteringMode>  
+ 2/test.jpg  
```


### exif.SceneCaptureType


```diff  
- <exif.SceneCaptureType>  
+ 0/test.jpg  
```


### exif.SensingMethod


```diff  
- <exif.SensingMethod>  
+ 0/test.jpg  
```


### exif.ShutterSpeedValue


```diff  
- <exif.ShutterSpeedValue>  
+ 8.41/test.jpg  
```


### exif.WhiteBalance


```diff  
- <exif.WhiteBalance>  
+ 0/test.jpg  
```


### gps.GPSDateStamp

Parse the date and format according to format given (see https://day.js.org/docs/en/display/format for formatting)
```diff  
- <gps.GPSDateStamp:YYYY>/<gps.GPSDateStamp:MM>  
+ 2021/02/test.jpg  
```


### image.ExifOffset


```diff  
- <image.ExifOffset>  
+ 240/test.jpg  
```


### image.ImageHeight


```diff  
- <image.ImageHeight>  
+ 3096/test.jpg  
```


### image.ImageWidth


```diff  
- <image.ImageWidth>  
+ 4128/test.jpg  
```


### image.Make


```diff  
- <image.Make>  
+ samsung/test.jpg  
```


### image.Model


```diff  
- <image.Model>  
+ cSM-J510FN/test.jpg  
```


### image.ModifyDate

Parse the date and format according to format given (see https://day.js.org/docs/en/display/format for formatting)
```diff  
- <image.ModifyDate:YYYY>/<image.ModifyDate:MM>  
+ 2021/02/test.jpg  
```


### image.Orientation


```diff  
- <image.Orientation>  
+ 6/test.jpg  
```


### image.ResolutionUnit


```diff  
- <image.ResolutionUnit>  
+ 2/test.jpg  
```


### image.Software


```diff  
- <image.Software>  
+ J510FNXXU2BRE4/test.jpg  
```


### image.XResolution


```diff  
- <image.XResolution>  
+ 72/test.jpg  
```


### image.YCbCrPositioning


```diff  
- <image.YCbCrPositioning>  
+ 1/test.jpg  
```


### image.YResolution


```diff  
- <image.YResolution>  
+ 72/test.jpg  
```


### thumbnail.Compression


```diff  
- <thumbnail.Compression>  
+ 6/test.jpg  
```


### thumbnail.ImageHeight


```diff  
- <thumbnail.ImageHeight>  
+ 384/test.jpg  
```


### thumbnail.ImageWidth


```diff  
- <thumbnail.ImageWidth>  
+ 512/test.jpg  
```


### thumbnail.Orientation


```diff  
- <thumbnail.Orientation>  
+ 6/test.jpg  
```


### thumbnail.ResolutionUnit


```diff  
- <thumbnail.ResolutionUnit>  
+ 2/test.jpg  
```


### thumbnail.ThumbnailLength


```diff  
- <thumbnail.ThumbnailLength>  
+ 32987/test.jpg  
```


### thumbnail.ThumbnailOffset


```diff  
- <thumbnail.ThumbnailOffset>  
+ 3424/test.jpg  
```


### thumbnail.XResolution


```diff  
- <thumbnail.XResolution>  
+ 72/test.jpg  
```


### thumbnail.YResolution


```diff  
- <thumbnail.YResolution>  
+ 72/test.jpg  
```
  

[//]: ####ts-command-line-args_generated-by-footer
Markdown Generated by [ts-command-line-args](https://www.npmjs.com/package/ts-command-line-args)