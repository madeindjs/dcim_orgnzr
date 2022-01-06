# DCIM orgnzr

**Work In Progress**

Organize your picture according to a JSON configuration.

## Usage

```sh
node src/index.js "$PWD/sample"
```

## Pattern

<!-- BEGIN: rules generated -->
### exif.CreateDate

Use EXIF created date and format date according to given format

Examples:

```diff
- <exif.CreateDate:YYYY-MM-DD>
+ 2021-02-03/test.jpg
```
```diff
- <exif.CreateDate:YYYY>/<exif.CreateDate:MM>/<exif.CreateDate:DD>
+ 2021/02/03/test.jpg
```

### exif.DateTimeOriginal

Use EXIF created date and format date according to given format

Examples:

```diff
- <exif.DateTimeOriginal:YYYY-MM-DD>
+ 2021-02-03/test.jpg
```
```diff
- <exif.DateTimeOriginal:YYYY>/<exif.DateTimeOriginal:MM>/<exif.DateTimeOriginal:DD>
+ 2021/02/03/test.jpg
```

<!-- END -->
