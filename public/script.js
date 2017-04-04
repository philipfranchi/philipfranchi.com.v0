
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
