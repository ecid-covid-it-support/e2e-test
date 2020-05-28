let defaultEducator = require('../../fixtures/account/models/users/educators/educator.json')
let defaultChild01 = require('../../fixtures/account/models/users/children/child01.json')
let childrenArray = require('../../fixtures/account/models/users/children/children.json')
let defaultChildrenGroup = require('../../fixtures/account/models/children-groups/group01.json')
const user = require('../../fixtures/account/utils/account.resources')

describe('Selection of Children', () => {
    let state = {}
    let accessTokenDefaultEducator = null

    before(() => {
        cy.task('accountDBConnect')
        cy.task('questDBConnect')
        cy.task('cleanAccountDB')
        cy.task('cleanQuestDB')

        cy.auth('admin', 'admin123').then(accessToken => state.accessTokenAdmin = accessToken)
        cy.createInstitution(state).then(institution => {
            state.institution_id = institution.id
            defaultEducator.institution_id = institution.id
            defaultChild01.institution_id = institution.id
        })
        cy.createUser(user.EDUCATOR, defaultEducator, state)
            .then(educador => defaultEducator.id = educador.id)

        cy.auth(defaultEducator.username, defaultEducator.password)
            .then(accessToken => accessTokenDefaultEducator = accessToken)
    })

    after(() => {
        cy.task('cleanAccountDB')
        cy.task('cleanQuestDB')
        cy.task('accountDBDispose')
        cy.task('questDBDispose')
    })

    it('checking all children who are associated with a user', () => {
        defaultChildrenGroup.children = [] // set children to new empty Array

        childrenArray.forEach((child) => {
            child.institution_id = state.institution_id
            cy.createUser(user.CHILD, child, state).then(childCreated => {
                child.id = childCreated.id
                defaultChildrenGroup.children.push(childCreated.id)
            })
        })
        cy.registerGroupFromEducador(defaultEducator, defaultChildrenGroup)
        cy.visit(Cypress.env('dashboard_uri'))
        cy.loginUI(defaultEducator)

        cy.get('.mat-select').click()
        cy.get('.mat-option').contains('10').then(($option) => $option[0].click())

        childrenArray.forEach((child) => cy.checkChild(child))

        cy.get('tbody').children().should('length', childrenArray.length)
    })
})