Cypress.Commands.add("checkParentsActivityQuest", function (q23) {
    cy.get('.mat-button-wrapper').contains('Iniciar Questionário').click()

    // Page 1
    const q23PageOneSelectedFieldsArray = new Array(q23.IPAQ_1, q23.IPAQ_3)
    cy.get("div[id$='-1']")
        .find('.mat-select-value-text')
        .each(($span, index) => {
            cy.wrap($span)
                .find('.ng-star-inserted')
                .should('have.text', q23PageOneSelectedFieldsArray[index])
        })

    const q23PageOneTypedFieldsArray = new Array(q23.IPAQ_2_h, q23.IPAQ_2_m, q23.IPAQ_4_h, q23.IPAQ_4_m)
    cy.get("div[id$='-1']")
        .find(".mat-form-field-infix")
        .each(($elem, index) => {
            cy.wrap($elem)
                .find('input').should('have.value', q23PageOneTypedFieldsArray[index])
        })
    cy.get('.mat-button-wrapper').contains('próximo').click()

    // Page 2
    cy.get("div[id$='-2']")
        .find('.mat-select-value-text')
        .find('.ng-star-inserted')
        .should('have.text', q23.IPAQ_5)

    const q23PageTwoTypedFieldsArray = new Array(q23.IPAQ_6_h, q23.IPAQ_6_m, q23.IPAQ_7_h, q23.IPAQ_7_m)
    cy.get("div[id$='-2']")
        .find(".mat-form-field-infix")
        .each(($elem, index) => {
            cy.wrap($elem)
                .find('input').should('have.value', q23PageTwoTypedFieldsArray[index])
        })

    cy.get('.mat-button-wrapper').contains('concluir').click()
    cy.get('.modal-body').find('button').click()
    cy.checkQ23Status('Completo')
})

Cypress.Commands.add("checkQ23Status", function (status) {
    cy.get('tbody tr:eq(3)')
        .find('div')
        .should('have.text', status === 'Completo' ? ` ${status} ` : ` ${status}`)
})

Cypress.Commands.add("checkIncompleteParentsActivityQuest", function (q23) {
    cy.get('.mat-button-wrapper').contains('Iniciar Questionário').click()

    // Page 1
    const q23PageOneSelectedFieldsArray = new Array(q23.IPAQ_1, q23.IPAQ_3)
    cy.get("div[id$='-1']")
        .find('.mat-select-value-text')
        .each(($span, index) => {
            cy.wrap($span)
                .find('.ng-star-inserted')
                .should('have.text', q23PageOneSelectedFieldsArray[index])
        })

    const q23PageOneTypedFieldsArray = new Array(q23.IPAQ_2_h, q23.IPAQ_2_m, q23.IPAQ_4_h, q23.IPAQ_4_m)
    cy.get("div[id$='-1']")
        .find(".mat-form-field-infix")
        .each(($elem, index) => {
            cy.wrap($elem)
                .find('input').should('have.value', q23PageOneTypedFieldsArray[index])
        })
    cy.get('.mat-button-wrapper').contains('próximo').click()

    // Page 2
    const emptyString = ''
    cy.get("div[id$='-2']")
        .find('.mat-select-value')
        .should('value', emptyString)

    cy.get("div[id$='-2']")
        .find(".mat-form-field-infix")
        .each(($elem, index) => {
            cy.wrap($elem)
                .find('input').should('have.value', emptyString)
        })

    cy.get('.mat-button-wrapper').contains('concluir').click()
    cy.get('.modal-body').find('.btn-success').click()
    cy.checkQ23Status('Incompleto 50%')
})