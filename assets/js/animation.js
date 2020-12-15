function moveCover(f,s){
    if(f==0){
        $("#cover").animate({left:'+=100px',width:'-=100px'},s);
    }
    else{
        $("#cover").animate({left:'+=44px',width:'-=44px'},s);
    }
    
}

function genrateColor(){
    var color = 'rgba(';
    var r=Math.random()*(254);
    var g=Math.random()*(254);
    var b=Math.random()*(254);
    color=color+r+','+g+','+b+',0.6)'
    return color;
}

function setColor(p){
    var colCell=document.getElementById("table").rows[p].cells.item(8);
    colCell.style.backgroundColor=genrateColor();
}