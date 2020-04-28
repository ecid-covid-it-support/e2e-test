let defaultEducator = require('../../../../fixtures/account/models/users/educators/educator.json')
let defaultChild01 = require('../../../../fixtures/account/models/users/children/child01.json')
let defaultChild02 = require('../../../../fixtures/account/models/users/children/child02.json')
let defaultChildrenGroup = require('../../../../fixtures/account/models/children-groups/group01.json')
let defaultQ501 = require('../../../../fixtures/quest/models/q501/q501.json')
let incompleteQ501 = require('../../../../fixtures/quest/models/q501/incompleteQ501.json')
const card = require('../../../../fixtures/ui/cards.title')
const questDescription = require('../../../../fixtures/ui/quest.description')

describe('Q501PhysicalActivityForChildren', () => {
    let state = {}

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
    })

    after(() => {
        cy.task('cleanAccountDB')
        cy.task('cleanQuestDB')
        cy.task('accountDBDispose')
        cy.task('questDBDispose')
    })

    describe('Test cases: ', () => {
        let accessTokenDefaultEducator
        before(() => {
            cy.auth(defaultEducator.username, defaultEducator.password)
                .then(accessToken => accessTokenDefaultEducator = accessToken)
        })

        afterEach(() => {
            cy.task('cleanQuestDB')
        })

        it('Saving a fully answered Q501PhysicalActivityForChildren', () => {
            defaultQ501.child_id = defaultChild01.username
            cy.createQ501(defaultQ501, accessTokenDefaultEducator)
            cy.visit(Cypress.env('dashboard_uri'))
            cy.loginUI(defaultEducator)
            cy.checkChild(defaultChild01).click()
            cy.selectCard(card.ACTIVITY)
            cy.selectQuest(questDescription.ACTIVITY_FREQUENCY)
            cy.checkActivityFrequencyQuest(defaultQ501)
        })

        it('When updating some fields in the Q501PhysicalActivityForChildren', () => {
            defaultQ501.child_id = defaultChild01.username
            cy.createQ501(defaultQ501, accessTokenDefaultEducator)

            defaultQ501.paqc_10 = '2' // child was not sick
            cy.updateQ501(defaultQ501, accessTokenDefaultEducator)

            cy.visit(Cypress.env('dashboard_uri'))
            cy.loginUI(defaultEducator)
            cy.checkChild(defaultChild01).click()
            cy.selectCard(card.ACTIVITY)
            cy.selectQuest(questDescription.ACTIVITY_FREQUENCY)
            cy.checkActivityFrequencyQuest(defaultQ501)
        })

        it('When filling only 25% of the Q501PhysicalActivityForChildren', () => {
            incompleteQ501.child_id = defaultChild01.username
            cy.createQ501(incompleteQ501, accessTokenDefaultEducator)
            cy.visit(Cypress.env('dashboard_uri'))
            cy.loginUI(defaultEducator)
            cy.checkChild(defaultChild01).click()
            cy.selectCard(card.ACTIVITY)
            cy.selectQuest(questDescription.ACTIVITY_FREQUENCY)
            cy.checkActivityFrequencyQuestIncomplete(incompleteQ501)
        })
    })
})