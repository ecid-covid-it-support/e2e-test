Cypress.Commands.add("checkQ601ChildEatingBehaviourQuest", function (q601) {
    cy.get('.mat-button-wrapper').contains('Start Questionnaire').click()

    // Page 2
    const answersPageTwo = getAnswersPageTwo(q601)
    cy.get("div[id$='-1']") // #cdk-step-content-?-1
        .find('mat-radio-group')
        .each(($radio_group, index) => {
            cy.wrap($radio_group)
                .find('.mat-radio-checked')
                .should('attr', 'ng-reflect-value', answersPageTwo[index])
        })
    cy.get('.mat-button-wrapper').contains('next').click()

    // Page 3
    const answersPageTree = getAnswersPageTree(q601)
    cy.get("div[id$='-2']") // #cdk-step-content-?-2
        .find('mat-radio-group')
        .each(($radio_group, index) => {
            cy.wrap($radio_group)
                .find('.mat-radio-checked')
                .should('attr', 'ng-reflect-value', answersPageTree[index])
        })
    cy.get("div[id$='-2']").find('#botonFinish').click()

    // Page 4
    const answersPageFour = getAnswersPageFour(q601)
    cy.get("div[id$='-3']") // #cdk-step-content-?-3
        .find('mat-radio-group')
        .each(($radio_group, index) => {
            cy.wrap($radio_group)
                .find('.mat-radio-checked')
                .should('attr', 'ng-reflect-value', answersPageFour[index])
        })
    cy.get("div[id$='-3']").find('#botonFinish').click()

    // Page 5
    const answersPageFive = getAnswersPageFive(q601)
    cy.get("div[id$='-4']") // #cdk-step-content-?-4
        .find('mat-radio-group')
        .each(($radio_group, index) => {
            cy.wrap($radio_group)
                .find('.mat-radio-checked')
                .should('attr', 'ng-reflect-value', answersPageFive[index])
        })
    cy.get("div[id$='-4']").find('#botonFinish').click()

    // Page 6
    const answersPageSix = getAnswersPageSix(q601)
    cy.get("div[id$='-5']") // #cdk-step-content-?-5
        .find('mat-radio-group')
        .each(($radio_group, index) => {
            cy.wrap($radio_group)
                .find('.mat-radio-checked')
                .should('attr', 'ng-reflect-value', answersPageSix[index])
        })

    cy.get('.mat-button-wrapper').contains('finish').click()
    cy.get('.modal-content').find('#cancel').click()
    cy.checkQ601ChildEatingBehaviourStatus('Complete')
})

Cypress.Commands.add("checkQ601ChildEatingBehaviourStatus", function (status) {
    cy.get('div').contains('Questionnaires').click()
    cy.get('tbody tr:eq(2)')
        .find('div')
        .should('have.text', status === 'Complete' ? ` ${status} ` : ` ${status}`)
})

function getAnswersPageTwo(q601) {
    return new Array(
        q601.ef_01,
        q601.eoe_01,
        q601.sr_01,
        q601.se_01,
        q601.ef_02,
        q601.dd_01,
        q601.ff_01,
    )
}

function getAnswersPageTree(q601) {
    return new Array(
        q601.se_02,
        q601.eue_01,
        q601.ff_02,
        q601.eue_02,
        q601.fr_01,
        q601.eoe_02,
        q601.fr_02,
    )
}

function getAnswersPageFour(q601) {
    return new Array(
        q601.eoe_03,
        q601.ff_09,
        q601.sr_02,
        q601.se_03,
        q601.fr_03,
        q601.ef_03,
        q601.sr_03,
    )
}

function getAnswersPageFive(q601) {
    return new Array(
        q601.ef_04,
        q601.eue_03,
        q601.ff_04,
        q601.eue_04,
        q601.sr_04,
        q601.eoe_04,
        q601.fr_04,
    )
}

function getAnswersPageSix(q601) {
    return new Array(
        q601.dd_02,
        q601.sr_05,
        q601.dd_03,
        q601.ff_05,
        q601.ff_06,
        q601.fr_05,
        q601.se_04,
    )
}