const card = require('./cards.title')
const questDescription = require('./quest.description')
import './q501/utils'
import './q502/util'

Cypress.Commands.add("loginUI", function (user) {
    cy.get('[ng-reflect-name=username]')
        .type(user.username).should('have.value', user.username)

    cy.get('[ng-reflect-name=password]')
        .type(user.password).should('have.value', user.password)

    cy.get('.btn-lg').click()
})

Cypress.Commands.add("checkChild", function (child) {
    cy.contains(child.username).parent('tr').then(($tr) => {
        cy.get($tr).find('.cdk-column-name').then($td => expect($td).to.have.text(` ${child.username}`))
        cy.get($tr).find('.cdk-column-gender').then($td => expect($td).to.have.text(` ${child.gender === 'male' ? 'Masculino' : 'Feminino'} `))
        cy.get($tr).find('.cdk-column-class').then($td => expect($td).to.have.text(` 4th Grade `))
        cy.get($tr).find('.cdk-column-birth').then($td => expect($td).to.have.text(`${Math.floor(child.age)}`))
    })
})

Cypress.Commands.add("selectChild", function (child) {
    cy.get(`td:contains(${child.username})`).then(td => td.click())
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
            return cy.get('.card-title').contains(card.FOLLOW).parent().next().click()
        case card.MISSIONS:
            return cy.get('.card-title').contains(card.MISSIONS).parent().next().click()
        case card.IOT_DEVICES:
            return cy.get('.card-title').contains(card.IOT_DEVICES).parent().next().click()
        case card.FOOD_INTAKE:
            return cy.get('.card-title').contains(card.FOOD_INTAKE).parent().next().click()
        case card.ACTIVITY:
            return cy.get('.card-title').contains(card.ACTIVITY).parent().next().click()
        case card.PROFILE:
            return cy.get('.card-title').contains(card.PROFILE).parent().next().click()
    }
})