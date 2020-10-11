let rows=2;
//let processes=rows-2;
document.getElementById("cover").hidden=false;
document.getElementById("mytb").hidden=false;
let table=document.getElementById("table");

function radioClicked(e){
    if(e=="RR"){
        document.getElementById("timequanta").style.display='block';       
    }
    else{
        document.getElementById("timequanta").style.display='none';       
    }
}

function addRow(){
	let AT=document.getElementById("AT").value;
    let BT=document.getElementById("BT").value;
    if(AT=="" ||BT==""){
    	alert("Empty field");
    }
    else{
        if(Number(AT)<0 || Number (BT)<0){
            alert("Invalid Values");
            return;
        }
    	let row=table.insertRow(rows);
    	let cell1=row.insertCell(0);
    	let cell2=row.insertCell(1);
    	let cell3=row.insertCell(2);
    	let cell4=row.insertCell(3);
        let cell5=row.insertCell(4);
        let cell6=row.insertCell(5);
        let cell7=row.insertCell(6);
		cell1.innerHTML="P"+(rows-1);
    	cell2.innerHTML=AT;
    	cell3.innerHTML=BT;
    	cell4.innerHTML="";
        cell5.innerHTML="";
        cell6.innerHTML="";
        cell7.innerHTML="";
   	 	rows++;
        document.getElementById("BT").value="";
        document.getElementById("AT").value="";
    }
}
function deleteRow(){
	if(rows==2){
    	alert("Cannot delete anymore rows");
    }
    else{
		table.deleteRow(rows-1);
    	rows--;
    }
}
function addProcesses(time,processes,queue,check_pro,bt){ 
    for(i=1;i<=processes;i++){
        let at=table.rows[1+i].cells[1].innerHTML;
        let et=table.rows[1+i].cells[2].innerHTML;
        let a=Number(at);
        let b=Number(et);
        if(a<=time && check_pro[i]==false){
            queue.push(i);
            bt.push(b);
            check_pro[i]=true;
        }
    }
}
function animator(pr,tr,r,b){
    if(r==0){
        var t=pr.insertCell(-1);
        t.innerHTML="CPU Idle";
        var td=tr.insertCell(-1);
        td.innerHTML=""+b;
        var temp=b*1000;
        moveCover(0,temp);
    }
    else{    
        var t=pr.insertCell(-1);
        t.innerHTML="P"+r;
        var td=tr.insertCell(-1);
        td.innerHTML=""+b;
        var temp=b*1000;
        moveCover(1,temp);
    } 
}

function calAverage(p){
    let avgct=0;
    let avgtat=0;
    for(i=1;i<=p;i++){
        let ct=Number(table.rows[1+i].cells[5].innerHTML);
        let tat=Number(table.rows[1+i].cells[4].innerHTML);
        avgct=Number(avgct)+ct;
        avgtat=Number(avgtat)+tat;
    }
    avgct=avgct/p;
    avgtat=avgtat/p;
    avgct=avgct.toPrecision(3);
    avgtat=avgtat.toPrecision(3);
    document.getElementById('averagebox1').value=avgct;
    document.getElementById('averagebox2').value=avgtat;
}

