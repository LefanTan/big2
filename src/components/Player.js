import { useEffect, useState } from "react";
import { db } from "../services/Firebase";

/* Prop: 
playerNo = Determines where the player will be showned locally on screen, client should always be Player1
*/
export default function Player(props){
    const [inputText, setInputText] = useState('')

    var gridRowNumber = 0;
    var gridColumnNumber = 0;

    useEffect(() => {
    }, [])

    // Update gridRowNumber and gridColumnNumber based on local player number
    switch(props.playerNo.toString()){
        case '1':
            gridRowNumber = 3
            gridColumnNumber = 3
            break;
        case '2':
            gridRowNumber = 2
            gridColumnNumber = 5
            break;
        case '3':
            gridRowNumber = 1
            gridColumnNumber = 3
            break;
        case '4':
            gridRowNumber = 2
            gridColumnNumber = 1
            break;
        default:
            throw new Error("Invalid Player Number")
    }

    var playerContainer = {
        backgroundColor: 'beige',
        gridRowStart: `${gridRowNumber}`,
        gridColumnStart: `${gridColumnNumber}`,
        width: '100%',
        height: '100%',

        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems:  'center'
    }

    const submitHandler = (e) => {
        e.preventDefault()

        // TODO: Send text to the deck
        const deckRef = db.ref().child('Lobbies').child(props.lobbyCode).child('deck')
        deckRef.push({
            sender: props.playerData['name'],
            timestamp: Date.now(),
            content: inputText
        })
        setInputText('')
    }

    return(
        <div style={playerContainer}>
            <p>{props.children}</p>
            {props.playerNo === 1 &&
                <form onSubmit={submitHandler}>
                    <input type="text" value={inputText} onChange={(e) => setInputText(e.target.value)}/>
                </form>
            }
        </div>
    );
}