Cypress.Commands.add("checkNutritionGuide", function (foodsRecords) {

    const matCard = ['Breakfast', 'Morning/Afternoon snacks', 'Lunch', 'Dinner']

    const allCategoriesArray = [
        getFormattedRecords(foodsRecords[0].categories_array),
        getFormattedRecords(foodsRecords[1].categories_array),
        getFormattedRecords(foodsRecords[2].categories_array),
        getFormattedRecords(foodsRecords[3].categories_array)
    ]

    matCard.forEach((_, index) => {
        cy.get("p")
            .contains(matCard[index])
            .parent()
            .find('.my-auto')
            .children()
            .eq(1)
            .children()
            .each(($div, index2) => {
                cy.wrap($div)
                    .find("p:first()")
                    .invoke('text')
                    .then((text) => {
                        expect(text.trim()).equal(allCategoriesArray[index][index2])
                    })
            })
    })
})

function getFormattedRecords(categories) {
    const array = new Array()
    const map = mapOfFoods()

    categories.forEach((category) => {
        const newElem = parseInt(category)
        isNaN(newElem) ? array.push(map.get(category)) : array.push(`(${category})`)
    })

    return array
}

function mapOfFoods() {
    const map = new Map()

    map.set('Bread', 'Bread')
    map.set('Cereals', 'Cereals')
    map.set('ind_pastry', 'Industrial pastry')
    map.set('biscuits', 'Biscuits')
    map.set('low_milk', 'Low milk')
    map.set('vegetable_milk', 'Vegetable milk')
    map.set('Yogurt', 'Yogurt')
    map.set('Cheese', 'Cheese')
    map.set('Fruit', 'Fruit')
    map.set('ind_juice', 'Industrial juice')
    map.set('Eggs', 'Eggs')
    map.set('nuts', 'Nuts')
    map.set('Candy', 'Candy')

    map.set('sandwich', 'Sandwich')
    map.set('pizza', 'Pizza')
    map.set('hamburguer', 'Hamburguer')
    map.set('sugary_sodas', 'Sugary sodas')
    map.set('FrenchFries', 'French fries')
    map.set('caloric_dessert', 'Caloric dessert')
    map.set('Vegetable', 'Vegetable')

    map.set('Rice', 'Rice')
    map.set('Pasta', 'Pasta')
    map.set('legumes', 'Legumes')
    map.set('Meat', 'Meat')
    map.set('Fish', 'Fish')
    map.set('proc_meats', 'Processed meats')
    map.set('hot_dog', 'Hot dog')
    map.set('water', 'Water')
    map.set('olive_oil', 'Olive oil')
    map.set('industrial_sauce', 'Industrial sauce')

    return map
}