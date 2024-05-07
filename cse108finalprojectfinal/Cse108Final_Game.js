//all games are treated as a json with 9 games
var gameJsonFile = {
    game1:{game:[],status:"", active: 0},
    game2:{game:[],status:"", active: 0},
    game3:{game:[],status:"", active: 0},
    game4:{game:[],status:"", active: 0},
    game5:{game:[],status:"", active: 0},
    game6:{game:[],status:"", active: 0},
    game7:{game:[],status:"", active: 0},
    game8:{game:[],status:"", active: 0},
    game9:{game:[],status:"", active: 0},
    turn:1,
    activeBoard:"",
    active:0,
    playerType:""
}

var databaseFile = {}

const urlParams = new URLSearchParams(window.location.search)
const seed = urlParams.get('seed')

const boardActivators = [
    "game1",
    "game2",
    "game3",
    "game4",
    "game5",
    "game6",
    "game7",
    "game8",
    "game9"
]

const winningBoardStates = [
    [1,2,3],
    [4,5,6],
    [7,8,9],
    [1,4,7],
    [2,5,8],
    [3,6,9],
    [1,5,9],
    [3,5,7]
]

const winningGameStates = [
    ["game1","game2","game3"],
    ["game4","game5","game6"],
    ["game7","game8","game9"],
    ["game1","game4","game7"],
    ["game2","game5","game8"],
    ["game3","game6","game9"],
    ["game1","game5","game9"],
    ["game3","game5","game7"]
]

const gamelist = ["game1", "game2", "game3", "game4", "game5", "game6", "game7", "game8", "game9"]

function forfeitButton(){
    var instance = M.Modal.getInstance(document.getElementById('forfeitAlert'))
    instance.open()
}

function forfeitGame(){
    if(username == databaseFile["player1_id"]){
        gameJsonFile = {
        game1:{game:[-1,-1,-1,-1,0,-1,-1,-1,-1],status:"-1", active: 0},
        game2:{game:[-1,-1,-1,-1,0,-1,-1,-1,-1],status:"-1", active: 0},
        game3:{game:[-1,-1,-1,-1,0,-1,-1,-1,-1],status:"-1", active: 0},
        game4:{game:[-1,-1,-1,-1,0,-1,-1,-1,-1],status:"-1", active: 0},
        game5:{game:[0,0,0,0,0,0,0,0,0],status:"", active: 0},
        game6:{game:[-1,-1,-1,-1,0,-1,-1,-1,-1],status:"-1", active: 0},
        game7:{game:[-1,-1,-1,-1,0,-1,-1,-1,-1],status:"-1", active: 0},
        game8:{game:[-1,-1,-1,-1,0,-1,-1,-1,-1],status:"-1", active: 0},
        game9:{game:[-1,-1,-1,-1,0,-1,-1,-1,-1],status:"-1", active: 0},
        turn:1,
        activeBoard:"done",
        active:0,
        playerType:""
        }
    }
    else{
        gameJsonFile = {
        game1:{game:[1,1,1,1,0,1,1,1,1],status:"1", active: 0},
        game2:{game:[1,1,1,1,0,1,1,1,1],status:"1", active: 0},
        game3:{game:[1,1,1,1,0,1,1,1,1],status:"1", active: 0},
        game4:{game:[1,1,1,1,0,1,1,1,1],status:"1", active: 0},
        game5:{game:[0,0,0,0,0,0,0,0,0],status:"", active: 0},
        game6:{game:[1,1,1,1,0,1,1,1,1],status:"1", active: 0},
        game7:{game:[1,1,1,1,0,1,1,1,1],status:"1", active: 0},
        game8:{game:[1,1,1,1,0,1,1,1,1],status:"1", active: 0},
        game9:{game:[1,1,1,1,0,1,1,1,1],status:"1", active: 0},
        turn:-1,
        activeBoard:"done",
        active:0,
        playerType:""
        }
    }
    updateDatabase(gameJsonFile)

}

