const AccountDb = require('../fixtures/account/database/account.db')
const QuestDb = require('../fixtures/quest/database/quests.db')
const TrackingDb = require('../fixtures/tracking/database/tracking.db')
const MissionsDb = require('../fixtures/missions/database/missions.db')

const accountDBConnect = () => {
  return new Promise((resolve) => {
    AccountDb.connect().then(resolve(true))
  })
}

const trackingDBConnect = () => {
  return new Promise((resolve) => {
    TrackingDb.connect().then(resolve(true))
  })
}

const questDBConnect = () => {
  return new Promise((resolve) => {
    QuestDb.connect().then(resolve(true))
  })
}

const accountDBDispose = () => {
  return new Promise(resolve => {
    AccountDb.dispose().then(resolve(true))
  })
}

const trackingDBDispose = () => {
  return new Promise(resolve => {
    TrackingDb.dispose().then(resolve(true))
  })
}

const questDBDispose = () => {
  return new Promise(resolve => {
    QuestDb.dispose().then(resolve(true))
  })
}

const removeAccountDBCollections = () => {
  return new Promise((resolve) => {
    AccountDb.removeCollections()
      .then(response => resolve(response))
      .catch(error => resolve(error))
  })
}

const removeTrackingDBCollections = () => {
  return new Promise((resolve) => {
    TrackingDb.removeCollections()
      .then(response => resolve(response))
      .catch(error => resolve(error))
  })
}

const removeQuestDBCollections = () => {
  return new Promise((resolve) => {
    QuestDb.removeCollections()
      .then(response => resolve(response))
      .catch(error => resolve(error))
  })
}

const removeAllChildren = () => {
  return new Promise((resolve) => {
    AccountDb.deleteAllChildren()
      .then(response => resolve(response))
      .catch(error => resolve(error))
  })
}

const removeChildrenGroups = () => {
  return new Promise((resolve) => {
    AccountDb.deleteChildrenGroups()
      .then(response => resolve(response))
      .catch(error => resolve(error))
  })
}

const missionsDBConnect = () => {
  return new Promise((resolve) => {
    MissionsDb.connect().then(resolve(true))
  })
}

const missionsDBRestore = () => {
  return new Promise(resolve => {
    MissionsDb.restore().then(resolve(true))
  })
}

module.exports = on => {
  on('task', {
    accountDBConnect() {
      return accountDBConnect()
    }
  })
  on('task', {
    trackingDBConnect() {
      return trackingDBConnect()
    }
  })
  on('task', {
    questDBConnect() {
      return questDBConnect()
    }
  })
  on('task', {
    missionsDBConnect() {
      return missionsDBConnect()
    }
  })

  on('task', {
    accountDBDispose() {
      return accountDBDispose()
    }
  })
  on('task', {
    trackingDBDispose() {
      return trackingDBDispose()
    }
  })
  on('task', {
    questDBDispose() {
      return questDBDispose()
    }
  })
  on('task', {
    missionsDBRestore() {
      return missionsDBRestore()
    }
  })

  on('task', {
    cleanAccountDB() {
      return removeAccountDBCollections()
    }
  })
  on('task', {
    cleanTrackingDB() {
      return removeTrackingDBCollections()
    }
  })
  on('task', {
    cleanQuestDB() {
      return removeQuestDBCollections()
    }
  })

  on('task', {
    removeAllChildren() {
      return removeAllChildren()
    }
  })
  on('task', {
    removeChildrenGroups() {
      return removeChildrenGroups()
    }
  })
}