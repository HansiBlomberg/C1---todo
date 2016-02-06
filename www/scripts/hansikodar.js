// A simple TODO list
// This is my first javascript program
// bear with me!
// Hansi Blomberg 2015-12-17


// This will be used as an argument to the toDoListItemBuilder() function
var ListTypeEnum = {
    TODO: 1,
    DONE: 2
};


debug = false;
// debug = true;
if (debug) debugOn();
    
debugtext();


var toDoListName = "MrInAHurry";
$("#listname").val(toDoListName);
var toDoServerURL = "https://todoo.netcare.se:1449";




// Do we have local storage check
var hasLocalStorage = (function () {
    try {
        localStorage.setItem(toDoListName, toDoListName);
        localStorage.removeItem(toDoListName);
        return true;
    } catch (exception) {
        return false;
    }
}());


// Do we have TODOO wcf storage check
// Lets rewrite the codebase to handle
// this in better ways

//$.ajaxSetup({
//    "error": function () {
//        hasTODOStorage = (function ()
//        { return false; });
//    }
//});

//hasTODOStorage = (function () {
    
   
//    $.getJSON(toDoServerURL + '/todo/' + toDoListName, function (data) { console.log("From hasTODOStorage data: " + data); });
//       return true;
//}());





var storedToDos = []; // Will be used to keep a json array with our todo items
var knownToDoNames = []; // Will be used to keep an array of known todo names
console.log("knowntodonames = " + knownToDoNames);
var highestLocalToDoId = 0; // Is needed when creating new todo items, each todo in stored todos need a unique ID never used in the current session.
var nextAddedToDoLocalId = null; // Gets a value if user is adding a changed item

readPersistedToDoNames();
updateToDoListMenu();
readPersistedToDo();

function LogAjaxError(jqXHR, textStatus,  errorThrown ) {
    console.log("Ajax error " + textStatus);
    console.log("incoming Text " + jqXHR.responseText);

}

function readPersistedToDoNames() {

    if (hasLocalStorage) {

        if (typeof (localStorage.getItem("lastUsedToDoListName")) !== "undefined") {
            toDoListName = localStorage.getItem("lastUsedToDoName");
            $("#listname").val(toDoListName);
        }

        if (typeof (localStorage.getItem("knownToDoListNames")) !== "undefined") {
            var tempToDoNames = JSON.parse(localStorage.getItem("knownToDoListNames"));
            if (tempToDoNames !== null) {
                knownToDoNames = tempToDoNames;
            }
            if (debug) {
                console.log("readPersistedToDoNames read tempToDoNames = " + tempToDoNames);
                console.log("knowntodonames = " + knownToDoNames);
            }
        }
    }
    else {
        // Sorry! No Web Storage support..
        if (debug) alert("readPersistedToDoNames(): Ingen web storage support!");
    }

}

function saveToDoNames() {

    if (hasLocalStorage) {

        // Put the object into storage
        localStorage.setItem("lastUsedToDoName", toDoListName);
        if (debug) console.log("Stored to local storage: lastUsedToDoName=" + toDoListName);

        // Add the current list name if not already known
        if (knownToDoNames === null) {
            knownToDoNames.push(toDoListName);
        } else if (knownToDoNames.indexOf(toDoListName) === -1) {
            knownToDoNames.push(toDoListName);
        }

        localStorage.setItem("knownToDoListNames", JSON.stringify(knownToDoNames));
        if (debug) console.log("Stored to local storage: knownToDoListNames" + JSON.stringify(knownToDoNames));



    } else {
        // Sorry! No Web Storage support..
        if (debug) alert("Ingen web storage support!");
    }

}

function updateToDoListMenu() {

    $("#knowntodolists").empty();

    for (i = 0; i < knownToDoNames.length; i++) {
        // <li><a href="#Foo" onclick="runMyFunction(); return false;">Do it!</a></li>
        $("#knowntodolists").append("<li><a href='#' onclick='loadToDoList(\"" + knownToDoNames[i] + "\"); return false;'>" + knownToDoNames[i] + "</a></li>");
        // <option value="volvo">Volvo</option>
        //$("#knowntodolists").append("<option value="+ knownToDoNames[i] + ">" + knownToDoNames[i] + "</option>");
    }

    if (knownToDoNames.length > 0) {
        $("#knowntodolists").parent().parent().show();
    } else {
        $("#knowntodolists").parent().parent().hide();
    }


}

