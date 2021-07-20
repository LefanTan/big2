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