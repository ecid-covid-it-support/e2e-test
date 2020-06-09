let defaultEducator = require('../../../fixtures/account/models/users/educators/educator.json')
let defaultChild01 = require('../../../fixtures/account/models/users/children/child01.json')
let defaultChildrenGroup = require('../../../fixtures/account/models/children-groups/group01.json')
let breakfast = require('../../../fixtures/quest/models/qfoodtracking/breakfast.json')
let snack = require('../../../fixtures/quest/models/qfoodtracking/snacks.json')
let lunch = require('../../../fixtures/quest/models/qfoodtracking/lunch.json')
let dinner = require('../../../fixtures/quest/models/qfoodtracking/dinner.json')
const cardSelector = require('../../../fixtures/ui/cards.selector')
const user = require('../../../fixtures/account/utils/account.resources')
const quest = require('../../../fixtures/quest/utils/quest.resources')

describe('Follow-Up', () => {
    const foodRecords = [breakfast, snack, lunch, dinner]
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

    it('When food records are saved', () => {
        prepareFoodRecords(foodRecords)

        foodRecords.forEach(record => {
            cy.createQuest(quest.QFoodtracking, record, accessTokenDefaultEducator)
        })

        cy.visit(Cypress.env('dashboard_uri'))
        cy.loginUI(defaultEducator)
        cy.checkChild(defaultChild01)
        cy.selectChild(defaultChild01)
        cy.selectCard(cardSelector.FOLLOW_UP)
        cy.checkNutritionGuide(foodRecords)
    })
})

function prepareFoodRecords(foodsRecord) {
    foodsRecord.forEach(record => {
        record.child_id = defaultChild01.username
        record.date = new Date().toLocalISOString()
    })
}

Date.prototype.toLocalISOString = function () {
    function pad(number) { return ('' + number).padStart(2, '0') }
    return `${this.getFullYear()}-${pad(this.getMonth() + 1)}-${pad(this.getDate())}T${pad(this.getHours())}:${pad(this.getMinutes())}:${pad(this.getSeconds())}.${pad(this.getTimezoneOffset())}Z`
}