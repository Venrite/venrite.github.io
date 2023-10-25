	/*
	alright to make power ups we can take createword() and add an ID parameter and if 0, spawn normal wordboxes, if 1-5 or something it'll spawn a wordbox that correlates to a powerup function.
	an ID of 1 can be nuke, and it'll just go loop through wordboxes foreach(wordbox) and assign .killed to them all, and increase score for each. could add a visual effect via the function.
	an id of 2 can be a healing wordbox and provides a heart back(possibly an overflow of hearts even IE hearts>3)
	an id of 3 can be a slowdown for the words, and all it will have to do is setinterval and change difficulty/boss to a slower speed before bringing it back to normal.
	an id of 4 can reduce word lengths by changing bosslength/normlength, or even change amount of words in each box.
	an id of 5 can do ....
	
	once the wordboxes have appropriate ID's, you just make it so the event listener checks for "if this word is typed and it has X ID, go to Y action".
	
	it's quite a simple game so we can modify parameters to make it more unique, like the word spawning directional cardinality can be modifed to spawn from any side, adding chaos to the game
	
	a difficulty slider should be initialzied at the beggining and then call the gameloop(). the slider should be like easy medium hard and we'll set the param according.
	to make the difficulty change over time we can do a difficulty=difficulty-score*10, or something similar to speed up word generation or normlength=normlength+(score%10). 
		THE IDEA IS TO NOT MAKE THE GAME LAST TOO LONG, BUT NOT BE SUPER HARD FROM THER START, LIKE A 3-10MINUTE MATCH MAX.
	
	sound effects should be added to each type of action accordingly (a nuke should make a boom or something, a right typed word should make a ping, gaining a heart should make a heartbeat or something).
	
	a lot of the game hinges on the createword function, and it looks quite simple but we can create supportive functions to make the game feel more like a game and more unique while adding 
	complexity, like adding an effect of a "bullet" going to the wordBox that is typed and applying the .killed, and then the sound effect can be twofold, the right typed word can make a 
	gunshot noise, the .killed application could be a hit marker noise or a small impact noise.
	
	the boxes for a prototype should be fine however we can either pretty the game up by making the boxes and background grids pretty/neon. or we cna add sprites and images (like squirels falling down are the wordboxes
	and the background of the webpage can be a forest and the game-container can be a similar forest or a car being protected from wildlife or something goofy, or the game can be meteorites falling down)
	*/
	
	const gameContainer = document.getElementById("game-container"); //gray area to play in being grabbed
	const player = document.getElementById("player"); //player box rn placeholder incase we want it or need it for like, firing bullets to wordboxes
	//all our sound effects below
	const correctSound = document.getElementById('correctSound');
	correctSound.volume = 0.1;
	const lifeloss = document.getElementById('lifeloss');
	lifeloss.volume = 0.1;
	const dead = document.getElementById('dead');
	dead.volume = 0.2;
	
	//const gamedata={//this holds all our gamedata, need to properly set this up with gamedata.spot instead of spot etc etc
	let spot=0;
	let elapsedTime = 0;
	let score = 0;
	let time = 0;
	let lives = 3;
	let normnum = 1; //how many words in box
	let normlength = 3; //length of words
	let bossnum = 2; //special spaws
	let bosslength = 4; //special spawns
	let difficulty = 2500; //ms for word gen
	let boss = 10000; //how long a boss takes to spawn
	let placeholder=0;
	//};
	//Function to fetch random words from an API
	async function fetchWords(num, length) { //length can be our difficulty, can add multiple words to it even
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
	
	//make length longer for difficulty
	function updateDifficulty() {
		if (normlength<12)
			normlength+=1;
	}
	
	//yash's make hearts
	function createHearts() { 
		const heartsContainer = document.getElementById('lives');
		heartsContainer.innerHTML = ''; // Clear existing hearts
		for (let i = 0; i < lives; i++) {
			const heart = document.createElement('div');
			heart.classList.add('heart');
			heartsContainer.appendChild(heart);
		}
	}
	
	//function to create and animate a word
	async function createWord(num, length, id) { //asynce to use await, add modifier here to make it so if true, match ID and its a powerup when typed.
		const wordBox = document.createElement("div"); //make DOM area
		wordBox.classList.add("word-box"); //give it a wordbox
		spot=Math.random() * 25 + 25;//get random position 
		wordBox.style.left = `${spot}vw`; //give it a position based on viewport width, staying mostly central, scales with the screen
		placeholder=spot;
		if (Math.abs(spot-placeholder)<=25){//check if last spot is to similar to current spot
		wordBox.style.left = `${Math.random() * 25 + 25}vw`; //try again, chances are it'll be fine, else skill issue
		}
		const randomWord = await fetchWords(num, length); //get word based on 6 length rn
		wordBox.textContent = randomWord; //prolly put await fetch here
		if (id!=0){ //testing spot for "Power ups"
			wordbox.textcontent=id.toString();
			}
		gameContainer.appendChild(wordBox); //add a child node to the game container.
		//adjust animation duration based on word length
		const animation = wordBox.animate( //set our animation for the words
			[{
					top: "0%"
				}, //start from the top
				{
					top: "100%"
				}, //move to the bottom
			], {
				duration: Math.floor(Math.random() * (8000 - 3000 + 1)) + 3000, // random drop speed between 3000 and 8000
				easing: "linear",
			}
		);	
		animation.onfinish = () => { //once the animation is done
			if (!wordBox.classList.contains("killed")) { //if it isnt killed (add ID check later for powerup's to not lose health)
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
			wordBox.remove(); //this makes it so you cant type the word after the life is lost and removes a bug. could prolly use a lock =false /true
		};
	}
	
	//function to end the game
	function endGame() {
		setTimeout(() => {//let endgame sound effect play
		alert(`Game Over! Score: ${score}`);
		location.reload();
		}, 500);
	}
	
	//makes score number change and plays sound
	function updateScore() {
		const scoreElement = document.getElementById("scoreValue");
		scoreElement.textContent = score;
		correctSound.play();
	}
	
	//it turns our clock on
	function updateTimer() { 
		const currentTime = new Date().getTime();
		const elapsedTime = (currentTime - startTime) / 1000;
		document.getElementById("time").textContent = elapsedTime.toFixed(2);
		requestAnimationFrame(updateTimer);
	}
	
	//Event listener for typing in the text box, should add a check for if powerup, no life lost on miss
	textbox.addEventListener("input", () => {
		const typedText = textbox.value.trim().toLowerCase(); //convert whats typed to lwoercase
		const wordBoxes = document.querySelectorAll(".word-box"); //grab every wordbox in the game container
		wordBoxes.forEach((wordBox) => { //a beautiful for loop going through our wordboxes
			const wordText = wordBox.textContent.trim().toLowerCase(); //take the target text and make it lowercase
			if (typedText === wordText) {
				wordBox.classList.add("killed"); //add a killed modifer to the object
				wordBox.style.animation = "shake 0.5s"; //apply the shake animation
				setTimeout(() => {//remove the word box after the shake animation finishes (500ms)
					wordBox.remove(); 
				}, 500); 
				score++;
				textbox.value = ""; //clear the text box
				updateScore();
			}
		});
	});
	
	//Game loop to create words periodically based on our current global variables 
	async function gameLoop() {
		
		if (lives === 3) {
			createHearts();
		}
		startTime = new Date().getTime(); //starts timer
		updateTimer(); //literally just turns our clock on
		if (window.innerWidth < 600) {//if phone sized
		setInterval(() => {//spawn words
			x=Math.floor(Math.random() * 4) + 3;
			setTimeout(() =>{//spawn radom length word on longer delay
			createWord(normnum, x,0);
			},500);
			createWord(normnum, normlength,0);//spawn normal word
		}, difficulty+500); //adjust the interval for word creation
		}
		else{//if not a phone
		setInterval(() => {//spawn words
			x=Math.floor(Math.random() * 4) + 3;
			setTimeout(() =>{//spawn random length word delayed .5 seconds
			createWord(normnum, x,0);
			},500);
			createWord(normnum, normlength,0);//spawn normal word with normal length
		}, difficulty); 
		
		setInterval(() => {//spawn double words AKA BOSS for now
			createWord(bossnum, bosslength,0);
		}, boss); 
		setInterval(() => {//power up tester
			Randid=Math.floor(Math.random() * (5 - 1 + 1)) + 1
			createWord(normnum, normlength,3);
		}, 1000);
		
		}
		setInterval(() => {
			updateDifficulty();
		},10000);//add a character every 10 seconds

	}
	gameLoop(); //this is here to start the game, can be moved to later as a start button