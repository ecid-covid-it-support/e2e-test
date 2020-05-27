Cypress.Commands.add("checkQ401FoodFrequencyQuest", function (q401) {
    cy.get('.mat-button-wrapper').contains('Start Questionnaire').click()
    
    // Page 2
    const answersPageTwo = getAnswersPageTwo(q401)
    cy.get("div[id$='-1']") // #cdk-step-content-?-1
        .find('mat-radio-group')
        .each(($radio_group, index) => {
            cy.wrap($radio_group)
                .find('.mat-radio-checked')
                .should('attr', 'ng-reflect-value', answersPageTwo[index])
        })
    cy.get('.mat-button-wrapper').contains('next').click()

    // Page 3
    const answersPageTree = getAnswersPageTree(q401)
    cy.get("div[id$='-2']") // #cdk-step-content-?-2
        .find('mat-radio-group')
        .each(($radio_group, index) => {
            cy.wrap($radio_group)
                .find('.mat-radio-checked')
                .should('attr', 'ng-reflect-value', answersPageTree[index])
        })
    cy.get("div[id$='-2']").find('#botonFinish').click()

    // Page 4
    const answersPageFour = getAnswersPageFour(q401)
    cy.get("div[id$='-3']") // #cdk-step-content-?-3
        .find('mat-radio-group')
        .each(($radio_group, index) => {
            cy.wrap($radio_group)
                .find('.mat-radio-checked')
                .should('attr', 'ng-reflect-value', answersPageFour[index])
        })
    cy.get("div[id$='-3']").find('#botonFinish').click()

    // Page 5
    const answersPageFive = getAnswersPageFive(q401)
    cy.get("div[id$='-4']") // #cdk-step-content-?-4
        .find('mat-radio-group')
        .each(($radio_group, index) => {
            cy.wrap($radio_group)
                .find('.mat-radio-checked')
                .should('attr', 'ng-reflect-value', answersPageFive[index])
        })
    cy.get("div[id$='-4']").find('#botonFinish').click()

    // Page 6
    const answersPageSix = getAnswersPageSix(q401)
    cy.get("div[id$='-5']") // #cdk-step-content-?-5
        .find('mat-radio-group')
        .each(($radio_group, index) => {
            cy.wrap($radio_group)
                .find('.mat-radio-checked')
                .should('attr', 'ng-reflect-value', answersPageSix[index])
        })
    cy.get("div[id$='-5']").find('#botonFinish').click()

    // Page 7
    const answersPageSeven = getAnswersPageSeven(q401)
    cy.get("div[id$='-6']") // #cdk-step-content-?-6
        .find('mat-radio-group')
        .each(($radio_group, index) => {
            cy.wrap($radio_group)
                .find('.mat-radio-checked')
                .should('attr', 'ng-reflect-value', answersPageSeven[index])
        })
    cy.get("div[id$='-6']").find('#botonFinish').click()

    // Page 8
    const answersPageEight = getAnswersPageEight(q401)
    cy.get("div[id$='-7']") // #cdk-step-content-?-7
        .find('mat-radio-group')
        .each(($radio_group, index) => {
            cy.wrap($radio_group)
                .find('.mat-radio-checked')
                .should('attr', 'ng-reflect-value', answersPageEight[index])
        })
    cy.get("div[id$='-7']").find('#botonFinish').click()

    const answersOfSelectOnPageNine = getAnswersOfSelectOnPageNine(q401)
    cy.get("div[id$='-8']") // #cdk-step-content-?-8
        .find('.mat-select-value-text')
        .each(($span, index) => {
            cy.wrap($span)
                .find('.ng-star-inserted')
                .should('have.text', answersOfSelectOnPageNine[index])
        })

    cy.get("div[id$='-8']")
        .find('.mat-radio-checked')
        .should('attr', 'ng-reflect-value', q401.oil_salad)

    cy.get('.mat-button-wrapper').contains('finish').click()
    // strangely, the button to confirm the successful completion of the questionnaire 
    // (OK) has the id = cancel
    cy.get('.modal-content').find('#cancel').click()
    cy.checkQ401FoodFrequencyStatus('Complete')
})

Cypress.Commands.add("checkQ401FoodFrequencyStatus", function (status) {
    cy.get('div').contains('Questionnaires').click()
    cy.get('tbody tr:eq(0)')
        .find('div')
        .should('have.text', status === 'Complete' ? ` ${status} ` : ` ${status}`)
})

function getAnswersPageTwo(q401) {
    return new Array(
        q401.bread_toasts,
        q401.cereals,
        q401.industrial_pastry,
        q401.biscuits,
    )
}

function getAnswersPageTree(q401) {
    return new Array(
        q401.cow_milk,
        q401.other_milk,
        q401.yogurt,
        q401.cheese,
    )
}

function getAnswersPageFour(q401) {
    return new Array(
        q401.fresh_fruit,
        q401.industrial_juice,
        q401.vegetables,
    )
}

function getAnswersPageFive(q401) {
    return new Array(
        q401.bakery_products,
        q401.rice,
        q401.pasta,
        q401.nuts,
    )
}

function getAnswersPageSix(q401) {
    return new Array(
        q401.legumes,
        q401.fish,
        q401.eggs,
        q401.meat,
    )
}

function getAnswersPageSeven(q401) {
    return new Array(
        q401.cold_cuts,
        q401.fried_snacks,
        q401.fast_food,
    )
}

function getAnswersPageEight(q401) {
    return new Array(
        q401.sweets,
        q401.sugary_sodas,
        q401.industrial_sauces,
        q401.caloric_desserts,
    )
}

function getAnswersOfSelectOnPageNine(q401) {
    return new Array(
        piecesFruitText(q401.pieces_fruit),
        waterConsumptionText(q401.water_consumption),
        useToCook(q401.oil_cook),
    )
}

function piecesFruitText(option) {
    switch (option) {
        case '1':
            return 'never'
        case '2':
            return '1'
        case '3':
            return '2'
        case '4':
            return '3'
        case '5':
            return '>3'
    }
}

function waterConsumptionText(option) {
    switch (option) {
        case '1':
            return "I don't drink water"
        case '2':
            return '1-2 glasses/day'
        case '3':
            return '3-4 glasses/day'
        case '4':
            return 'At least 5 or more/day'
    }
}

function useToCook(option) {
    switch (option) {
        case '1':
            return "Butter"
        case '2':
            return 'Vegetable oil(soy, canola oil, sunflower)'
        case '3':
            return 'Olive oil'
        case '4':
            return 'Margarine'
    }
}