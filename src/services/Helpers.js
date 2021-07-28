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

// smallest to largest
const numOrder = ['03', '04', '05', '06', '07', '08', '09', '10', '0J', '0Q', '0K', '0A', '02']
const suitOrder = ['D', 'C', 'L', 'S']

// Sort the cards from smallest to biggest
export function sortCard(x, y){
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

// smallest to biggest 
const combosType = ['straight', 'flush', 'full house', 'four of a kind', 'straight flush', 'royal flush']
// Takes two combo type and return true if first set is bigger than second set
// Exception: for types single, double and triple, they'll only return true if both param are of same type etc (first: double, second: double) 
// Doesn't apply to triples, doubles or singles 
export function biggerOrEqualCombo(first, second){
    if(first === second) return true
    else if((combosType.indexOf(first) !== -1 && combosType.indexOf(second) !== -1) && combosType.indexOf(first) >= combosType.indexOf(second)) return true
    return false
}

// cards param must be an array
// Return an array (combo type, biggestCardInDeck, emoji)
export function getCardType(cards){
    // Biggest to smallest
    var sortedCards = [...cards].sort(sortCard).reverse()

    var firstSuitIndex, secondSuitIndex, thirdSuitIndex = ''

    if(cards.length === 1){
        return ['single', cards[0], '']
    }else if(cards.length === 2 && cards[0].substring(0, 2) === cards[1].substring(0, 2)){ // make sure first card and second card has the same number type
        firstSuitIndex = suitOrder.indexOf(cards[0].substring(2))
        secondSuitIndex = suitOrder.indexOf(cards[1].substring(2))

        return ['double',  firstSuitIndex > secondSuitIndex ? cards[0] : cards[1], '¯\\_(° ͜ʖ °)_/¯']
    }else if(cards.length === 3 && (cards[0].substring(0, 2) === cards[1].substring(0, 2) && cards[0].substring(0, 2) === cards[2].substring(0, 2))){ // make sure first card, second and third card has the same number type
        firstSuitIndex = suitOrder.indexOf(cards[0].substring(2))
        secondSuitIndex = suitOrder.indexOf(cards[1].substring(2))
        thirdSuitIndex = suitOrder.indexOf(cards[2].substring(2))

        return ['triple',  firstSuitIndex > secondSuitIndex ? (thirdSuitIndex > firstSuitIndex ? cards[2] : cards[0]) : cards[1], '╭( ๐_๐)╮']
    }else if(cards.length === 5){ // 5 cards combo
        // Check for straights and straight flushes
        let firstSuit = sortedCards[0].slice(2)

        // FLUSHES, ROYAL AND STRAIGHT FLUSHES
        if(sortedCards.every((card) => { // True if all suit is same
            return card.slice(2) === firstSuit
        })){
            // If all cards are bigger than the next one by one, it is a straight flush
            let prevCardIndex = 0
            if(sortedCards.every((card) => {
                var index = numOrder.indexOf(card.slice(0, 2))
                if(prevCardIndex - index === 1 || prevCardIndex === 0){
                    prevCardIndex = index
                    return true
                }
                return false
            })){
                if(sortedCards[0].slice(0, 2) === '0A') // If biggest card starts with A, it is a royal flush
                    return ['royal flush', sortedCards[0], '✧･ﾟ:*( ͡ꈍ ͜ʖ̫ ͡ꈍ )*:･ﾟ✧']

                return ['straight flush', sortedCards[0], '( ͡° ͜ʖ ͡°)_╭∩╮']
            }

            return ['flush', sortedCards[0], '~( ˘▾˘~)']
        }

        // STRAIGHTS
        // If all cards are bigger than the next one by one, it is a straight
        let prevCardIndex = ''
        if(sortedCards.every((card) => {
            var index = numOrder.indexOf(card.slice(0, 2))
            if(prevCardIndex - index === 1 || prevCardIndex === ''){
                prevCardIndex = index
                return true
            }
            return false
        })){
            return ['straight', sortedCards[0], '(≖ ͜ʖ≖)']
        }

        //FOUR OF A KIND & FULL HOUSE
        let cardsWithoutSuits = []
        sortedCards.forEach(card => cardsWithoutSuits.push(card.slice(0, 2)))
        let uniqueCards = cardsWithoutSuits.filter((x, index) => cardsWithoutSuits.indexOf(x) === index)
        // there should only be two unique items in a Full house or four of a kind
        let firstItemCount = 0
        let secondItemCount = 0

        // Count how many times the two cards appear
        cardsWithoutSuits.forEach(cards => {
            if(cards === uniqueCards[0]) firstItemCount++
            else if(cards === uniqueCards[1]) secondItemCount++
        })

        // FOUR OF A KIND
        if(Math.abs(firstItemCount - secondItemCount) === 3){ 
            let biggestCard = ''
            if (firstItemCount > secondItemCount) biggestCard = sortedCards[0] 
            else biggestCard = sortedCards[1]

            return ['four of a kind', biggestCard, '(ʃƪ˶˘ ﻬ ˘˶)']
        }

        // FULL HOUSE
        if(Math.abs(firstItemCount - secondItemCount) === 1){ // Full house
            let biggestCard = ''
            if (firstItemCount > secondItemCount) biggestCard = sortedCards[0] 
            else biggestCard = sortedCards[2]

            return ['full house', biggestCard, '(~‾⌣‾)~']
        }
    }

    return ['invalid', -1, '']
}