

const state = {
    score:{
        playerScore:0,
        computerScore:0,
        empateScore:0,
        scoreBox: document.getElementById("score_points")
    },

    cardSprites:{
        avatar: document.getElementById("card-image"),
        name: document.getElementById("card-name"),
        type: document.getElementById("card-type"),
        
    },
    playerSides:{
        player1: "player-cards",
        player1Box: document.querySelector("#player-cards"),
        computer: "computer-cards",
        computerBox: document.querySelector("#computer-cards"),
    },
    fieldCards:{
        player: document.getElementById("player-field-card"),
        computer: document.getElementById("computer-field-card"),
    },
    actions: {
        button: document.getElementById("next-duel"),
    },
};


const playerSides = {
    player1: "player-cards",
    computer: "computer-cards",
}

const pathImage = "./src/assets/icons/";

const cardData = [
    {   id: 0,
        name: "Dragon",
        type: "Paper",
        value: 11,
        image: `${pathImage}dragon.png`,
        winOf: [1],
        loseOf: [2],
    },
    { 
        id: 1,
        name: "Dark",
        type: "Rock",
        value: 2,
        image: `${pathImage}magician.png`,
        winOf: [2],
        loseOf: [0],
    },
    { 
        id: 2,
        name: "Exodia",
        type: "Scissors", //tesoura
        value: 2,
        image: `${pathImage}exodia.png`,
        winOf: [0],
        loseOf: [1],
    },
];


async function createCardImage(cardId, field){
    let card = document.createElement("img");
    card.setAttribute("height", "100px");
    card.setAttribute("src", "./src/assets/icons/card-back.png");
    card.setAttribute("data-id", cardId);
    card.classList.add("card");

    if(field === playerSides.player1){
        card.addEventListener("click",()=>{
            setCardsField(card.getAttribute("data-id"));

        });

        card.addEventListener("mouseover",()=>{
            drawSelectCard(cardId);
        });
    
    }
   return card;
}

async function setCardsField(cardId){
    await removeAllCardsImages();
    let computerCard = await getRandomCard();

    state.fieldCards.player.style.display = "block";
    state.fieldCards.computer.style.display = "block";

    state.fieldCards.player.src = cardData[cardId].image;
    state.fieldCards.computer.src = cardData[computerCard].image;

   
   let duelo = await checkDuelo(cardId, computerCard);
   await updateScore();
   await drawButton(duelo);
}

async function updateScore(){
    state.score.scoreBox.innerHTML = `Jogador:${state.score.playerScore} Computador:${state.score.computerScore} Empate:${state.score.empateScore}`;
}
    
async function drawButton(result){
    state.actions.button.innerText = result;
    state.actions.button.style.display = "block";
}

async function checkDuelo(playerCardId, computerCardId)
{
    let Result = "Empate";

    let playerWin = cardData[playerCardId];
    let computerWin = cardData[computerCardId];
    console.log("duelo");
           
    if(playerWin.winOf.includes(computerCardId)){
           Result = playerWin.type+" Ganhou "+computerWin.type;
           state.score.playerScore++;
           await playAudio("win");
    }else if(playerWin.loseOf.includes(computerCardId)){
            Result = playerWin.type+" Perdeu "+computerWin.type;
            state.score.computerScore++;
            await playAudio("lose");
    }else{
        await playAudio("empate");
        state.score.empateScore++;
    }
    
    return Result;
}    

async function removeAllCardsImages(){
    let cards = state.playerSides.computerBox;
    let imgElements = cards.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());

    cards = state.playerSides.player1Box;
    imgElements = cards.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());

}


async function drawSelectCard(indice)
{
    state.cardSprites.avatar.src = cardData[indice].image;
    state.cardSprites.name.innerText = cardData[indice].name;
    state.cardSprites.type.innerText = "Attributes:" + cardData[indice].type;
}

async function getRandomCard(){
    const xrandomCard = Math.floor(Math.random() * cardData.length);
    console.log("numero aleatorio="+cardData[xrandomCard].id);
    return cardData[xrandomCard].id;
}

async function drawCards(num, xfield)
{
    for(let i=0; i<num; i++)
    {
       const zrandomIdCard = await getRandomCard();
       const cardImage = await createCardImage(zrandomIdCard,xfield);
        document.getElementById(xfield).appendChild(cardImage);
    }
}

async function resetDuel()
{
    state.cardSprites.avatar.src="./src/assets/icons/card-back.png";
    state.actions.button.style.display="none";

    state.fieldCards.player.style.display="none";
    state.fieldCards.computer.style.display="none";

    state.cardSprites.name.innerText = "Selecione";
    state.cardSprites.type.innerText = "uma carta";

    init();
}

async function playAudio(status)
{
    const som = new Audio(`./src/assets/audios/${status}.wav`);
    som.play();
}
function  init(){
   drawCards(5,playerSides.player1);
   drawCards(5,playerSides.computer);

   const bgm = document.getElementById("bgm");
   bgm.play();
}


init();
