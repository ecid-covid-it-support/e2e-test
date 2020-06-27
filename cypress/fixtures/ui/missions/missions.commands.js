Cypress.Commands.add("checkEducatorMissions", function (missions, educatorId, status) {
    cy.get('p').contains('Owner')
        .next()
        .should('have.text', educatorId) // educator

    cy.get('p').contains('Mission description')
        .next()
        .should('have.text', missions.description[0].text)

    cy.get('p').contains('Goal')
        .next()
        .should('have.text', 'Increase fruit consumption') // D3

    const duration = missions.durationNumber
    const durationType = duration > 1
        ? missions.durationType.concat('s')
        : missions.durationType

    cy.get('p').contains('Duration')
        .next()
        .should('have.text', `${duration} ${durationType}`)

    cy.get("p").contains(`${status}`)
        .should('have.text', ` ${status}`)
})