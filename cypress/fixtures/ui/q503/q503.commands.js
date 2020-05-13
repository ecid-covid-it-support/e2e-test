Cypress.Commands.add("checkSleepHabitsQuest", function (q503) {
    // Single page
    const q503PageArray = getQ503PageArray(q503)
    cy.get("div[id='principal']")
        .find('.mat-select-value-text')
        .each(($span, index) => {
            cy.wrap($span)
                .find('.ng-star-inserted')
                .should('have.text', q503PageArray[index])
        })

    cy.get('.mat-radio-group')
        .find('.mat-radio-checked')
        .should('attr', 'ng-reflect-value', q503.time_nap)

    cy.get('.mat-button-wrapper').contains('concluir').click()
    cy.get('.modal-body').find('button').click()
    cy.checkQ503Status('Completo')
})

Cypress.Commands.add("checkQ503Status", function (status) {
    cy.get('tbody tr:eq(2)')
        .find('div')
        .should('have.text', status === 'Completo' ? ` ${status} ` : ` ${status}`)
})

function getQ503PageArray(q503) {
    return new Array(
        getTextTimeToSleepAtNight(q503.time_sleep),
        getTextTimeWakeUp(q503.time_wake_up),
    )
}

function getTextTimeToSleepAtNight(index) {
    switch (index) {
        case '1':
            return 'Entre 8 pm-9 pm'
        case '2':
            return 'Entre 9 pm-10 pm'
        case '3':
            return 'Entre 10 pm-11 pm'
        case '4':
            return 'Entre 11 pm-12 pm'
        case '5':
            return 'Depois das 12 pm'
    }
}

// On the dashboard, the options that tell you what time the child wakes up 
// on the days they have classes are indexed from 0
function getTextTimeWakeUp(index) {
    switch (index) {
        case '0':
            return 'Antes das 6 am'
        case '1':
            return 'Entre 6 am-7 am'
        case '2':
            return 'Entre 7 am-8 am'
        case '3':
            return 'Entre 8 am-9 am'
        case '4':
            return 'Depois das 9 am'
    }
}