function readPersistedToDo() {
    // Get todo list from server storage if available
    

    console.log("readPersistedtoDo trying to call " + toDoServerURL + "/todo/" + toDoListName);
    $.getJSON(toDoServerURL + '/todo/' + toDoListName, function (data) {

        console.log("data=" + data);
        console.log("data length = " + data.length);
        storedToDos = data;

        PopulateToDoLists();

    }).error(function (jqXHR, textStatus, errorThrown) {

        console.log("error " + textStatus);
        console.log("incoming Text " + jqXHR.responseText);
        console.log("No todoo server storage, trying local storage");
        if (hasLocalStorage) {
            if (typeof (localStorage.getItem(toDoListName)) !== "undefined") {
                storedToDos = JSON.parse(localStorage.getItem(toDoListName));
                PopulateToDoLists();

            }
        }
        else {
            // Sorry! No Local Storage support..
            if (debug) alert("Sory no local storage support!");
        }


    });

        


    
       
    
}

// Populate todo lists if we got some items from local or remote storage
function PopulateToDoLists() {

    if (typeof (storedToDos) !== "undefined" ) {

        // for (var i = 0; i < storedToDos.todo.length; i++) {
        highestLocalToDoId = storedToDos.length - 1;
        for (var i = 0; i < storedToDos.length; i++) {
            // var aToDo = storedToDos.todo[i];
            storedToDos[i].LocalId = i;
            var aToDo = storedToDos[i];
            $(aToDo.Finnished ? "#donelist" : "#todolist").append(toDoListItemBuilder(aToDo.LocalId, aToDo.Description, (aToDo.Finnished ? ListTypeEnum.DONE : ListTypeEnum.TODO)));
        }

        // Show the headers?
        ShowHeadersWithItems();

    }


    // Save the initial text of the #addtodo button because it will be messed with
    initialAddToDoButtonText = $("#addtodo").html();

    // Add event to the todo add item button
    $("#addtodo").click(addToDoItem);


    $('#newtodo').keypress(function(event){
        if(event.keyCode == 13){
            $('#addtodo').click();
        }
    });

    $('#listname').keypress(function (event) {
        if (event.keyCode == 13) {
            $('#listnamechange').click();
        }
    });





    // The List Name Change button
    $("#listnamechange").click(changeListName);

    
    focusOnInput();


}
 

function ShowHeadersWithItems() {
    // Check if the todo list is empty, if it is hide it
    if ($("#todolist").has("li").length === 0) {
        $("#tododiv").hide();
    } else $("#tododiv").show();

    // Check if the done list is empty, if it is hide it
    if ($("#donelist").has("li").length === 0) {
        $("#donediv").hide();
    } else $("#donediv").show();


}


function loadToDoList(name) {

    $("#listname").val(name);
    $("#listnamechange").click();


}


function changeListName() {

    var listName = $("#listname").val();
    listName = listName.trim();
    if (listName === "") return;
    if (listName === toDoListName) return;

    toDoListName = listName;
    console.log("changeListName changed toDoListName to " + listName);
    saveToDoNames();
    updateToDoListMenu();
    storedToDos = [];
    $("#todolist").empty();
    $("#donelist").empty();
    readPersistedToDo();
  
}



// Builds an array of toDoItem objects based on the ToDo list

// I am not used anymore...

function toDoToJSON(listId, name, toDos) {   // Needs to be redone totally based on the todo array
    
        // Until I find a better way...the .text() method brings in all the button texts etc.
        // and we need to get rid of that.
        var cut = 0;
        if (listId == "todolist") cut = 59;
        if (listId == "donelist") cut = 45;

    
        // Find the ToDo UL with the id of listId that we take as a parameter
        $("ul#" + listId + " li").each(function (index, element) {

            var tempText = $(this).text();
            var descriptionText = tempText.substring(0, (tempText.length - cut));
            descriptionText = stripHTML(descriptionText); // Paranoid

            if (debug) alert("Pushing " + descriptionText + " to the json array from list #" + listId + " item " + (index + 1) + ". Done = " + (listId == "donelist" ? "true" : "false"));


            //  toDos.todo.push( { 

            toDos.push({

                "CreatedDate": Date.now(),
                "DeadLine": Date.now(),
                "Description": descriptionText,
                "EstimationTime": 0,
                "Finnished": listId == "donelist" ? true : false,
                "Name": toDoListName
            });

        });
       
    
}


