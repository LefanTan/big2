export function getCardImage(cardType){
    const images = require.context('../assets/cards/', true)

    var cardImage = images(`./${cardType}.png`)

    if(typeof(cardImage) === 'undefined'){
        throw Error('Invalid Card Type')
    }
    return cardImage['default']
}

export function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]
    }
}

export function sortCard(x, y){
    // largest to smallest
    const numOrder = ['02', '0A', '0K', '0J', '0Q', '10', '09', '08', '07', '06', '05', '04', '03']
    const suitOrder = ['S', 'L', 'C', 'D']

    var xNumIndex = numOrder.indexOf(x.slice(0, 2).toUpperCase())
    var yNumIndex = numOrder.indexOf(y.slice(0, 2).toUpperCase())
    var xSuitIndex = suitOrder.indexOf(x.slice(2).toUpperCase())
    var ySuitIndex = suitOrder.indexOf(y.slice(2).toUpperCase())

    if(xNumIndex > yNumIndex)
        return 1
    else if (xNumIndex < yNumIndex)
        return -1
    else{ // both num index is the same, check for suit
        if(xSuitIndex > ySuitIndex)
            return 1
        else if(xSuitIndex < ySuitIndex)
            return -1
        return 0
    }
}