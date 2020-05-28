Cypress.Commands.add("checkBreakfastQuest", function (breakfastQuest) {
    cy.get('mat-dialog-container')
        .find('input')
        .should('attr', 'ng-reflect-model', breakfastQuest.date)

    cy.get('mat-dialog-container')
        .find('.mat-select-value-text')
        .should('have.text', breakfastQuest.type)

    const foodsBreakfastMap = getFoodsOfBreakfast(breakfastQuest.categories_array)
    const checked = []
    const amounts = []
    getFoodsandAmounts(foodsBreakfastMap, checked, amounts)
    cy.get('mat-checkbox')
        .each(($check_box, index) => {
            cy.wrap($check_box).should('attr', 'ng-reflect-model', checked[index])
        })
        .parent()
        .parent() // div -> [class= col-md-4] | [font-size: 18px]
        .find('p:nth-child(2)') // All <p> elements that are the 2nd child of their parent
        .each(($p, index) => {
            cy.wrap($p)
                .should('have.text', amounts[index])
        })

    cy.get('#save').click()
})

function getFoodsOfBreakfast(categories) {
    let foodsMap = getFoods()

    for (let i = 0; i < (categories.length - 1); i += 2) {
        foodsMap.set(categories[i], ['true', categories[i + 1]])
    }

    return foodsMap
}

function getFoodsandAmounts(map, checked, amounts) {
    const values = map.values()

    for (let v of values) {
        checked.push(v[0])

        if (v[0] === 'true') {
            amounts.push(v[1])
        }
    }
}

// returns food in the order in which it is found(from left to right)
function getFoods() {
    const map = new Map()

    map.set('Bread', ['false', '0'])
    map.set('low_milk', ['false', '0'])
    map.set('Fruit', ['false', '0'])
    map.set('Cereals', ['false', '0'])
    map.set('vegetable_milk', ['false', '0'])
    map.set('ind_juice', ['false', '0'])
    map.set('ind_pastry', ['false', '0'])
    map.set('Yogurt', ['false', '0'])
    map.set('biscuits', ['false', '0'])
    map.set('Cheese', ['false', '0'])
    map.set('Eggs', ['false', '0'])
    map.set('nuts', ['false', '0'])
    map.set('Candy', ['false', '0'])

    return map
}