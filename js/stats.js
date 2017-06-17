var datetime = Math.round(new Date().getTime() / 1000);


var teamObj = {};


$(document).ready(function () {

    loadTeams(loadStats)


});

function  loadTeams (callback){
    $.getJSON('./data/teams.json?time='+datetime,function(json){
        callback(json)
    });
}


function getDefaultScore(){
    var defaultScore = {
        played :  0,
        won :  0,
        lost : 0,
        draw : 0,
        goal_allowed : 0,
        goal_scored : 0
    };

    return defaultScore;
}

function getTeamStats (teams, schedule){

    var groupedTeams = _.groupBy(teams,'id');


    _.each(schedule,function(itemobj, index){
        // console.log(itemobj);
        //var teamObj = {};


        var home = _.pick(itemobj.stats,'home').home;
        var away = _.pick(itemobj.stats,'away').away;


        if(home.goals && away.goals) {
            if(teamObj[home.team]){
                teamObj[home.team].played =  teamObj[home.team].played + 1;
            } else {
                teamObj[home.team] = getDefaultScore();
                teamObj[home.team].played = 1;
            }
            if(teamObj[away.team]){
                teamObj[away.team].played =  teamObj[away.team].played + 1;
            } else {
                teamObj[away.team] = getDefaultScore();
                teamObj[away.team].played = 1;
            }


            if(home.goals.length == away.goals.length) {

                teamObj[home.team].draw =  (teamObj[home.team].draw || 0 ) + 1;
                teamObj[away.team].draw =  (teamObj[away.team].draw || 0 ) + 1;

            } else if(home.goals.length > away.goals.length) {


                teamObj[home.team].won =  (teamObj[home.team].won || 0 ) + 1;
                teamObj[away.team].lost =  (teamObj[away.team].lost|| 0 ) + 1;

                teamObj[away.team].goal_allowed =  teamObj[away.team].goal_allowed + home.goals.length;




            } else if(away.goals.length > home.goals.length) {

                teamObj[away.team].won =  (teamObj[away.team].won || 0 ) + 1;
                teamObj[home.team].lost =  (teamObj[home.team].lost || 0 ) + 1;

                teamObj[home.team].goal_allowed =  teamObj[home.team].goal_allowed + away.goals.length;

            }

            teamObj[home.team].goal_scored =  teamObj[home.team].goal_scored + home.goals.length;
            teamObj[away.team].goal_scored =  teamObj[away.team].goal_scored + away.goals.length;




        } else {


            if(!teamObj[home.team]){

                teamObj[home.team] = getDefaultScore();
            }
            if(!teamObj[away.team]){

                teamObj[away.team] = getDefaultScore();
            }


        }


    });

    _.each(teamObj,function(itemobj, index){
        itemobj.goal_diff =  itemobj.goal_scored - itemobj.goal_allowed;

        itemobj.points =  (itemobj.draw * 1) +  (itemobj.won * 3);
        console.log(groupedTeams[index]);

        itemobj.team = groupedTeams[index][0];


    });

    teamObj = _.values(teamObj)
    teamObj.sort(predicate({
        name : 'points',
        reverse : true
    },{
        name : 'goal_diff',
        reverse : true
    },{
        name : 'goal_scored',
        reverse : true
    }));

    return _.values(teamObj);
}


function  renderTable (statsData){

    var stats_source   = $("#stats-template").html();
    var stats_template = Handlebars.compile(stats_source);


    var stats_html    = stats_template(statsData);
    $('tbody').html(stats_html);

}


var teamStats;
function  loadStats(teamsArr){
    $.getJSON('./data/schedule.json?time='+datetime,function(scheduleData){
        teamStats = getTeamStats(teamsArr, scheduleData);
        renderTable(teamStats);
    });

}