//
// Definition of the toDoItem object
//`

    function toDoItem(LocalId, CreatedDate, DeadLine, Description, EstimationTime, Finnished, Id, Name) {
        this.LocalId = LocalId;
        this.CreatedDate = CreatedDate;
        this.DeadLine = DeadLine;
        this.Description = Description;
        this.EstimationTime = EstimationTime;
        this.Finnished = Finnished;
        this.Id = Id;
        this.Name = Name;
    }


    // Save the entire current toDo list to local storage
    function saveToDoToLocalWeb() {

        // Can we?
        if (hasLocalStorage) {
   
            // Put the object into storage
            localStorage.setItem(toDoListName, JSON.stringify(storedToDos));
            if(debug) console.log("Stored to local storage: " + JSON.stringify(storedToDos));

        } else {
            // Sorry! No Web Storage support..
            if (debug) alert("Ingen web storage support!");
        }

    }




    // Change focus to the input field
    function focusOnInput() {
        $("#newtodo").focus();
    }


    function debugOn() {

        debug = true;
        if( $("#debug").length === 0 ){
            var debugFields = '<div id="debug"><label for="debuginfo1">Debug: Number of todo list elements</label><input type="text" id="debuginfo1" name="debuginfo1" class="form-control"></div>';
            $("div .form-group").append(debugFields);
        } else $("#debug").show();

    }

    function debugOff() {

        debug = false;
        $("#debug").hide();

    }



    function toDoListItemBuilder(toDoLocalId, toDoText, listType) {

        var listItem = ""; // Will hold the items List Item HTML that this function will return
        toDoText = stripHTML(toDoText); // really, really paranoid...
   
        // Common rows
        // listItem += '<div>';
        listItem += '    <li class="row list-group-item list-group-item-info">';
        listItem += toDoText;
        listItem += '      <div class="col-xs-6 col-sm-4 col-md-3 col-lg-2 btn-group btn-group-xs todo-item-buttons pull-right" role="group" aria-label="...">';

        // Buttons when adding to the TODO list
        if (listType === ListTypeEnum.TODO) {
            listItem += '        <button type="button" value="' + toDoText + '" onclick="doneToDoItem(this, ' + toDoLocalId + ')" class="todo-done btn btn-success">Klart!</button>';
            listItem += '        <button type="button" value="' + toDoText + '" onclick="changeToDoItem(this, ' + toDoLocalId + ')" class="todo-change btn btn-info">&Auml;ndra</button>';
            listItem += '        <button type="button" onclick="askToRemoveListItem(this, ' + toDoLocalId + ')" class="todo-remove btn btn-danger">Ta bort</button>';
        }


        // Button when adding to the DONE list
        if (listType === ListTypeEnum.DONE) {
            listItem += '        <button type="button" onclick="undoToDoItem(this, ' + toDoLocalId + ')" value="' + toDoText + '" class="done-undo btn btn-info">&Aring;ngra</button>';
            listItem += '        <button type="button" onclick="askToRemoveListItem(this, ' + toDoLocalId + ')" class="done-remove btn btn-danger">Ta bort</button>';
        }

        // More common rows
        listItem += '       </div>';
        listItem += '    </li>';
        // listItem += '</div>';

        return listItem;
 
    }


    // This function is called when the user clicks the DONE button on an item on the todo list
    // if that happens, we move the item to the done list
    function doneToDoItem(theButtonThatGotClicked, toDoLocalId) {

        var toDoText; // Will hold the items todo text
        var listItem; // Will hold the items List Item HTML

        toDoText = $(theButtonThatGotClicked).val();

        // Change the item in the array
        // We need to find the changed object in our Todo array
        var index = findWithAttr(storedToDos, "LocalId", toDoLocalId);
        if (index > -1) {
            storedToDos[index].Finnished = true;
        } else {
            console.log("Weird, doneToDoItem did not find toDoLocalId " + toDoLocalId + "in the storedToDos array...");
        }

        // Remove the item from the todo list
        removeListItemButDontSave(theButtonThatGotClicked, toDoLocalId);
        

        debugtext();

        // I dont want my page upside down
        toDoText = stripHTML(toDoText);

        // Add the list item to done list
        listItem = toDoListItemBuilder(toDoLocalId, toDoText, ListTypeEnum.DONE);
        $("#donelist").append(listItem);

        // Update todo list in local web storage
        saveToDoToLocalWeb();

        // Make sure the done list is displaying now that we know there is at least one item in it...
        $("#donediv").show();

        focusOnInput();

        debugtext();

        // Try to store the changes to todoo server
        if ( index > -1) {
            if (debug) console.log("doneToDoItem: Trying to update item on todoo server");
            // Method = "PUT", UriTemplate = "todo/{name}/{id}/done")]
            $.ajax({
                type: "PUT",
                url: toDoServerURL + '/todo/' + toDoListName + '/' + storedToDos[index].Id + '/done',
                success: changeTODOOItemToDoneSuccess,
                error: LogAjaxError
                // dataType: "json"
            });

        }
    }

    function changeTODOOItemToDoneSuccess() {
        // if (debug) console.log("changeTODOOItemToDoneSuccess() called, Todooo server updated item to DONE!");
        console.log("changeTODOOItemToDoneSuccess() called, Todooo server updated item to DONE!");
    }


    // This function will move an item back to the todo list
    function undoToDoItem(theButtonThatGotClicked, toDoLocalId) {

        var toDoText; // Will hold the items todo text
        var listItem; // Will hold the items List Item HTML

        toDoText = $(theButtonThatGotClicked).val();
       
        // Remove the item from the done list
        removeListItemButDontSave(theButtonThatGotClicked, toDoLocalId);

        saveToDoToLocalWeb();

        // I dont want my page upside down
        toDoText = stripHTML(toDoText);

        // Build the list item html
        listItem = toDoListItemBuilder(toDoLocalId, toDoText, ListTypeEnum.TODO);

        // Add the list item to the todo list
        $("#todolist").append(listItem);

        // Change the item in the array
        // We need to find the changed object in our Todo array
        var index = findWithAttr(storedToDos, "LocalId", toDoLocalId);
        if (index > -1) {
            storedToDos[index].Finnished = false;
        } else {
            console.log("Weird, undoToDoItem did not find toDoLocalId " + toDoLocalId + "in the storedToDos array...");
        }

        saveToDoToLocalWeb();

        // Make sure the list is displaying now that we know there is at least one item in it...
        $("#tododiv").show();

        focusOnInput();

        debugtext();

        // If we have a todoo server, save the changes
        if (index > -1) {
            // Method = "PUT", UriTemplate = "todo/{name}/{id}/done")]
            $.ajax({
                type: "PUT",
                url: toDoServerURL + '/todo/' + toDoListName + '/' + storedToDos[index].Id + '/notdone',
                success: changeTODOOItemToNotDoneSuccess,
                error: LogAjaxError
                // dataType: "json"
            });

        }

    }

    function changeTODOOItemToNotDoneSuccess() {
        console.log("Successfully changed the item to NOT DONE in the todoo server!");
    }

    // This function will remove the item and insert it in the
    // input field for entering a new item.
    // It will disable all buttons in the todo and done lists
    // and rely on the AddToDo function to re-enable them.

    // It will also change the text and color of the Add to list button
    // to indicate we are changing something

    function changeToDoItem(theButtonThatGotClicked, toDoLocalId) {
        var toDoText;

        // Retrieve the data from the item
        toDoText = $(theButtonThatGotClicked).val();
        toDoText = stripHTML(toDoText); // paranoid

        // Disable all buttons for all list items
        $("#tododiv :input").attr("disabled", true);
        $("#donediv :input").attr("disabled", true);

        // Remove the item from the on-screen todo list, it is still in the item array as well as
        // in local storage and todoo server storage.
        removeListItemButDontSave(theButtonThatGotClicked, toDoLocalId);

        // Not really neccessary, but you never know what the user is fiddlering with
        toDoText = stripHTML(toDoText);

        // And put it into the input field
        $("#newtodo").val(toDoText);

        // Change the text of the input button to "change"
        $("#addtodo").html('&Auml;ndra');
    
        // Set the color of the button to "btn-info"
        $("#addtodo").removeClass("btn-success").addClass("btn-info");
    

        // Ugly global variable signalling to the AddToDoItem function
        // that the added item is a changed item. 
        // Will not be needed when the change item design is changed

        nextAddedToDoLocalId = toDoLocalId;
        focusOnInput();

        debugtext();

    }


    function askToRemoveListItem(theButtonThatGotClicked, toDoLocalId) {
    

        // Lets fire up the modal!
        // '<a data-toggle="modal" href="#wantToDeleteModal" class="todo-remove btn btn-danger btn-xs">Ta bort</a>';

        // Insert the todo description into the modal
        var index = findWithAttr(storedToDos, "LocalId", toDoLocalId);
        if (index > -1) {
            $("#tabortitemdescription").text(storedToDos[index].Description);
        } else {
            console.log("Weird, askToRemoveListItem did not find toDoLocalId " + toDoLocalId + "in the storedToDos array...");
            $("#tabortitemdescription").text("Error: item description text not found");
        }

    
        $('#wantToDeleteModal').modal({
            show: 'true',
            backdrop: 'true',
            keyboard: 'true'
        });


        // Hide modal and exit if user did not want to delete item
        $('#wantToDeleteModal .go-back-button').click(function () {
            $('#wantToDeleteModal').modal('hide');
            return;
        });

        // Hide modal and delete item if user confirmed
        $('#wantToDeleteModal .okay-button').click(function () {
            $('#wantToDeleteModal').modal('hide');
            removeListItem(theButtonThatGotClicked, toDoLocalId);
        });

    }

    // This function will be called for items on both the todo and done list
    function removeListItem(theButtonThatGotClicked, toDoLocalId) {
 
  
        // $(theButtonThatGotClicked).parent().parent().remove();

        // We need to find the deleted object in our Todo array
        var index = findWithAttr(storedToDos, "LocalId", toDoLocalId);
        
        // Lets remove the deleted object from the todoo server and our Todo array
        var tempToDoId;
        if (index > -1) {
            tempToDoId = storedToDos[index].Id;
            storedToDos.splice(index, 1);
        }
                
        removeListItemButDontSave(theButtonThatGotClicked, toDoLocalId);
        saveToDoToLocalWeb();
        debugtext();


        if (index > -1) {
            removeItemFromTODOO(tempToDoId);
        }

    }

    function removeItemFromTODOO(Id) {

        
            console.log("Calling " + toDoServerURL + "/todo/" + toDoListName + "/" + Id);
                       
            $.ajax({
                type: "DELETE",
                url: toDoServerURL + '/todo/' + toDoListName + '/' + Id,
                success: removeItemFromTODOOSuccess(),
                error: function (xhr, ajaxOptions, thrownError) {
                    console.log("removeItemFronTODOO failed!");
                    console.log(xhr.status);
                    console.log(thrownError);
                }
                // dataType: "json"
            });
            
       
                      
    }

    function removeItemFromTODOOSuccess(result) {

        console.log("removeItemFromTODOOSuccess called successfully")
    }

    


