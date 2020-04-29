let defaultEducator = require('../../../../fixtures/account/models/users/educators/educator.json')
let defaultChild01 = require('../../../../fixtures/account/models/users/children/child01.json')
let defaultChild02 = require('../../../../fixtures/account/models/users/children/child02.json')
let defaultChildrenGroup = require('../../../../fixtures/account/models/children-groups/group01.json')
let defaultQ502 = require('../../../../fixtures/quest/models/q502/q502.json')
let incompleteQ502 = require('../../../../fixtures/quest/models/q502/incompleteQ502.json')
const card = require('../../../../fixtures/ui/cards.title')
const questDescription = require('../../../../fixtures/ui/quest.description')
const questResource = require('../../../../fixtures/quest/utils/quest.resources')

describe('Q502PhysicalActivityandSedentaryHabits', () => {
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

        it('Saving a fully answered Q502PhysicalActivityandSedentaryHabits', () => {
            defaultQ502.child_id = defaultChild01.username
            cy.createQuest(questResource.Q502PhysicalActivityandSedentaryHabits, defaultQ502, accessTokenDefaultEducator)
            cy.visit(Cypress.env('dashboard_uri'))
            cy.loginUI(defaultEducator)
            cy.checkChild(defaultChild01)
            cy.selectChild(defaultChild01)
            cy.selectCard(card.ACTIVITY)
            cy.selectQuest(questDescription.PHYSICAL_HABITS)
            cy.checkPhysicalHabitsQuest(defaultQ502)
        })

        // it('When updating some fields in the Q502PhysicalActivityandSedentaryHabits', () => {
        //     defaultQ502.child_id = defaultChild01.username
        //     cy.createQuest(questResource.Q502PhysicalActivityandSedentaryHabits, defaultQ502, accessTokenDefaultEducator)

        //     defaultQ502.paqc_10 = '2' // child was not sick
        //     cy.updateQuest(questResource.Q502PhysicalActivityandSedentaryHabits, defaultQ502, accessTokenDefaultEducator)

        //     cy.visit(Cypress.env('dashboard_uri'))
        //     cy.loginUI(defaultEducator)
        //     cy.checkChild(defaultChild01).click()
        //     cy.selectCard(card.ACTIVITY)
        //     cy.selectQuest(questDescription.PHYSICAL_HABITS)

        //     cy.checkActivityFrequencyQuest(defaultQ502)
        // })

        // it('When filling only 25% of the Q502PhysicalActivityandSedentaryHabits', () => {
        //     incompleteQ502.child_id = defaultChild01.username
        //     cy.createQuest(questResource.Q502PhysicalActivityandSedentaryHabits, incompleteQ502, accessTokenDefaultEducator)
        //     cy.visit(Cypress.env('dashboard_uri'))
        //     cy.loginUI(defaultEducator)
        //     cy.checkChild(defaultChild01).click()
        //     cy.selectCard(card.ACTIVITY)
        //     cy.selectQuest(questDescription.PHYSICAL_HABITS)

        //     cy.checkActivityFrequencyQuestIncomplete(incompleteQ502)
        // })
    })
})