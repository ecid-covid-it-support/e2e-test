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