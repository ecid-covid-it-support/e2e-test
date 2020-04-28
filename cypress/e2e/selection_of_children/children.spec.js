let defaultEducator = require('../../fixtures/account/models/users/educators/educator.json')
let defaultChild01 = require('../../fixtures/account/models/users/children/child01.json')
let childrenArray = require('../../fixtures/account/models/users/children/children.json')
let defaultChildrenGroup = require('../../fixtures/account/models/children-groups/group01.json')

describe('Selection of Children', () => {
    let state = {}

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
        cy.createEducator(defaultEducator, state).then(educador => defaultEducator.id = educador.id)
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
            cy.task('removeAllChildren')
            cy.task('removeChildrenGroups')
        })

        it('checking the children that are associated with the educator', () => {
            defaultChild01.age = '9.311'

            cy.createChild(defaultChild01, state).then(child => {
                defaultChild01.id = child.id
                defaultChildrenGroup.children.push(child.id)
            })
            cy.registerGroupFromEducador(defaultEducator, defaultChildrenGroup)
            cy.visit(Cypress.env('dashboard_uri'))
            cy.loginUI(defaultEducator)
            cy.checkChild(defaultChild01).click()
        })

        it('checking the children that are associated with the educator', () => {
            defaultChildrenGroup.children = [] // set children to new empty Array

            childrenArray.forEach((child) => {
                child.institution_id = state.institution_id
                cy.createChild(child, state).then(childCreated => {
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
})