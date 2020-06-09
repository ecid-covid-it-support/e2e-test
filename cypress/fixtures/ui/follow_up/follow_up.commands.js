Cypress.Commands.add("selectFollowUpGuide", function (num) {
    // 1: Nutrition, 2: Physical Activity, 3: Sleep
    cy.get(`div[aria-posinset='${num}']`).click()
})