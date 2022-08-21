'use strict'

import { app, BrowserWindow, ipcMain } from 'electron'
import { knex } from 'knex'
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}
let dbPath = require('path').join(__dirname, '/database.sqlite')
if (process.env.NODE_ENV !== 'development') {
  dbPath = app.getPath('userData') + '/database.sqlite'
}
const _knex = knex({
  client: 'sqlite3',
  connection: {
    filename: dbPath
  }
})
let mainWindow

// eslint-disable-next-line node/no-path-concat
const winURL = process.env.NODE_ENV === 'development' ? 'http://localhost:9080' : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    // useContentSize: true,
    width: 100,
    // fullscreen: true,
    webPreferences: {
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      enableRemoteModule: true
    }
  })

  mainWindow.maximize()
  mainWindow.loadURL(winURL)
  mainWindow.removeMenu()

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

function initDB () {
  console.log('create tables')

  _knex.schema.hasTable('studies').then(function (exists) {
    if (!exists) {
      return _knex.schema.createTable('studies', function (t) {
        t.increments()
        t.string('uid')
        t.string('name')
        t.timestamps()
      })
    }
  })

  _knex.schema.hasTable('study_chapter').then(function (exists) {
    if (!exists) {
      return _knex.schema.createTable('study_chapter', function (t) {
        t.increments()
        t.string('uid')
        t.string('studyId')
        t.string('name')
        t.string('fen')
        t.timestamps()
      })
    }
  })
}
app.on('ready', () => {
  createWindow()
  initDB()
  console.log('app ready')

  // send all study list
  ipcMain.on('allstudyLoad', function () {
    const result = _knex.select('*').from('studies')
    result.then(function (rows) {
      mainWindow.webContents.send('getAllStudy', rows)
    })
  })

  // add study to db
  ipcMain.on('addStudy', function (event, newStudy) {
    console.log(newStudy)
    const result = _knex('studies').insert(newStudy)
    result.then(function (ret) {
      console.log('addStudy', ret)
      const result2 = _knex.select('*').from('studies')
      result2.then(function (rows) {
        mainWindow.webContents.send('getAllStudy', rows)
      })
    })
  })

  // get chapter list for study
  ipcMain.on('loadStudyChapterList', function (event, _studyId) {
    const result = _knex.select('*').from('study_chapter').where({ studyId: _studyId })
    result.then(function (rows) {
      mainWindow.webContents.send('getStudyChapterList', rows)
    })
  })

  // add chapter to db
  ipcMain.on('addStudyChapter', function (event, newStudy) {
    console.log(newStudy)
    const _studyId = newStudy.studyId
    const result = _knex('study_chapter').insert(newStudy)
    result.then(function (ret) {
      console.log('addStudyChapter', ret)
      const result2 = _knex.select('*').from('study_chapter').where({ studyId: _studyId })
      result2.then(function (rows) {
        mainWindow.webContents.send('getStudyChapterList', rows)
      })
    })
  })

  // delete chapter from db
  ipcMain.on('deleteStudyChapter', function (event, payload) {
    const chapterId = payload.uid
    const studyId = payload.studyId
    const result = _knex('study_chapter').where('uid', chapterId).del()
    result.then(function (ret) {
      const result = _knex.select('*').from('study_chapter').where({ studyId: studyId })
      result.then(function (rows) {
        mainWindow.webContents.send('getStudyChapterList', rows)
      })
    })
  })
}
)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
