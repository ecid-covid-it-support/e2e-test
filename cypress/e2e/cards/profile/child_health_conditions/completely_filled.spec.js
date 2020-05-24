let defaultFamily = require('../../../../fixtures/account/models/users/family/family.json')
let defaultChild02 = require('../../../../fixtures/account/models/users/children/child02.json')
let completeQ21 = require('../../../../fixtures/quest/models/q21/q21.json')
const cardSelector = require('../../../../fixtures/ui/cards.selector')
const questDescription = require('../../../../fixtures/ui/quest.description')
const questResource = require('../../../../fixtures/quest/utils/quest.resources')

describe('Q21ChildHealthConditions', () => {
    let state = {}
    let accessTokenDefaultFamily = null

    before(() => {
        cy.task('accountDBConnect')
        cy.task('questDBConnect')
        cy.task('cleanAccountDB')
        cy.task('cleanQuestDB')

        cy.auth('admin', 'admin123').then(accessToken => state.accessTokenAdmin = accessToken)
        cy.createInstitution(state).then(institution => {
            defaultFamily.institution_id = institution.id
            defaultChild02.institution_id = institution.id
        })
        cy.createChild(defaultChild02, state).then(child => {
            defaultChild02.id = child.id
            defaultFamily.children.push(child.id)
        })
        cy.createFamily(defaultFamily, state).then(family => defaultFamily.id = family.id)
        cy.auth(defaultFamily.username, defaultFamily.password)
            .then(accessToken => accessTokenDefaultFamily = accessToken)
    })

    after(() => {
        cy.task('cleanAccountDB')
        cy.task('cleanQuestDB')
        cy.task('accountDBDispose')
        cy.task('questDBDispose')
    })

    it('When Q21ChildHealthConditions was completely filled', () => {
        completeQ21.child_id = defaultChild02.username
        cy.createQuest(questResource.Q21ChildHealthConditions, completeQ21, accessTokenDefaultFamily)

        cy.visit(Cypress.env('dashboard_uri'))
        cy.loginUI(defaultFamily)
        cy.familyFirstLogin(defaultFamily)
        cy.checkNumberOfIncompleteQuestOnTheCard(cardSelector.PROFILE, 2)
        cy.selectCard(cardSelector.PROFILE)
        cy.checkQ21Status('Complete')
        cy.selectQuest(questDescription.CHILD_HEALTH_CONDITIONS)
        cy.checkQ21ChildHealthConditions(completeQ21)
    })
})