var Timer = function(element, tijd){
	setInterval(function(){getTime();},1000);
	function getTime(){
	today = new Date();

	BigDay = new Date(tijd);
	msPerDay = 24 * 60 * 60 * 1000 ;
	timeLeft = (BigDay.getTime() - today.getTime());
	if(timeLeft>=0){
	e_daysLeft = timeLeft / msPerDay;
	daysLeft = Math.floor(e_daysLeft);
	e_hrsLeft = (e_daysLeft - daysLeft)*24;
	hrsLeft = Math.floor(e_hrsLeft);
	minsLeft = Math.floor((e_hrsLeft - hrsLeft)*60);
	secondsLeft = Math.floor((e_hrsLeft - hrsLeft)*60*60)%60;
	}
	else{
		daysLeft = 0;
		hrsLeft = 0;
		minsLeft = 0;
		secondsLeft = 0;
	}
	element.innerHTML = daysLeft + dagOrDagen(daysLeft) + hrsLeft +uurOrUren(hrsLeft)+ minsLeft + minuutOrMinuten(minsLeft) + " en "+ secondsLeft +secondeOrSeconden(secondsLeft);

	}

	function dagOrDagen(input){
		if(input == 1){
			return " dag "
		}
		else{
			return " dagen "
		}
	}

	function uurOrUren(input){
		if(input == 1){
			return " uur "
		}
		else{
			return " uren "
		}
	}

	function minuutOrMinuten(input){
		if(input == 1){
			return " minuut "
		}
		else{
			return " minuten "
		}
	}

	function secondeOrSeconden(input){
		if(input == 1){
			return " seconde "
		}
		else{
			return " seconden "
		}
	}	
}