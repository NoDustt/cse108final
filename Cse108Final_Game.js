//all games are treated as a json with 9 games
const gameJsonFile = {
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
    active:0
}

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


function createGame(gameJsonFile){
    for(var key in gameJsonFile){
        if(key == "turn"){
            gameJsonFile[key] = 1
        }
        else if(key == "activeBoard" || key == "active"){
            
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
    console.log(boardActivator)
    let check = gameJsonFile[boardActivator]["game"]
    let winner = 0
    winningBoardStates.forEach(state => {
        let check1 = check[state[0]-1]
        let check2 = check[state[1]-1]
        let check3 = check[state[2]-1]
        if(check1 != 0 && check2 != 0 && check3 != 0 && check1 == check2 && check2 == check3){
            if(check1 == 1){
                gameJsonFile[boardActivator]["status"] = 1
                document.getElementById(boardActivator).classList.add("xWinner")
                winner = 1
            }
            else{
                gameJsonFile[boardActivator]["status"] = -1
                document.getElementById(boardActivator).classList.add("oWinner")
                winner = 1
            }
        }
        
    })
    if(gameJsonFile[boardActivator]["active"] == 8 && winner != 1){
        gameJsonFile[boardActivator]["status"] = 0
        document.getElementById(boardActivator).classList.add("draw")
    }
}

function determineWinner(gameJsonFile){
    winningGameStates.forEach(state =>{
        let check1 = gameJsonFile[state[0]]["status"]
        let check2 = gameJsonFile[state[1]]["status"]
        let check3 = gameJsonFile[state[2]]["status"]
        if(check1 != 0 && check2 != 0 && check3 != 0 && check1 == check2 && check2 == check3){
            console.log("someone won!")
            if(check1 == 1){
                console.log("X is the Game Winner!")
                setAllBoardsInactive()
            }
            else{
                console.log("O is the Game Winner")
                setAllBoardsInactive()
            }
        }
        if(gameJsonFile["active"] == 8){
            console.log("It's a draw!!")
            gameJsonFile[boardActivator]["status"] = 2
            setAllBoardsInactive()
        }
    })
}

function setAllBoardsInactive(){
    gamelist.forEach(game => {
        let temp = document.getElementById(game)
        if(temp.classList.contains("finished")){
        }
        else{
            temp.classList.remove("activeBoard")
            temp.classList.add("inactiveBoard")
        }
        
    });
}

function createBoard(gameJsonFile){
    for(key in gameJsonFile){
        if(key == "turn"){
            document.getElementById("turnStatus").innerHTML = gameJsonFile[key]
        }
        else if(key == "activeBoard" || key == "active"){
        }
        else{
            var gameTable = document.createElement("table")
            gameTable.id = key
            gameTable.status = 0 
            for(let i = 1; i <= 3; i++){
                var tableRow = document.createElement("tr")
                tableRow.id = key + "tr" + i
                for(let j = 1; j <= 3; j++){
                    var tableData = document.createElement("td")
                    tableData.id = key + "tr" + i + "td" + j
                    var button = document.createElement("button")
                    button.id = key + "tr" + i +"td" + j + "button"
                    button.boardActivator = boardActivators[i*3 + j - 4]
                    button.innerHTML = ""
                    button.row = i
                    button.col = j
                    button.classList.add("cell")
                    button.addEventListener("click", function() {
                        if((this.parentElement.parentElement.parentElement.id == gameJsonFile["activeBoard"] || gameJsonFile["activeBoard"] == "") && (gameJsonFile[this.parentElement.parentElement.parentElement.id]["status"] == "" && this.innerHTML == "")){
                            if(gameJsonFile[this.boardActivator]["status"] != ""){
                                console.log("resetting")
                                gameJsonFile["activeBoard"] = ""
                                document.getElementById(this.parentElement.parentElement.parentElement.id).classList.replace("activeBoard","inactiveBoard")
                            }
                            else{
                                document.getElementById(this.parentElement.parentElement.parentElement.id).classList.replace("activeBoard","inactiveBoard")
                                gameJsonFile["activeBoard"] = this.boardActivator
                                console.log(this.boardActivator)
                                console.log(document.getElementById(this.boardActivator))
                                document.getElementById(this.boardActivator).classList.replace("inactiveBoard","activeBoard")
                            }
                            if(gameJsonFile["turn"] == 1){
                                this.innerHTML = "X"
                                gameJsonFile["turn"] *= -1
                                gameJsonFile[this.parentElement.parentElement.parentElement.id]["game"][(this.row*3 + this.col - 4)] = 1
                                gameJsonFile[this.boardActivator]["active"]++
                            }
                            else{
                                this.innerHTML = "O"
                                gameJsonFile["turn"] *= -1
                                gameJsonFile[this.parentElement.parentElement.parentElement.id]["game"][(this.row*3 + this.col - 4)] = -1
                                gameJsonFile[this.boardActivator]["active"]++
                            }
                            determineBoardState(gameJsonFile, this.parentElement.parentElement.parentElement.id)
                            determineWinner(gameJsonFile)
                        }
                    })
                    tableData.appendChild(button)
                    tableRow.appendChild(tableData)
                }
                gameTable.append(tableRow)
            }
            document.getElementById(key).appendChild(gameTable)
        }
    }
}



createBoard(gameJsonFile)