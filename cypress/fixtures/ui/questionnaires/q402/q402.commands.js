Cypress.Commands.add("checkQ402FoodHabitsQuest", function (q402) {
    cy.get('.mat-button-wrapper').contains('Start Questionnaire').click()

    // Page 2
    const answersPageTwo = getAnswersPageTwo(q402)
    cy.get("div[id$='-1']") // #cdk-step-content-?-1
        .find('.mat-select-value-text')
        .each(($span, index) => {
            cy.wrap($span)
                .find('.ng-star-inserted')
                .should('have.text', answersPageTwo[index])
        })

    const answersInCheckBoxOfPageTwo = getAnswersInCheckBoxOfPageTwo(q402)
    cy.get("div[id$='-1']") // #cdk-step-content-?-1
        .find('mat-checkbox')
        .each(($check_box, index) => {
            cy.wrap($check_box)
                .should('attr', 'ng-reflect-model', answersInCheckBoxOfPageTwo[index].toString())
        })
    cy.get('.mat-button-wrapper').contains('next').click()

    // Page 3
    const answersInCheckBoxOfPageTree = getAnswersInCheckBoxOfPageTree(q402)
    cy.get("div[id$='-2']") // #cdk-step-content-?-2
        .find('mat-checkbox')
        .each(($check_box, index) => {
            cy.wrap($check_box)
                .should('attr', 'ng-reflect-model', answersInCheckBoxOfPageTree[index].toString())
        })

    const answerSelectOfPageTree = getAnswerSelectOfPageTree(q402.meals_screentime)
    cy.get("div[id$='-2']") // #cdk-step-content-?-2
        .find('.mat-select-value-text')
        .find('.ng-star-inserted')
        .should('have.text', answerSelectOfPageTree)

    const answersRadioGroupPageTree = getAnswersRadioGroupPageTree(q402)
    cy.get("div[id$='-2']") // #cdk-step-content-?-2
        .find('mat-radio-group')
        .each(($radio_group, index) => {
            cy.wrap($radio_group)
                .find('.mat-radio-checked')
                .should('attr', 'ng-reflect-value', answersRadioGroupPageTree[index])
        })

    cy.get("div[id$='-2']").find('#botonFinish').click()

    // Page 4
    cy.get("div[id$='-3']") // #cdk-step-content-?-3
        .find('.mat-radio-checked')
        .should('attr', 'ng-reflect-value', q402.leisure_time_friends)

    if (q402.leisure_time_friends === '1') {
        const answersInCheckBoxOfPageFour = getAnswersInCheckBoxOfPageFour(q402)
        cy.get("div[id$='-3']") // #cdk-step-content-?-3
            .find('mat-checkbox')
            .each(($check_box, index) => {
                cy.wrap($check_box)
                    .should('attr', 'ng-reflect-model',
                        answersInCheckBoxOfPageFour[index].toString())
            })
    }

    cy.get('.mat-button-wrapper').contains('finish').click()
    cy.get('.modal-content').find('#cancel').click()
    cy.checkQ402FoodHabitsStatus('Complete')
})

Cypress.Commands.add("checkQ402FoodHabitsStatus", function (status) {
    cy.get('div').contains('Questionnaires').click()
    cy.get('tbody tr:eq(1)')
        .find('div')
        .should('have.text', status === 'Complete' ? ` ${status} ` : ` ${status}`)
})

function getAnswersPageTwo(q402) {
    return new Array(
        getTimesText(q402.breakfast_habit, false),
        getBreakFastLocation(q402.breakfast_location),
        getTimesText(q402.breakfast_choices, true),
        getMealsAtSchool(q402.meals_at_school),
    )
}

function getAnswersInCheckBoxOfPageTwo(q402) {
    return new Array(
        q402.meals_company_weekdays_1,
        q402.meals_company_weekdays_2,
        q402.meals_company_weekdays_3,
        q402.meals_company_weekdays_4,
    )
}

function getAnswersInCheckBoxOfPageTree(q402) {
    return new Array(
        q402.meals_company_weekends_1,
        q402.meals_company_weekends_2,
        q402.meals_company_weekends_3,
        q402.meals_company_weekends_4,
    )
}

function getAnswersRadioGroupPageTree(q402) {
    return new Array(
        q402.family_cooking,
        q402.family_purchasing,
    )
}

function getAnswersInCheckBoxOfPageFour(q402) {
    return new Array(
        q402.food_elections_weekends_1,
        q402.food_elections_weekends_2,
        q402.food_elections_weekends_3,
        q402.food_elections_weekends_4,
        q402.food_elections_weekends_5,
        q402.food_elections_weekends_6,
        q402.food_elections_weekends_7,
        q402.food_elections_weekends_8,
        q402.food_elections_weekends_9,
        q402.food_elections_weekends_10,
    )
}

function getAnswerSelectOfPageTree(option) {
    switch (option) {
        case '1':
            return 'Yes'
        case '2':
            return 'No'
        case '3':
            return 'Only sometimes'
    }
}

function getTimesText(option, includeOnly) {
    switch (option) {
        case '1':
            return 'Everyday'
        case '2':
            return '4-6 times a week'
        case '3':
            return includeOnly ? 'Only 1-3 times a week' : '1-3 times a week'
    }
}

function getBreakFastLocation(option) {
    switch (option) {
        case '1':
            return 'At home'
        case '2':
            return 'On the way to school'
        case '3':
            return 'At school'
        case '4':
            return 'I do not have breakfast'
        case '5':
            return 'In the restaurant/bakery/diner'
    }
}

function getMealsAtSchool(option) {
    switch (option) {
        case '1':
            return 'Never'
        case '2':
            return 'Everyday'
        case '3':
            return 'Almost every day'
        case '4':
            return 'Only some days'
    }
}