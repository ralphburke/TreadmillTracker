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
        if(speed.value!=="0"){speedStore=speed.value}
        speed.value="0";
        if(incline.value!=="0"){inclineStore=incline.value}
        incline.value="0";
        speed.setAttribute('disabled', "true");
        incline.setAttribute('disabled', "true");
    }else{
        speed.removeAttribute('disabled');
        incline.removeAttribute('disabled');
        if(speed.value=="0"){speed.value=speedStore}
        if(incline.value=="0"){incline.value=inclineStore}};
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
document.getElementsByName("tiredness").forEach(element=>{if(element.checked==true){tiredness=element.value}})
let session={
    category: document.getElementById("sessionCategory").value,
    tiredness,
    calories: document.getElementById("calories").value,
    legs
}
sessionList.push(session);
burySessions();
document.getElementById("SessionForm").reset();
    document.querySelectorAll(".legEntryRow").forEach(element=>{
    if(element.id!=="legRow0"){element.remove()}}
)
addLegRow();
}

function addLeg(element){
    let leg={
    type: element.querySelector(".typeInput").value,
    time: element.querySelector(".legTimeM").value*60+parseInt(element.querySelector(".legTimeS").value),
    speed: element.querySelector(".legSpeed").value,
    incline: element.querySelector(".legIncline").value,
    heart: element.querySelector(".legHeart").value
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