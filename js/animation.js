function moveCover(f,s){
    if(f==0){
        $("#cover").animate({left:'+=100px',width:'-=100px'},s);
    }
    else{
        $("#cover").animate({left:'+=44px',width:'-=44px'},s);
    }
    
}