// We dont want save to happen because we are just changing an item
// or moving it between lists
    function removeListItemButDontSave(theButtonThatGotClicked, toDoLocalId) {


        $(theButtonThatGotClicked).parent().parent().remove();

        ShowHeadersWithItems();
  
        focusOnInput();
        debugtext();

    }



    // This function is called when the user click the Add button to add an item to the todo list
    // It will look in the text field #newtodo and if it is not empty or already in the todo list
    // it will add the item to the todo list #todolist.
    // if it is in the todo list show an alert (not implemented)
    // if it is in the done list, show an alert and ask user if it should be moved back to the todo list (not implemented)
    function addToDoItem() {
        var toDoText; // Will hold the text from the textbox to be added to the todo list
        var listItem; // Will hold the List Item HTML 

        toDoText = $("#newtodo").val();

        toDoText = toDoText.trim();
        if (toDoText === "") return;
        
        // Avoid duplicate entries unless it is an edited item that is re-saved
        if (nextAddedToDoLocalId === null) {
            for (var i = 0; i < storedToDos.length; i++) {
                if (toDoText.toLowerCase() === storedToDos[i].Description.toLowerCase()) return;
            }
        } else { // If it is an edited item, allow duplicate if same id as before. Coded like this for readability.
            for (var j = 0; j < storedToDos.length; j++) {
                
                if (toDoText.toLowerCase() === storedToDos[j].Description.toLowerCase() && nextAddedToDoLocalId != storedToDos[j].LocalId) {
                    
                    console.log("nextAddedToDoLocalId= " + nextAddedToDoLocalId + "storedToDos[j].LocalId=" + storedToDos[j].LocalId);
                    return;
                }

            }

        }


        if (toDoText === "debugON") debugOn();
        if (toDoText === "debugOFF") debugOff();
        

 

        // Set the color and text of the #addtido button to "btn-success" and its original text because it might have been changed by another function call
        $("#addtodo").removeClass("btn-info").addClass("btn-success");
        $("#addtodo").html(initialAddToDoButtonText);

        // Clear the text from the input field
        $("#newtodo").val("");
  
        // I dont want my page upside down
        toDoText = stripHTML(toDoText);
    
        // Check if it is a new item or an edited item
        if (nextAddedToDoLocalId === null) {   // Then it is a new item

            var toDoLocalId = ++highestLocalToDoId;
            var dt = Date.now();
            var msDate = "\/Date(" + dt.valueOf() + ")\/"; // Microsoft WCF needs this format

            var tempToDo = new toDoItem(
                toDoLocalId,
                msDate,
                msDate,
                toDoText,
                0,
                false,
                null,
                toDoListName);


            storedToDos.push(tempToDo);

        } else { // It is an EDITED item
            toDoLocalId = nextAddedToDoLocalId;
        }
            
        

        var index = findWithAttr(storedToDos, "LocalId", toDoLocalId);
        if (index > -1) {
            storedToDos[index].Description = toDoText; // Redundant if it is a NEW item
        } else {
            console.log("Weird, addToDoItem did not find toDoLocalId " + toDoLocalId + "in the storedToDos array...");
        }

        // Build the HTML for the list item
        listItem = toDoListItemBuilder(toDoLocalId, toDoText, ListTypeEnum.TODO);
    
        $("#todolist").append(listItem);
    
        // Make sure the list is displaying now that we know there is at least one item in it...
        $("#tododiv").show();

        // Make sure all the buttons for all the list items can be used.
        // They might be disabled if the user was using the changeItem function.
        // Disable all buttons for all list items
        $("#tododiv :input").attr("disabled", false);
        $("#donediv :input").attr("disabled", false);

        saveToDoToLocalWeb();
        focusOnInput();
        debugtext();

        // If we have todoo server storage, we must either add or change the item now
        
            if (nextAddedToDoLocalId === null) {   // The item is a new item that need to be stored
                // nextAddedToDoLocalId = 0; // Just clearing
                console.log("add todo: storing a NEW item!");

                // Because our todo object is not exactly like the servers, we need to transform it
                //  Next refactoring: Try the object delete function

                // We have this: 
                // {"CreatedDate":1451394620806,"DeadLine":1451394620806,"Description":"mat","EstimationTime":0,"Finnished":false,"Id":-1,"Name":"MrInAHurry"}}
                // We want:
                // {"CreatedDate":"\/Date(1451390900353+0100)\/","DeadLine":"\/Date(1451563700330+0100)\/","Description":"FOOOOOOD!","EstimationTime":100,"Finnished":true,"Id":-1,"Name":"MrInAHurry"}


                var toDoToStore = { "CreatedDate": tempToDo.CreatedDate, "DeadLine": tempToDo.DeadLine, "Description": tempToDo.Description, "EstimationTime": tempToDo.EstimationTime, "Finnished": tempToDo.Finnished, "Name": tempToDo.Name };

                // Method = "POST", UriTemplate = "todo/{name}/new")]
                $.ajax({
                    type: "POST",
                    url: toDoServerURL + '/todo/' + toDoListName + '/new',
                    data: JSON.stringify({ todo: toDoToStore }),
                    success: function (data) {
                        addTODOOItemSuccess(data, toDoLocalId);
                    },
                    error: function (jqXHR, testStatus, errorThrown) {
                        addTODOOItemError(toDoToStore, toDoLocalId, jqXHR, testStatus, errorThrown);
                        
                    },

                    // dataType: "json",   // This broke things because the server dont return in json
                    contentType: 'application/json; charset=utf-8'
                });

            } else { // We are dealing with an update
                nextAddedToDoLocalId = null; // Just clearing
                console.log("add todo: UPDATING item!");
                
                // Method = "PUT", UriTemplate = "todo/{name}/{id}/description/{description}")]
                $.ajax({
                    type: "PUT",
                    url: toDoServerURL + '/todo/' + toDoListName + '/' + storedToDos[index].Id + '/description/' + storedToDos[index].Description,
                    success: function (data) { addTODOOChangeItemSuccess(data); },
                    error: function (jqXHR, testStatus, errorThrown) {
                        console.log("PUT " + toDoServerURL + "/todo/" + toDoListName + "/" + storedToDos[index].Id + "/description/" + storedToDos[index].Description + " ERROR");
                        console.log("testStatus: " + testStatus);
                        console.log("errrorThrown: " + errorThrown);
                    }
                    // dataType: "json" // not needed!
                    
                });


            }
      

    }

    function addTODOOItemSuccess(data, toDoLocalId) {

        console.log("Added new item to todoo server:" + data);
        console.log("data.Description = " + data.Description);
        console.log("data.Id = " + data.Id);
        console.log("local id = " + toDoLocalId)
        var index = findWithAttr(storedToDos, "LocalId", toDoLocalId);
        if (index > -1) {
            storedToDos[index].Id = data.Id;
        } else {
            console.log("Weird, addToDoItemSuccess did not find toDoLocalId " + toDoLocalId + "in the storedToDos array...");
        }
                
    }

    function addTODOOItemError(toDoToStore, toDoLocalId, jqXHR, testStatus, errorThrown) {

        console.log("POST " + toDoServerURL + "/todo/" + toDoListName + "/new ERROR");
        console.log("testStatus: " + testStatus);
        console.log("errrorThrown: " + errorThrown);
        console.log("ToDoToStore values:");
        console.log("Created: " + toDoToStore.CreatedDate);
        console.log("Deadline:" + toDoToStore.DeadLine);
        console.log("Description:" + toDoToStore.Description);
        console.log("Estimation:" + toDoToStore.EstimationTime);
        console.log("Finnished:" + toDoToStore.Finnished);
        console.log("Name:" + toDoToStore.Name);
        console.log("JSON stringifyed data:" + JSON.stringify({ todo: toDoToStore }));

        // Try to recover from false errors where data actually got posted
        // Our main problem, we have no idea what Id the todo item has in the todoo server.
        // Lets try to find out shall we?
        
        console.log("Error might be a false alarm. We are trying to recover...");
        $.getJSON(toDoServerURL + '/todo/' + toDoListName, function (data) {
            console.log("local id = " + toDoLocalId)
            for (var i = 0; i < data.length; i++) {

                if (data[i].Description === toDoToStore.Description) {
                    console.log("Found a matching description!");
                    console.log("Setting storedToDos[" + toDoLocalId + "] to " + data[i].Id);
                    console.log("In the best of worlds, this will only happen once...");
                    storedToDos[toDoLocalId].Id = data[i].Id;
                }

            }

        });

       
    }



    function addTODOOChangeItemSuccess(data) {

        console.log("Added CHANGED item to todoo server...");
        console.log("data.Description= " + data.Description);
        console.log("data.Id= " + data.Id);
        
    }



    // I stole this code. I hope it will keep the page safe from being turned upside-down...
    function stripHTML(dirtyString) {
        var container = document.createElement('div');
        var text = document.createTextNode(dirtyString);
        container.appendChild(text);
        return container.innerHTML; // innerHTML will be a xss safe string
    }


// I stole this code. It returns the value of the index
// in the array that has an attribute with a value
    function findWithAttr(array, attr, value) {
        for(var i = 0; i < array.length; i += 1) {
            if(array[i][attr] === value) {
                return i;
            }
        }
        return -1;
    }



    function debugtext() {

        if (!debug) return;

        $("#debuginfo1").val($("#todolist").has("li").length);

    }