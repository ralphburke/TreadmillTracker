const type = document.getElementById("legType");
const speed = document.getElementById("legSpeed");
const incline = document.getElementById("legIncline");
var inclineStore=0;
var speedstore=0;

function legGrey(){
if(type.value=="Rest"){
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
};

document.addEventListener("click", legGrey);

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
};

document.addEventListener("submit", function(event){
    event.preventDefault();
    let aForm = document.getElementById("legForm");     
addLeg(aForm.elements.legType.value, aForm.elements.legSpeed.value, parseInt(aForm.elements.legTimeS.value)+aForm.elements.legTimeM.value*60, aForm.elements.legIncline.value, aForm.elements.legHeart.value);
console.log(legs);
});

document.getElementById("legEntryPopupClose").onclick=function(){
    document.getElementById("legEntryPopup").style.visibility="hidden";
}

document.getElementById("legEntryPopupOpen").onclick=function(){
    document.getElementById("legEntryPopup").style.visibility="visible";
}