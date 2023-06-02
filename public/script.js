// Initial functions for managing the .pastSession elements on the landing page
loadSessions();
writeSessions();
// addLegRow adds a row to the initially empty leg form in the session entry pop-up
addLegRow();

// '+ New session' button
document.getElementById("sessionEntryPopupOpen").addEventListener("click",function(){
    // resets form
    sessionReset();
    // restores templates from memory
    loadTemplates();
    // fills the template <select> with <option>s
    listTemplates();
    // move .pastSession elements off of the landing page
    moveToHistory();
    // pop-up made visible
    document.getElementById("sessionEntryPopup").style.visibility="visible";
})

// X button
document.getElementById("sessionEntryPopupClose").addEventListener("click",function(){
    closeSessionEntry();
    // Restores .pastSession elements to the landing page
    moveFromHistory();
})

function closeSessionEntry(){
    document.getElementById("sessionEntryPopup").style.visibility="hidden";
    // removes template <option> elements
    resetTemplates();
}

// '+' button on leg form, adds a new row
document.getElementById("addLegButton").addEventListener("click", function(){
    addLegRow();
})

function addLegRow(){
    blankRow=document.getElementById("legRow0");
    /* This code clones a template from the html file to easily create an indefinite number of copies
    It uses the cloneNode() method I found here:
    https://www.w3schools.com/jsref/met_node_clonenode.asp */
    legRowCopy=blankRow.cloneNode(true);
    let rowNum=document.getElementsByClassName("legEntryRow").length;
    rowNum==1?legRowCopy.id="legRow1":legRowCopy.removeAttribute("id");
    if(legRowCopy.id==="legRow1"){legRowCopy.querySelector(".legRowDelete").style.visibility="hidden"};
    document.getElementById("legForm").insertBefore(legRowCopy, document.getElementById("addLegButton"));
    // 'change' event triggers when the selected <option> changes. I learned this form here: https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/change_event
    document.getElementsByClassName("typeInput")[rowNum-1].addEventListener("change", event=>{
        legGrey(event.target);
    })
    document.getElementsByClassName("legRowDelete")[rowNum-1].addEventListener("click", event=>{
        // Finds the nearest leg row ancestor using .closest(). I learned this method from this post: https://stackoverflow.com/a/27037567
        event.target.closest(".legEntryRow").remove();
    })
}

// Greys out speed and incline inputs when rest is selected as the leg type
function legGrey(typeSelect){
    let legRow=typeSelect.parentNode.parentNode;
    let speed=legRow.querySelector(".legSpeed");
    let incline=legRow.querySelector(".legIncline");
    if(typeSelect.value=="Rest"){
        speed.value=null;
        incline.value=null;
        speed.setAttribute("disabled", "true");
        incline.setAttribute("disabled", "true");
    }else{
        speed.removeAttribute("disabled");
        incline.removeAttribute("disabled");
    }
    }

document.getElementById("sessionEntryPopup").addEventListener("submit", event=>{
    event.preventDefault();
    addSession();
    closeSessionEntry();
});

// Converts form information into a session object and saves it to local storage
function addSession(){
    // Array from nodelist. I got the method from this post: https://stackoverflow.com/a/36249012
    let legRows=Array.from(document.getElementById("legForm").children);
    legRows.pop();
    // resets leg array
    legs=[];
    //adds all legs to leg array
    legRows.forEach(element=>{
        addLeg(element);
    })
    //undefined set as a backup value if no tiredness elements are checked
    let tiredness=undefined;
    document.getElementsByName("tiredness").forEach(element=>{if(element.checked==true){tiredness=element.value}});
    
    let session={
        name: document.getElementById("nameInput").value,
        category,
        tiredness,
        calories: document.getElementById("calories").value,
        // legs array added
        legs,
        // toLocaleString formats the date nicely. I got the method from here: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
        date: new Date().toLocaleString("en-AU"),
        id: Date.now(),
        totalSpeed:0,
        totalTime:0
    }

    sessionList.push(session);
    saveSessions();

    // Generates and saves new template
    if(document.getElementById("templateYes").getAttribute("data-checked")=="true"){
        let template={
            name: document.getElementById("nameInput").value,
            category,
            tiredness,
            calories: document.getElementById("calories").value,
            legs,
        }
        templateList.push(template);
        saveTemplates();
    }

    closeSessionEntry();
    moveFromHistory();
    sessionReset();
    // Creates a new .pastSession element from the newly created session
    pastSessionConstruct(sessionList[sessionList.length-1]);
}

