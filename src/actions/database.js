const sqlite3 = require('sqlite3')

const db = new sqlite3.Database('gigfm.sqlite3')

function setup () {
  return new Promise((resolve, reject) => {
    db.run(`
      CREATE TABLE IF NOT EXISTS repo (
        id INTEGER PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        dir VARCHAR(255) NOT NULL,
        author_name VARCHAR(255) NOT NULL DEFAULT '',
        author_email VARCHAR(255) NOT NULL DEFAULT ''
      );
    `, function (error) {
      if (error === null) {
        resolve()
      } else {
        reject()
        console.error(error)
      }
    })
  })
}

function createRepo (name, dir) {
  return new Promise((resolve, reject) => {
    db.run(`
      INSERT INTO repo (name, dir)
      VALUES ($name, $dir);
    `, {
      $name: name,
      $dir: dir
    },
    function (error) {
      if (error === null) {
        resolve(this.lastID)
      } else {
        reject(error)
      }
    })
  })
}

function updateRepo (id, name, authorName, authorEmail) {
  return new Promise((resolve, reject) => {
    const updateStatements = []
    const params = { $id: id }

    if (name !== undefined) {
      updateStatements.push('name = $name')
      params.$name = name
    }
    if (authorName !== undefined) {
      updateStatements.push('author_name = $author_name')
      params.$author_name = authorName
    }
    if (authorEmail !== undefined) {
      updateStatements.push('author_email = $author_email')
      params.$author_email = authorEmail
    }

    if (updateStatements.length === 0) {
      resolve()
    }

    const updateStatement = updateStatements.join(', ')

    db.run(`
      UPDATE repo
      SET ${updateStatement}
      WHERE id = $id;
    `,
    params,
    function (error) {
      if (error === null) {
        resolve()
      } else {
        reject(error)
      }
    })
  })
}

function getAllRepos () {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM repo ORDER BY id;', function (error, rows) {
      if (error === null) {
        resolve(rows)
      } else {
        reject(error)
      }
    })
  })
}


module.exports = {
  db,
  setup,
  createRepo,
  updateRepo,
  getAllRepos
}
