import './q501/q501.commands'
import './q502/q502.commands'

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
    cy.get(`td:contains(${child.username})`).then(td => {
        td.click()
        cy.wait(2000)
    })
})

Cypress.Commands.add("selectQuest", function (description) {
    cy.get('tbody').contains(description).then(tr => tr.click())
})

Cypress.Commands.add("selectCard", function (cardRouterLink) {
    cy.get(`div[routerlink='/${cardRouterLink}']`).then(div => {
        div.click()
        cy.wait(2000)
    })
})