// Resets the session entry form
function sessionReset(){
    document.getElementById("sessionEntryPopup").reset();
    /* querySelectorAll produces a nodeList which works with forEach(),
    whereas getElementsByClassName produces an HTMLCollection which doesn't. This helped: https://medium.com/@larry.sassainsworth/iterating-over-an-html-collection-in-javascript-5071f58fad6b*/
    document.querySelectorAll(".tiredness").forEach(element=>{element.checked=false});
    // Remove all leg rows except the template, then add one fresh leg row back in
    document.querySelectorAll(".legEntryRow").forEach(element=>{
        if(element.id!=="legRow0"){element.remove()}}
    )
    addLegRow();
    document.getElementById("templateYes").setAttribute("data-checked","false");
    document.getElementById("templateNo").setAttribute("data-checked","true");
}

// Creates leg objects from a leg input row and adds them to legs array which will go in the session object
function addLeg(element){
    let leg={
    type: element.querySelector(".typeInput").value,
    time: element.querySelector(".legTimeM").value*60+parseInt(element.querySelector(".legTimeS").value||0),
    // ||0 returns 0 if the parseInt fails. Sometimes the speed is "" so this is needed
    speed: parseInt(element.querySelector(".legSpeed").value)||0,
    incline: element.querySelector(".legIncline").value,
    heart: element.querySelector(".legHeart").value,
    }
    legs.push(leg);
}

function saveSessions(){
    localStorage.setItem("sessionList", JSON.stringify(sessionList));
}

function loadSessions(){
    localStorage.getItem("sessionList")===null?sessionList=[]:sessionList=JSON.parse(localStorage.getItem("sessionList"));
}

function saveTemplates(){
    localStorage.setItem("templateList", JSON.stringify(templateList));
}

function loadTemplates(){
    localStorage.getItem("templateList")===null?templateList=[]:templateList=JSON.parse(localStorage.getItem("templateList"));
}

// Adds option elements in the template select element of the session entry form
function listTemplates(){
    templateList.forEach(template=>{
        let templateOption=document.createElement("option");
        // Adding the template's index as data to its option helps find the template from the option later
        templateOption.setAttribute("data-index", templateList.findIndex(object=>object===template));
        templateOption.setAttribute("class", "templateOption")
        templateOption.setAttribute("value", template.name);
        templateOption.setAttribute("id", template.name);
        templateOption.innerText=template.name;
        document.getElementById("sessionTemplate").appendChild(templateOption);
    })
}

// Removes template option elements
function resetTemplates(){
    document.querySelectorAll(".templateOption").forEach(option=>{
        if(option.id!=="templateNone"){option.remove()}
    })
}

// Autofills the form when user selects a template
document.getElementById("sessionTemplate").addEventListener("change", function(){
    let templateValue=document.getElementById("sessionTemplate").value;
    sessionReset();
    if(templateValue!=="None"){
        document.getElementById("sessionTemplate").value=templateValue;
        let template=templateList[document.getElementById(templateValue).getAttribute("data-index")];
        document.getElementById("nameInput").value=template.name;
        document.getElementById("sessionCategory").value=template.category;
        document.getElementById("calories").value=template.calories;
        if(template.tiredness!==undefined){
            // string concatenation to get the id of the element to check
            document.getElementById("tiredness"+template.tiredness).checked=true;
        }
        // Fills in newest leg row, adds another row, repeats. A left over unused row is removed at the end.
        let allRows=document.getElementById("legForm").children;
        template.legs.forEach(leg=>{
            let row=allRows[allRows.length-2];
            row.querySelector(".typeInput").value=leg.type;
            // Time value in seconds is converted to minutes and seconds
            row.querySelector(".legTimeM").value=Math.floor(leg.time/60);
            row.querySelector(".legTimeS").value=leg.time%60;
            row.querySelector(".legSpeed").value=leg.speed;
            row.querySelector(".legIncline").value=leg.incline;
            row.querySelector(".legHeart").value=leg.heart;
            addLegRow();
        })
        allRows[allRows.length-2].remove();
    }
})

