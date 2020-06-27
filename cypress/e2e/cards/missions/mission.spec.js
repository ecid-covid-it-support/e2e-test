let defaultEducator = require('../../../fixtures/account/models/users/educators/educator.json')
let defaultChild01 = require('../../../fixtures/account/models/users/children/child01.json')
let defaultChildrenGroup = require('../../../fixtures/account/models/children-groups/group01.json')
let educatorMissions = require('../../../fixtures/missions/models/educator.missions.json')
const cardSelector = require('../../../fixtures/ui/cards.selector')
const user = require('../../../fixtures/account/utils/account.resources')

describe('Missions', () => {
    let state = {}
    let accessTokenDefaultEducator = null

    before(() => {
        cy.task('accountDBConnect')
        cy.task('missionsDBConnect')
        cy.task('cleanAccountDB')
        cy.task('missionsDBRestore')

        cy.auth('admin', 'admin123').then(accessToken => state.accessTokenAdmin = accessToken)
        cy.createInstitution(state).then(institution => {
            defaultEducator.institution_id = institution.id
            defaultChild01.institution_id = institution.id
        })
        cy.createUser(user.EDUCATOR, defaultEducator, state)
            .then(educador => defaultEducator.id = educador.id)

        cy.createUser(user.CHILD, defaultChild01, state).then(child => {
            defaultChild01.id = child.id
            defaultChildrenGroup.children.push(child.id)
        })
        cy.registerGroupFromEducador(defaultEducator, defaultChildrenGroup)
        cy.auth(defaultEducator.username, defaultEducator.password)
            .then(accessToken => accessTokenDefaultEducator = accessToken)
    })

    after(() => {
        cy.task('cleanAccountDB')
        cy.task('missionsDBRestore')
        cy.task('accountDBDispose')
    })

    it('When Educator Missions was registered', () => {
        educatorMissions.child_id = defaultChild01.username
        educatorMissions.creatorId = defaultEducator.id
        cy.createEducatorMissions(educatorMissions, accessTokenDefaultEducator)
            .then(response => {
                const obj = { missionId: response.data, childId: defaultChild01.id }
                cy.assignEducatorMission(obj, accessTokenDefaultEducator)
            })

        cy.visit(Cypress.env('dashboard_uri'))
        cy.loginUI(defaultEducator)
        cy.checkChild(defaultChild01)
        cy.selectChild(defaultChild01)
        cy.selectCard(cardSelector.MISSIONS)
        cy.checkEducatorMissions(educatorMissions, defaultEducator.id, 'Inactive')
    })
})