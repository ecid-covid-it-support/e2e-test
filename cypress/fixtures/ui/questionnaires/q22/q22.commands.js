Cypress.Commands.add("checkQ22ParentsHealthConditions", function (q22) {
    // Single Page
    const answersOfInputsInPageTwoArray = [
        q22.weight_respondent, q22.height_respondent,
        q22.weight_partner, q22.height_partner
    ]
    cy.get('input')
        .each(($input, index) => {
            cy.wrap($input)
                .should('have.value', answersOfInputsInPageTwoArray[index].toString())
        })

    cy.get('.mat-button-wrapper').contains('finish').click()
    cy.get('.modal-body').find('button').click()
    cy.checkQ22Status('Complete')
})

Cypress.Commands.add("checkQ22Status", function (status) {
    cy.get('div').contains('Questionnaires').click()
    cy.get('tbody tr:eq(2)')
        .find('div')
        .should('have.text', status === 'Complete' ? ` ${status} ` : ` ${status}`)
})