

// Add event to the todo add item button
// <button type="submit" class="btn btn-success" id="addtodo">Lägg till!</button>

$("#addtodo").click(addToDoItem);

$('#newtodo').bind("enterKey", addToDoItem);

$('#newtodo').keyup(function (e) {
    if (e.keyCode == 13) {
        $(this).trigger("enterKey");
    }
});



// This function is called when the user clicks the DONE button on an item on the todo list
// if that happens, we move the item to the done list
function doneToDoItem(theButtonThatGotClicked) {

    var toDoText; // Will hold the items todo text
    var listItem; // Will hold the items List Item HTML
    // alert("I am boinked!");
    toDoText = $(theButtonThatGotClicked).val();
    
    // alert(toDoText);

    // Remove the item from the todo list
    $(theButtonThatGotClicked).parent().parent().detach();

    // Check if the todo list is empty, if it is hide it
    // alert("I den bästa av världar hade detta varit antalet items i todo listan: " + $('#todolist').children().length);

    if ($('#todolist').children().length < 1) {
        $("#tododiv").hide();
    }


    // Add it to done list

    // I dont want my page upside down
    toDoText = stripHTML(toDoText);


    // Add the list item to the done list
    listItem = ""; // Because I wanted all the string building below to start with listItem +=
    listItem += '<div class="row">';
    listItem += '  <div>';
    listItem += '    <li class="list-group-item list-group-item-info">'
    listItem += toDoText;
    listItem += '      <div class="btn-group btn-group-xs todo-item-buttons" role="group" aria-label="...">';
    listItem += '        <button type="button" onclick="undoToDoItem(this)" value="' + toDoText + '" class="done-undo btn btn-info">&Aring;ngra</button>';
    listItem += '        <button type="button" onclick="removeToDoItem(this)" class="done-remove btn btn-danger">Ta bort</button>';
    listItem += '       </div>';
    listItem += '    </li>';
    listItem += '  </div>';
    listItem += '</div>';


    $("#donelist").append(listItem);

    // Make sure the list is displaying now that we know there is at least one item in it...
    $("#donediv").show();

}

// This function will move an item back to the todo list
function undoToDoItem(theButtonThatGotClicked) {

    var toDoText; // Will hold the items todo text
    var listItem; // Will hold the items List Item HTML
    // alert("I am boinked!");
    toDoText = $(theButtonThatGotClicked).val();

    // Remove the item from the done list
    $(theButtonThatGotClicked).parent().parent().remove();

    // Check if the done list is empty, if it is hide it
    //  alert("I den bästa av världar hade detta varit antalet items i done listan: " + $('#donelist').children().length);

    if ($('#donelist').children().length < 1) {
        $("#donediv").hide();
    }


    // Add it to todo list

    // I dont want my page upside down
    toDoText = stripHTML(toDoText);


    // Add the list item to the todo list
    listItem = ""; // Because I wanted all the string building below to start with listItem +=

    listItem += '<div class="row">';
    listItem += '  <div>';
    listItem += '    <li class="list-group-item list-group-item-info">'
    listItem += toDoText;
    listItem += '      <div class="btn-group btn-group-xs todo-item-buttons" role="group" aria-label="...">';
    listItem += '        <button type="button" value="' + toDoText + '" onclick="doneToDoItem(this)" class="todo-done btn btn-success">Klart!</button>';
    listItem += '        <button type="button" value="' + toDoText + '" onclick="changeToDoItem(this)" class="todo-change btn btn-info">&Auml;ndra</button>';
    listItem += '        <button type="button" onclick="removeToDoItem(this)" class="todo-remove btn btn-danger">Ta bort</button>';
    listItem += '       </div>';
    listItem += '    </li>';
    listItem += '  </div>';
    listItem += '</div>';


    $("#todolist").append(listItem);

    // Make sure the list is displaying now that we know there is at least one item in it...
    $("#tododiv").show();

}

// This function will remove the item and insert it in the
// box for entering a new item.
function changeToDoItem(theButtonThatGotClicked) {
    var toDoText;

    // Retrieve the data from the item
    toDoText = $(theButtonThatGotClicked).val();

    // Remove the item from the todo list
    $(theButtonThatGotClicked).parent().parent().detach();

    // Not really neccessary, but you never know what the user is fiddlering with
    toDoText = stripHTML(toDoText);

    // And put it into the input field
    $("#newtodo").val(toDoText);

    // Change focus to the input field
    $("#newtodo").focus();

}


// This function will be called for items on both the todo and done list
function removeToDoItem(theButtonThatGotClicked) {

    $(theButtonThatGotClicked).parent().parent().remove();

}


// This function is called when the user click the Add button to add an item to the todo list
// It will look in the text field #newtodo and if it is not empty or already in the todo list
// it will add the item to the todo list #todolist.
// if it is in the todo list show an alert
// if it is in the done list, show an alert and ask user if it should be moved back to the todo list
function addToDoItem() {
    var toDoText; // Will hold the text from the textbox to be added to the todo list
    var listItem; // Will hold the List Item HTML 

    toDoText = $("#newtodo").val();
    if (toDoText === "") return;

    // Clear the text from the input field
    $("#newtodo").val("");
  
    // I dont want my page upside down
    toDoText = stripHTML(toDoText);


       // Add the list item to the todo list
    listItem = ""; // Because I wanted all the string building below to start with listItem +=
    listItem += '<div class="row">';
    listItem += '  <div>';
    listItem += '    <li class="list-group-item list-group-item-info">'
    listItem +=        toDoText;
    listItem += '      <div class="btn-group btn-group-xs todo-item-buttons" role="group" aria-label="...">';
    listItem += '        <button type="button" value="'+toDoText+'" onclick="doneToDoItem(this)" class="todo-done btn btn-success">Klart!</button>';
    listItem += '        <button type="button" value="' + toDoText + '" onclick="changeToDoItem(this)" class="todo-change btn btn-info">&Auml;ndra</button>';
    listItem += '        <button type="button" onclick="removeToDoItem(this)" class="todo-remove btn btn-danger">Ta bort</button>';
    listItem += '       </div>';
    listItem += '    </li>';
    listItem += '  </div>';
    listItem += '</div>';

    $("#todolist").append(listItem);
    
    // Make sure the list is displaying now that we know there is at least one item in it...
    $("#tododiv").show();



}


// I stole this code. I hope it will keep the page safe from being turned upside-down...
function stripHTML(dirtyString) {
    var container = document.createElement('div');
    var text = document.createTextNode(dirtyString);
    container.appendChild(text);
    return container.innerHTML; // innerHTML will be a xss safe string
}
