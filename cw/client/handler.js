const saveScore = () =>{
    let local;
    if (localStorage.getItem('scoreTable')) {
        local = JSON.parse(localStorage.getItem('scoreTable'));
    } else {
        local = {}
    }
    if (!local[localStorage.getItem("username")] || gameManager.score > local[localStorage.getItem("username")]) {
        local[localStorage.getItem("username")] = gameManager.score;
        localStorage.setItem('scoreTable', JSON.stringify(local));
    }
}

const getScores = () =>{
    let local;
    let arr = [];
    if (localStorage.getItem('scoreTable')) {
        local = localStorage.getItem('scoreTable');
        local = JSON.parse(local);
        let elem;
        for (elem of Object.keys(local)){
            arr.push([elem, local[elem]]);
        }
    }
    return arr;
}

function viewScore(){
    let arr = getScores();
    let tableLen = 10;
    let resultTable = [["Номер", "Имя пользователя", "Рекорд"]];
    let colCount = resultTable[0].length;
    arr.sort(function(a, b){
        return b[1] - a[1];
    })
    for (let ind = 0; ind < arr.length; ind++){
        if (ind === tableLen){
            break;
        }
        resultTable.push([ind + 1, arr[ind][0], arr[ind][1]])
    }
    let table = document.createElement("TABLE");
    table.border = "1";
    let row = table.insertRow(-1);
    for (let ind = 0; ind < colCount; ind++){
        let headerCell = document.createElement("TH");
        headerCell.innerHTML = resultTable[0][ind];
        row.appendChild(headerCell);
    }
    for (let ind = 1; ind < resultTable.length; ind++){
        row = table.insertRow(-1);
        for (let j = 0; j < colCount; j++){
            let cell = row.insertCell(-1);
            cell.innerHTML = resultTable[ind][j];
        }
    }
    let viewTable = document.getElementById("viewTable");
    if (!viewTable){
        viewTable = document.createElement("viewTable")
    }
    viewTable.innerHTML = "";
    viewTable.appendChild(table);
}