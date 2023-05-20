const type = document.getElementById("legType");
const speed = document.getElementById("legSpeed");
const incline = document.getElementById("legIncline");
var inclineStore=0;
var speedStore=0;
resurrectSessions();
addLegRow();

document.getElementById("legEntryPopupClose").onclick=function(){
    document.getElementById("legEntryPopup").style.visibility="hidden";
}

document.getElementById("legEntryPopupOpen").onclick=function(){
    document.getElementById("legEntryPopup").style.visibility="visible";
}

document.getElementById("addLegButton").addEventListener("click", function(){
    addLegRow();
})

function addLegRow(){
    blankRow=document.getElementById("legRow0");
    legRowCopy=blankRow.cloneNode(true);
    rowNum=document.getElementsByClassName("legEntryRow").length;
    legRowCopy.id="legRow"+(parseInt(document.getElementsByClassName("legEntryRow")[rowNum-1].id.slice(6))+1);
    if(legRowCopy.id==="legRow1"){legRowCopy.children[8].style.visibility="hidden"};
    document.getElementById("legForm").insertBefore(legRowCopy, document.getElementById("addLegButton"));
    document.getElementsByClassName("typeInput")[rowNum].addEventListener("change", event=>{
        legGrey(event.target);
    })
    document.getElementsByClassName("legRowDelete")[rowNum].addEventListener("click", event=>{
        deleteLegRow(event.target);
    })
}

function legGrey(typeSelect){
    let legRow=typeSelect.parentNode;
    let speed=legRow.children[2];
    let incline=legRow.children[4];
    if(typeSelect.value=="Rest"){
        // if(speed.value!=="0"){speedStore=speed.value}
        // speed.value="0";
        // if(incline.value!=="0"){inclineStore=incline.value}
        // incline.value="0";
        speed.value=null;
        incline.value=null;
        speed.setAttribute('disabled', "true");
        incline.setAttribute('disabled', "true");
    }else{
        speed.removeAttribute('disabled');
        incline.removeAttribute('disabled');
        // if(speed.value=="0"){speed.value=speedStore}
        // if(incline.value=="0"){incline.value=inclineStore};
        if(speed.value=="0"){speed.value=null}
        if(incline.value=="0"){incline.value=null}};
    }

function deleteLegRow(deleteButton){
        deleteButton.parentNode.remove();
}

document.getElementById("addSession").addEventListener("click", addSession)

function addSession(){
let legRows=Array.from(document.getElementById("legForm").children);
legRows.shift();
legRows.pop();
legs=[];
legRows.forEach(element=>{
    addLeg(element);
})
let tiredness=undefined;
document.getElementsByName("tiredness").forEach(element=>{if(element.checked==true){tiredness=element.value}});

let category=document.getElementById("sessionCategory").value;
if(category=="Sprints"){image=""}else{
if(category=="Jog"){image=""}else{
if(category=="Endurance"){image=""}else{
if(category=="Walk"){image=""}}}}

let session={
    name: document.getElementById("nameInput").value,
    category,
    tiredness,
    calories: document.getElementById("calories").value,
    legs,
    date: new Date().toISOString(),
    id: Date.now(),
    image,
}
sessionList.push(session);
burySessions();
document.getElementById("sessionForm").reset();
    document.querySelectorAll(".legEntryRow").forEach(element=>{
    if(element.id!=="legRow0"){element.remove()}}
)
addLegRow();
}

function addLeg(element){
    console.log(element.querySelector(".legSpeed").value);
    let leg={
    type: element.querySelector(".typeInput").value,
    time: element.querySelector(".legTimeM").value*60+parseInt(element.querySelector(".legTimeS").value+0),
    speed: element.querySelector(".legSpeed").value+0,
    incline: element.querySelector(".legIncline").value,
    heart: element.querySelector(".legHeart").value,
    number: element.id.slice(6)
    }
    legs.push(leg);
}

function burySessions(){
    localStorage.setItem("sessionList", JSON.stringify(sessionList));
}

function resurrectSessions(){
    localStorage.getItem("sessionList")===null?sessionList=[]
    :sessionList=JSON.parse(localStorage.getItem("sessionList"));
}

function constructGraph(sessionNum){
    let session=sessionList[sessionNum];
    let totalTime=0;
    let biggestSpeed=0;
    session.legs.forEach(leg=>{
        if(leg.speed>parseInt(biggestSpeed)){biggestSpeed=leg.speed};
        totalTime+=leg.time;
        let newBar=document.createElement("div");
        newBar.setAttribute("data-time", leg.time);
        newBar.setAttribute("data-speed", leg.speed);
        newBar.setAttribute("class", "bar");
        newBar.setAttribute("id", leg.number);
        if(leg.type=="Sprint"){        var colour="orange"
        }else{if(leg.type="Jog"){  var colour="green"
            }else{                  var colour="blue"
            }
        }
        newBar.setAttribute("data-colour",colour);
        graphLocation=document.getElementById("graph1");
        graphLocation.appendChild(newBar);
    })
    let barWidth=500;
    let barHeight=100;
    graphLocation.querySelectorAll(".bar").forEach(bar=>{
        bar.style.width=(barWidth*bar.getAttribute("data-time")/totalTime)+"px";
        bar.style.height=(barHeight*bar.getAttribute("data-speed")/biggestSpeed)+"px";
        bar.style.backgroundColor=bar.getAttribute("data-colour");
    })
}


document.getElementById("writeSessions").addEventListener("click", logger);
function logger(){
    console.log(sessionList);

    // document.querySelectorAll(".bar").forEach(bar=>{
    //     console.log(bar.style.width);
    //     bar.style.width=bar.style.width.slice(0,-2)*0.5+"px";
    //     console.log(bar.style.width);
    // })
}

document.getElementById("make").addEventListener("click", constructor);

function constructor(){
    constructGraph(sessionList.length-1);
}