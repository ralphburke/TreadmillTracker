resurrectSessions();
addLegRow();

document.getElementById("sessionEntryPopupClose").onclick=function(){
    document.getElementById("sessionEntryPopup").style.visibility="hidden";
}

document.getElementById("sessionEntryPopupOpen").onclick=function(){
    document.getElementById("sessionEntryPopup").style.visibility="visible";
}

document.getElementById("addLegButton").addEventListener("click", function(){
    addLegRow();
})

function addLegRow(){
    blankRow=document.getElementById("legRow0");
    legRowCopy=blankRow.cloneNode(true);
    // console.log(document.getElementsByClassName("legEntryRow").length);
    let rowNum=document.getElementsByClassName("legEntryRow").length;
    console.log(rowNum);
    rowNum==1?legRowCopy.id="legRow1":legRowCopy.removeAttribute("id");
    // legRowCopy.id="legRow"+(parseInt(document.getElementsByClassName("legEntryRow")[rowNum-1].id.slice(6))+1);
    if(legRowCopy.id==="legRow1"){legRowCopy.children[8].style.visibility="hidden"};
    document.getElementById("legForm").insertBefore(legRowCopy, document.getElementById("addLegButton"));
    document.getElementsByClassName("typeInput")[rowNum-1].addEventListener("change", event=>{
        legGrey(event.target);
    })
    document.getElementsByClassName("legRowDelete")[rowNum-1].addEventListener("click", event=>{
        deleteLegRow(event.target);
    })
}

function legGrey(typeSelect){
    let legRow=typeSelect.parentNode;
    let speed=legRow.children[2];
    let incline=legRow.children[4];
    if(typeSelect.value=="Rest"){
        speed.value=null;
        incline.value=null;
        speed.setAttribute('disabled', "true");
        incline.setAttribute('disabled', "true");
    }else{
        speed.removeAttribute('disabled');
        incline.removeAttribute('disabled');
    }
    }

function deleteLegRow(deleteButton){
        deleteButton.parentNode.remove();
}

document.getElementById("sessionEntryPopup").addEventListener("submit", addSession);

function addSession(){
let legRows=Array.from(document.getElementById("legForm").children);
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
    totalSpeed:0,
    totalTime:0
}
sessionList.push(session);
burySessions();
document.getElementById("sessionForm").reset();
    document.querySelectorAll(".legEntryRow").forEach(element=>{
    if(element.id!=="legRow0"){element.remove()}}
)
addLegRow();
pastSessionConstruct(sessionList[sessionList.length-1]);
}

function addLeg(element){
    let leg={
    type: element.querySelector(".typeInput").value,
    time: element.querySelector(".legTimeM").value*60+parseInt(element.querySelector(".legTimeS").value||0),
    speed: parseInt(element.querySelector(".legSpeed").value)||0,
    incline: element.querySelector(".legIncline").value,
    heart: element.querySelector(".legHeart").value,
    }
    legs.push(leg);
}

function burySessions(){
    localStorage.setItem("sessionList", JSON.stringify(sessionList));
}

function resurrectSessions(){
    localStorage.getItem("sessionList")===null?sessionList=[]:sessionList=JSON.parse(localStorage.getItem("sessionList"));
}

function writeSessions(){
    sessionList.forEach(session=>pastSessionConstruct(session));
}

function pastSessionConstruct(session){
    blankSession=document.getElementById("pastSession0");
    pastSessionCopy=blankSession.cloneNode(true);
    pastSessionCopy.removeAttribute("id");
    pastSessionCopy.querySelector(".sessionName").innerHTML=session.name;
    constructGraph(session, pastSessionCopy.querySelector(".graph"));
    pastSessionCopy.querySelector(".distanceStat").innerHTML=((session.totalTime/3600)*session.totalSpeed/session.legs.length).toFixed(2)+"<span class=\"sessionUnits\"> km/h</span>";
    pastSessionCopy.querySelector(".timeStatM").innerHTML=Math.floor(session.totalTime/60);
    pastSessionCopy.querySelector(".timeStatS").innerHTML=session.totalTime%60;
    if(session.calories!==""){pastSessionCopy.querySelector(".calorieStat").innerHTML=session.calories+"<span class=\"sessionUnits\"> kcal</span>"}else{
        pastSessionCopy.querySelector(".calorieStat").remove();
    };
    document.getElementById("sessionsMainPage").appendChild(pastSessionCopy);
}

function constructGraph(session, graphLocation){
    session.totalSpeed=0;
    session.totalTime=0;
    let maxSpeed=0;
    session.legs.forEach(leg=>{
        if(leg.speed>parseInt(maxSpeed)){maxSpeed=leg.speed};
        session.totalTime+=leg.time;
        session.totalSpeed+=leg.speed;
        let newBar=document.createElement("div");
        newBar.setAttribute("data-time", leg.time);
        newBar.setAttribute("data-speed", leg.speed);
        newBar.setAttribute("class", "bar");
        if(leg.type=="Sprint"){     var colour="orange" }else{
            if(leg.type=="Jog"){    var colour="green"  }else{
                                    var colour="blue"   }}
        newBar.setAttribute("data-colour",colour);
        graphLocation.appendChild(newBar);
    })
    let graphWidth=400;
    let graphHeight=30;
    graphLocation.querySelectorAll(".bar").forEach(bar=>{
        bar.style.width=(graphWidth*bar.getAttribute("data-time")/session.totalTime)+"px";
        bar.style.height=(graphHeight*bar.getAttribute("data-speed")/maxSpeed)+"px";
        bar.style.backgroundColor=bar.getAttribute("data-colour");
    })
}

document.getElementById("writeSessions").addEventListener("click", function(){
    // writeSessions();
    document.querySelectorAll("input,select").forEach(element=>{
        if(element.hasAttribute("required")){
            if(element.value==""){console.log("asaadsfa")}
        }
    })
})