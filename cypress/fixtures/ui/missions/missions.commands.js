Cypress.Commands.add("checkEducatorMissions", function (missions, creatorUsername, status) {
    cy.get('p').contains('Owner')
        .next()
        .should('have.text', creatorUsername) // creator

    cy.get('p').contains('Mission description')
        .next()
        .should('have.text', missions.description)

    cy.get('p').contains('Goal')
        .next()
        .should('have.text', 'Increase vegetable consumption') // D3

    const duration = missions.durationNumber
    const durationType = duration > 1
        ? missions.durationType.concat('s')
        : missions.durationType

    cy.get('p').contains('Duration')
        .next()
        .should('have.text', `${duration} ${durationType}`)

    cy.get('p').contains('Status')
        .next()
        .should('have.text', `Status ${status}`)
})

Cypress.Commands.add("checkAgentReport", function (observations) {
    cy.get("button[id='save']").click()

    const numberOfDivs = 6
    for (let i = 0; i < numberOfDivs; i++) {
        cy.get(`div[id$=-${i}]`) // #cdk-step-content-?-i
            .find('mat-radio-group')
            .each(($radio_group) => {
                cy.wrap($radio_group)
                    .find('.mat-radio-checked')
                    .should('attr', 'ng-reflect-value', observations[0].value)
            })
    }
})