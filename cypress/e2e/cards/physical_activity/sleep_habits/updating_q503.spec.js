let defaultEducator = require('../../../../fixtures/account/models/users/educators/educator.json')
let defaultChild01 = require('../../../../fixtures/account/models/users/children/child01.json')
let defaultChildrenGroup = require('../../../../fixtures/account/models/children-groups/group01.json')
let emptyQ503 = require('../../../../fixtures/quest/models/q503/emptyQ503.json')
const cardSelector = require('../../../../fixtures/ui/cards.selector')
const questDescription = require('../../../../fixtures/ui/quest.description')
const questResource = require('../../../../fixtures/quest/utils/quest.resources')

describe('Q503SleepingHabits', () => {
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
        cy.createEducator(defaultEducator, state).then(educador => defaultEducator.id = educador.id)
        cy.createChild(defaultChild01, state).then(child => {
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

    it('When updating Q503SleepingHabits filling it completely', () => {
        emptyQ503.child_id = defaultChild01.username
        emptyQ503.time_sleep = '5'
        cy.createQuest(questResource.Q503SleepingHabits, emptyQ503, accessTokenDefaultEducator)

        const updatedQ503 = fillingQ503({ ...emptyQ503 })
        cy.updateQuest(questResource.Q503SleepingHabits, updatedQ503, accessTokenDefaultEducator)

        cy.visit(Cypress.env('dashboard_uri'))
        cy.loginUI(defaultEducator)
        cy.checkChild(defaultChild01)
        cy.selectChild(defaultChild01)
        cy.checkNumberOfIncompleteQuestOnTheCard(cardSelector.ACTIVITY, 2)
        cy.selectCard(cardSelector.ACTIVITY)
        cy.checkQ503Status('Complete')
        cy.selectQuest(questDescription.SLEEP_HABITS)
        cy.checkSleepHabitsQuest(updatedQ503)
    })
})

async function fillingQ503(q503) {
    q503.time_wake_up = '4'
    q503.time_nap = '1'
    q503.percentage = 'true'
    q503.state = 'Complete'
    return q503
}