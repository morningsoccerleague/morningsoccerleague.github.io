function generateStats(){
    var teamStats = {};
    teamStats.completed = true;
    teamStats.stats = {};
    teamStats.stats.home = getTeamStats('home');
    teamStats.stats.away = getTeamStats('away');
    var stats_tpl = document.getElementById("stats_tpl").value;
    //console.log(JSON.stringify(teamStats,null,2));
    var stats_main_tpl = (stats_tpl) ?  JSON.parse(stats_tpl) :{}
   // console.log(Object.assign(stats_main_tpl,teamStats))
    document.getElementById("gen_data").value = JSON.stringify(_.merge(stats_main_tpl,teamStats),null,2)
}

function getTeamStats (type){
    var team = `${type}_team`;
    var goals = `${type}_goals`;
    var cautions = `${type}_cautions`;
    var players = `${type}_players`;
    var keeper = `${type}_keeper`;
    var fouls = `${type}_fouls`;
    var mom = `${type}_mom`;

    var returnObj = {};
    //returnObj.team = document.getElementById(team).value.trim();
    returnObj.fouls = document.getElementById(fouls).value.trim();
    returnObj.goals = getGoals(document.getElementById(goals).value);
    returnObj.cautions = getCautions(document.getElementById(cautions).value);
    returnObj.players = getPlayers(document.getElementById(players).value);
    returnObj.keeper = getKeeper(document.getElementById(keeper).value);
    returnObj.mom = getMom(document.getElementById(mom).value);
    return returnObj;
}

function getGoals(val){
    if(!val) return [];
    var result =  val.split("\n").map(item => {
        var arr = item.split("\t");
        var obj =  {
            "minute": parseFloat(arr[8].split(":")[1]).toString(),
            "player" :  parseInt(arr[4])
        };
        if(arr[6]) {
            obj.assist =  parseInt(arr[6])
        }
        return obj;
    });
    return result;
}

function getCautions(val){
    if(!val) return [];
    var result =  val.split("\n").map(item => {
        var arr = item.split("\t");
        if(!arr[2])  return false;
        var obj =  {
            
            "caution_id": 1,
            "player": parseInt(arr[2]),
            "minute": parseFloat(arr[4].split(":")[1]).toString()
        };
        return  obj;
    }).filter(Boolean);
    return result;
}

function getPlayers(val){
    if(!val) return [];
    var result = val.split("\n").map(item => {
        return {"player": item}
    });
    return result;
}

function getKeeper(val){
    if(!val) return [];
    var result =  val.split("\n").map(item => {
        var arr = item.split("\t");
        if(!arr[2])  return false;
        var obj =  {
            "player": parseInt(arr[2]),
            "saves" :  parseInt(arr[3])
        };
        return  obj;
    }).filter(Boolean);

    return result;

}

function getMom(val){
    if(!val) return [];
    var result = val.split("\n").map(item => {
        return {"player": item}
    });
    return result;
}