function createGame(gameJsonFile){
    for(var key in gameJsonFile){
        if(key == "turn"){
            gameJsonFile[key] = 1
        }
        else if(key == "activeBoard" || key == "active" || key == "playerType"){

        }
        else{
            if(gameJsonFile["activeBoard"] == ""){
                gameJsonFile[key] = {game:[0,0,0,0,0,0,0,0,0], status:"", active:0}
            }
        }

    }
}

createGame(gameJsonFile)


function determineBoardState(gameJsonFile, boardActivator){
    let check = gameJsonFile[boardActivator]["game"]
    let winner = ""
    winningBoardStates.forEach(state => {
        let check1 = check[state[0]-1]
        let check2 = check[state[1]-1]
        let check3 = check[state[2]-1]

        if(check1 != 0 && check2 != 0 && check3 != 0 && check1 == check2 && check2 == check3){
            if(check1 == 1){
                gameJsonFile[boardActivator]["status"] = 1
                document.getElementById(boardActivator).classList.add("xWinner")
                document.getElementById(boardActivator).parentElement.classList.add("xWinner")
                winner = 1

            }
            else{
                gameJsonFile[boardActivator]["status"] = -1
                document.getElementById(boardActivator).classList.add("oWinner")
                document.getElementById(boardActivator).parentElement.classList.add("oWinner")
                winner = 1
            }
        }

    })
    if(gameJsonFile[boardActivator]["active"] == 9 && winner != 1){
        gameJsonFile[boardActivator]["status"] = 0
        document.getElementById(boardActivator).classList.add("draw")
        document.getElementById(boardActivator).parentElement.classList.add("draw")

    }

}

function determineWinner(gameJsonFile){
    winningGameStates.forEach(state =>{
        let check1 = gameJsonFile[state[0]]["status"]
        let check2 = gameJsonFile[state[1]]["status"]
        let check3 = gameJsonFile[state[2]]["status"]
        if(check1 != 0 && check2 != 0 && check3 != 0 && check1 == check2 && check2 == check3){
            if(check1 == 1){
                setAllBoardsInactive(gameJsonFile, "x")
                databaseFile["roomState"] = "done"
                handleWinLoss(gameJsonFile, "x")
                gameJsonFile["activeBoard"] = "done"
            }
            else{
                setAllBoardsInactive(gameJsonFile, "o")
                databaseFile["roomState"] = "done"
                handleWinLoss(gameJsonFile, "o")
                gameJsonFile["activeBoard"] = "done"
            }
        }
        let draw = true
        boardActivators.forEach(game =>{
            if(gameJsonFile[game]["status"] === ""){
                draw = false
            }
        })
        if(draw){
                setAllBoardsInactive(gameJsonFile)
                databaseFile["roomState"] = "done"
                handleWinLoss(gameJsonFile, "draw")
                gameJsonFile["activeBoard"] = "done"
        }
    })

}
var doOnce = true
function handleWinLoss(gameJsonFile, wintype){
    xml3 = new XMLHttpRequest()
    xml3.open("POST", "/leaderboard")
    xml3.setRequestHeader("Content-Type", "application/json")
    let formData = {}
    if(wintype == "x" && username == databaseFile["player1_id"] || wintype == "o" && username == databaseFile["player2_id"]){
        formData = {
            "username": username,
            "result": "win"
        }
        document.getElementById("winnerMessage").innerText = "You have won the game!"

    }
    else if (wintype != "draw"){
        formData = {
            "username": username,
            "result": "loss"
        }
        document.getElementById("winnerMessage").innerText = "You have lost the game. Better luck next time!"
    }
    else{
        formData = {
            "username": username,
            "result": "draw"
        }
        document.getElementById("winnerMessage").innerText = "It's a draw!"

    }
    if(formData != {}){
        if(doOnce){
            var instance = M.Modal.getInstance(document.getElementById('gameWinner'))
            instance.open()
            doOnce = false
            xml3.send(JSON.stringify(formData))
            xml3.onload = function() {
                if(xml3.responseText == "Stats updated"){
                }

                doOnce = false
            }

        }
    }
}
function setAllBoardsInactive(gameJsonFile){
    gamelist.forEach(game => {
        let temp = document.getElementById(game)
        if(temp.classList.contains("finished")){
        }
        else{
            temp.classList.remove("activeBoard")
            temp.classList.add("inactiveBoard")
        }
        gameJsonFile["activeBoard"] = "done"
    })

}

