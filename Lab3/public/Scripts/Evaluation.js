var student;var tutor;var keyword;var keys='';var keywords;var result;var keyNotinAns;var ansNotinKey;
    var foundinAns;var useranswer;
    var synonyms={
        synonyms:{}
    };
    var Question;
    /*var Question= {
        questionID: 10,
        question: 'what is java is called platform independent?',
        answer: 'Java is called Platform independent because of its byte code which can run on any OS.',
        keywords: [{'id': 1, 'key': 'byte code', 'score': 5},
            {'id': 2, 'key': 'run on any OS', 'score': 5}]
    };*/
var textAnalyze = function($scope,$http,qid) {
    var query='https://api.mlab.com/api/1/databases/nlp_database/collections/questions?apiKey=lSMpIYO_9GB-Gnslwjb-KPeyA4fc4hxb';
    $http.get(query+'&q={"question_id":'+qid+'}').then(function(data){
        console.log(data);
        console.log('check');
        Question=data.data[0];
        AnswerEval($scope,$http,qid);
    });
};
function AnswerEval($scope,$http,qid){
    useranswer=document.getElementById("answers-"+qid).value;
    var query = '/hiresh/nlp?text=';
    $http.post(query+ useranswer).then(function (data) {
        student =data;
        $http.post(query+ Question.answer).then(function (data) {
            //console.log(data);
            tutor =data;
            Result(student.data.tokens,tutor.data.tokens,$http);
        });
    });
}
    function Result(student,tutor,$http)
    {
        //console.log(tutor);
        //console.log(Question.keywords);
        keywords = alasql('SELECT LOWER(keywords.key) as a,LOWER(tutor.text.content) as b,LOWER(tutor.partOfSpeech.tag) as c,keywords.score as d \
         ,tutor.lemma as lemma,keywords.score as score\
         FROM ? AS keywords JOIN ? AS tutor ON LOWER(keywords.key) LIKE "%"+'+'LOWER(tutor.text.content)'+'+"%"\
         OR " "+'+'LOWER(keywords.key)'+'+" " LIKE "% "+'+'LOWER(tutor.lemma)'+'+" %"',
            [Question.keywords,tutor]);
        console.log(keywords);
        //console.log(student);
        result = alasql('SELECT student.text.content as ans,keywords.a as key,keywords.d as score \
         FROM ? AS student JOIN ? AS keywords ON LOWER(student.text.content) = keywords.b\
         OR LOWER(student.lemma) = keywords.b',
            [student, keywords]);
        //console.log(result);

        keyNotinAns = alasql('COLUMN OF SELECT keywords.b \
         FROM ? AS student RIGHT JOIN ? AS keywords ON LOWER(student.text.content) = LOWER(keywords.b)\
          OR LOWER(student.lemma) = keywords.b WHERE student.text.content IS NULL AND keywords.b IS NOT NULL',
            [student, keywords]);
       //console.log(keywords);
        console.log(keyNotinAns);

        ansNotinKey = alasql('SELECT student.text.content as a,student.lemma as lemma \
         FROM ? AS student LEFT JOIN ? AS keywords ON LOWER(student.text.content) = LOWER(keywords.b)\
          OR LOWER(student.lemma) = keywords.b WHERE student.text.content IS NOT NULL AND keywords.b IS NULL',
            [student, keywords]);

        console.log('check');
        console.log(keyNotinAns);
        if(keyNotinAns.length>0) {
            for (var i = 0; i < keyNotinAns.length; i++) {
                if (i == keyNotinAns.length - 1) {
                    console.log('a');
                    CallAPI(i, keyNotinAns[i], $http, 'end');
                }
                else {
                    console.log('b');
                    CallAPI(i, keyNotinAns[i], $http, 'no end');
                }
            }
        }
        else
        {
            Display();
        }
        /*for(var i=0;i<ansNotinKey.length;i++)
        {
            /!*if(i==keyNotinAns.length-1)
            {*!/
            CallAPI(i,ansNotinKey[i],$http,'end');
            /!* }
             else
             {*!/
            // CallAPI(i,keyNotinAns[i],$http,'no end');
            //}
        }*/
    }
    var CallAPI=function(i,value,$http,isEnd)
    {
        //console.log(i+','+value);
        var query = 'http://words.bighugelabs.com/api/2/9cf7cd4e66f41736f7d126e38c973b2f/';
        $http.get(query+ value+'/json').then(function (data) {
            //console.log('kj');
            //console.log(data);
            if(data.data.verb!=null) {
                synonyms.synonyms[value] = data.data.verb.syn;
            }
            if(data.data.noun!=null){
                if(synonyms.synonyms[value]!=null) {
                    synonyms.synonyms[value] = synonyms.synonyms[value].concat(data.data.noun.syn);
                }
                else{
                    synonyms.synonyms[value] = data.data.noun.syn;
                }
            }
            if(data.data.adjective!=null){
                if(synonyms.synonyms[value]!=null) {
                    synonyms.synonyms[value] = synonyms.synonyms[value].concat(data.data.adjective.syn);
                }
                else{
                    synonyms.synonyms[value] = data.data.adjective.syn;
                }
            }
            if(isEnd=="end"){
                Display();
            }
        })
            .catch(function (err) {
                if(isEnd=="end"){
                    Display();
                }
            });
    };
    function Display(){
        //console.log(synonyms);
        //console.log(ansNotinKey);
        console.log('display');
        for(var i=0;i<keyNotinAns.length && keyNotinAns.length>0;i++) {
            //console.log('bbb'+synonyms.synonyms[keyNotinAns[i]]);
            if(synonyms.synonyms[keyNotinAns[i]] !=undefined) {
                foundinAns = alasql('SELECT DISTINCT synonyms._ as a,"' + keyNotinAns[i] + '" as b,ansNotinKey.a as ans,ansNotinKey.lemma as lemma \
         FROM ? AS synonyms JOIN ? AS ansNotinKey ON LOWER(synonyms._) LIKE "%"+' + 'LOWER(ansNotinKey.a)' + '+"%" \
         OR LOWER(synonyms._) =LOWER(ansNotinKey.lemma)\
         WHERE LENGTH(ansNotinKey.a)>1',
                    [synonyms.synonyms[keyNotinAns[i]], ansNotinKey]);
                console.log(foundinAns);
                for (var j = 0; j < foundinAns.length; j++) {
                    if (keyNotinAns.length > 0) {
                        //console.log('aaa'+foundinAns[j].b);
                        var index = keyNotinAns.indexOf(foundinAns[j].b);
                        console.log('remove '+keyNotinAns[index]);
                        //console.log(index);
                        if (index >= 0) {
                            i = i - 1;
                            keyNotinAns.splice(index, 1);
                        }
                    }
                }
            }
        }
        //console.log(keyNotinAns);
        CalculateMarks();
    }

    function CalculateMarks()
    {
        //console.log(keywords);
        //console.log(synonyms);
        var keywordsgroup=alasql('SELECT keywords.a as a,keywords.score as score,count(*) as `count` \
        FROM ? as keywords GROUP BY keywords.a,keywords.score'
            ,[keywords]);
        //console.log(keywordsgroup);
        /*console.log(alasql('SELECT DISTINCT Keywords.a as a,Keywords.b as b \
         FROM ? AS Keywords',
            [keywords]));*/
        var missingKeys =alasql('SELECT DISTINCT Keywords.a as a,Keywords.b as b,keygrp.score as score,keygrp.[count] as `count` \
         FROM ? AS Keywords JOIN ? AS keyNotinAns ON LOWER(keyNotinAns._) =LOWER(Keywords.b)\
         join ? keygrp on Keywords.a=keygrp.a',
            [keywords,keyNotinAns,keywordsgroup]);
        var score=10;
        console.log(missingKeys);
        for(var i=0;i<missingKeys.length;i++){
            score=score-(missingKeys[i].score/missingKeys[i]['count']);
        }
        score=score*10;
        //console.log(score);
        //console.log(Question.answer);
        if(score>50){
            $('.progress-bar-info').css('background-color', 'green');
        }
        else
        {
            $('.progress-bar-info').css('background-color', 'red');
        }
        $('#txtanswer').text(useranswer);
        document.getElementById('progressbar').style.width=(score==0?2:score)+'%';
        document.getElementById('progressbar').innerText=(score+'% correct');
        //  document.getElementById('progress').css('border','1px solid');
        document.getElementById('getAnswer').click();
    }