// Creates all .pastSession elements
function writeSessions(){
    // The session row label is invisible if there are no elements present
    if(sessionList.length==0){
        document.getElementById("sessionsRowLabel").style.visibility="hidden";
    }else{
        document.getElementById("sessionsRowLabel").style.visibility="visible";
    }
    // Remove all .pastSession elements except for the template
    document.querySelectorAll(".pastSession").forEach(element=>{
        if(element.id!=="pastSession0"){element.remove()}
    })
    // Create new .pastSession elements
    sessionList.forEach(session=>pastSessionConstruct(session));
}

// Creates a .pastSession element from any session
function pastSessionConstruct(session){
    document.getElementById("sessionsRowLabel").style.visibility="visible";
    blankSession=document.getElementById("pastSession0");
    pastSessionCopy=blankSession.cloneNode(true);
    pastSessionCopy.removeAttribute("id");
    pastSessionCopy.querySelector(".sessionName").innerText=session.name;
    constructGraph(session, pastSessionCopy.querySelector(".graph"));
    // Total speed and number of legs are used to find average speed. Distance calculated from average speed and total time
    pastSessionCopy.querySelector(".distanceStat").innerHTML=((session.totalTime/3600)*session.totalSpeed/session.legs.length).toFixed(2)+"<span class=\"sessionUnits\"> km</span>";
    pastSessionCopy.querySelector(".timeStatM").innerText=Math.floor(session.totalTime/60);
    // I needed a number to be exactly 2 digits, this post gives a good method using toLocaleString: https://stackoverflow.com/a/8043061
    pastSessionCopy.querySelector(".timeStatS").innerText=(session.totalTime%60).toLocaleString("en-AU", {minimumIntegerDigits:2});
    pastSessionCopy.setAttribute("data-image", session.category);
    if(session.calories!==""){pastSessionCopy.querySelector(".calorieStat").innerHTML=session.calories+"<span class=\"sessionUnits\"> kcal</span>"}else{
        pastSessionCopy.querySelector(".calorieStat").remove();
    };
    pastSessionCopy.addEventListener("click", event=>{
        let pastSession=event.target.closest(".pastSession");
        /* Here I need to find the index of an element in a nodelist
        This post gives a good method using Array.prototype.indexOf.call
        https://stackoverflow.com/a/3781018 */
        let index=Array.prototype.indexOf.call(document.querySelectorAll(".pastSession"),pastSession)-1;
        document.getElementById("deleteButton").setAttribute("data-sessionIndex", index);
        viewSession(pastSession, sessionList[index]);
    });
    document.getElementById("sessionsRow").appendChild(pastSessionCopy);
}

// Makes a graph from session information, appends to graphLocation
function constructGraph(session, graphLocation){
    session.totalSpeed=0;
    session.totalTime=0;
    let maxSpeed=0;
    session.legs.forEach(leg=>{
        //maxSpeed will be the highest speed, and will be used to scale each bar vertically
        if(leg.speed>parseInt(maxSpeed)){maxSpeed=leg.speed};
        // Cumulative values generated. Total time will be used as a stat. Total speed will be used to calculate distance
        session.totalTime+=leg.time;
        session.totalSpeed+=leg.speed;
        let newBar=document.createElement("div");
        newBar.setAttribute("data-time", leg.time);
        newBar.setAttribute("data-speed", leg.speed);
        newBar.setAttribute("class", "bar");
        // data-colour attribute will be used later to style each bar
        if(leg.type=="Sprint"){ var colour="Sprint" }else{
        if(leg.type=="Jog"){    var colour="Jog"    }else{
        if(leg.type=="Walk"){   var colour="Walk"   }else{
                                var colour="Rest"   }}}
        newBar.setAttribute("data-colour",colour);
        graphLocation.appendChild(newBar);
    })
    let graphWidth=400;
    let graphHeight=50;
    graphLocation.querySelectorAll(".bar").forEach(bar=>{
        // bar width = constant * leg time / total time
        bar.style.width=(graphWidth*bar.getAttribute("data-time")/session.totalTime)+"px";
        // bar height = constant * leg speed / max speed
        bar.style.height=(graphHeight*bar.getAttribute("data-speed")/maxSpeed)+"px";
        //special styling for bars with speed 0. Mostly this will be for legs of rest type
        if(bar.getAttribute("data-speed")=="0"){
            bar.style.height=graphHeight+"px";
            bar.style.border="0px";
            bar.style.borderBottom="2px solid black";
            bar.style.backgroundColor="transparent";
        };
    })
}

