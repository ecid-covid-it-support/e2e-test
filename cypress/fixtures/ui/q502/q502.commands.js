Cypress.Commands.add("checkPhysicalHabitsQuest", function (q502) {
    cy.get('.mat-button-wrapper').contains('Iniciar Questionário').click()

    // Page 2
    const q502Page2Array = getQ502Page2(q502)
    cy.get("div[id$='-1'") // #cdk-step-content-?-1
        .find('.mat-select-value-text')
        .each(($span, index) => {
            cy.wrap($span)
                .find('.ng-star-inserted')
                .should('have.text', q502Page2Array[index])
        })

    cy.get('.mat-button-wrapper').contains('próximo').click()

    // Page 3
    cy.get("div[id$='-2'") // #cdk-step-content-?-2
        .find('mat-radio-group')
        .each(($radio_group) => {
            cy.wrap($radio_group)
                .find('.mat-radio-checked')
                .should('attr', 'ng-reflect-value', q502.parents_sport)
        })
    cy.get("div[id$='-2'").find('#botonFinish').click()

    // Page 4
    const q502Page4Array = getQ502Page4(q502)
    cy.get("div[id$='-3'") // #cdk-step-content-?-1
        .find('.mat-select-value-text')
        .each(($span, index) => {
            cy.wrap($span)
                .find('.ng-star-inserted')
                .should('have.text', q502Page4Array[index])
        })

    cy.get('.mat-button-wrapper').contains('concluir').click()
    cy.get('.modal-body').find('button').click()
    cy.get('tbody tr:eq(2)').prev().find('div').should('have.text', ' Completo ')
})

function getQ502Page2(q502) {
    const array = []
    let index = 0
    array[index] = getTextTransportToSchool(q502.transport_to_school)
    if (q502.transport_to_school === '6') { // 6: outro*
        array[++index] = q502.another_way_expl
    }
    array[++index] = getTextTimeInTransportToSchool(q502.time_in_transport_to_school)
    return array
}

function getQ502Page4(q502) {
    return new Array(
        getTextHours(q502.screen_time_schooldays),
        getTextHours(q502.screen_time_weekends),
        getTextHours(q502.mobilephone_time_schooldays),
        getTextHours(q502.mobilephone_time_weekends)
    )
}

function getTextTransportToSchool(index) {
    switch (index) {
        case '1':
            return 'ônibus/transporte escolar (sem ser público)'
        case '2':
            return 'carro/motocicleta'
        case '3':
            return 'transporte público'
        case '4':
            return 'caminhando'
        case '5':
            return 'bicicleta'
        case '6':
            return 'outro*'
    }
}

function getTextTimeInTransportToSchool(index) {
    switch (index) {
        case '1':
            return 'menos de 30 minutos'
        case '2':
            return 'entre 30 minutos e 1 hora'
        case '3':
            return 'mais de 1 hora'
    }
}

function getTextHours(index) {
    switch (index) {
        case '1':
            return 'Nenhuma'
        case '2':
            return 'Menos de 1 hora'
        case '3':
            return '1 hora'
        case '4':
            return '2 horas'
        case '5':
            return '3 horas'
        case '6':
            return 'Mais de 3 horas'
    }
}