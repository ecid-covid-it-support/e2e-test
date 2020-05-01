let defaultEducator = require('../../../../fixtures/account/models/users/educators/educator.json')
let defaultChild01 = require('../../../../fixtures/account/models/users/children/child01.json')
let defaultChild02 = require('../../../../fixtures/account/models/users/children/child02.json')
let defaultChildrenGroup = require('../../../../fixtures/account/models/children-groups/group01.json')
let completeQ502 = require('../../../../fixtures/quest/models/q502/q502.json')
let incompleteQ502 = require('../../../../fixtures/quest/models/q502/incompleteQ502.json')
const cardSelector = require('../../../../fixtures/ui/cards.selector')
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

        it('When Q502PhysicalActivityandSedentaryHabits was completely filled', () => {
            completeQ502.child_id = defaultChild01.username
            cy.createQuest(questResource.Q502PhysicalActivityandSedentaryHabits, completeQ502, accessTokenDefaultEducator)

            cy.visit(Cypress.env('dashboard_uri'))
            cy.loginUI(defaultEducator)
            cy.checkChild(defaultChild01)
            cy.selectChild(defaultChild01)
            cy.checkNumberOfIncompleteQuestOnTheCard(cardSelector.ACTIVITY, 2)
            cy.selectCard(cardSelector.ACTIVITY)
            cy.checkQ502Status('Completo')
            cy.selectQuest(questDescription.PHYSICAL_HABITS)
            cy.checkPhysicalHabitsQuest(completeQ502)
        })

        it('When updating Q502PhysicalActivityandSedentaryHabits filling it completely', () => {
            const newQ502 = { ...incompleteQ502 }
            newQ502.child_id = defaultChild01.username
            cy.createQuest(questResource.Q502PhysicalActivityandSedentaryHabits, newQ502, accessTokenDefaultEducator)

            newQ502.transport_to_school = '6' // outro*
            newQ502.another_way_expl = 'helicopter'

            newQ502.screen_time_schooldays = '2'
            newQ502.screen_time_weekends = '3'
            newQ502.mobilephone_time_schooldays = '4'
            newQ502.mobilephone_time_weekends = '6'
            newQ502.percentage = 'true, true, true'
            newQ502.state = 'Complete'

            cy.updateQuest(questResource.Q502PhysicalActivityandSedentaryHabits, newQ502, accessTokenDefaultEducator)

            cy.visit(Cypress.env('dashboard_uri'))
            cy.loginUI(defaultEducator)
            cy.checkChild(defaultChild01)
            cy.selectChild(defaultChild01)
            cy.checkNumberOfIncompleteQuestOnTheCard(cardSelector.ACTIVITY, 2)
            cy.selectCard(cardSelector.ACTIVITY)
            cy.checkQ502Status('Completo')
            cy.selectQuest(questDescription.PHYSICAL_HABITS)
            cy.checkPhysicalHabitsQuest(newQ502)
        })

        it('When only 67% of the Q502PhysicalActivityandSedentaryHabits was filled', () => {
            incompleteQ502.child_id = defaultChild01.username
            cy.createQuest(questResource.Q502PhysicalActivityandSedentaryHabits, incompleteQ502, accessTokenDefaultEducator)

            cy.visit(Cypress.env('dashboard_uri'))
            cy.loginUI(defaultEducator)
            cy.checkChild(defaultChild01)
            cy.selectChild(defaultChild01)
            cy.checkNumberOfIncompleteQuestOnTheCard(cardSelector.ACTIVITY, 3)
            cy.selectCard(cardSelector.ACTIVITY)
            cy.checkQ502Status('Incompleto 67%')
            cy.selectQuest(questDescription.PHYSICAL_HABITS)
            cy.checkPhysicalHabitsQuestIncomplete(incompleteQ502)
        })
    })
})