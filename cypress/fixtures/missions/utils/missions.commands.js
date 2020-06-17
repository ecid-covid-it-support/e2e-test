Cypress.Commands.add("createEducatorMissions", (mission, accessToken) => {
    cy.request({
        method: 'POST',
        url: `/educator-missions`,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '.concat(accessToken)
        },
        body: mission
    }).then(response => response.body)
})

Cypress.Commands.add("assignEducatorMission", (obj, accessToken) => {
    cy.request({
        method: 'POST',
        url: `/educator-missions/assign`,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '.concat(accessToken)
        },
        body: obj
    }).then(response => response.body)
})

Cypress.Commands.add("getWeekQuestionnaires", (childId, accessToken) => {
    cy.request({
        method: 'GET',
        url: `/observations/get-week-questionnaires/${childId}`,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '.concat(accessToken)
        }
    }).then(response => response.body)
})

Cypress.Commands.add("answerQuestion", (obj, childId, accessToken) => {
    cy.request({
        method: 'POST',
        url: `/observations/answer-question/${childId}`,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '.concat(accessToken)
        },
        body: obj
    }).then(response => response.body)
})