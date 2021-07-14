export function GetCardImage(cardType){
    const images = require.context('../assets/cards/', true)

    var cardImage = images(`./${cardType}.png`)

    if(typeof(cardImage) === 'undefined'){
        throw Error('Invalid Card Type')
    }
    return cardImage['default']
}