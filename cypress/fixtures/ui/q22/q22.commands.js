Cypress.Commands.add("checkQ22ParentsHealthConditions", function (q22) {
    cy.get('.mat-button-wrapper').contains('Iniciar Questionário').click()

    // Page 2
    const answersOfInputsInPageTwoArray = [
        q22.weight_respondent, q22.height_respondent,
        q22.weight_partner, q22.height_partner
    ]
    cy.get("div[id$='-1']")
        .find('input')
        .each(($input, index) => {
            cy.wrap($input)
                .should('have.value', answersOfInputsInPageTwoArray[index].toString())
        })
    cy.get('.mat-button-wrapper').contains('próximo').click()

    // Page 3
    const answersOfPageTree = getTextAnswersOfPageTree(q22)
    cy.get("div[id$='-2']") // #cdk-step-content-?-2
        .find('.mat-select-value-text')
        .each(($span, index) => {
            cy.wrap($span)
                .find('.ng-star-inserted')
                .should('have.text', answersOfPageTree[index])
        })
    cy.get("div[id$='-2']").find('#botonFinish').click()

    // // Page 4
    const answersOfPageFour = getTextAnswersOfPageFour(q22)
    cy.get("div[id$='-3']") // #cdk-step-content-?-3
        .find('.mat-select-value-text')
        .each(($span, index) => {
            cy.wrap($span)
                .find('.ng-star-inserted')
                .should('have.text', answersOfPageFour[index])
        })

    cy.get("div[id$='-3']")
        .find('input')
        .should('have.value', q22.food_parents16)

    cy.get('.mat-button-wrapper').contains('concluir').click()
    cy.get('.modal-body').find('button').click()
    cy.checkQ22Status('Completo')
})

Cypress.Commands.add("checkQ22Status", function (status) {
    cy.get('div').contains('Questionários').click()
    cy.get('tbody tr:eq(2)')
        .find('div')
        .should('have.text', status === 'Completo' ? ` ${status} ` : ` ${status}`)
})

function getTextAnswersOfPageTree(q22) {
    return new Array(
        q22.food_parents1 = getWeekDaysText(q22.food_parents1),
        q22.food_parents2 = getWeekDaysText(q22.food_parents2),
        q22.food_parents3 = getTimesInTheDayText(q22.food_parents3),
        q22.food_parents4 = getWeekDaysText(q22.food_parents4),
        q22.food_parents5 = getTimesInTheDayText(q22.food_parents5),
        q22.food_parents6 = getWeekDaysText(q22.food_parents6),
        q22.food_parents7 = getMealWithOrWithoutSkin(q22.food_parents7),
        q22.food_parents8 = getWeekDaysText(q22.food_parents8),
        q22.food_parents9 = getMealWithOrWithoutSkin(q22.food_parents9),
        q22.food_parents10 = getWeekDaysText(q22.food_parents10)
    )
}

function getTextAnswersOfPageFour(q22) {
    return new Array(
        q22.food_parents11 = getWeekDaysText(q22.food_parents11),
        q22.food_parents12 = getWeekDaysText(q22.food_parents12),
        q22.food_parents13 = getTimesInTheDayText(q22.food_parents13),
        q22.food_parents14 = getWeekDaysText(q22.food_parents14),
        q22.food_parents15 = getSodaType(q22.food_parents15),
        q22.food_parents17 = getWeekDaysText(q22.food_parents17),
        q22.food_parents18 = getMilkType(q22.food_parents18),
        q22.food_parents19 = getWeekDaysText(q22.food_parents19),
        q22.food_parents20 = getWeekDaysText(q22.food_parents20),
        q22.food_parents21 = getSaltConsumption(q22.food_parents21),
    )
}

function getSaltConsumption(option) {
    switch (option) {
        case '1':
            return 'Muito alto'
        case '2':
            return 'Alto'
        case '3':
            return 'Adequado'
        case '4':
            return 'Baixo'
        case '5':
            return 'Muito baixo'
    }
}

function getMilkType(option) {
    switch (option) {
        case '1':
            return 'Integral'
        case '2':
            return 'Desnatado/semidesnatado'
        case '3':
            return 'Os dois tipos'
    }
}

function getSodaType(option) {
    switch (option) {
        case '1':
            return 'Normal'
        case '2':
            return 'Diet/light/zero'
        case '3':
            return 'Ambos'
    }
}

function getWeekDaysText(option) {
    switch (option) {
        case '1':
            return 'Nunca ou menos de uma vez na semana'
        case '2':
            return '1 dia'
        case '3':
            return '2 dias'
        case '4':
            return '3 dias'
        case '5':
            return '4 dias'
        case '6':
            return '5 dias'
        case '7':
            return '6 dias'
        case '8':
            return '7 dias'
    }
}

function getTimesInTheDayText(option) {
    switch (option) {
        case '1':
            return '1 vez por dia (no almoço ou no jantar)'
        case '2':
            return '2 vezes por dia (no almoço e no jantar)'
        case '3':
            return '3 vezes ou mais por dia'
    }
}

function getMealWithOrWithoutSkin(option) {
    switch (option) {
        case '1':
            return 'Tirar o excesso de gordura visível'
        case '2':
            return 'Comer com a pele'
    }
}