function determineTurnState(){
    if(gameJsonFile["turn"]=="1"){
        document.getElementById("turnStatus").innerHTML = "It is X's turn to play"
    }
    else{
        document.getElementById("turnStatus").innerHTML = "It is O's turn to play"
    }
}

function updateDatabase(gameJsonFile){
    databaseFile["roomJSONFILE"] = JSON.stringify(gameJsonFile)
    var xml2 = new XMLHttpRequest()
    xml2.open("POST", "/game/" + seed)
    xml2.setRequestHeader("Content-Type", "application/json")
    xml2.send(JSON.stringify(databaseFile))
    xml2.onload = function(){
    }
}

function createBoard(){
    for(key in gameJsonFile){
        if(key == "turn"){
            document.getElementById("turnStatus").innerHTML = "It is X's turn to play"
        }
        else if(key == "activeBoard" || key == "active" || key == "playerType"){
        }
        else{
            var gameTable = document.createElement("table")
            gameTable.id = key
            gameTable.status = 0
            gameTable.classList.add("dataTable")
            for(let i = 1; i <= 3; i++){
                var tableRow = document.createElement("tr")
                tableRow.id = key + "tr" + i
                tableRow.classList.add("dataRow")
                for(let j = 1; j <= 3; j++){
                    var tableData = document.createElement("td")
                    tableData.classList.add("dataCell")
                    tableData.id = key + "tr" + i + "td" + j
                    var button = document.createElement("button")
                    button.id = key + "tr" + i +"td" + j + "button"
                    button.boardActivator = boardActivators[i*3 + j - 4]
                    button.row = i
                    button.col = j
                    button.classList.add("cell","offHover", "modal-close", "btn-flat")
                    button.addEventListener("click", function() {

                        if((this.parentElement.parentElement.parentElement.id == gameJsonFile["activeBoard"] ||
                        gameJsonFile["activeBoard"] == "") &&
                        (gameJsonFile[this.parentElement.parentElement.parentElement.id]["status"] == "" &&
                        this.innerHTML == "") &&
                        ((gameJsonFile["turn"] == 1 &&
                        username == databaseFile["player1_id"]) ||
                        (gameJsonFile["turn"] == -1 &&
                        username == databaseFile["player2_id"])) &&
                        gameJsonFile["activeBoard"] != "done")
                        {
                            if(gameJsonFile[this.boardActivator]["status"] !== ""){
                                gameJsonFile["activeBoard"] = ""
                                document.getElementById(this.parentElement.parentElement.parentElement.id).classList.replace("activeBoard","inactiveBoard")
                                updatingGame()
                                boardActivators.forEach(board => {
                                    let temp = document.getElementById(board)
                                    if(temp.classList.contains("xWinner") || temp.classList.contains("oWinner")){
                                    }
                                    else{
                                    temp.classList.remove("activeBoard")
                                    temp.classList.add("inactiveBoard")
                                    }
                                })
                            }
                            else if(this.boardActivator == this.parentElement.parentElement.parentElement.id){
                            }
                            else{
                                document.getElementById(this.parentElement.parentElement.parentElement.id).classList.replace("activeBoard","inactiveBoard")
                                gameJsonFile["activeBoard"] = this.boardActivator
                                document.getElementById(this.boardActivator).classList.replace("inactiveBoard","activeBoard")
                                updatingGame()
                            }
                            if(gameJsonFile["turn"] == 1 && username == databaseFile["player1_id"]){
                                this.innerHTML = "X"
                                button.classList.add("xletter")
                                gameJsonFile["turn"] = -1
                                gameJsonFile[this.parentElement.parentElement.parentElement.id]["game"][(this.row*3 + this.col - 4)] = 1
                                gameJsonFile[this.parentElement.parentElement.parentElement.id]["active"]++
                                updateBoard(gameJsonFile,this.parentElement.parentElement.parentElement.id,this.row,this.col,this)
                            }
                            else if(username == databaseFile["player2_id"]){
                                this.innerHTML = "O"
                                this.classList.add("oletter")
                                gameJsonFile["turn"] = 1
                                gameJsonFile[this.parentElement.parentElement.parentElement.id]["game"][(this.row*3 + this.col - 4)] = -1
                                gameJsonFile[this.parentElement.parentElement.parentElement.id]["active"]++
                                updateBoard(gameJsonFile,this.parentElement.parentElement.parentElement.id,this.row,this.col,this)
                            }
                            determineBoardState(gameJsonFile, this.parentElement.parentElement.parentElement.id)
                            // determineTurnState(gameJsonFile)
                            if (gameJsonFile[this.boardActivator]["status"] !== "") {
                                gameJsonFile["activeBoard"] = ""
                                boardActivators.forEach(board => {
                                    let temp = document.getElementById(board)
                                    if(temp.classList.contains("xWinner") || temp.classList.contains("oWinner")){
                                    }
                                    else{
                                    temp.classList.remove("activeBoard")
                                    temp.classList.add("inactiveBoard")
                                    }
                                })
                            }
                            determineWinner(gameJsonFile)
                            updateDatabase(gameJsonFile)
                        }
                    })
                    button.addEventListener("mouseover", function(){
                        this.classList.replace("offHover", "hover")
                    })
                    button.addEventListener("mouseout", function(){
                        this.classList.replace("hover","offHover")
                    })
                    tableData.appendChild(button)
                    tableRow.appendChild(tableData)
                    updateBoard(gameJsonFile,key,i,j,button)
                }

                gameTable.append(tableRow)
            }
            document.getElementById(key).appendChild(gameTable)
        }
    }
}

