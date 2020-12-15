recalculateServiceTime();
$(".priority-only").hide();

$(document).ready(function () {
    $("input[type=radio][name=algorithm]").change(function () {
        if (this.value == "priority") {
            $(".priority-only").show();
            $(".servtime").show();
            $("#minus").css("left", "604px");
        } else {
            $(".priority-only").hide();
            $(".servtime").show();
            $("#minus").css("left", "428px");
        }

        var paratag = document.getElementById("quantumParagraph");
        if (this.value == "robin") {
            $(".avg").hide();
            $(".servtime").hide();
            $(".completiontime").hide();
            $(".turnaroundtime").hide();
            paratag.style.visibility = "visible";
        } else {
            $(".avg").show();
            $(".completiontime").show();
            $(".turnaroundtime").show();
            paratag.style.visibility = "hidden";
            $(".servtime").show();
        }
        recalculateServiceTime();
    });
});

function addRow() {
    // console.log("Row");
    var lastRow = $("#inputTable tr:last");
    var lastRowNumebr = parseInt(lastRow.children()[1].innerText);

    // console.log(lastRow);
    var newRow =
        "<tr><td>P" +
        (lastRowNumebr + 1) +
        "</td><td>" +
        (lastRowNumebr + 1) +
        '</td><td><input class="exectime" type="text"/></td><td class="servtime"></td>' +
        //if ($('input[name=algorithm]:checked', '#algorithm').val() == "priority")
        '<td class="priority-only"><input type="text"/></td> <td class="completiontime"></td><td class="turnaroundtime"></td></tr>';
    lastRow.after(newRow);

    var minus = $("#minus");
    minus.show();
    minus.css("top", parseFloat(minus.css("top")) + 24 + "px");

    if ($("input[name=algorithm]:checked", "#algorithm").val() != "priority")
        $(".priority-only").hide();

    $("#inputTable tr:last input").change(function () {
        recalculateServiceTime();
    });
}

function deleteRow() {
    var tablerow = document.getElementById("inputTable").rows.length;
    if (tablerow == 2) {
        window.alert("Come on At least one process need to execute");
    } else {
        var lastRow = $("#inputTable tr:last");
        lastRow.remove();

        var minus = $("#minus");
        minus.css("top", parseFloat(minus.css("top")) - 24 + "px");

        if (parseFloat(minus.css("top")) < 150) minus.hide();
    }
}

$(".initial").change(function () {
    recalculateServiceTime();
});

function totalavg() {
    var tot_completionTime = 0;
    var tot_turnaroundtime = 0;
    var tableid = $("#inputTable tr");
    var count = tableid.length - 1;

    for (let i = 1; i <= count; i++) {
        tot_completionTime += parseInt($(tableid[i].children[5]).html());
        tot_turnaroundtime += parseInt($(tableid[i].children[6]).html());
    }
    var avg_completiontime = tot_completionTime / count;
    var avg_turnaroundtime = tot_turnaroundtime / count;
    avg_completiontime.toFixed(2);
    avg_turnaroundtime.toFixed(2);
    $("#ans_avg_turn").val(avg_turnaroundtime);
    $("#ans_avg_comp").val(avg_completiontime);
}

