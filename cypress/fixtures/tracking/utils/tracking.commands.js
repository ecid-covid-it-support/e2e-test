Cypress.Commands.add("createTrackingResource", (resource, child_id, obj, accessToken) => {
    cy.request({
        method: 'POST',
        url: `/children/${child_id}/${resource}`,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '.concat(accessToken)
        },
        body: obj
    }).then(response => response.body)
})

Cypress.Commands.add("createInstitutionEnv", (institution_id, environment, accessToken) => {
    cy.request({
        method: 'POST',
        url: `/institutions/${institution_id}/environments`,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '.concat(accessToken)
        },
        body: environment
    }).then(response => response.body)
})

Cypress.Commands.add("createChildLogs", (logs, childId, resource, accessToken) => {
    cy.request({
        method: 'POST',
        url: `/children/${childId}/logs/${resource}`,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '.concat(accessToken)
        },
        body: logs
    }).then(response => response.body)
})