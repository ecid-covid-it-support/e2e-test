Cypress.Commands.add("checkActivityFrequencyQuest", function (q501) {
    cy.get('.mat-button-wrapper').contains('Iniciar Questionário').click()

    // Page 2
    const q501Page2Array = getQ501Page2(q501)
    cy.get("div[id$='-1'") // #cdk-step-content-?-1
        .find('mat-radio-group')
        .each(($radio_group, index) => {
            cy.wrap($radio_group)
                .find('.mat-radio-checked')
                .should('attr', 'ng-reflect-value', q501Page2Array[index])
        })
    cy.get('.mat-button-wrapper').contains('próximo').click()

    // Page 3
    const q501Page3Array = getQ501Page3(q501)
    cy.get("div[id$='-2'") // #cdk-step-content-?-2
        .find('.mat-select-value-text')
        .each(($span, index) => {
            cy.wrap($span)
                .find('.ng-star-inserted')
                .should('have.text', q501Page3Array[index])
        })
    cy.get("div[id$='-2'").find('#botonFinish').click()

    // Page 4
    const q501Page4Array = getQ501Page4(q501)
    cy.get("div[id$='-3'") // #cdk-step-content-?-2
        .find('.mat-select-value-text')
        .each(($span, index) => {
            cy.wrap($span)
                .find('.ng-star-inserted')
                .should('have.text', q501Page4Array[index])
        })
    cy.get("div[id$='-3'").find('#botonFinish').click()

    // Page 5
    const q501Page5Array = getQ501Page5(q501)
    cy.get("div[id$='-4'") // #cdk-step-content-?-4
        .find('.example-radio-group')
        .each(($radio_group, index) => {
            cy.wrap($radio_group)
                .find('.mat-radio-checked')
                .should('attr', 'ng-reflect-value', q501Page5Array[index])
        })

    cy.get('mat-radio-group').eq(23)
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

    cy.get('.mat-button-wrapper').contains('concluir').click()
    cy.get('.modal-body').find('button').click()
    cy.get('tbody tr td').eq(4).find('div').should('have.text', ' Completo ')
})

Cypress.Commands.add("checkActivityFrequencyQuestIncomplete", function (q501) {
    cy.get('.mat-button-wrapper').contains('Iniciar Questionário').click()

    // Page 2
    const q501Page2Array = getQ501Page2(q501)
    cy.get("div[id$='-1'") // #cdk-step-content-?-1
        .find('mat-radio-group')
        .each(($radio_group, index) => {
            cy.wrap($radio_group)
                .find('.mat-radio-checked')
                .should('attr', 'ng-reflect-value', q501Page2Array[index])
        })
    cy.get('.mat-horizontal-stepper-header-container mat-step-header').eq(4).click()
    cy.get('.mat-button-wrapper').contains('concluir').click()
    cy.get('.modal-content').find('.btn-success').click()
    cy.get('tbody tr td').eq(4).find('div').should('have.text', ' Incompleto 25%')
})

function getQ501Page2(q501) {
    return new Array(
        q501.a,
        q501.b,
        q501.c,
        q501.d,
        q501.e,
        q501.f,
        q501.k,
        q501.m,
        q501.n,
        q501.o,
        q501.s,
        q501.p,
        q501.q,
        q501.r,
        q501.t,
        q501.u,
    )
}

function getQ501Page3(q501) {
    return new Array(
        getTextPaqc_2(q501.paqc_2),
        getTextPaqc_3(q501.paqc_3),
        getTextNumberDaysOfTheWeak(q501.paqc_4br),
        getTextNumberDaysOfTheWeak(q501.paqc_5br),
    )
}

function getQ501Page4(q501) {
    return new Array(
        getTextNumberDaysOfTheWeak(q501.paqc_6br),
        getTextNumberDaysOfTheWeak(q501.paqc_7),
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
            return 'Não tenho aula de educação física'
        case '2':
            return 'Quase nunca'
        case '3':
            return 'Algumas vezes'
        case '4':
            return 'Muitas vezes'
        case '5':
            return 'Sempre'
    }
}

function getTextPaqc_3(index) {
    switch (index) {
        case '1':
            return 'Fico sentado (conversando, lendo, fazendo tarefas de aula, etc.)'
        case '2':
            return 'Fico passeando pelas dependências da escola'
        case '3':
            return 'Corro ou jogo um pouco'
        case '4':
            return 'Corro ou jogo bastante'
        case '5':
            return 'Corro ou jogo intensamente durante todo o recreio'
    }
}

function getTextNumberDaysOfTheWeak(index) {
    switch (index) {
        case '1':
            return 'Nenhum'
        case '2':
            return '1 vez na semana passada'
        case '3':
            return '2 ou 3 vezes na semana passada'
        case '4':
            return '4-5 vezes na semana passada'
        case '5':
            return '6 vezes na semana passada'
    }
}

function getTextPaqc_8(index) {
    switch (index) {
        case '1':
            return 'Todo ou a maioria do tempo livre realizei atividades que exige pouco ou nenhum esforço físico.'
        case '2':
            return 'Algumas vezes (1-2 vezes na última semana) realizei atividade física no meu tempo livre (por exemplo, pratiquei esporte, joguei, bola, corri, nadei, dancei, andei de bicicleta, fiz exercício físico, etc.)'
        case '3':
            return 'Frequentemente (3-4 vezes na última semana) realizei atividade física no meu tempo livre.'
        case '4':
            return 'Bastante frequentemente (5-6 vezes na última semana) realizei atividade física no meu tempo livre.'
        case '5':
            return 'Muito frequentemente (7 ou mais vezes na última semana) realizei atividade física no meu tempo livre.'
    }
}