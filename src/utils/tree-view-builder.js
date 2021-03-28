import { splitPaths, joinPaths, makeUniqueArray } from './common.js'


class Path {
  constructor (fullpath) {
    this.id = fullpath
    this.children = []

    const splited = splitPaths(fullpath)
    this.name = splited[splited.length - 1]
    this.parent = splited.slice(0, splited.length - 1)
    this.isRoot = this.parent.length === 0
    this.isFile = this.name.indexOf('.') > -1
  }

  setChildren (paths) {
    paths.forEach(path => {
      const parentPath = joinPaths(path.parent)
      if (parentPath === this.id) {
        this.children.push(path)
      }
    })
  }
}

export class TreeViewBuilder {
  constructor (filepaths) {
    this.filepaths = filepaths
    this.treeItems = []
  }

  build () {
    const paths = this.initPathObjects()
    const tree = []
    paths.forEach(path => {
      path.setChildren(paths)
      if (path.isRoot) {
        tree.push(path)
      }
    })
    return tree
  }

  initPathObjects () {
    let paths = []
    this.filepaths.forEach(filepath => {
      let currentPos = 0
      while (true) {
        const pathSplitIndex = filepath.indexOf('/', currentPos)
        if (pathSplitIndex === -1) {  // -1 means does not find "/"
          const currentPath = filepath
          paths.push(currentPath)
          break
        }

        const currentPath = filepath.slice(0, pathSplitIndex)  // Not include appending "/"
        paths.push(currentPath)
        currentPos = pathSplitIndex + 1
      }
    })

    paths = makeUniqueArray(paths)
    const pathObjects = paths.map(path => new Path(path))
    return pathObjects
  }
}
