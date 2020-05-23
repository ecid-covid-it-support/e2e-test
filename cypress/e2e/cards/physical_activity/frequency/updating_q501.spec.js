let defaultEducator = require('../../../../fixtures/account/models/users/educators/educator.json')
let defaultChild01 = require('../../../../fixtures/account/models/users/children/child01.json')
let defaultChild02 = require('../../../../fixtures/account/models/users/children/child02.json')
let defaultChildrenGroup = require('../../../../fixtures/account/models/children-groups/group01.json')
let completeQ501 = require('../../../../fixtures/quest/models/q501/q501.json')
const cardSelector = require('../../../../fixtures/ui/cards.selector')
const questDescription = require('../../../../fixtures/ui/quest.description')
const questResource = require('../../../../fixtures/quest/utils/quest.resources')

describe('Q501PhysicalActivityForChildren', () => {
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
            defaultChild02.institution_id = institution.id
        })
        cy.createEducator(defaultEducator, state).then(educador => defaultEducator.id = educador.id)
        cy.createChild(defaultChild01, state).then(child => {
            defaultChild01.id = child.id
            defaultChildrenGroup.children.push(child.id)
        })
        cy.createChild(defaultChild02, state).then(child => {
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

    it('When updating Q501PhysicalActivityForChildren filling it completely', () => {
        completeQ501.child_id = defaultChild01.username
        cy.createQuest(questResource.Q501PhysicalActivityForChildren, completeQ501, accessTokenDefaultEducator)

        const updatedQ501 = { ...completeQ501 }
        updatedQ501.paqc_10 = '2' // child was not sick
        cy.updateQuest(questResource.Q501PhysicalActivityForChildren, updatedQ501, accessTokenDefaultEducator)

        cy.visit(Cypress.env('dashboard_uri'))
        cy.loginUI(defaultEducator)
        cy.checkChild(defaultChild01)
        cy.selectChild(defaultChild01)
        cy.checkNumberOfIncompleteQuestOnTheCard(cardSelector.ACTIVITY, 2)
        cy.selectCard(cardSelector.ACTIVITY)
        cy.checkQ501Status('Complete')
        cy.selectQuest(questDescription.ACTIVITY_FREQUENCY)
        cy.checkActivityFrequencyQuest(updatedQ501)
    })
})