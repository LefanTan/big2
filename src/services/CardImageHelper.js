export function GetCardImage(cardType){
    const images = require.context('../assets/cards/', true)

    var cardImage = images(`./${cardType.toUpperCase()}.png`)

    if(typeof(cardImage) === 'undefined'){
        throw Error('Invalid Card Type')
    }
    return cardImage['default']
}