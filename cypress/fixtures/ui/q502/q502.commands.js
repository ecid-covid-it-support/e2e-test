Cypress.Commands.add("checkPhysicalHabitsQuest", function (q502) {
    cy.get('.mat-button-wrapper').contains('Start Questionnaire').click()

    // Page 2
    const q502Page2Array = getQ502Page2(q502)
    cy.get("div[id$='-1']") // #cdk-step-content-?-1
        .find('.mat-select-value-text')
        .each(($span, index) => {
            cy.wrap($span)
                .find('.ng-star-inserted')
                .should('have.text', q502Page2Array[index])
        })

    if (q502.transport_to_school === '6') { // 6: outro*
        cy.get("input[id^='mat-input']").should('have.value', q502.another_way_expl)
    }

    cy.get("div[id$='-1']")
        .find('.mat-radio-checked')
        .should('attr', 'ng-reflect-value', q502.sports_practice)

    const sportsDuringSchoolHours = getSportsDuringSchoolHours(q502)
    if (q502.sports_practice === '1') {
        cy.get("div[id$='-1']")
            .find('mat-checkbox')
            .each(($check_box, index) => {
                cy.wrap($check_box)
                    .should('attr', 'ng-reflect-model', sportsDuringSchoolHours[index].toString())
            })
    }

    cy.get('.mat-button-wrapper').contains('next').click()

    // Page 3
    const answersPagetree = getAnswersPagetree(q502)
    cy.get("div[id$='-2']") // #cdk-step-content-?-2
        .find('mat-radio-group')
        .each(($radio_group, index) => {
            cy.wrap($radio_group)
                .find('.mat-radio-checked')
                .should('attr', 'ng-reflect-value', answersPagetree[index])
        })

    if (q502.parents_sport === '1') {
        cy.get("div[id$='-2']") // #cdk-step-content-?-2
            .find('.mat-select-value-text')
            .should('have.text', getTextTimes(q502.time_pa_parents))
    }

    cy.get("div[id$='-2']").find('#botonFinish').click()

    // Page 4
    const q502Page4Array = getQ502Page4(q502)
    cy.get("div[id$='-3']") // #cdk-step-content-?-3
        .find('.mat-select-value-text')
        .each(($span, index) => {
            cy.wrap($span)
                .find('.ng-star-inserted')
                .should('have.text', q502Page4Array[index])
        })

    cy.get("div[id$='-3']")
        .find('.mat-radio-checked')
        .should('attr', 'ng-reflect-value', q502.mobile_phone)

    cy.get('.mat-button-wrapper').contains('finish').click()
    cy.get('.modal-body').find('button').click()
    cy.checkQ502Status('Complete')
})

Cypress.Commands.add("checkQ502Status", function (status) {
    cy.get('tbody tr:eq(2)')
        .prev()
        .find('div')
        .should('have.text', status === 'Complete' ? ` ${status} ` : ` ${status}`)
})

Cypress.Commands.add("checkPhysicalHabitsQuestIncomplete", function (q502) {
    cy.get('.mat-button-wrapper').contains('Start Questionnaire').click()

    // Page 2
    const q502Page2Array = getQ502Page2(q502)
    cy.get("div[id$='-1']") // #cdk-step-content-?-1
        .find('.mat-select-value-text')
        .each(($span, index) => {
            cy.wrap($span)
                .find('.ng-star-inserted')
                .should('have.text', q502Page2Array[index])
        })

    cy.get("div[id$='-1']")
        .find('.mat-radio-checked')
        .should('attr', 'ng-reflect-value', q502.sports_practice)

    cy.get('.mat-button-wrapper').contains('next').click()

    // Page 3
    const sports = [q502.fun_sports, q502.parents_sport]
    cy.get("div[id$='-2']") // #cdk-step-content-?-2
        .find('mat-radio-group')
        .each(($radio_group, index) => {
            cy.wrap($radio_group)
                .find('.mat-radio-checked')
                .should('attr', 'ng-reflect-value', sports[index])
        })
    cy.get("div[id$='-2']").find('#botonFinish').click()

    // Page 4
    const emptyString = ''
    cy.get("div[id$='-3']") // #cdk-step-content-?-3
        .find('.mat-select-value')
        .each(($span) => {
            cy.wrap($span)
                .should('have.value', emptyString)
        })

    cy.get("div[id$='-3']")
        .find('.mat-radio-checked')
        .should('not.exist')

    cy.get('.mat-button-wrapper').contains('finish').click()
    cy.get('.modal-body').find('.btn-success').click()
    cy.checkQ502Status('Incomplete 67%')
})

function getQ502Page2(q502) {
    return new Array(
        getTextTransportToSchool(q502.transport_to_school),
        getTextTimeInTransportToSchool(q502.time_in_transport_to_school)
    )
}

function getQ502Page4(q502) {
    return new Array(
        getTextHours(q502.screen_time_schooldays),
        getTextHours(q502.screen_time_weekends),
        getTextHours(q502.mobilephone_time_schooldays),
        getTextHours(q502.mobilephone_time_weekends)
    )
}

function getAnswersPagetree(q502) {
    const array = [q502.fun_sports, q502.parents_sport]
    if (q502.parents_sport === '1') {
        array.push(q502.fun_parents_sport, q502.time_sport_parents)
    }
    return array
}

function getTextTransportToSchool(index) {
    switch (index) {
        case '1':
            return 'By school bus'
        case '2':
            return 'By car/motorbike'
        case '3':
            return 'By public transport'
        case '4':
            return 'Walking'
        case '5':
            return 'On a bicycle'
        case '6':
            return 'Another way*'
    }
}

function getSportsDuringSchoolHours(q502) {
    return new Array(
        q502.sport_type_1,
        q502.sport_type_2,
        q502.sport_type_3,
        q502.sport_type_4,
        q502.sport_type_5,
        q502.sport_type_6,
        q502.sport_type_7,
    )
}

function getTextTimeInTransportToSchool(index) {
    switch (index) {
        case '1':
            return 'Less than half an hour'
        case '2':
            return 'Between half an hour and an hour'
        case '3':
            return 'More than one hour'
    }
}

function getTextHours(index) {
    switch (index) {
        case '1':
            return 'None'
        case '2':
            return 'Less than an hour'
        case '3':
            return '1 hour'
        case '4':
            return '2 hours'
        case '5':
            return '3 hours'
        case '6':
            return 'More than 3 hours'
    }
}

function getTextTimes(index) {
    switch (index) {
        case '1':
            return 'Once a week'
        case '2':
            return 'More than once a week'
        case '3':
            return 'Once a month'
        case '4':
            return 'Very occasionally'
        case '5':
            return 'never'
    }
}