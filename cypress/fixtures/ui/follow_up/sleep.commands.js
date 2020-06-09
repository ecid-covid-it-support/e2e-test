Cypress.Commands.add("checkDailySleep", function (resultsArray) {
    const h1 = resultsArray[0].hours, m1 = resultsArray[0].minutes
    cy.get('p')
        .contains('Awake time')
        .prev()
        .should('have.text', `${h1}hrs${m1}mins`)

    const h2 = resultsArray[1].hours, m2 = resultsArray[1].minutes
    cy.get('p')
        .contains('Deep sleep')
        .prev()
        .should('have.text', `${h2}hrs${m2}mins`)

    const h3 = resultsArray[2].hours, m3 = resultsArray[2].minutes
    cy.get('p')
        .contains('Light sleep')
        .prev()
        .should('have.text', `${h3}hrs${m3}mins`)

    const fHour = resultsArray[3]
    const h5 = resultsArray[4].hours, m5 = resultsArray[4].minutes
    cy.get('p')
        .contains('of sleep')
        .prev()
        .should('have.text', `${h5}hrs${m5}mins`)
        .prev()
        .should('have.text', fHour)
})