/*
 
 När vi lägger till ett item så vill vi lägga till detta list item till <ul class="list-group">

 <li class="list-group-item list-group-item-info">ATT GÖRA TEXT
                 <div class="btn-group btn-group-xs" role="group" aria-label="...">
                    <button type="button" class="todo-done btn btn-success">Klart!</button>
                    <button type="button" class="todo-change btn btn-info">Ändra</button>
                    <button type="button" class="todo-remove btn btn-danger">Ta bort</button>
                </div>
            </li>
    */


/* Lägg till ett event på lägg-till knappen */
/* <button type="submit" class="btn btn-success" id="addtodo">Lägg till!</button> */

$("#addtodo").click(addToDoClicked);

// This function is called when the user click the Add button to add an item to the todo list
// It will look in the text field #newtodo and if it is not empty or already in the todo list
// it will add the item to the todo list #todolist.
// if it is in the todo list show an alert
// if it is in the done list, show an alert and ask user if it should be moved back to the todo list
function addToDoClicked() {
    var todoText; // Will hold the text from the textbox to be added to the todo list
    var listItem; // Will hold the List Item HTML 

    toDoText = $("#newtodo").val();
    if (toDoText === "") return;

    // I dont want my page upside down
    toDoText = stripHTML(toDoText);

    // Add the list item
    listItem   = '<li class="list-group-item list-group-item-info">' + toDoText + '<div class="btn-group btn-group-xs" role="group" aria-label="...">';
    listItem  += '<button type="button" class="todo-done btn btn-success">Klart!</button>';
    listItem  += '<button type="button" class="todo-change btn btn-info">Ändra</button>';
    listItem  += '<button type="button" class="todo-remove btn btn-danger">Ta bort</button></div></li>';

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




    /*

    När vi klickat på att vi gjort klart ett item vill vi ta bort det från att-göra-istan och
    lägga till det under <ul class="list-group">

    <li class="list-group-item list-group-item-success">
                Jag är bara ett exempel
                    <div class="btn-group btn-group-xs" role="group" aria-label="...">
                    <button type="button" class="done-undo btn btn-info">Ångra</button>
                    <button type="button" class="done-remove btn btn-danger">Ta bort</button>

                </div>
    </li>

    */



