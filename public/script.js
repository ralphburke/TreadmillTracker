const type = document.getElementById("legType");
const speed = document.getElementById("legSpeed");
const incline = document.getElementById("legIncline");
var inclineStore=0;
var speedStore=0;

const legs=[];

function addLeg(type,speed,time,incline,heart){
let leg={
    type,
    speed,
    time,
    incline,
    heart
}
legs.push(leg);
}

document.addEventListener("submit", function(event){
    event.preventDefault();
    let theLegForm = document.getElementById("legForm");     
addLeg(theLegForm.elements.legType.value, theLegForm.elements.legSpeed.value, parseInt(theLegForm.elements.legTimeS.value)+theLegForm.elements.legTimeM.value*60, theLegForm.elements.legIncline.value, theLegForm.elements.legHeart.value);
console.log(legs);
})

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
    saveLegRows();
    legRowCopy.id="legRow"+(parseInt(legRowCopy.id.slice(-1))+1);
    console.log(legRowCopy);
    document.getElementById("legForm").insertBefore(legRowCopy, document.getElementById("addLegButton"));
}

function saveLegRows(){
    legRows=document.getElementsByClassName("legEntryRow");
    legRowCopy=legRows[legRows.length-1].cloneNode(true);
}

// function legGrey(element){
//     if(type.value=="Rest"){
//         if(speed.value!=="0"){speedStore=speed.value}
//         speed.value="0";
//         if(incline.value!=="0"){inclineStore=incline.value}
//         incline.value="0";
//         speed.setAttribute('disabled', "true");
//         incline.setAttribute('disabled', "true");
//     }else{
//         speed.removeAttribute('disabled');
//         incline.removeAttribute('disabled');
//         if(speed.value=="0"){speed.value=speedStore}
//         if(incline.value=="0"){incline.value=inclineStore}};
//     };
    
//         document.getElementById("legType").addEventListener("change", event=>{
//             saveLegRows();
//             legRowsArray=Array.from(legRows);
//             console.log(legRowsArray);
//             legRowsArray.forEach(element => {
//             legGrey(element);
//         })
//     })