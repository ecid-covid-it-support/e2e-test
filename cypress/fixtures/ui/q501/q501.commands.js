Cypress.Commands.add("checkActivityFrequencyQuest", function (q501) {
    cy.get('.mat-button-wrapper').contains('Start Questionnaire').click()

    // Page 2
    const q501Page2Array = getQ501Page2(q501)
    cy.get("div[id$='-1']") // #cdk-step-content-?-1
        .find('mat-radio-group')
        .each(($radio_group, index) => {
            cy.wrap($radio_group)
                .find('.mat-radio-checked')
                .should('attr', 'ng-reflect-value', q501Page2Array[index])
        })
    cy.get('.mat-button-wrapper').contains('next').click()

    // Page 3
    const q501Page3Array = getQ501Page3(q501)
    cy.get("div[id$='-2']") // #cdk-step-content-?-2
        .find('.mat-select-value-text')
        .each(($span, index) => {
            cy.wrap($span)
                .find('.ng-star-inserted')
                .should('have.text', q501Page3Array[index])
        })
    cy.get("div[id$='-2']").find('#botonFinish').click()

    // Page 4
    const q501Page4Array = getQ501Page4(q501)
    cy.get("div[id$='-3']") // #cdk-step-content-?-3
        .find('.mat-select-value-text')
        .each(($span, index) => {
            cy.wrap($span)
                .find('.ng-star-inserted')
                .should('have.text', q501Page4Array[index])
        })
    cy.get("div[id$='-3']").find('#botonFinish').click()

    // Page 5
    const q501Page5Array = getQ501Page5(q501)
    cy.get("div[id$='-4']") // #cdk-step-content-?-4
        .find('.example-radio-group')
        .each(($radio_group, index) => {
            cy.wrap($radio_group)
                .find('.mat-radio-checked')
                .should('attr', 'ng-reflect-value', q501Page5Array[index])
        })

    cy.get('mat-radio-group').eq(21)
        .children()
        .each(($radio_button, index) => {
            if (index === 0) {
                if (q501.paqc_10 === '1') {
                    cy.wrap($radio_button).should('have.class', 'mat-radio-checked')
                }
            } else {
                if (q501.paqc_10 === '2') {
                    cy.wrap($radio_button).should('have.class', 'mat-radio-checked')
                }
            }
        })

    if (q501.paqc_10 === '1') {
        cy.get('.mat-input-element').invoke('attr', 'ng-reflect-value').should('eq', q501.paqc_11)
    }

    cy.get('.mat-button-wrapper').contains('finish').click()
    cy.get('.modal-body').find('button').click()
    cy.checkQ501Status('Complete')
})

Cypress.Commands.add("checkQ501Status", function (status) {
    cy.get('tbody tr:eq(0)')
        .find('div')
        .should('have.text', status === 'Complete' ? ` ${status} ` : ` ${status}`)
})

Cypress.Commands.add("checkActivityFrequencyQuestIncomplete", function (q501) {
    cy.get('.mat-button-wrapper').contains('Start Questionnaire').click()

    // Page 2
    const q501Page2Array = getQ501Page2(q501)
    cy.get("div[id$='-1']") // #cdk-step-content-?-1
        .find('mat-radio-group')
        .each(($radio_group, index) => {
            cy.wrap($radio_group)
                .find('.mat-radio-checked')
                .should('attr', 'ng-reflect-value', q501Page2Array[index])
        })
    cy.get('.mat-button-wrapper').contains('next').click()

    // Page 3
    const emptyString = ''
    cy.get("div[id$='-2']") // #cdk-step-content-?-2
        .find('.mat-select-value')
        .each(($span) => {
            cy.wrap($span)
                .should('have.value', emptyString)
        })
    cy.get("div[id$='-2']").find('#botonFinish').click()

    // Page 4
    cy.get("div[id$='-3']") // #cdk-step-content-?-3
        .find('.mat-select-value')
        .each(($span) => {
            cy.wrap($span)
                .should('have.value', emptyString)
        })
    cy.get("div[id$='-3']").find('#botonFinish').click()

    // Page 5
    cy.get("div[id$='-4']") // #cdk-step-content-?-4
        .find('.example-radio-group')
        .each(($radio_group) => {
            cy.wrap($radio_group)
                .find('.mat-radio-checked')
                .should('not.exist')
        })
    cy.get('mat-radio-group')
        .eq(21)
        .find('.mat-radio-checked')
        .should('not.exist')

    cy.get('.mat-button-wrapper').contains('finish').click()
    cy.get('.modal-content').find('.btn-success').click()
    cy.checkQ501Status('Incomplete 25%')

})

function getQ501Page2(q501) {
    return new Array(
        q501.a,
        q501.b,
        q501.c,
        q501.d,
        q501.e,
        q501.f,
        q501.gh,
        q501.i,
        q501.k,
        q501.l,
        q501.m,
        q501.n,
        q501.o,
        q501.p,
    )
}

function getQ501Page3(q501) {
    return new Array(
        getTextPaqc_2(q501.paqc_2),
        getTextPaqc_3(q501.paqc_3),
        getTextPaqc_3(q501.paqc_4),
        getTextNumberDaysOfTheWeak(q501.paqc_5),
    )
}

function getQ501Page4(q501) {
    return new Array(
        getTextNumberDaysOfTheWeak(q501.paqc_6),
        getTextTimesInWeekend(q501.paqc_7),
        getTextPaqc_8(q501.paqc_8),
    )
}

function getQ501Page5(q501) {
    return new Array(
        q501.a_7,
        q501.b_7,
        q501.c_7,
        q501.d_7,
        q501.e_7,
        q501.f_7,
        q501.g_7,
    )
}

function getTextPaqc_2(index) {
    switch (index) {
        case '1':
            return "I don't do physical edycation classes"
        case '2':
            return 'Hardly ever'
        case '3':
            return 'Sometimes'
        case '4':
            return 'Quite often'
        case '5':
            return 'Always'
    }
}

function getTextPaqc_3(index) {
    switch (index) {
        case '1':
            return 'Sat down (reading, talking, doing schoolwork..)'
        case '2':
            return 'Stood around or walked around'
        case '3':
            return 'Ran or played a bit'
        case '4':
            return 'Ran around and play quite a bit'
        case '5':
            return 'Ran and played hard most of the time'
    }
}

function getTextNumberDaysOfTheWeak(index) {
    switch (index) {
        case '1':
            return 'None'
        case '2':
            return '1 time last week'
        case '3':
            return '2 or 3 times last week'
        case '4':
            return '4 times last week'
        case '5':
            return '5 times last week'
    }
}

function getTextTimesInWeekend(index) {
    switch (index) {
        case '1':
            return 'None'
        case '2':
            return '1 time'
        case '3':
            return '2 or 3 times'
        case '4':
            return '4 times'
        case '5':
            return '5 times'
    }
}

function getTextPaqc_8(index) {
    switch (index) {
        case '1':
            return 'Most of the time was spent in little physical effort activities'
        case '2':
            return '1 or 2 times I did physical activities'
        case '3':
            return '3 or 4 times I did physical activities'
        case '4':
            return '5 or 6 times I did physical activities'
        case '5':
            return '7 or more times I did physical activities'
    }
}