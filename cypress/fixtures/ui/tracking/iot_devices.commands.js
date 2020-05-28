Cypress.Commands.add("checkIoTDevices", function (weights, environments) {

    const measurements = getValues(weights, environments)
    cy.get("p[id=data]")
        .each(($p, index) => {
            cy.wrap($p)
                .should('have.text', measurements[index])
        })
})

function getValues(weights, environments) {
    return new Array(
        `${weights.value} ${weights.unit}`,
        `${environments.measurements[0].value} ${environments.measurements[0].unit}`,
        `${environments.measurements[1].value} ${environments.measurements[1].unit}`
    )
}