Cypress.Commands.add("checkQ1SocioDemographicQuest", function (q1SocioDemographic) {
    cy.get('.mat-button-wrapper').contains('Start Questionnaire').click()

    // Page 2
    const answersOnSelectOfPageTwo = getAnswersOnSelectOfPageTwo(q1SocioDemographic)
    cy.get("div[id$='-1']") // #cdk-step-content-?-1
        .find('.mat-select-value-text')
        .each(($span, index) => {
            cy.wrap($span)
                .find('.ng-star-inserted')
                .should('have.text', answersOnSelectOfPageTwo[index])
        })

    cy.get("div[id$='-1']")
        .find('.mat-radio-checked')
        .should('attr', 'ng-reflect-value', q1SocioDemographic.number_children)

    const answersOfInputsInPageTwoArray = getAnswersOfInputsInPageTwoArray(q1SocioDemographic)
    cy.get("div[id$='-1']")
        .find('.mat-input-element')
        .each(($input, index) => {
            cy.wrap($input)
                .should('have.value', answersOfInputsInPageTwoArray[index])
        })
    cy.get('.mat-button-wrapper').contains('next').click()

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
    const answersRadioGroupPageFour = [q1SocioDemographic.resp_2, q1SocioDemographic.part_2]
    cy.get("div[id$='-3']") // #cdk-step-content-?-3
        .find('mat-radio-group')
        .each(($radio_group, index) => {
            cy.wrap($radio_group)
                .find('.mat-radio-checked')
                .should('attr', 'ng-reflect-value', answersRadioGroupPageFour[index])
        })
    cy.get("div[id$='-3']").find('#botonFinish').click()

    // Page 5
    const answersRadioGroupPageSix = [
        q1SocioDemographic.supermarket_near, q1SocioDemographic.tradmarket_near, q1SocioDemographic.park_near
    ]
    cy.get("div[id$='-4']") // #cdk-step-content-?-4
        .find('mat-radio-group')
        .each(($radio_group, index) => {
            cy.wrap($radio_group)
                .find('.mat-radio-checked')
                .should('attr', 'ng-reflect-value', answersRadioGroupPageSix[index])
        })
    cy.get("div[id$='-4']").find('#botonFinish').click()

    // Page 6
    const answersRadioGroupPageSeven = [
        q1SocioDemographic.supermarket, q1SocioDemographic.tradi_market, q1SocioDemographic.park
    ]
    cy.get("div[id$='-5']") // #cdk-step-content-?-5
        .find('mat-radio-group')
        .each(($radio_group, index) => {
            cy.wrap($radio_group)
                .find('.mat-radio-checked')
                .should('attr', 'ng-reflect-value', answersRadioGroupPageSeven[index])
        })

    const typeTransport = getTypeTransportText(q1SocioDemographic)
    cy.get("div[id$='-5']")
        .find('.mat-select-value-text')
        .find('.ng-star-inserted')
        .should('have.text', typeTransport)

    cy.get("div[id$='-5']").find('#botonFinish').click()

    // Page 7
    const answersRadioGroupPageEight = [
        q1SocioDemographic.comp, q1SocioDemographic.mob, q1SocioDemographic.smartp, q1SocioDemographic.tablet,
        q1SocioDemographic.internet_access, q1SocioDemographic.tv_bedroom, q1SocioDemographic.internet_fast
    ]
    cy.get("div[id$='-6']") // #cdk-step-content-?-6
        .find('mat-radio-group')
        .each(($radio_group, index) => {
            cy.wrap($radio_group)
                .find('.mat-radio-checked')
                .should('attr', 'ng-reflect-value', answersRadioGroupPageEight[index])
        })

    cy.get('.mat-button-wrapper').contains('finish').click()
    cy.get('.modal-body').find('button').click()
    cy.checkQ1SocioDemographicStatus('Complete')
})

Cypress.Commands.add("checkQ1SocioDemographicStatus", function (status) {
    cy.get('div').contains('Questionnaires').click()
    cy.get('tbody tr:eq(0)')
        .find('div')
        .should('have.text', status === 'Complete' ? ` ${status} ` : ` ${status}`)
})

function getAnswersOnSelectOfPageTwo(q1SocioDemographic) {
    const array = new Array(getRespondent(q1SocioDemographic.parental_identity_q1))

    if (q1SocioDemographic.number_children === '1') {
        array.push(getNumbersOfChildren(q1SocioDemographic.number_siblings))
    }

    return array
}

function getAnswersOfInputsInPageTwoArray(q1SocioDemographic) {
    return new Array(
        q1SocioDemographic.number_of_household_members.toString(),
        q1SocioDemographic.ages_household_members.toString(),
    )
}

function getRespondent(option) {
    switch (option) {
        case '1':
            return 'Father'
        case '2':
            return 'Mother'
        case '3':
            return 'Grandparent or another caretaker'
    }
}

function getNumbersOfChildren(option) {
    switch (option) {
        case '1':
            return '2 children'
        case '2':
            return '3 children'
        case '3':
            return '4 children'
        case '4':
            return 'More than 4 children'
    }
}

function getTypeTransportText(q1SocioDemographic) {
    switch (q1SocioDemographic.type_transport) {
        case '1':
            return 'Car'
        case '2':
            return 'Public transport'
        case '3':
            return 'Walking'
        case '4':
            return 'Cycling'
        case '5':
            return 'Another way'
    }
}