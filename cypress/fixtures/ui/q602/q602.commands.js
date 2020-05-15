Cypress.Commands.add("checkQ602AutoPerceptionQuest", function (q602) {
    // single Page
    const arr = [q602.similar_body, q602.body_preference, q602.ideal_body]
    cy.get('.mat-select-value-text')
        .each(($span, index) => {
            cy.wrap($span)
                .find('.ng-star-inserted')
                .should('have.text', arr[index])
        })

    cy.get('.mat-button-wrapper').contains('concluir').click()
    cy.get('.modal-body').find('button').click()
    cy.checkQ602Status('Completo')
})

Cypress.Commands.add("checkQ602Status", function (status) {
    cy.get('div').contains('Questionários').click()
    cy.get('tbody tr:eq(3)')
        .find('div')
        .should('have.text', status === 'Completo' ? ` ${status} ` : ` ${status}`)
})