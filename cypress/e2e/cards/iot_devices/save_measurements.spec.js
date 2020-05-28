let defaultEducator = require('../../../fixtures/account/models/users/educators/educator.json')
let defaultChild01 = require('../../../fixtures/account/models/users/children/child01.json')
let defaultApplication = require('../../../fixtures/account/models/users/application/app01.json')
let defaultChildrenGroup = require('../../../fixtures/account/models/children-groups/group01.json')
let weight = require('../../../fixtures/tracking/models/weights/weight.json')
let institutionEnv = require('../../../fixtures/tracking/models/institutions.environments/environment.json')
const cardSelector = require('../../../fixtures/ui/cards.selector')
const user = require('../../../fixtures/account/utils/account.resources')
const tracking = require('../../../fixtures/tracking/utils/tracking.resources')

describe('IoT Devices', () => {
    let state = {}
    let accessTokenDefaultEducator = null
    let accessTokenDefaultApplication = null

    before(() => {
        cy.task('accountDBConnect')
        cy.task('questDBConnect')
        cy.task('cleanAccountDB')
        cy.task('cleanQuestDB')

        cy.auth('admin', 'admin123').then(accessToken => state.accessTokenAdmin = accessToken)
        cy.createInstitution(state).then(institution => {
            defaultEducator.institution_id = institution.id
            defaultChild01.institution_id = institution.id
            defaultApplication.institution_id = institution.id
        })
        cy.createUser(user.EDUCATOR, defaultEducator, state)
            .then(educador => defaultEducator.id = educador.id)

        cy.createUser(user.APPLICATION, defaultApplication, state)
            .then(app => defaultApplication.id = app.id)

        cy.createUser(user.CHILD, defaultChild01, state).then(child => {
            defaultChild01.id = child.id
            defaultChildrenGroup.children.push(child.id)
        })

        cy.registerGroupFromEducador(defaultEducator, defaultChildrenGroup)

        cy.auth(defaultEducator.username, defaultEducator.password)
            .then(accessToken => accessTokenDefaultEducator = accessToken)

        cy.auth(defaultApplication.username, defaultApplication.password)
            .then(accessToken => accessTokenDefaultApplication = accessToken)
    })

    after(() => {
        cy.task('cleanAccountDB')
        cy.task('cleanQuestDB')
        cy.task('accountDBDispose')
        cy.task('questDBDispose')
    })

    it('When Iot Devices register measurements', () => {
        cy.createTrackingResource(tracking.Weights, defaultChild01.id, weight, accessTokenDefaultEducator)
        cy.createInstitutionEnv(defaultChild01.institution_id, institutionEnv, accessTokenDefaultApplication)

        cy.visit(Cypress.env('dashboard_uri'))
        cy.loginUI(defaultEducator)
        cy.checkChild(defaultChild01)
        cy.selectChild(defaultChild01)
        cy.selectCard(cardSelector.IOT_DEVICES)
        cy.checkIoTDevices(weight, institutionEnv)
    })
})