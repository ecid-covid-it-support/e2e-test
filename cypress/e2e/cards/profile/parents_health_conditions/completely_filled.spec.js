let defaultFamily = require('../../../../fixtures/account/models/users/family/family.json')
let defaultChild01 = require('../../../../fixtures/account/models/users/children/child01.json')
let completeQ22 = require('../../../../fixtures/quest/models/q22/q22.json')
const cardSelector = require('../../../../fixtures/ui/cards.selector')
const questDescription = require('../../../../fixtures/ui/quest.description')
const user = require('../../../../fixtures/account/utils/account.resources')
const quest = require('../../../../fixtures/quest/utils/quest.resources')

describe('Q22ParentsHealthConditions', () => {
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
            defaultChild01.institution_id = institution.id
        })
        cy.createUser(user.CHILD, defaultChild01, state).then(child => {
            defaultChild01.id = child.id
            defaultFamily.children.push(child.id)
        })
        cy.createUser(user.FAMILY, defaultFamily, state)
            .then(family => defaultFamily.id = family.id)

        cy.auth(defaultFamily.username, defaultFamily.password)
            .then(accessToken => accessTokenDefaultFamily = accessToken)
    })

    after(() => {
        cy.task('cleanAccountDB')
        cy.task('cleanQuestDB')
        cy.task('accountDBDispose')
        cy.task('questDBDispose')
    })

    it('When Q22ParentsHealthConditions was completely filled', () => {
        completeQ22.child_id = defaultChild01.username
        cy.createQuest(quest.Q22ParentsHealthConditions, completeQ22, accessTokenDefaultFamily)

        cy.visit(Cypress.env('dashboard_uri'))
        cy.loginUI(defaultFamily)
        cy.familyFirstLogin(defaultFamily)
        cy.checkNumberOfIncompleteQuestOnTheCard(cardSelector.PROFILE, 2)
        cy.selectCard(cardSelector.PROFILE)
        cy.checkQ22Status('Complete')
        cy.selectQuest(questDescription.PARENTS_HEALTH_CONDITIONS)
        cy.checkQ22ParentsHealthConditions(completeQ22)
    })
})