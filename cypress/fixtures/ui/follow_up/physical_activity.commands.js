Cypress.Commands.add("checkMonthlyLogs", function (resultsArray) {

    const h1 = resultsArray[0].hours
    const m1 = resultsArray[0].minutes
    cy.get('p')
        .contains('active hours')
        .prev()
        .should('have.text', `${h1}hrs${m1}mins`)

    cy.get('p')
        .contains('Steps')
        .prev()
        .should('have.text', resultsArray[1])

    cy.get('p')
        .contains('calories burned')
        .prev()
        .should('have.text', resultsArray[2])

    const h2 = resultsArray[3].hours
    const m2 = resultsArray[3].minutes
    cy.get('p')
        .contains('Sedentary hours')
        .prev()
        .should('have.text', `${h2}hrs${m2}mins`)
})