function createEntry(entry, textType){
    var title, text, button;
    if(!entry) return '';

    title = '<h2>' + entry.title +'</h2>';

    if(textType == 'preview'){
        text = '<p>' + entry.text.split(' ').slice(0, 50).join(' ') + '...</p>';
        button = '<button onclick="getPost('+ entry.id +')">Continue Reading</button>'
    }
    else{
        text = '<p>' + entry.text + '</p>';
        button = '<button onclick="getAllPosts()">Read Other Articles</button>'
    }

    return title+text+button;
}

function writePostsToPage(data, textType){
    if(!data) return false;
    removePostsFromPage();

    //grab post-section
    var entryElement = document.getElementById('start-entry');
    //Append data to section
    for(var p = 0; p < data.length; p++){
        var curEntry = createEntry(data[p], textType);
        entryElement.innerHTML += curEntry;
    }
    return true;
}

function writePreviewsToPage(data){
    writePostsToPage(data, 'preview');
}
function writeFullEntryToPage(data){
    writePostsToPage([data], 'full');
}

function makeRequest(type, uri, _callback, _data){
    //Initialize vars
    var data = (!_data) ? {} : _data;
    var callBack = _callback || function(){};
    var xhttp = new XMLHttpRequest();
    if(!window.XMLHttpRequest) xhttp = new ActiveXObject("Microsoft.XMLHTTP");

    //Add JSON header to post types

    //Trigger callback if request is complete
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        callBack(JSON.parse(this.responseText));
      }
    };
    //Make Request
    xhttp.open(type, uri, true);
    if(type == 'POST' || type == 'PUT') xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify(data));
}

function removePostsFromPage(){
    var entryElement = document.getElementById('start-entry');
    entryElement.innerHTML = '';
}

function getAllPosts(){
    makeRequest('GET', "/blog", writePreviewsToPage);
}

function getPost(id){
    makeRequest('GET', "/blog/" + id, writeFullEntryToPage);
}
function postNewEntry(){
    var data = { 
        title: document.getElementById('entry-title').value, 
        text: document.getElementById('entry-text').value
    }
    makeRequest('POST', "/blog/new_entry", function(){}, data);
}

