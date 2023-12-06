	/*
	
	_Milestone agenda_
	
	Make 3 powerups:
		Nuke that pops everything on screen but does not provide powerups
		Heal that provides one health, aable to go over 3 hearts
		Multi that provides 2x points for a few moments, if active BEFORE hitting nuke you get massive points.
		
	Leaderboard with WPM:
		Its there, its just not using a database, and we got worst word typed as well for giggles
		
	Final Decide on a theme:
		Turns out Halloween theme just goes hard, decided to keep it

	Personal Secondary Objectives:	
		Optimize the word generation and randomize everything better, too many setIntervals causing lag.
		Clean up code to be less bloated with unused data/comments
		
	*/
	
	
	const gameContainer = document.getElementById("game-container"); 
	const correctSound = document.getElementById('correctSound');
	const startButton = document.getElementById("startButton");
	const lifeloss = document.getElementById('lifeloss');
	const dead = document.getElementById('dead');
	const beats = document.getElementById('beats');
	
	correctSound.volume = 0.1;
	beats.volume = 0.1;
	dead.volume = 0.2;
	lifeloss.volume = 0.1;
	
	let spot=0; //position for words to drop, not unique can be global
	let elapsedTime = 0;
	let score = 0;
	let time = 0;
	let lives = 3;
	let normnum = 1; 
	let normlength = 3; 
	let difficulty = 2000;
	let yayYayAppear = 0; 
	let scoreMultiplier = 1; 
	let longestTypedWord = ""; 
	let longestTypedWordTime = 0; 
	let wordsTyped = 0;
	let startTime=0;
	
	function calculateWPM() {
    const currentTime = new Date().getTime();
    const elapsedTime = (currentTime - startTime) / 1000 / 60; // Convert milliseconds to minutes
    const wpm = Math.round((wordsTyped / elapsedTime) * 60); // Words per minute calculation
    return wpm;
}
	
	function activateScoreMultiplier(factor, duration) {//Yash Function
		scoreMultiplier *= factor; // Multiply score by the given factor
		document.getElementById('multiplier-indicator').style.display = 'block'; // Show visual indicator

		setTimeout(() => {
			scoreMultiplier /= factor; // Revert the score multiplier after the duration ends
			document.getElementById('multiplier-indicator').style.display = 'none'; // Hide visual indicator
		}, duration);
	}

	async function fetchWords(num, length) { //API UTILITY HERE
		try {
			const response = await fetch(`https://random-word-api.herokuapp.com/word?number=${num}&length=${length}`);
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			const data = await response.json();
			return data;
		} catch (error) {
			console.error('Error fetching words:', error);
			return [];
		}
	}
	
	//make length longer for difficulty but not past 12 characters
	function updateDifficulty() {if (normlength<12){normlength+=1;}}
	
	function createHearts() { //yash's make hearts
		const heartsContainer = document.getElementById('lives');
		heartsContainer.innerHTML = ''; // Clear existing hearts
		for (let i = 0; i < lives; i++) {
			const heart = document.createElement('div');
			heart.classList.add('heart');
			heartsContainer.appendChild(heart);
		}
	}

		//function to create and animate a word
	async function createWord(num, length, type) { 
		const wordBox = document.createElement("div"); 
		wordBox.classList.add("word-box"); 
		const screenWidth = window.innerWidth;
		const spotPercentage = 0 + Math.random() * (50);
		const spot = (spotPercentage / 100) * screenWidth;
		wordBox.style.left = `${spot}px`; 
		const randomWord = await fetchWords(num, length); 
		wordBox.textContent = randomWord; //better to do it this way, because we can later make random word pull from an arra if we need too
		if (type===1){
			wordBox.style.backgroundImage='url("Heal.png")';
			wordBox.textContent = "heal"; 
		}else if (type===2){
			wordBox.style.backgroundImage='url("nuke.png")';
			wordBox.textContent = "nuke";
		}else if (type===3){
			wordBox.style.backgroundImage='url("multi.png")';
			wordBox.textContent = "multi"; 
		}
		gameContainer.appendChild(wordBox); 
		
		const animation = wordBox.animate( 
			[{
					top: "0%"
				}, 
				{
					top: "100%"
				}, 
			], {
				duration: Math.floor(Math.random() * (8000 - 3000 + 1)) + 3000, // random drop speed between 3000 and 8000
				easing: "linear",
			}
		);	
		animation.onfinish = () => { 
			if (!wordBox.classList.contains("killed")) { 
				lives--;
				//update the heart graphic
				const heartsContainer = document.getElementById('lives');
				const hearts = document.querySelectorAll('.heart');
				lifeloss.play();
				hearts[lives].remove();
				if (lives <= 0) { //safer to say lessthan incase any weird bug occurs
					dead.play();
					endGame();
				}
			}
			wordBox.remove();
		};
	}
	
	function endGame() {
		setTimeout(() => {
		alert(`Game Over! Score: ${score} and slowest typed word: ${longestTypedWord}`);
		location.reload(); }, 500);//let endgame sound effect play
	}
	

	function updateScore() {
		const scoreElement = document.getElementById("scoreValue");
		scoreElement.textContent = score;
		correctSound.play();
	}
	
	function updateTimer() { 
		const currentTime = new Date().getTime();
		const elapsedTime = (currentTime - startTime) / 1000;
		document.getElementById("time").textContent = elapsedTime.toFixed(2);
		requestAnimationFrame(updateTimer);
		const WPM = document.getElementById("WPMValue");//We can also update our WPM here since e have the localvar of time.
		WPM.textContent = Math.round(wordsTyped/(elapsedTime/60));
	}
	
	//Event listener for typing in the text box, should add a check for if powerup, no life lost on miss
		textbox.addEventListener("input", () => {
		const typedText = textbox.value.trim().toLowerCase();
		const wordBoxes = document.querySelectorAll(".word-box");
		let yayYayTyped = false;
		let multiplierTyped = false;
		let typedWordMatched = false;
  
		wordBoxes.forEach((wordBox) => {
			 const wordText = wordBox.textContent.trim().toLowerCase();
  
			 if (typedText === "heal" && wordText === "heal") {//yash made
				  wordBox.classList.add("killed");
				  wordBox.style.animation = "shake 0.5s";
				  setTimeout(() => {wordBox.remove();}, 500);
				  if (yayYayAppear === 1) {
						yayYayAppear = 0;
						lives++;
						createHearts();
						yayYayTyped = true;
				  }
				  textbox.value = "";
			 } else if (typedText === "multi" && wordText === "multi") {//yash made
				  wordBox.classList.add("killed");
				  wordBox.style.animation = "shake 0.5s";
				  setTimeout(() => {wordBox.remove();}, 500);
				  activateScoreMultiplier(2, 10000);
				  multiplierTyped = true;
				  typedWordMatched = true;
				  textbox.value = "";
			 } else if (typedText==="nuke"&&wordText==="nuke"){
				wordBoxes.forEach((wordBox) => {
				wordBox.classList.add("killed");
				setTimeout(() => {wordBox.remove(); }, 500);
				})
				const destroyedWordboxes = document.querySelectorAll(".killed");
				score += destroyedWordboxes.length * scoreMultiplier;
				updateScore();

				textbox.value = "";
			 }else if (typedText === wordText) {
				  wordBox.classList.add("killed");
				  wordBox.style.animation = "shake 0.5s";
				  setTimeout(() => {wordBox.remove();}, 500);
				  typedWordMatched = true;
				  wordsTyped++;//for wpm, since score is changing dynamically its no longer a count of typed words
				  score += 1 * scoreMultiplier;
				  updateScore();
				  textbox.value = "";
			 } 
			 if (typedText.length > longestTypedWord.length) {
                longestTypedWord = typedText;
                longestTypedWordTime = new Date().getTime();
            }
		});
		
  });
	
async function gameLoop() {
    if (lives === 3) {createHearts();}
    startTime = new Date().getTime();
    updateTimer(); 
    if (window.innerWidth < 600) { // if phone-sized simplify game
        setInterval(() => {
            x = Math.floor(Math.random() * 4) + 3;
            setTimeout(() => { createWord(normnum, x,0); }, 500);
            createWord(normnum, normlength,0);
        }, difficulty + 500);
    } else { // if not a phone
        setInterval(() => {
            x = Math.floor(Math.random() * 20) + 1;//out of 20 possibilities, some make powerups.
			n = Math.floor(Math.random() * 4) + 3;
            if (x === 0||x===5||x===15) {
                updateDifficulty();
            } else if (x === 10) {
                createWord(normnum, normlength,1);
                yayYayAppear = 1;
            } else if (x === 9) {
                createWord(normnum, normlength,2);

            } else if(x===20){
			createNukeWord();
			}else {
                createWord(normnum, n,0);
                createWord(normnum, normlength,0);
            }
        }, difficulty);
    }
    setInterval(() => { beats.play(); }, 108000); // replays music
}

	startButton.addEventListener("click", () => {//when they click the button begin the game, so that music can play.
	startButton.style.display = "none";

    gameLoop();
    beats.play();
});
