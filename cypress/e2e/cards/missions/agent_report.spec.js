import '../../../fixtures/utils/date.utils'
let defaultFamily = require('../../../fixtures/account/models/users/family/family.json')
let defaultChild01 = require('../../../fixtures/account/models/users/children/child01.json')
let observation = require('../../../fixtures/missions/models/observation.json')
const cardSelector = require('../../../fixtures/ui/cards.selector')
const user = require('../../../fixtures/account/utils/account.resources')

describe('Missions', () => {
    let state = {}
    let accessTokenDefaultFamily = null

    before(() => {
        cy.task('accountDBConnect')
        cy.task('missionsDBConnect')
        cy.task('cleanAccountDB')
        cy.task('missionsDBRestore')

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
        cy.task('missionsDBRestore')
        cy.task('accountDBDispose')
    })

    it('When Agent Report was registered', () => {
        const observations = []
        cy.getWeekQuestionnaires(defaultChild01.id, accessTokenDefaultFamily)
            .then(response => {
                response.data.forEach(question => {
                    const ob = { ...observation }

                    ob.measurement = question.questionnaireId
                    ob.measurementType = getType(question.questionnaireId)
                    ob.observationDate = new Date().toLocalISOString()
                    ob.userFhirId = defaultFamily.id
                    ob.value = 'A'.concat(`${Math.floor(Math.random() * question.options.length + 1)}`)

                    observations.push(ob)
                    cy.answerQuestion(ob, defaultChild01.id, accessTokenDefaultFamily)
                })
            })

        cy.visit(Cypress.env('dashboard_uri'))
        cy.loginUI(defaultFamily)
        cy.familyFirstLogin(defaultFamily)
        cy.selectCard(cardSelector.MISSIONS)
        cy.checkAgentReport(observations)
    })
})

function getType(option) {
    switch (option.charAt(0)) {
        case 'D':
            return 'Diet'
        case 'E':
            return 'Education'
        case 'A':
            return 'Activity'
    }
}