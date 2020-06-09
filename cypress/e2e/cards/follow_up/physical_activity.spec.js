import '../../../fixtures/utils/date.utils'
let defaultEducator = require('../../../fixtures/account/models/users/educators/educator.json')
let defaultChild01 = require('../../../fixtures/account/models/users/children/child01.json')
let defaultChildrenGroup = require('../../../fixtures/account/models/children-groups/group01.json')
let resource = require('../../../fixtures/tracking/models/logs/resource_names')
const cardSelector = require('../../../fixtures/ui/cards.selector')
const user = require('../../../fixtures/account/utils/account.resources')

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

    it('When activities records are saved', () => {
        const steps = generateLogs(resource.STEPS)
        const calories = generateLogs(resource.CALORIES)
        const active_minutes = generateLogs(resource.ACTIVE_MINUTES)
        const lightly = generateLogs(resource.LIGHTLY_ACTIVE_MINUTES)
        const sedentary = generateLogs(resource.SEDENTARY_MINUTES)

        cy.createChildLogs(steps, defaultChild01.id, resource.STEPS, accessTokenDefaultEducator)
        cy.createChildLogs(calories, defaultChild01.id, resource.CALORIES, accessTokenDefaultEducator)
        cy.createChildLogs(active_minutes, defaultChild01.id, resource.ACTIVE_MINUTES, accessTokenDefaultEducator)
        cy.createChildLogs(lightly, defaultChild01.id, resource.LIGHTLY_ACTIVE_MINUTES, accessTokenDefaultEducator)
        cy.createChildLogs(sedentary, defaultChild01.id, resource.SEDENTARY_MINUTES, accessTokenDefaultEducator)

        const resultsArray = [
            getHoursAndMinutes(getSum(active_minutes)),
            getSum(steps),
            getSum(calories),
            getHoursAndMinutes(getSum(sedentary)),
        ]

        cy.visit(Cypress.env('dashboard_uri'))
        cy.loginUI(defaultEducator)
        cy.checkChild(defaultChild01)
        cy.selectChild(defaultChild01)
        cy.selectCard(cardSelector.FOLLOW_UP)
        cy.selectFollowUpGuide(2) //Physical Activity
        cy.get('mat-button-toggle').eq(2).click() // Month
        cy.checkMonthlyLogs(resultsArray)
    })
})

function generateLogs(resource) {
    const amountLogs = 5
    const newLog = []
    const currentDate = new Date()
    const limits = getBoundaryLimits()

    for (let i = 0; i < amountLogs; i++) {
        let newDate = new Date()
        let obj = {}

        newDate.setDate(currentDate.getDate() + i)
        obj.date = newDate.toLocalISOString().substring(0, 10)
        obj.value = Math.floor(Math.random() * limits.get(resource))

        newLog.push(obj)
    }

    return newLog
}

function getBoundaryLimits() {
    const map = new Map()

    map.set(resource.STEPS, 1501)
    map.set(resource.CALORIES, 601)
    map.set(resource.ACTIVE_MINUTES, 201)
    map.set(resource.LIGHTLY_ACTIVE_MINUTES, 201)
    map.set(resource.SEDENTARY_MINUTES, 301)

    return map
}

function getHoursAndMinutes(timeInMinutes) {
    const hours = parseInt(timeInMinutes / 60)
    const minutes = timeInMinutes % 60

    return { hours, minutes }
}

function getSum(logs) {
    return logs.reduce((sum, logs) => { return sum + logs.value }, 0)
}