function addHover(){
    //console.log('Adding shake');
    document.getElementById('coming-soon').classList.add('shake')
}

function removeHover(){
    //console.log('Removing Shake');
    document.getElementById('coming-soon').classList.remove('shake');
}

document.getElementById('title').addEventListener('mouseenter',function(){
    //console.log('Entered center-content');
    addHover();
    window.setTimeout(removeHover, 1000);
});

var linkNodes = document.getElementsByClassName('link-item');
for(var i = 0; i < linkNodes.length; i++){

    var curNode = document.getElementById(linkNodes[i].id);

    (function(curNode){
        curNode.addEventListener('mouseenter', function(){
            document.getElementById('coming-soon').childNodes[0].innerHTML = curNode.id;
        });
    })(curNode);
    
    (function(curNode){
        curNode.addEventListener('mouseleave', function(){
            document.getElementById('coming-soon').childNodes[0].innerHTML = 'More coming soon';
        });
    })(curNode);
}