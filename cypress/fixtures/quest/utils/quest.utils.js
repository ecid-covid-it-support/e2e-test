Cypress.Commands.add("createQ501", (q501, accessToken) => {
    cy.request({
        method: 'POST',
        url: '/q501physicalactivityforchildren',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '.concat(accessToken)
        },
        body: q501
    }).then(response => response.body)
})

Cypress.Commands.add("updateQ501", (q501, accessToken) => {
    cy.request({
        method: 'PATCH',
        url: `/q501physicalactivityforchildren/${q501.id}`,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '.concat(accessToken)
        },
        body: q501
    }).then(response => response.body)
})
