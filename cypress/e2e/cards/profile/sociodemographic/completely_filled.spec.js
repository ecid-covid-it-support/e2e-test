let defaultFamily = require('../../../../fixtures/account/models/users/family/family.json')
let defaultChild01 = require('../../../../fixtures/account/models/users/children/child01.json')
let completeQ1SocioDemographic = require('../../../../fixtures/quest/models/q1sociodemographic/q1SocioDemographic.json')
const cardSelector = require('../../../../fixtures/ui/cards.selector')
const questDescription = require('../../../../fixtures/ui/quest.description')
const user = require('../../../../fixtures/account/utils/account.resources')
const quest = require('../../../../fixtures/quest/utils/quest.resources')

describe('Q1SocioDemographic', () => {
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

    it('When Q1SocioDemographic was completely filled', () => {
        completeQ1SocioDemographic.child_id = defaultChild01.username
        completeQ1SocioDemographic.child_age = Math.floor(defaultChild01.age)
        completeQ1SocioDemographic.ages_household_members.push(Math.floor(defaultChild01.age))
        completeQ1SocioDemographic.number_of_household_members = completeQ1SocioDemographic.ages_household_members.length
        cy.createQuest(quest.Q1SocioDemographic, completeQ1SocioDemographic, accessTokenDefaultFamily)

        cy.visit(Cypress.env('dashboard_uri'))
        cy.loginUI(defaultFamily)
        cy.familyFirstLogin(defaultFamily)
        cy.checkNumberOfIncompleteQuestOnTheCard(cardSelector.PROFILE, 2)
        cy.selectCard(cardSelector.PROFILE)
        cy.checkQ1SocioDemographicStatus('Complete')
        cy.selectQuest(questDescription.SOCIO_DEMOGRAPHICS)
        cy.checkQ1SocioDemographicQuest(completeQ1SocioDemographic)
    })
})