const card = require('./cards.title')
const questDescription = require('./quest.description')
import './q501/utils'

Cypress.Commands.add("loginUI", function (user) {
    cy.get('[ng-reflect-name=username]')
        .type(user.username).should('have.value', user.username)

    cy.get('[ng-reflect-name=password]')
        .type(user.password).should('have.value', user.password)

    cy.get('.btn-lg').click()
})

Cypress.Commands.add("checkChild", function (child) {
    cy.contains(child.username).parent('tr').within(() => {
        cy.get('.cdk-column-name').should('have.text', ` ${child.username}`)
        cy.get('.cdk-column-gender').should('have.text', ` ${child.gender === 'male' ? 'Masculino' : 'Feminino'} `)
        cy.get('.cdk-column-class').should('have.text', ` 4th Grade `)
        cy.get('.cdk-column-birth').should('have.text', `${Math.floor(child.age)}`)
    })
})

Cypress.Commands.add("selectQuest", function (description) {
    switch (description) {
        case questDescription.ACTIVITY_FREQUENCY:
            return cy.get('tbody').contains(questDescription.ACTIVITY_FREQUENCY).click()
        case questDescription.PHYSICAL_HABITS:
            return cy.get('tbody').contains(questDescription.PHYSICAL_HABITS).click()
        case questDescription.SLEEP_HABITS:
            return cy.get('tbody').contains(questDescription.SLEEP_HABITS).click()
        case questDescription.FOOD_FREQUENCY:
            return cy.get('tbody').contains(questDescription.FOOD_FREQUENCY).click()
        case questDescription.FOOD_HABITS:
            return cy.get('tbody').contains(questDescription.FOOD_HABITS).click()
        case questDescription.SELF_PERCEPTION:
            return cy.get('tbody').contains(questDescription.SELF_PERCEPTION).click()
    }
})

Cypress.Commands.add("selectCard", function (cardTitle) {
    switch (cardTitle) {
        case card.FOLLOW:
            return cy.get('.card-title').contains(card.FOLLOW).click()
        case card.MISSIONS:
            return cy.get('.card-title').contains(card.MISSIONS).click()
        case card.IOT_DEVICES:
            return cy.get('.card-title').contains(card.IOT_DEVICES).click()
        case card.FOOD_INTAKE:
            return cy.get('.card-title').contains(card.FOOD_INTAKE).click()
        case card.ACTIVITY:
            return cy.get('.card-title').contains(card.ACTIVITY).click()
        case card.PROFILE:
            return cy.get('.card-title').contains(card.PROFILE).click()
    }
})