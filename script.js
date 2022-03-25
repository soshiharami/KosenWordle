//なんか関数名がゴミだけど許して怖い人，特に表示する関数とかshowとかprintとか統一すべきだったよな，，めんどいからもうしないけど，おこってツイッターでいきりながらさらすとかやめてね怖い人
//バグがあるかもとくに表示するとこ
//てかボタンだってわかるようなクラス名つけれ!おれ直さんけど!!
let playerAnsList = ["", "", "", "", "", "", ""]
let ans=""
let word=""
let tilesWidth = 7
let tilesHeight = 7
let nowLine=0
let nowStr=0
let resultList=[[],[],[],[],[],[],[]]
let wordList
let flag

const BLANK = ' '
const INCORRECT = 0
const CORRECT = 1
const HALF = 2

$(document).ready(function () {
	initArray()
	loadJSON()
	setTimeout(()=>{
		printWordList()
	},1000)
})

//min以上max未満　での乱数
function getRand(min, max) { 
	return (Math.floor(Math.random() * (max - min))) + min
}

function initArray(){
	for(let i=0;i<tilesHeight;i++){
		for(let j=0;j<tilesWidth;j++){
			resultList[i][j]=0
		}
	}
}

function loadJSON() {
  fetch('wordList.json')
    .then(response => response.json())
    .then(json => {
      wordList = json
      const rndIndex = getRand(0, wordList.length)
      ans = wordList[rndIndex].word
      word = wordList[rndIndex].word
    })
}


function strPadding(str,num){
	while(str.length!=num){
		str+=BLANK
	}
	return str
}

function notExistWords(){
	console.log("ワードリストにねえ")
	$(".errors").prepend("<div class='error'>ワードリストにない高専です</div>")
	setTimeout(()=>{
		$(".error:last").remove()
	},1000,)
}

function printError2(index){
	console.log((index+1)+"文字目は"+ans[index]+"でないといけません")
	$(".errors").prepend("<div class='error'>" + (index + 1) + "文字目は" + ans[index] + "でないといけません</div>")
	setTimeout(() => {
		$(".error:last").remove()
	}, 1000, )
}

function checkWord(playerAns,resultList){
	let Flag = 0;
	// console.log(playerAns)
	wordList.forEach(e=>{
		if(e.word==playerAns){
			Flag=1//ワードリストにあったら１
		}
	})
	if(Flag==0){
		notExistWords()
		return Flag
	}
	let paddingedAns = strPadding(ans, tilesWidth)
	for(let i=0;i<nowLine;i++){
		for(let j=0;j<tilesWidth;j++){
			if((resultList[nowLine][j]!=1)&&(resultList[i][j]==1)&&(paddingedAns[j]!=BLANK)){//以前に1が出てるのに1じゃなかったら
				printError2(j)
				return Flag=0
			}
		}
	}

	return Flag
}

function compAns(playerAns,result){
	const paddingedplayerAns = [...strPadding(playerAns, tilesWidth)]
	const paddingedAns = [...strPadding(ans, tilesWidth)]

	// MEMO:
	// Wordleでは、同一の文字が複数出現する場合のみ、重複する2つ以上文字を黄色にする。
	// 一方で、一度しか出現しない文字を複数入力した場合で且つ場所も合っていない場合、最初の文字のみ黄色にする。

	paddingedplayerAns.forEach((c, i) => {
		usedChar.push(c)
		if (c == paddingedAns[i]) {
			// 完全一致
			result[i] = CORRECT
		} else {
			// 部分一致
			if (paddingedAns.indexOf(c) >= 0) {
				// 何度出現するか?
				const used_by_answer = paddingedAns.filter(e => e == c).length
				const used_by_player = usedChar.filter(e => e == c).length
				// 既出ならば色を変えない
				if (used_by_answer >= used_by_player) {
					result[i] = HALF
				} else {
					result[i] = INCORRECT
				}
			} else {
				// 一致しない
				result[i] = INCORRECT
			}
		}
	})
}

function checkResult(result){
	let flag=1
	for(let i=0;i<ans.length;i++){
		flag=flag&result[i]
	}
	return flag
}

