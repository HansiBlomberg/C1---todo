// A simple TODO list
// This is my first javascript program
// bear with me!
// Hansi Blomberg 2015-12-17


debug = false;
if (debug) debugOn();
    

debugtext();

// Add event to the todo add item button
$("#addtodo").click(addToDoItem);


// This will make the enter key work to add items from the todo input field
$('#newtodo').bind("enterKey", addToDoItem);

$('#newtodo').keyup(function (e) {
    if (e.keyCode == 13) {
        $(this).trigger("enterKey");
    }
});


// This will be used as an argument to the toDoListItemBuilder() function
var ListTypeEnum = {
    TODO: 1,
    DONE: 2,
};


function debugOn() {

    debug = true;
    if( $("#debug").length == 0 ){
        var debugFields = '<div id="debug"><label for="debuginfo1">Debug: Number of todo list elements</label><input type="text" id="debuginfo1" name="debuginfo1" class="form-control"></div>';
        $("div .form-group").append(debugFields);
    } else $("#debug").show();

}

function debugOff() {

    debug = false;
    $("#debug").hide();

}



function toDoListItemBuilder(toDoText, listType) {

    var listItem = ""; // Will hold the items List Item HTML that this function will return

    // col-xs-12 col-md-12 col-lg-12  class="row"
    // Common rows
    listItem += '<div>';
   // listItem += '  <div>';
    listItem += '    <li class="row list-group-item list-group-item-info">'
    listItem += toDoText;
    listItem += '      <span class="col-xs-6 col-sm-4 col-md-3 col-lg-2 btn-group btn-group-xs todo-item-buttons pull-right" role="group" aria-label="...">';

    // Buttons when adding to the TODO list
    if (listType === ListTypeEnum.TODO) {
        listItem += '        <button type="button" value="' + toDoText + '" onclick="doneToDoItem(this)" class="todo-done btn btn-success">Klart!</button>';
        listItem += '        <button type="button" value="' + toDoText + '" onclick="changeToDoItem(this)" class="todo-change btn btn-info">&Auml;ndra</button>';
        listItem += '        <button type="button" onclick="removeListItem(this)" class="todo-remove btn btn-danger">Ta bort</button>';
    }

    // Button when adding to the DONE list
    if (listType === ListTypeEnum.DONE) {
        listItem += '        <button type="button" onclick="undoToDoItem(this)" value="' + toDoText + '" class="done-undo btn btn-info">&Aring;ngra</button>';
        listItem += '        <button type="button" onclick="removeListItem(this)" class="done-remove btn btn-danger">Ta bort</button>';
    }

    // More common rows
   
    listItem += '       </span>';
    listItem += '    </li>';
   // listItem += '  </div>';
    listItem += '</div>';

    return listItem;
 
}


// This function is called when the user clicks the DONE button on an item on the todo list
// if that happens, we move the item to the done list
function doneToDoItem(theButtonThatGotClicked) {

    var toDoText; // Will hold the items todo text
    var listItem; // Will hold the items List Item HTML

    toDoText = $(theButtonThatGotClicked).val();
   

    // Remove the item from the todo list
    removeListItem(theButtonThatGotClicked)


    debugtext();

    
    // I dont want my page upside down
    toDoText = stripHTML(toDoText);

    // Add the list item to done list
    listItem = toDoListItemBuilder(toDoText, ListTypeEnum.DONE);
    $("#donelist").append(listItem);

    // Make sure the done list is displaying now that we know there is at least one item in it...
    $("#donediv").show();

    debugtext();

}

// This function will move an item back to the todo list
function undoToDoItem(theButtonThatGotClicked) {

    var toDoText; // Will hold the items todo text
    var listItem; // Will hold the items List Item HTML

    toDoText = $(theButtonThatGotClicked).val();

    // Remove the item from the done list
    removeListItem(theButtonThatGotClicked)

   
    // I dont want my page upside down
    toDoText = stripHTML(toDoText);

    // Build the list item html
    listItem = toDoListItemBuilder(toDoText, ListTypeEnum.TODO);

    // Add the list item to the todo list
    $("#todolist").append(listItem);

    // Make sure the list is displaying now that we know there is at least one item in it...
    $("#tododiv").show();

    debugtext();

}

// This function will remove the item and insert it in the
// input field for entering a new item.
// It will disable all buttons in the todo and done lists
// and rely on the AddToDo function to re-enable them.
function changeToDoItem(theButtonThatGotClicked) {
    var toDoText;

    // Retrieve the data from the item
    toDoText = $(theButtonThatGotClicked).val();

    // Disable all buttons for all list items
    $("#tododiv :input").attr("disabled", true);
    $("#donediv :input").attr("disabled", true);

    // Remove the item from the todo list
    removeListItem(theButtonThatGotClicked);

    // Not really neccessary, but you never know what the user is fiddlering with
    toDoText = stripHTML(toDoText);

    // And put it into the input field
    $("#newtodo").val(toDoText);

    // Change focus to the input field
    $("#newtodo").focus();

    debugtext();

}


// This function will be called for items on both the todo and done list
function removeListItem(theButtonThatGotClicked) {

   // $(theButtonThatGotClicked).parent().parent().parent().parent().remove();
    $(theButtonThatGotClicked).parent().parent().parent().remove();

    // Check if the todo list is empty, if it is hide it
    if ($("#todolist").has("li").length == 0) {
        $("#tododiv").hide();
    }


    // Check if the done list is empty, if it is hide it
    if ($("#donelist").has("li").length == 0) {
        $("#donediv").hide();
    }

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
    if (toDoText === "") return;
    if (toDoText === "debugON") debugOn();
    if (toDoText === "debugOFF") debugOff();

    // Clear the text from the input field
    $("#newtodo").val("");
  
    // I dont want my page upside down
    toDoText = stripHTML(toDoText);

    // Build the HTML for the list item
    listItem = toDoListItemBuilder(toDoText, ListTypeEnum.TODO);
    
    $("#todolist").append(listItem);
    
    // Make sure the list is displaying now that we know there is at least one item in it...
    $("#tododiv").show();

    // Make sure all the buttons for all the list items can be used.
    // They might be disabled if the user was using the changeItem function.
    // Disable all buttons for all list items
    $("#tododiv :input").attr("disabled", false);
    $("#donediv :input").attr("disabled", false);

    debugtext();
}


// I stole this code. I hope it will keep the page safe from being turned upside-down...
function stripHTML(dirtyString) {
    var container = document.createElement('div');
    var text = document.createTextNode(dirtyString);
    container.appendChild(text);
    return container.innerHTML; // innerHTML will be a xss safe string
}


function debugtext() {

    if (!debug) return;

    $("#debuginfo1").val($("#todolist").has("li").length)

}