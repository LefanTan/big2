import { useState } from "react";

/* Prop: 
playerNo = Determines where the player will be showned locally on screen, client should always be Player1
*/
export default function Player(props){
    const [text, setText] = useState('')

    var gridRowNumber = 0;
    var gridColumnNumber = 0;

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
        console.log(text)
        setText('')
    }

    return(
        <div style={playerContainer}>
            <p>{props.children}</p>
            {props.playerNo === 1 &&
                <form onSubmit={submitHandler}>
                    <input type="text" value={text} onChange={(e) => setText(e.target.value)}/>
                </form>
            }
        </div>
    );
}