/* Adds all information from one session into a pop-up.
Parameters are the .pastSession element and the session object. */
function viewSession(pastSession, session){
    moveToHistory();
    document.getElementById("history").style.visibility="visible";
    document.getElementById("sessionHistory").style.visibility="visible";
    document.getElementById("fullHistory").style.visibility="hidden";
    let historyGraph=document.getElementById("historyGraph");
    // resets the existing graph
    historyGraph.innerHTML="";
    // takes a graph from a .pastSession element and copies it over
    historyGraph.appendChild(pastSession.querySelector("#thePastSessionGraph").cloneNode(true));
    historyGraph.appendChild(pastSession.querySelector(".stats").cloneNode(true));
    // scales the new graph
    enlargeGraph(historyGraph);
    let leftSide=document.getElementById("sessionHistoryLeft");
    leftSide.querySelector("#historyName").innerText=session.name;
    leftSide.querySelector("#historyCategory").innerText="Category: "+session.category;
    leftSide.querySelector("#historyDate").innerText="Added "+session.date;
    leftSide.querySelector("#historyID").innerHTML="ID: "+session.id;
    newHistoryRows(session);
}

/* Couldn't find a good css way of doing this so I did it here
 (css scale seems only capable of scaling width and height by the same amount) */
function enlargeGraph(graphLocation){
    graphLocation.querySelectorAll(".bar").forEach(bar=>{
        bar.style.width=(1.1*bar.style.width.slice(0,-2))+"px";
        bar.style.height=(2*bar.style.height.slice(0,-2))+"px";
    })
}

// Creates a row for each leg for viewing a past session
function newHistoryRows(session){
    let historyRow=document.getElementsByClassName("historyRow")[0].cloneNode(true);
    let historyLegs=document.getElementById("historyLegs");
    historyLegs.innerHTML="";
    session.legs.forEach(leg=>{
        let newRow=historyRow.cloneNode(true);
        newRow.querySelector(".historyType").innerText=leg.type;
        newRow.querySelector(".historySpeed").innerHTML=leg.speed;
        newRow.querySelector(".historyTimeM").innerText=Math.floor(leg.time/60);
        newRow.querySelector(".historyTimeS").innerText=(leg.time%60).toLocaleString("en-AU", {minimumIntegerDigits:2});
        // Boxes for incline and heartrate are reset then filled in (extra1 first) depending on what data is available
        let extra1=newRow.querySelector(".historyExtra1");
        let extra2=newRow.querySelector(".historyExtra2");
        extra1.removeAttribute("id");
        extra2.removeAttribute("id");
        extra1.innerText="";
        extra2.innerText="";
        // Incline takes the left box unless there is no incline data, in which case it goes to heartrate
        if(leg.incline!==""){
            extra1.setAttribute("id","historyIncline");
            extra1.innerHTML=leg.incline+"<span>°</span>";
            if(leg.heart!==""){
                extra2.setAttribute("id","historyHeart");
                extra2.innerHTML=leg.heart+"<span class=\"historyUnits\">❤</span>";
            }
        }else{
            if(leg.heart!==""){
            extra1.setAttribute("id","historyHeart");
            extra1.innerHTML=leg.heart+"<span class=\"historyUnits\">❤</span>";
        }}
        historyLegs.appendChild(newRow);
    })
}

// Clicking the session delete button prompts a second confirmation click
document.getElementById("deleteButton").addEventListener("click", function(){
    let deleteButton=document.getElementById("deleteButton");
    if(deleteButton.getAttribute("data-status")=="delete"){
        // Clickling delete changes its class, switching out spans to ask for confirmation
        deleteButton.setAttribute("data-status","confirm");
        // Using inherit instead of visible ensures the button will not be visible when the page is hidden. I got this from here: https://www.digitalocean.com/community/tutorials/css-inherit-initial-unset
        document.getElementById("cancelDelete").style.position="relative";
        document.getElementById("cancelDelete").style.visibility="inherit";
    }else{
        // If confirmation is given...
        let sessionIndex=document.getElementById("deleteButton").getAttribute("data-sessionIndex");
        sessionList.splice(sessionIndex, 1);
        saveSessions();
        moveFromHistory();
        writeSessions();
        // Resetting the delete button
        deleteButton.setAttribute("data-status", "delete");
        document.getElementById("cancelDelete").style.visibility="hidden";
        document.getElementById("cancelDelete").style.position="absolute";
        document.getElementById("history").style.visibility="hidden";
        document.getElementById("sessionHistory").style.visibility="hidden";
    }
})

