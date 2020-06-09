let defaultEducator = require('../../../../fixtures/account/models/users/educators/educator.json')
let defaultChild01 = require('../../../../fixtures/account/models/users/children/child01.json')
let defaultChild02 = require('../../../../fixtures/account/models/users/children/child02.json')
let defaultChildrenGroup = require('../../../../fixtures/account/models/children-groups/group01.json')
let incompleteQ502 = require('../../../../fixtures/quest/models/q502/incompleteQ502.json')
const cardSelector = require('../../../../fixtures/ui/cards.selector')
const questDescription = require('../../../../fixtures/ui/quest.description')
const user = require('../../../../fixtures/account/utils/account.resources')
const quest = require('../../../../fixtures/quest/utils/quest.resources')

describe('Q502PhysicalActivityandSedentaryHabits', () => {
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
        cy.createUser(user.EDUCATOR, defaultEducator, state)
            .then(educador => defaultEducator.id = educador.id)

        cy.createUser(user.CHILD, defaultChild01, state).then(child => {
            defaultChild01.id = child.id
            defaultChildrenGroup.children.push(child.id)
        })
        cy.createUser(user.CHILD, defaultChild02, state).then(child => {
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

    it('When updating Q502PhysicalActivityandSedentaryHabits filling it completely', () => {
        incompleteQ502.child_id = defaultChild01.username
        cy.createQuest(quest.Q502PhysicalActivityandSedentaryHabits,
            incompleteQ502, accessTokenDefaultEducator)
            .then(q502Created => incompleteQ502.id = q502Created.id)

        completeQ502Fields(incompleteQ502)
        cy.updateQuest(quest.Q502PhysicalActivityandSedentaryHabits, incompleteQ502, accessTokenDefaultEducator)

        cy.visit(Cypress.env('dashboard_uri'))
        cy.loginUI(defaultEducator)
        cy.checkChild(defaultChild01)
        cy.selectChild(defaultChild01)
        cy.checkNumberOfIncompleteQuestOnTheCard(cardSelector.ACTIVITY, 2)
        cy.selectCard(cardSelector.ACTIVITY)
        cy.checkQ502Status('Complete')
        cy.selectQuest(questDescription.PHYSICAL_HABITS)
        cy.checkPhysicalHabitsQuest(incompleteQ502)
    })
})

function completeQ502Fields(q502) {
    q502.transport_to_school = '6' // outro*
    q502.another_way_expl = 'helicopter'

    q502.parents_sport = '2'
    q502.screen_time_schooldays = '2'
    q502.screen_time_weekends = '3'
    q502.mobile_phone = '1'
    q502.mobilephone_time_schooldays = '4'
    q502.mobilephone_time_weekends = '6'
    q502.percentage = 'true, true, true'
    q502.state = 'Complete'

    return q502
}