function recalculateServiceTime() {
    var inputTable = $("#inputTable tr");
    var totalExectuteTime = 0;
    var completionTime = 0;
    var algorithm = $("input[name=algorithm]:checked", "#algorithm").val();
    if (algorithm == "fcfs") {
        $.each(inputTable, function (key, value) {
            if (key == 0) return true;
            $(value.children[3]).text(totalExectuteTime);
            var executeTime = parseInt(
                $(value.children[2]).children().first().val()
            );
            // Starts here
            totalExectuteTime += executeTime;
            completionTime = totalExectuteTime;
            //Completion time
            $(value.children[5]).text(completionTime);
            //Turn Around time
            $(value.children[6]).text(
                completionTime - $(value.children[1]).text()
            );
        });
    } else if (algorithm == "sjf") {
        var exectuteTimes = [];
        $.each(inputTable, function (key, value) {
            if (key == 0) return true;
            exectuteTimes[key - 1] = parseInt(
                $(value.children[2]).children().first().val()
            );
        });

        var currentIndex = -1;
        for (var i = 0; i < exectuteTimes.length; i++) {
            currentIndex = findNextIndex(currentIndex, exectuteTimes);

            if (currentIndex == -1) return;

            $(inputTable[currentIndex + 1].children[3]).text(totalExectuteTime);

            totalExectuteTime += exectuteTimes[currentIndex];
            // Starts here
            completionTime = totalExectuteTime;
            $(inputTable[currentIndex + 1].children[5]).text(totalExectuteTime);

            $(inputTable[currentIndex + 1].children[6]).text(
                totalExectuteTime -
                    $(inputTable[currentIndex + 1].children[1]).text()
            );
        }
    } else if (algorithm == "priority") {
        var exectuteTimes = [];
        var priorities = [];

        $.each(inputTable, function (key, value) {
            if (key == 0) return true;
            exectuteTimes[key - 1] = parseInt(
                $(value.children[2]).children().first().val()
            );
            priorities[key - 1] = parseInt(
                $(value.children[4]).children().first().val()
            );
        });

        var currentIndex = -1;
        for (var i = 0; i < exectuteTimes.length; i++) {
            currentIndex = findNextIndexWithPriority(currentIndex, priorities);

            if (currentIndex == -1) return;

            $(inputTable[currentIndex + 1].children[3]).text(totalExectuteTime);

            totalExectuteTime += exectuteTimes[currentIndex];

            $(inputTable[currentIndex + 1].children[5]).text(totalExectuteTime);

            $(inputTable[currentIndex + 1].children[6]).text(
                totalExectuteTime -
                    $(inputTable[currentIndex + 1].children[1]).text()
            );
        }
    } else if (algorithm == "robin") {
        $("#minus").css("left", "335px");
        $.each(inputTable, function (key, value) {
            if (key == 0) return true;
            $(value.children[3]).text("");
        });
    }
}

function findNextIndexWithPriority(currentIndex, priorities) {
    var currentPriority = 1000000;
    if (currentIndex != -1) currentPriority = priorities[currentIndex];
    var resultPriority = 0;
    var resultIndex = -1;
    var samePriority = false;
    var areWeThereYet = false;

    $.each(priorities, function (key, value) {
        var changeInThisIteration = false;

        if (key == currentIndex) {
            areWeThereYet = true;
            return true;
        }
        if (value <= currentPriority && value >= resultPriority) {
            if (value == resultPriority) {
                if (currentPriority == value && !samePriority) {
                    samePriority = true;
                    changeInThisIteration = true;
                    resultPriority = value;
                    resultIndex = key;
                }
            } else if (value == currentPriority) {
                if (areWeThereYet) {
                    samePriority = true;
                    areWeThereYet = false;
                    changeInThisIteration = true;
                    resultPriority = value;
                    resultIndex = key;
                }
            } else {
                resultPriority = value;
                resultIndex = key;
            }

            if (value > resultPriority && !changeInThisIteration)
                samePriority = false;
        }
    });
    return resultIndex;
}

function findNextIndex(currentIndex, array) {
    var currentTime = 0;
    if (currentIndex != -1) currentTime = array[currentIndex];
    var resultTime = 1000000;
    var resultIndex = -1;
    var sameTime = false;
    var areWeThereYet = false;

    $.each(array, function (key, value) {
        var changeInThisIteration = false;

        if (key == currentIndex) {
            areWeThereYet = true;
            return true;
        }
        if (value >= currentTime && value <= resultTime) {
            if (value == resultTime) {
                if (currentTime == value && !sameTime) {
                    sameTime = true;
                    changeInThisIteration = true;
                    resultTime = value;
                    resultIndex = key;
                }
            } else if (value == currentTime) {
                if (areWeThereYet) {
                    sameTime = true;
                    areWeThereYet = false;
                    changeInThisIteration = true;
                    resultTime = value;
                    resultIndex = key;
                }
            } else {
                resultTime = value;
                resultIndex = key;
            }

            if (value < resultTime && !changeInThisIteration) sameTime = false;
        }
    });
    return resultIndex;
}
function addMultipleRow() {
    var count = document.getElementById("multirow").value;
    if (count > 0) {
        for (let i = 0; i < count; i++) {
            // console.log("ADD ROW");
            addRow();
        }
    } else {
        alert("Think what you just entered");
    }
}
function animate() {
    $("fresh").prepend(
        '<div id="curtain" style="position: absolute; right: 0; width:100%; height:100px;"></div>'
    );

    $("#curtain").width($("#resultTable").width());
    $("#curtain").css({ left: $("#resultTable").position().left });

    var sum = 0;
    $(".exectime").each(function () {
        sum += Number($(this).val());
        // ADD COMPLETION AND TURN AROUND TIME
    });

    console.log($("#resultTable").width());
    var distance = $("#curtain").css("width");
    // console.log("SUM Is" + sum);
    animationStep(sum, 0);
    jQuery("#curtain").animate(
        { width: "0", marginLeft: distance },
        (sum * 1000) / 2,
        "linear"
    );
    // console.log("Animation completed");
}

