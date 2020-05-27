let defaultEducator = require('../../../../fixtures/account/models/users/educators/educator.json')
let defaultChild01 = require('../../../../fixtures/account/models/users/children/child01.json')
let defaultChildrenGroup = require('../../../../fixtures/account/models/children-groups/group01.json')
let completeQ401 = require('../../../../fixtures/quest/models/q401/q401.json')
const cardSelector = require('../../../../fixtures/ui/cards.selector')
const questDescription = require('../../../../fixtures/ui/quest.description')
const questResource = require('../../../../fixtures/quest/utils/quest.resources')

describe('Q401FoodFrequency', () => {
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

    it('When Q401FoodFrequency was completely filled', () => {
        completeQ401.child_id = defaultChild01.username
        cy.createQuest(questResource.Q401FoodFrequency, completeQ401, accessTokenDefaultEducator)

        cy.visit(Cypress.env('dashboard_uri'))
        cy.loginUI(defaultEducator)
        cy.checkChild(defaultChild01)
        cy.selectChild(defaultChild01)
        cy.checkNumberOfIncompleteQuestOnTheCard(cardSelector.FOOD_INTAKE, 2)
        cy.selectCard(cardSelector.FOOD_INTAKE)
        cy.checkQ401FoodFrequencyStatus('Complete')
        cy.selectQuest(questDescription.FOOD_FREQUENCY)
        cy.checkQ401FoodFrequencyQuest(completeQ401)
    })
})