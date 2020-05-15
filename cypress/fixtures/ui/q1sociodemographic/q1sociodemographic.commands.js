Cypress.Commands.add("checkQ1SocioDemographicQuest", function (q23) {
    cy.get('.mat-button-wrapper').contains('Iniciar Questionário').click()

    // Page 2
    const respondent = getRespondent(q23)
    cy.get("div[id$='-1']")
        .find('.mat-select-value-text')
        .find('.ng-star-inserted')
        .should('have.text', respondent)

    const answersOfInputsInPageTwoArray = getAnswersOfInputsInPageTwoArray(q23)
    cy.get("div[id$='-1']")
        .find('input')
        .each(($input, index) => {
            cy.wrap($input)
                .should('have.value', answersOfInputsInPageTwoArray[index])
        })
    cy.get('.mat-button-wrapper').contains('próximo').click()

    // Page 3
    const answersRadioGroupPageTree = [q23.resp_1, q23.part_1]
    cy.get("div[id$='-2']") // #cdk-step-content-?-2
        .find('mat-radio-group')
        .each(($radio_group, index) => {
            cy.wrap($radio_group)
                .find('.mat-radio-checked')
                .should('attr', 'ng-reflect-value', answersRadioGroupPageTree[index])
        })
    cy.get("div[id$='-2']").find('#botonFinish').click()

    // Page 4
    const answersRadioGroupPageFour = [q23.resp_3, q23.part_3]
    cy.get("div[id$='-3']") // #cdk-step-content-?-3
        .find('mat-radio-group')
        .each(($radio_group, index) => {
            cy.wrap($radio_group)
                .find('.mat-radio-checked')
                .should('attr', 'ng-reflect-value', answersRadioGroupPageFour[index])
        })
    cy.get("div[id$='-3']").find('#botonFinish').click()

    // Page 5
    const answersRadioGroupPageFive = [q23.resp_2, q23.part_2]
    cy.get("div[id$='-4']") // #cdk-step-content-?-4
        .find('mat-radio-group')
        .each(($radio_group, index) => {
            cy.wrap($radio_group)
                .find('.mat-radio-checked')
                .should('attr', 'ng-reflect-value', answersRadioGroupPageFive[index])
        })
    cy.get("div[id$='-4']").find('#botonFinish').click()

    // Page 6
    const answersRadioGroupPageSix = [q23.supermarket_near, q23.tradmarket_near, q23.park_near]
    cy.get("div[id$='-5']") // #cdk-step-content-?-5
        .find('mat-radio-group')
        .each(($radio_group, index) => {
            cy.wrap($radio_group)
                .find('.mat-radio-checked')
                .should('attr', 'ng-reflect-value', answersRadioGroupPageSix[index])
        })
    cy.get("div[id$='-5']").find('#botonFinish').click()

    // Page 7
    const answersRadioGroupPageSeven = [q23.supermarket, q23.tradi_market, q23.park]
    cy.get("div[id$='-6']") // #cdk-step-content-?-6
        .find('mat-radio-group')
        .each(($radio_group, index) => {
            cy.wrap($radio_group)
                .find('.mat-radio-checked')
                .should('attr', 'ng-reflect-value', answersRadioGroupPageSeven[index])
        })

    const typeTransport = getTypeTransportText(q23)
    cy.get("div[id$='-6']")
        .find('.mat-select-value-text')
        .find('.ng-star-inserted')
        .should('have.text', typeTransport)

    cy.get("div[id$='-6']").find('#botonFinish').click()

    // Page 8
    const answersRadioGroupPageEight = [
        q23.comp, q23.mob, q23.smartp, q23.tablet,
        q23.internet_access, q23.tv_bedroom, q23.internet_fast
    ]
    cy.get("div[id$='-7']") // #cdk-step-content-?-7
        .find('mat-radio-group')
        .each(($radio_group, index) => {
            cy.wrap($radio_group)
                .find('.mat-radio-checked')
                .should('attr', 'ng-reflect-value', answersRadioGroupPageEight[index])
        })
    cy.get("div[id$='-7']").find('#botonFinish').click()

    // Page 9
    cy.get("div[id$='-8']") // #cdk-step-content-?-8
        .find('mat-radio-group')
        .find('.mat-radio-checked')
        .should('attr', 'ng-reflect-value', q23.race)

    cy.get('.mat-button-wrapper').contains('concluir').click()
    cy.get('.modal-body').find('button').click()
    cy.checkQ1SocioDemographicStatus('Completo')
})

Cypress.Commands.add("checkQ1SocioDemographicStatus", function (status) {
    cy.get('div').contains('Questionários').click()
    cy.get('tbody tr:eq(0)')
        .find('div')
        .should('have.text', status === 'Completo' ? ` ${status} ` : ` ${status}`)
})

function getRespondent(q23) {
    switch (q23.parental_identity_q1) {
        case '1':
            return 'Pai'
        case '2':
            return 'Mãe'
        case '3':
            return 'Outro responsável'
    }
}

function getAnswersOfInputsInPageTwoArray(q23) {
    return new Array(
        q23.number_siblings,
        q23.number_of_household_members.toString(),
        q23.ages_household_members.toString(),
    )
}

function getTypeTransportText(q23) {
    switch (q23.type_transport) {
        case '1':
            return 'Carro/Motocicleta'
        case '2':
            return 'Transporte público'
        case '3':
            return 'Caminhada'
        case '4':
            return 'De bicicleta'
        case '5':
            return 'Outro'
    }
}