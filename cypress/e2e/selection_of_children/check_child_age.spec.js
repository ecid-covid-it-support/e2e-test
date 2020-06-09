import '../../fixtures/utils/date.utils'
let defaultEducator = require('../../fixtures/account/models/users/educators/educator.json')
let defaultChild01 = require('../../fixtures/account/models/users/children/child01.json')
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

    it('When the child has aged one year since his age was calculated', () => {
        defaultChild01.age = '9.92' // 9 years and 11 months

        const currentDate = new Date()
        currentDate.setMonth(currentDate.getMonth() - 2)

        defaultChild01.age_calc_date = currentDate.toLocalISOString().substring(0, 10) // YYYY-MM-DD

        cy.createUser(user.CHILD, defaultChild01, state).then(child => {
            defaultChild01.id = child.id
            defaultChildrenGroup.children.push(child.id)
        })
        cy.registerGroupFromEducador(defaultEducator, defaultChildrenGroup)
        cy.visit(Cypress.env('dashboard_uri'))
        cy.loginUI(defaultEducator)
        cy.contains(defaultChild01.username)
            .parent('tr')
            .find('.cdk-column-birth')
            .then(td => expect(td).to.have.text('10'))
    })
})