Cypress.Commands.add("checkQ21ChildHealthConditions", function (q21) {
    cy.get('.mat-button-wrapper').contains('Start Questionnaire').click()

    // Page 2
    const answersRadioGroupPageTwo = getAnswersRadioGroupPageTwo(q21)
    cy.get("div[id$='-1']") // #cdk-step-content-?-1
        .find('mat-radio-group')
        .each(($radio_group, index) => {
            cy.wrap($radio_group)
                .find('.mat-radio-checked')
                .should('attr', 'ng-reflect-value', answersRadioGroupPageTwo[index])
        })

    const answersInputPageTwo = [q21.ch_other2, q21.ch_other_allergy2]
    cy.get("div[id$='-1']")
        .find("input[id^='mat-input']")
        .each(($input, index) => {
            cy.wrap($input)
                .should('have.value', answersInputPageTwo[index])
        })
    cy.get('.mat-button-wrapper').contains('next').click()

    // Page 3
    const answersRadioGroupPageTree = [q21.weight_height_birth, q21.menarche]
    cy.get("div[id$='-2']") // #cdk-step-content-?-2
        .find('mat-radio-group')
        .each(($radio_group, index) => {
            cy.wrap($radio_group)
                .find('.mat-radio-checked')
                .should('attr', 'ng-reflect-value', answersRadioGroupPageTree[index])
        })

    const answersInputPageTree = getAnswersInputPageTree(q21)
    cy.get("div[id$='-2']")
        .find("input[id^='mat-input']")
        .each(($input, index) => {
            cy.wrap($input)
                .should('have.value', answersInputPageTree[index])
        })

    const answerSelectPageTree = getAnswerSelectPageTree(q21)
    cy.get("div[id$='-2']") // #cdk-step-content-?-2
        .find('.mat-select-value')
        .each(($div, index) => {
            cy.wrap($div)
                .invoke('text')
                .then(text => {
                    expect(text.trim()).to.eql(answerSelectPageTree[index])
                })
        })

    cy.get('.mat-button-wrapper').contains('finish').click()
    cy.get('.modal-body > p')
        .should('have.text', ' Questionnaire completed successfully ')
        .parent()
        .find('button').click()
    cy.checkQ21Status('Complete')
})

Cypress.Commands.add("checkQ21Status", function (status) {
    cy.get('div').contains('Questionnaires').click()
    cy.get('tbody tr:eq(1)')
        .find('div')
        .should('have.text', status === 'Complete' ? ` ${status} ` : ` ${status}`)
})

function getAnswersRadioGroupPageTwo(q21) {
    return new Array(
        q21.ch_hypertension, q21.ch_diabetes, q21.ch_hypercholesterolemia,
        q21.ch_asthma, q21.ch_other1, q21.ch_celiac, q21.ch_lactose,
        q21.ch_food_allergy, q21.ch_egg_allergy, q21.ch_milk_allergy, q21.ch_other_allergy1
    )
}

function getAnswersInputPageTree(q21) {
    return new Array(
        q21.weight_birth.toString(),
        q21.height_birth.toString(),
        q21.breastfeeding_practice_other,
        q21.breastfeeding_exclusive_other,
        q21.menarche_time.toString()
    )
}

function getAnswerSelectPageTree(q21) {
    return new Array(
        getSelecText(q21.breastfeeding_practice, false),
        getSelecText(q21.breastfeeding_exclusive, true)
    )
}

function getSelecText(option, isExclusive) {
    switch (option) {
        case '1':
            return "Don't know"
        case '2':
            return isExclusive ? 'I never exclusively breast-fed my son/daughter' : 'My son/daughter has not been breast-fed'
        case '3':
            return 'Less than a month'
        case '4':
            return '1-3 months'
        case '5':
            return '3-4 months'
        case '6':
            return '4-5 months'
        default:
            return ''
    }
}