function printResult(result,playerAns){//いまわかったこの関数は不完全だともうやる気でないから直さないけどねゴミうんち！！うっひゃああああｗｗｗｗうんこ！！同じ文字できいろ，みどりってなったときこれだと緑になってしまう
	//今までのリザルトで同じ文字で緑か黄色になってるやつの最大の個数を取得．そして，，その文字において今までの最大みどり・きいろ個数分みどりになっているときにキーボードのやつも緑にする．．という風にすべきだろうけどしてないめんどい
	//でもここまで書きだしたらやれよって思うわ！？！？！？！？？うんこ！！！だめだやる気でねえ！！！！
	let i=0
	let row=$(".row")

	let timerID=setInterval(()=>{
		if (i > tilesWidth) {
			clearInterval(timerID)
		}

		if(result[i]==CORRECT){		//きもい順番でごめん
			if(playerAns[i]!=BLANK){		//buttonには" "の文字列を含むやつがないからここで除いてる
				$(".keyBoard button:contains('"+playerAns[i]+"')").removeClass("incorrect")
				$(".keyBoard button:contains('"+playerAns[i]+"')").removeClass("half")
				$(".keyBoard button:contains('"+playerAns[i]+"')").addClass("correct")
			}
			row.eq(nowLine-1).find(".tile").eq(i).addClass("correct")
		}else if(result[i]==INCORRECT){
			if(playerAns[i]!=BLANK){
				$(".keyBoard button:contains('"+playerAns[i]+"')").removeClass("correct")
				$(".keyBoard button:contains('"+playerAns[i]+"')").removeClass("half")

				$(".keyBoard button:contains('"+playerAns[i]+"')").addClass("incorrect")
			}
			row.eq(nowLine-1).find(".tile").eq(i).addClass("incorrect")
		}else if(result[i]==2){
			if(playerAns[i]!=BLANK){
				$(".keyBoard button:contains('"+playerAns[i]+"')").removeClass("incorrect")
				$(".keyBoard button:contains('"+playerAns[i]+"')").removeClass("correct")

				$(".keyBoard button:contains('"+playerAns[i]+"')").addClass("half")
			}
			row.eq(nowLine-1).find(".tile").eq(i).addClass("half")
		}
		i++
	},300)
}

function printChar(key) {
	let tiles = $(".tile")
	tiles.eq(tilesWidth*(nowLine)+nowStr).append("<div class='tileChar'>" + key + "</div>")
}

function deleteChar() {
	let tiles = $(".tile")
	if(nowStr>0){
		tiles.eq(tilesWidth * (nowLine) + nowStr-1).text("")
	}
}


function showHowToTab() {
	let tab = $(".howToTab")
	tab.fadeIn(500)
}

function hideHowToTab() {
	let tab = $(".howToTab")
	tab.hide()
}

function printWordList(){
	let tab = $(".wordListTab .Tab")
	let text = ""
	wordList.forEach((e) => {
		text += "校名(略): " + e.name + "<br>"
		text += "回答方法: " + e.word + "<br><br>"
	})
	tab.append("<div class='wordListDiv'>" + text + "</div>")
}

function showWordListTab() {
	let tab = $(".wordListTab")
	tab.fadeIn(500)
}

function hideWordListTab() {
	let tab = $(".wordListTab")
	tab.hide()
}

function showCorrectTab(flag){
	let tab=$(".correctTab .Tab")
	let tweetButton=$(".howTo")//ごめんこれツイートボタンではない
	let realtab=$(".correctTab")
	let resultString="\n"
	let worl="LOSE(笑)"
	let worlClass="lose"
	for(let i=0;i<nowLine+1;i++){
		for(let j=0;j<tilesWidth;j++){
			if (resultList[i][j] == 1) {
				resultString += "🟩"
			} else if (resultList[i][j] == 0) {
				resultString += "⬜"
			} else{
				resultString += "🟨"
			}
		}
		resultString+="\n"
	}
	resultString+="\n答え: "+word+"\n"
	if(flag){
		worl="WIN!"
		worlClass="win"
	}
	resultString+="\n"+worl+"\n"
	let hashtag=encodeURI("高専Wordle")
	resultString=encodeURI(resultString)
	let url = encodeURI("https://trimscash.github.io/KosenWordle");
	let encoded = "https://twitter.com/intent/tweet?&text=%20%23" + hashtag + "%20" + resultString + "&url=" + url;

	tab.append("<div class='ans'>答え: " + ans + "</div>")
	tab.append("<div class='word'>" + word + "</div>")
	tab.append("<div class='"+worlClass+"'>" + worl + "</div>")
	tab.append("<div class='howmany'>試行回数: " + (nowLine+1) + "</div>")
	tab.append('<a href="' + encoded + '"><div class="share"><img src="./Icon/circleTweet.png"></div></a>');
	realtab.delay(3000).fadeIn(500)
	tweetButton.delay(3000).after('<a href="' + encoded + '"><div class="share2"><img src="./Icon/circleTweet.png"></div></a>')
}

function deleteTab(){
	let tab = $(".correctTab")
	tab.remove()
}


function keyBoard(key) {//ここがメインみたいなもん
	if(nowLine<tilesHeight){
		if(key=='E'&&flag!=1){
			compAns(playerAnsList[nowLine], resultList[nowLine])
			if(checkWord(playerAnsList[nowLine],resultList)){//ワードリストにあったりなんとかしたら

				printResult(resultList[nowLine],playerAnsList[nowLine])

				if (checkResult(resultList[nowLine])) {
					flag=1
					console.log("WIN")
					showCorrectTab(flag)
				}else if(nowLine+1==tilesHeight){
					console.log("LOSE")
					showCorrectTab(flag)
				}
				nowLine++
				nowStr=0
			}
		}else if(key=='B'&&flag!=1){
			if(playerAnsList[nowLine].length>0){
				playerAnsList[nowLine] = playerAnsList[nowLine].slice(0, playerAnsList[nowLine].length - 1)
				deleteChar()
				nowStr--
			}
		} else if (flag!=1&&playerAnsList[nowLine].length < tilesWidth) {
			playerAnsList[nowLine] += key
			printChar(key)
			nowStr++
		}
	}
}