function animationStep(steps, cur) {
    $("#timer").html(cur);
    if (cur < steps) {
        setTimeout(function () {
            animationStep(steps, cur + 1);
        }, 500);
    }
}

function draw() {
    totalavg();
    $("fresh").html("");
    var inputTable = $("#inputTable tr");
    var th = "";
    var td = "";

    var algorithm = $("input[name=algorithm]:checked", "#algorithm").val();
    if (algorithm == "fcfs") {
        $.each(inputTable, function (key, value) {
            if (key == 0) return true;
            var executeTime = parseInt(
                $(value.children[2]).children().first().val()
            );
            th +=
                '<th style="height: 60px; width: ' +
                executeTime * 20 +
                'px;">P' +
                (key - 1) +
                "</th>";
            td += "<td>" + executeTime + "</td>";
        });

        $("fresh").html(
            '<table id="resultTable"><tr>' +
                th +
                "</tr><tr>" +
                td +
                "</tr></table>"
        );
    } else if (algorithm == "sjf") {
        var executeTimes = [];

        $.each(inputTable, function (key, value) {
            if (key == 0) return true;
            var executeTime = parseInt(
                $(value.children[2]).children().first().val()
            );
            executeTimes[key - 1] = { executeTime: executeTime, P: key - 1 };
        });

        executeTimes.sort(function (a, b) {
            if (a.executeTime == b.executeTime) return a.P - b.P;
            return a.executeTime - b.executeTime;
        });

        $.each(executeTimes, function (key, value) {
            th +=
                '<th style="height: 60px; width: ' +
                value.executeTime * 20 +
                'px;">P' +
                value.P +
                "</th>";
            td += "<td>" + value.executeTime + "</td>";
        });

        $("fresh").html(
            '<table id="resultTable"><tr>' +
                th +
                "</tr><tr>" +
                td +
                "</tr></table>"
        );
    } else if (algorithm == "priority") {
        var executeTimes = [];

        $.each(inputTable, function (key, value) {
            if (key == 0) return true;
            var executeTime = parseInt(
                $(value.children[2]).children().first().val()
            );
            var priority = parseInt(
                $(value.children[4]).children().first().val()
            );
            executeTimes[key - 1] = {
                executeTime: executeTime,
                P: key - 1,
                priority: priority,
            };
        });

        executeTimes.sort(function (a, b) {
            if (a.priority == b.priority) return a.P - b.P;
            return b.priority - a.priority;
        });

        $.each(executeTimes, function (key, value) {
            th +=
                '<th style="height: 60px; width: ' +
                value.executeTime * 20 +
                'px;">P' +
                value.P +
                "</th>";
            td += "<td>" + value.executeTime + "</td>";
        });

        $("fresh").html(
            '<table id="resultTable" style="width: 70%"><tr>' +
                th +
                "</tr><tr>" +
                td +
                "</tr></table>"
        );
    } else if (algorithm == "robin") {
        var quantum = $("#quantum").val();
        if (quantum <= 0) {
            window.alert(
                "Alright Don't be checky I can't handle negative time"
            );
            return false;
        } else {
            var executeTimes = [];

            $.each(inputTable, function (key, value) {
                if (key == 0) return true;
                var executeTime = parseInt(
                    $(value.children[2]).children().first().val()
                );
                executeTimes[key - 1] = {
                    executeTime: executeTime,
                    P: key - 1,
                };
            });

            var areWeThereYet = false;
            while (!areWeThereYet) {
                areWeThereYet = true;
                $.each(executeTimes, function (key, value) {
                    if (value.executeTime > 0) {
                        th +=
                            '<th style="height: 60px; width: ' +
                            (value.executeTime > quantum
                                ? quantum
                                : value.executeTime) *
                                20 +
                            'px;">P' +
                            value.P +
                            "</th>";
                        td +=
                            "<td>" +
                            (value.executeTime > quantum
                                ? quantum
                                : value.executeTime) +
                            "</td>";
                        value.executeTime -= quantum;
                        areWeThereYet = false;
                    }
                });
            }
            $("fresh").html(
                '<table id="resultTable" style="width: 70%"><tr>' +
                    th +
                    "</tr><tr>" +
                    td +
                    "</tr></table>"
            );
        }
    }
    animate();
}
