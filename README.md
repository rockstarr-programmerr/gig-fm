# GigFM
> GigFM is a [recursive acronym](https://en.wikipedia.org/wiki/Recursive_acronym) for "GigFM is git for musicians".

**Update:** This project was created for personal use (version control my music mixes, hence the name).
But then I realize that base on git, this can be used by anybody for anything, not just music.

## For development
### Install npm packages
```
npm install
```

### Start watching for file changes
```
npm run watch
```

### Open app
```
npm start
```

### Restart app: type this in the same command line where you wrote `npm start`
```
rs
```

## For production
### Make artifacts
```
npm run build
```

### Make executable
```
npm make
```

### Create installer
```
npm run build-installer
```

**NOTE**:
- `npm make` will create executable as well as an one-click installer in `out` directory
- `npm run build-installer` will create an assisted installer in `dist_installer` directory

You can choose which command you want.

## License
[MIT](https://github.com/rockstarr-programmerr/gig-fm/blob/dev/LICENSE)
