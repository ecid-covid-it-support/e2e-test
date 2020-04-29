Cypress.Commands.add("createQuest", (resource, quest, accessToken) => {
    cy.request({
        method: 'POST',
        url: `/${resource}`,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '.concat(accessToken)
        },
        body: quest
    }).then(response => response.body)
})

Cypress.Commands.add("updateQuest", (resource, quest, accessToken) => {
    cy.request({
        method: 'PATCH',
        url: `/${resource}/${quest.id}`,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '.concat(accessToken)
        },
        body: quest
    }).then(response => response.body)
})