// Pressing the 'cancel' button
document.getElementById("cancelDelete").addEventListener("click", function(){
    document.getElementById("deleteButton").setAttribute("data-status", "delete");
    document.getElementById("cancelDelete").style.visibility="hidden";
    document.getElementById("cancelDelete").style.position="absolute";
})

// 'Show all' button
document.getElementById("showFullHistory").addEventListener("click", function(){
    // Move .pastSession elements into history
    moveToHistory();
    // Show pop-up elemnents
    document.getElementById("history").style.visibility="visible";
    document.getElementById("fullHistory").style.visibility="visible";
})

document.getElementById("historyPopupClose").addEventListener("click", function(){
    // Reset delete button
    document.getElementById("deleteButton").setAttribute("data-status", "delete");
    document.getElementById("cancelDelete").style.visibility="hidden";
    document.getElementById("cancelDelete").style.position="absolute";
    // Hide pop-up elements
    document.getElementById("history").style.visibility="hidden";
    document.getElementById("sessionHistory").style.visibility="hidden";
    document.getElementById("fullHistory").style.visibility="hidden";
    moveFromHistory();
})

// Move .pastSession elements between 'historySessions' and 'sessionsRow'
function moveToHistory(){
    let historySessions=document.getElementById("historySessions");
    document.querySelectorAll(".pastSession").forEach(element=>historySessions.appendChild(element));
}

function moveFromHistory(){
    let sessionsRow=document.getElementById("sessionsRow");
    document.querySelectorAll(".pastSession").forEach(element=>sessionsRow.appendChild(element));
}

// Back button when viewing individual session
document.getElementById("backToFullHistory").addEventListener("click", function(){
    document.getElementById("fullHistory").style.visibility="visible";
    document.getElementById("sessionHistory").style.visibility="hidden";
})

// Changing the 'save as template?' buttons when clicked
document.getElementById("templateYes").addEventListener("click", event=>{
    event.target.setAttribute("data-checked","true");
    document.getElementById("templateNo").setAttribute("data-checked","false");
})

document.getElementById("templateNo").addEventListener("click", event=>{
    event.target.setAttribute("data-checked","true");
    document.getElementById("templateYes").setAttribute("data-checked","false");
})

// Shows a new pop-up for viewing and deleting saved templates
document.getElementById("manageTemplates").addEventListener("click", function(){
    resetTemplates();
    writeTemplates();
    document.getElementById("sessionEntryPopup").style.visibility="hidden";
    document.getElementById("manageTemplatesPopup").style.visibility="visible";
})

document.getElementById("manageTemplatesPopupClose").addEventListener("click", function(){
    document.getElementById("sessionEntryPopup").style.visibility="visible";
    document.getElementById("manageTemplatesPopup").style.visibility="hidden";
    listTemplates();
})

// Lists templates in the 'manage templates' pop-up
function writeTemplates(){
    document.getElementById("templatesDiv").innerHTML="";
    templateList.forEach(template=>{
        let templateRow=document.createElement("li");
        templateRow.setAttribute("class", "templateRow");
        let templateNew=document.createElement("div");
        templateNew.innerText=template.name;
        let templateDelete=document.createElement("button");
        templateDelete.setAttribute("type", "button");
        // Saves the template's index to the delete button
        templateDelete.setAttribute("data-index", templateList.indexOf(template));
        templateDelete.addEventListener("click", event=>{
            // retrieves template
            templateList.splice(event.target.getAttribute("data-index"),1)
            saveTemplates();
            writeTemplates();
        })
        // The word 'template' is in a span and is removed on mobile devices to save space
        templateDelete.innerHTML="Delete<span> template</span>"
        templateRow.appendChild(templateNew);
        templateRow.appendChild(templateDelete);
        document.getElementById("templatesDiv").appendChild(templateRow);
    })
}