Cypress.Commands.add("checkQ1SocioDemographicQuest", function (q1SocioDemographic) {
    cy.get('.mat-button-wrapper').contains('Iniciar Questionário').click()

    // Page 2
    const respondent = getRespondent(q1SocioDemographic)
    cy.get("div[id$='-1']")
        .find('.mat-select-value-text')
        .find('.ng-star-inserted')
        .should('have.text', respondent)

    const answersOfInputsInPageTwoArray = getAnswersOfInputsInPageTwoArray(q1SocioDemographic)
    cy.get("div[id$='-1']")
        .find('input')
        .each(($input, index) => {
            cy.wrap($input)
                .should('have.value', answersOfInputsInPageTwoArray[index])
        })
    cy.get('.mat-button-wrapper').contains('próximo').click()

    // Page 3
    const answersRadioGroupPageTree = [q1SocioDemographic.resp_1, q1SocioDemographic.part_1]
    cy.get("div[id$='-2']") // #cdk-step-content-?-2
        .find('mat-radio-group')
        .each(($radio_group, index) => {
            cy.wrap($radio_group)
                .find('.mat-radio-checked')
                .should('attr', 'ng-reflect-value', answersRadioGroupPageTree[index])
        })
    cy.get("div[id$='-2']").find('#botonFinish').click()

    // Page 4
    const answersRadioGroupPageFour = [q1SocioDemographic.resp_3, q1SocioDemographic.part_3]
    cy.get("div[id$='-3']") // #cdk-step-content-?-3
        .find('mat-radio-group')
        .each(($radio_group, index) => {
            cy.wrap($radio_group)
                .find('.mat-radio-checked')
                .should('attr', 'ng-reflect-value', answersRadioGroupPageFour[index])
        })
    cy.get("div[id$='-3']").find('#botonFinish').click()

    // Page 5
    const answersRadioGroupPageFive = [q1SocioDemographic.resp_2, q1SocioDemographic.part_2]
    cy.get("div[id$='-4']") // #cdk-step-content-?-4
        .find('mat-radio-group')
        .each(($radio_group, index) => {
            cy.wrap($radio_group)
                .find('.mat-radio-checked')
                .should('attr', 'ng-reflect-value', answersRadioGroupPageFive[index])
        })
    cy.get("div[id$='-4']").find('#botonFinish').click()

    // Page 6
    const answersRadioGroupPageSix = [q1SocioDemographic.supermarket_near, q1SocioDemographic.tradmarket_near, q1SocioDemographic.park_near]
    cy.get("div[id$='-5']") // #cdk-step-content-?-5
        .find('mat-radio-group')
        .each(($radio_group, index) => {
            cy.wrap($radio_group)
                .find('.mat-radio-checked')
                .should('attr', 'ng-reflect-value', answersRadioGroupPageSix[index])
        })
    cy.get("div[id$='-5']").find('#botonFinish').click()

    // Page 7
    const answersRadioGroupPageSeven = [q1SocioDemographic.supermarket, q1SocioDemographic.tradi_market, q1SocioDemographic.park]
    cy.get("div[id$='-6']") // #cdk-step-content-?-6
        .find('mat-radio-group')
        .each(($radio_group, index) => {
            cy.wrap($radio_group)
                .find('.mat-radio-checked')
                .should('attr', 'ng-reflect-value', answersRadioGroupPageSeven[index])
        })

    const typeTransport = getTypeTransportText(q1SocioDemographic)
    cy.get("div[id$='-6']")
        .find('.mat-select-value-text')
        .find('.ng-star-inserted')
        .should('have.text', typeTransport)

    cy.get("div[id$='-6']").find('#botonFinish').click()

    // Page 8
    const answersRadioGroupPageEight = [
        q1SocioDemographic.comp, q1SocioDemographic.mob, q1SocioDemographic.smartp, q1SocioDemographic.tablet,
        q1SocioDemographic.internet_access, q1SocioDemographic.tv_bedroom, q1SocioDemographic.internet_fast
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
        .should('attr', 'ng-reflect-value', q1SocioDemographic.race)

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

function getRespondent(q1SocioDemographic) {
    switch (q1SocioDemographic.parental_identity_q1) {
        case '1':
            return 'Pai'
        case '2':
            return 'Mãe'
        case '3':
            return 'Outro responsável'
    }
}

function getAnswersOfInputsInPageTwoArray(q1SocioDemographic) {
    return new Array(
        q1SocioDemographic.number_siblings,
        q1SocioDemographic.number_of_household_members.toString(),
        q1SocioDemographic.ages_household_members.toString(),
    )
}

function getTypeTransportText(q1SocioDemographic) {
    switch (q1SocioDemographic.type_transport) {
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