function calculate(){
    let processes=rows-2;
    document.getElementById("cover").style.left="0";
    document.getElementById("cover").style.width="100%";
    document.getElementById("processr").innerHTML="";
    document.getElementById("timer").innerHTML="";
    //SJF
    if(document.getElementById("SJF").checked){
        let time=0;
        let check_pro = [];
        for(i=1;i<=processes;i++){
            check_pro[i]=false;
        }
        let queue=[];
        let bt=[];
        let counter=0;
        addProcesses(time,processes,queue,check_pro,bt);
        if(queue.length==0){
            let flag=0;
            for(j=1;j<=processes;j++){
                if(check_pro[j]==false){
                    flag++;
                    break;
                }
            }
            let at=Number(table.rows[1+j].cells[1].innerHTML);
            let b=Number(table.rows[1+j].cells[2].innerHTML);
            var pr=document.getElementById("processr");
            var tr=document.getElementById("timer");
            animator(pr,tr,0,at);
            time=at;
            addProcesses(time,processes,queue,check_pro,bt); 
        }
        while(!(queue.length==0)){
            let r=0;
            let min=Math.min(...bt);
            let index=bt.indexOf(min);
            if(index==-1){
                break;
            }
            else{
                bt.splice(index,1);
                r=queue[index];
                let myt=document.getElementById("mytb");
                var pr=document.getElementById("processr");
                var tr=document.getElementById("timer");
                animator(pr,tr,r,min);
                queue.splice(index,1);
                table.rows[1+r].cells[3].innerHTML=time;
                time=time+min;
                let at=Number(table.rows[1+r].cells[1].innerHTML);
                table.rows[1+r].cells[5].innerHTML=time;
                table.rows[1+r].cells[4].innerHTML=time-at;
                table.rows[1+r].cells[6].innerHTML=(time-at)-min;
                addProcesses(time,processes,queue,check_pro,bt);
                if(queue.length==0){
                    let flag=0;
                    for(i=1;i<=processes;i++){
                        if(check_pro[i]==false){
                            flag++;
                            break;
                        }
                    }
                    if(flag==0){
                        break;
                    }
                    else{
                        let at=Number(table.rows[1+i].cells[1].innerHTML);
                        let b=Number(table.rows[1+i].cells[2].innerHTML);
                        var pr=document.getElementById("processr");
                        var tr=document.getElementById("timer");
                        animator(pr,tr,0,at-time);
                        time=at;
                        addProcesses(time,processes,queue,check_pro,bt);
                    }
                }
            }
        }
        calAverage(processes);
    }
    
    //FCFS
    else if(document.getElementById("FCFS").checked){
        let time=0;
        if(table.rows[2].cells[1].innerHTML=="0"){
        	table.rows[2].cells[3].innerHTML="0";
            table.rows[2].cells[6].innerHTML="0";
     	}    
     	else{
            table.rows[2].cells[3].innerHTML=table.rows[2].cells[1].innerHTML;
            var pr=document.getElementById("processr");
            var tr=document.getElementById("timer");
            var b=Number(table.rows[2].cells[1].innerHTML);
            time=time+b;
            animator(pr,tr,0,b);
            table.rows[2].cells[6].innerHTML="0";
        }
    	for(i=1;i<processes;i++){
			let at=table.rows[1+i].cells[1].innerHTML;
            let rt=table.rows[1+i].cells[3].innerHTML;
          	let bt=table.rows[1+i].cells[2].innerHTML;
            let newat=table.rows[2+i].cells[1].innerHTML;
            let a=Number(at);
            let r=Number(rt);
          	let b=Number(bt);
            let na=Number(newat);
            let res=0;
            if(na<=(a+b)){ 
          		res=r+b;
          		table.rows[2+i].cells[3].innerHTML = ""+res;
            }
            else{
              	res=na;
          		table.rows[2+i].cells[3].innerHTML = ""+res;
            }
            let wt=res-na;
            table.rows[2+i].cells[6].innerHTML = ""+wt;
        }
        for(i=0;i<processes;i++){
            var mytb=document.getElementById("mytb");
            var pr=document.getElementById("processr");
            var tr=document.getElementById("timer");
            let at=table.rows[2+i].cells[1].innerHTML;
        	let wt=table.rows[2+i].cells[6].innerHTML;
			let rt=table.rows[2+i].cells[3].innerHTML;
           	let bt=table.rows[2+i].cells[2].innerHTML;
            let r=Number(rt);
            let a=Number(at);
           	let b=Number(bt);
            let w=Number(wt);
            if(a>time){
                animator(pr,tr,0,a-time);
                time=at;
                time=Number(time)+Number(b);
                animator(pr,tr,i+1,b);
            }
            else{
                time=Number(time)+Number(b);
                animator(pr,tr,i+1,b);
            }
            let ct=r+b;
            let tat=w+b;
           	table.rows[2+i].cells[5].innerHTML = ""+ct;
            table.rows[2+i].cells[4].innerHTML = ""+tat;
        }
        calAverage(processes);
    }
    
    //RR algorithm
    else if(document.getElementById("RR").checked){
    	let time=0;
        let check_pro = [];
        for(i=1;i<=processes;i++){
            check_pro[i]=false;
        }
        let queue=[];
        let bt=[];
        let counter=0;
        addProcesses(time,processes,queue,check_pro,bt);
        if(queue.length==0){
            let flag=0;
            for(j=1;j<=processes;j++){
                if(check_pro[j]==false){
                    flag++;
                    break;
                }
            }
            let at=Number(table.rows[1+j].cells[1].innerHTML);
            let b=Number(table.rows[1+j].cells[2].innerHTML);
            var pr=document.getElementById("processr");
            var tr=document.getElementById("timer");
            animator(pr,tr,0,at);
            time=at;
            addProcesses(time,processes,queue,check_pro,bt); 
        }
        let tq=Number(document.getElementById("TQ").value);
        while(!(queue.length==0)){
            let i=queue[0];
            if(bt[0]<=tq){
                let temp2=Number(bt[0]);
                queue.shift();
                bt.shift();
                if(table.rows[1+i].cells[3].innerHTML==""){
                    table.rows[1+i].cells[3].innerHTML=time;
                    table.rows[1+i].cells[5].innerHTML=(time+temp2);
                    table.rows[1+i].cells[4].innerHTML=(Number(table.rows[1+i].cells[5].innerHTML)-Number(table.rows[1+i].cells[1].innerHTML));
                    table.rows[1+i].cells[6].innerHTML=(Number(table.rows[1+i].cells[4].innerHTML)-Number(table.rows[1+i].cells[2].innerHTML));
                }
                else{
                    table.rows[1+i].cells[5].innerHTML=(time+temp2);
                    table.rows[1+i].cells[4].innerHTML=(Number(table.rows[1+i].cells[5].innerHTML)-Number(table.rows[1+i].cells[1].innerHTML));
                    table.rows[1+i].cells[6].innerHTML=(Number(table.rows[1+i].cells[4].innerHTML)-Number(table.rows[1+i].cells[2].innerHTML));
                }
                var pr=document.getElementById("processr");
                var tr=document.getElementById("timer");
                animator(pr,tr,i,temp2);
                time=time+temp2;
                addProcesses(time,processes,queue,check_pro,bt);
            }
            
            else if(bt[0]>tq){
                var temp=bt[0]-tq;
                queue.shift();
                bt.shift();
                var pr=document.getElementById("processr");
                var tr=document.getElementById("timer");
                animator(pr,tr,i,tq);
                if(table.rows[1+i].cells[3].innerHTML==""){
                    table.rows[1+i].cells[3].innerHTML=time;
                }
                time=time+tq;
                addProcesses(time,processes,queue,check_pro,bt);
                queue.push(i);
                bt.push(temp);
            }

            if(queue.length==0){
                let flag=0;
                for(j=1;j<=processes;j++){
                    if(check_pro[j]==false){
                        flag++;
                        break;
                    }
                }
                if(flag==0){
                    break;
                }
                else{
                    let at=Number(table.rows[1+j].cells[1].innerHTML);
                    let b=Number(table.rows[1+j].cells[2].innerHTML);
                    var pr=document.getElementById("processr");
                    var tr=document.getElementById("timer");
                    animator(pr,tr,0,at-time);
                    time=at;
                    addProcesses(time,processes,queue,check_pro,bt);
                }    
            }     
        }
        calAverage(processes);
    }

    else{
    	alert("Select a Radio Button");
    }
}