function updateBoard(gameJsonFile,key,i,j,button){
    if(gameJsonFile[key]["game"][i*3 + j -4] == 1){
        button.innerHTML = "X"
        button.classList.add("xletter")
        determineBoardState(gameJsonFile, key)
        determineWinner(gameJsonFile)
    }
    else if(gameJsonFile[key]["game"][i*3 + j -4 ] == -1){
        button.innerHTML = "O"
        button.classList.add("oletter")
        determineBoardState(gameJsonFile, key)
        determineWinner(gameJsonFile)
    }
    else{
        button.innerHTML = ""
    }

}





function getGameFromDatabase(){

    var xml = new XMLHttpRequest()
    if (seed.length == 4){
        xml.open("GET", "/game/" + seed)
        xml.send()
        xml.onload = function (){
            parsed = JSON.parse(xml.responseText)
            databaseFile = parsed
            gameJsonFile = JSON.parse(parsed["roomJSONFILE"])
        }
    }
}


getGameFromDatabase()
createBoard()
function updatingGame() {
    if((gameJsonFile["turn"] == 1 && username == databaseFile["player1_id"]) || (gameJsonFile["turn"] == -1 && username == databaseFile["player2_id"])){
        document.getElementById("turnStatus").innerHTML = "It is your turn to play"
    }
    else{
        document.getElementById("turnStatus").innerHTML = "It is your opponent's turn to play"
        getGameFromDatabase()
    }
    for(key in gameJsonFile){
        if(key == "turn"){
            // determineTurnState()
        }
        else if(key == "active" || key == "playerType" || key == "activeBoard"){
        }
        else{
            document.getElementById(key).classList.replace("activeBoard","inactiveBoard")
            for(let i = 1; i <= 3; i++){
                for(let j = 1; j <= 3; j++){
                    let button = document.getElementById(key + "tr" + i +"td" + j + "button")
                    updateBoard(gameJsonFile,key,i,j,button)
                }
            }
        }
    }



    if(gameJsonFile["activeBoard"] != "" && gameJsonFile["activeBoard"] != "done"){
        document.getElementById(gameJsonFile["activeBoard"]).classList.replace("inactiveBoard","activeBoard")
    }
    if(gameJsonFile["activeBoard"] == ""){
        boardActivators.forEach(board => {
            let temp = document.getElementById(board)
            if(temp.classList.contains("xWinner") || temp.classList.contains("oWinner")){
            }
            else{
            temp.classList.add("activeBoard")
            temp.classList.remove("inactiveBoard")
            }
        })
    }
}
setInterval (updatingGame, 1000)

document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.modal')
    var instances = M.Modal.init(elems)
})















