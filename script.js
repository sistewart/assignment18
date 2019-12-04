//Main Page JS
//$("#add-player-form").trigger('reset'); 
// toggling forms
function toggleAddForm(){
    console.log("toggling add form");
   let addForm = document.getElementById("add-player-form");
   addForm.classList.toggle("hidden");
}


//javascript functions to show the players
async function showPlayers(){
    let response = await fetch(`api/players/`);
    let players = await response.json();
    let playersDiv = document.getElementById("players-home");
    playersDiv.innerHTML = "";

    playersDiv.className = "players-div";

    for(i in players){
        playersDiv.append(getPlayerElem(players[i]));
    }
}

function getPlayerElem(player){
    let playerDiv = document.createElement("div");
    playerDiv.className = "player-div";
    playerDiv.classList.add("player");
    let playerContentDiv = document.createElement("div");
    playerContentDiv.className = "player-content-div";
    playerContentDiv.classList.add("player-content");

    let playerHeader = document.createElement("h3");
    playerHeader.className = "player-header";
    playerHeader.innerHTML = `${player.name}`;
    playerDiv.append(playerHeader);
    //NEED TO FIX THIS
    playerContentDiv.innerHTML = `He is ${player.age} years old and is from ${player.hometown}. He has played for ${player.former} over ${player.years} years. He currently plays for ${player.current}.`;
    playerDiv.append(playerContentDiv);

    playerDiv.append(getPlayerButtons(player));
    return playerDiv;
}

function getPlayerButtons(player){
    let buttonsDiv = document.createElement("div");
    buttonsDiv.className = "buttons-div";

    let editButton = document.createElement("button");
    let deleteButton = document.createElement("button");

    editButton.innerHTML = "Edit"
    deleteButton.innerHTML = "Delete";
    editButton.className = "edit-btn";
    deleteButton.className = "delete-btn";

    editButton.onclick = showEditForm;


    editButton.setAttribute("data-id", player._id);
    deleteButton.setAttribute("data-id", player._id);
    editButton.onclick = showEditForm;
    deleteButton.onclick = removePlayer;
    buttonsDiv.append(editButton);
    buttonsDiv.append(deleteButton);
    return buttonsDiv;
}
async function makePlayer(){
    const name = document.getElementById("add-player-name").value;
    const age = document.getElementById("add-player-age").value;
    const hometown = document.getElementById("add-player-hometown").value;
    const formerText = document.getElementById("add-player-former").value;
    const current = document.getElementById("add-player-current").value;
    const years = document.getElementById("add-player-years").value;
    const former = formerText.split("\n");

    let player = {"name": name, "age": age, "hometown": hometown, "former": former, "current": current, "years": years};
    console.log(player);

    let response = await fetch('/api/players/',{
        method: 'POST',
        headers:{
        'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify(player),
    });

    if(response.status != 200){
        console.log("something went wrong");
        return;
    }

    let result = await response.json();

    showPlayers();
}


function resetAddForm(){
    document.getElementById("add-player-form").reset();
    console.log("form was reset");
}
async function showEditForm(){
    //trying to add toggle function
    console.log("toggling edit form");
    let editForm = document.getElementById("edit-player-form");
    editForm.classList.toggle("hidden");

    let playerID = this.getAttribute("data-id");
    document.getElementById("edit-player-id").textContent = playerID;
    let response = await fetch(`api/players/${playerID}`);

    if(response.status != 200){
        console.log("error editing player");
    }

    let player = await response.json();
    document.getElementById("edit-player-name").value = player.name;
    document.getElementById("edit-player-age").value = player.age;
    document.getElementById("edit-player-hometown").value = player.hometown;
    document.getElementById("edit-player-current").value = player.current;
    document.getElementById("add-player-years").value = player.years;
    if(player.former != null){
        document.getElementById("edit-player-former").value = player.former.join('\n');
    }

}

async function editPlayer(){
    const name = document.getElementById("edit-player-name").value;
    const age = document.getElementById("edit-player-age").value;
    const hometown = document.getElementById("edit-player-hometown").value;
    const formerText = document.getElementById("edit-player-former").value;
    const current = document.getElementById("edit-player-current").value;
    const years = document.getElementById("edit-player-years").value;
    const former = formerText.split("\n");

    let player = {"name": name, "age": age, "hometown": hometown, "former": former, "current": current, "years": years};
    console.log(player);

    const id= document.getElementById("edit-player-id").textContent;

    let response = await fetch(`/api/players/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify(player),
    });

    let result = await response.json();
    showPlayers();
}


async function removePlayer(){
    let playerID= this.getAttribute('data-id');
    let response = await fetch(`/api/players/${playerID}`,{
        method: 'DELETE',
        headers:{
            'Content-Type': 'application/json;charset=utf-8',
        }
    });

    if(response.status != 200){
        return;
    }
    let result = await response.json();
    showPlayers();
}

window.onload = function(){
    this.showPlayers();

    const addForm = document.getElementById("add-player-form");
    addForm.hidden = false;
    const addButton = document.getElementById("add-player-btn");
    addButton.onclick = toggleAddForm;

    const editForm = document.getElementById("edit-player-form");
    editForm.hidden = false;

    const editButton = document.getElementsByClassName("edit-btn");
    editButton.onClick = showEditForm;

    addingPlayer = document.getElementById("btn-adding-player");
    addingPlayer.addEventListener("click", makePlayer);
    
    editingPlayer = document.getElementById("btn-editing-player");
    editingPlayer.onclick = editPlayer;
   
  
}