import '../../../fixtures/utils/date.utils'
let defaultEducator = require('../../../fixtures/account/models/users/educators/educator.json')
let defaultChild01 = require('../../../fixtures/account/models/users/children/child01.json')
let defaultChildrenGroup = require('../../../fixtures/account/models/children-groups/group01.json')
let sleep = require('../../../fixtures/tracking/models/sleep/sleep.json')
const cardSelector = require('../../../fixtures/ui/cards.selector')
const user = require('../../../fixtures/account/utils/account.resources')
const tracking = require('../../../fixtures/tracking/utils/tracking.resources')

describe('Follow-Up', () => {
    let state = {}
    let accessTokenDefaultEducator = null

    before(() => {
        cy.task('accountDBConnect')
        cy.task('questDBConnect')
        cy.task('cleanAccountDB')
        cy.task('cleanQuestDB')

        cy.auth('admin', 'admin123').then(accessToken => state.accessTokenAdmin = accessToken)
        cy.createInstitution(state).then(institution => {
            defaultEducator.institution_id = institution.id
            defaultChild01.institution_id = institution.id
        })
        cy.createUser(user.EDUCATOR, defaultEducator, state)
            .then(educador => defaultEducator.id = educador.id)

        cy.createUser(user.CHILD, defaultChild01, state).then(child => {
            defaultChild01.id = child.id
            defaultChildrenGroup.children.push(child.id)
        })
        cy.registerGroupFromEducador(defaultEducator, defaultChildrenGroup)

        cy.auth(defaultEducator.username, defaultEducator.password)
            .then(accessToken => accessTokenDefaultEducator = accessToken)
    })

    after(() => {
        cy.task('cleanAccountDB')
        cy.task('cleanQuestDB')
        cy.task('accountDBDispose')
        cy.task('questDBDispose')
    })

    it('When sleep records are saved', () => {
        prepareSleep(sleep)
        cy.createTrackingResource(tracking.Sleep, defaultChild01.id, sleep, accessTokenDefaultEducator)

        cy.visit(Cypress.env('dashboard_uri'))
        cy.loginUI(defaultEducator)
        cy.checkChild(defaultChild01)
        cy.selectChild(defaultChild01)
        cy.selectCard(cardSelector.FOLLOW_UP)
        cy.selectFollowUpGuide(3) //Sleep
        cy.checkDailySleep(getResultArray(sleep))
    })
})

function prepareSleep(sleep) {
    const currentDate = new Date()
    sleep.start_time = currentDate.toLocalISOString()

    const newDate = new Date()
    newDate.setMilliseconds(currentDate.getMilliseconds() + sleep.duration)

    sleep.end_time = newDate.toLocalISOString()
}

function getResultArray(sleep) {
    const results = [
        getSum(sleep, 'awake'),
        getSum(sleep, 'restless'),
        getSum(sleep, 'asleep'),
        getFormattedTime(sleep),
        msToHoursAndMinutes(sleep.duration)
    ]

    return results
}

function getSum(sleep, name) {
    let sum = 0
    sleep.pattern.data_set.forEach(record => {
        if (record.name === name) sum += record.duration
    })

    return msToHoursAndMinutes(sum)
}

function getFormattedTime(sleep) {
    const start_time = sleep.start_time.substring(11, 16),
        end_time = sleep.end_time.substring(11, 16)

    const start = start_time.substring(0, 2)
    const end = end_time.substring(0, 2)

    return `${start_time} ${start < 12 ? 'AM' : 'PM'}-${end_time} ${end < 12 ? 'AM' : 'PM'}`
}

function msToHoursAndMinutes(msDuration) {
    let seconds = Math.floor((msDuration / 1000) % 60),
        hours = Math.floor((msDuration / (1000 * 60 * 60)) % 24),
        minutes = (seconds <= 30) ?
            Math.floor((msDuration / (1000 * 60)) % 60)
            : Math.ceil((msDuration / (1000 * 60)) % 60)

    hours = (hours < 10) ? "0" + hours : hours
    minutes = (minutes < 10) ? "0" + minutes : minutes

    return { hours, minutes }
}