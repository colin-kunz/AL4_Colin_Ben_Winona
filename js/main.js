document.addEventListener("DOMContentLoaded", () => {
  // --- Script for Category Navigation Arrows ---
  const kategorienGrid = document.querySelector(".kategorien-grid");
  const prevArrow = document.querySelector(".prev-arrow");
  const nextArrow = document.querySelector(".next-arrow");

  if (kategorienGrid && prevArrow && nextArrow) {
    // Calculate scroll amount based on the first card's width + gap
    const firstCard = kategorienGrid.querySelector(".kategorie-card");
    const scrollAmount = firstCard ? firstCard.offsetWidth + 20 : 270;

    prevArrow.addEventListener("click", () => {
      kategorienGrid.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    });

    nextArrow.addEventListener("click", () => {
      kategorienGrid.scrollBy({ left: scrollAmount, behavior: "smooth" });
    });
  }

  // --- Script for Midnight Runner Game ---
  const player = document.getElementById("player");
  // Check if player element exists on the page before running game logic
  if (player) {
    const obstacle = document.getElementById("obstacle");
    const scoreDisplay = document.getElementById("score");
    const game = document.getElementById("game");
    const startBtn = document.getElementById("startBtn");
    const reward = document.getElementById("reward");
    const restartBtn = document.getElementById("restartBtn");
    const codeEl = document.getElementById("code");
    const jumpSound = document.getElementById("jumpSound");

    let score = 0;
    let obstacleX = 600;
    let speed = 7; // CHANGED: Increased initial speed
    let hit = false;
    let rewardShown = false;
    let animationFrame;

    const obstacleImgs = [
      "https://i.postimg.cc/HLGt469n/Chat-GPT-Image-3-Juni-2025-21-41-53.png",
      "https://i.postimg.cc/m2J3Bmqj/Chat-GPT-Image-3-Juni-2025-21-45-02.png",
    ];

    // UPDATED JUMP FUNCTION
    function jump() {
      if (game.classList.contains("hidden")) return; // Don't jump if game hasn't started

      // Check if either animation class is already present to prevent re-triggering mid-jump
      if (
        !player.classList.contains("jump-frontflip") &&
        !player.classList.contains("jump-backflip")
      ) {
        // Randomly choose between a front-flip and a back-flip
        const flipClass =
          Math.random() < 0.5 ? "jump-frontflip" : "jump-backflip";
        player.classList.add(flipClass);

        if (jumpSound) jumpSound.play();

        // Remove the animation classes after the animation is complete (500ms)
        setTimeout(() => {
          player.classList.remove("jump-frontflip", "jump-backflip");
        }, 500);
      }
    }

    document.addEventListener("keydown", (e) => {
      if (e.code === "Space") {
        e.preventDefault(); // Prevent page from scrolling
        jump();
      }
    });
    if (game) {
      game.addEventListener("click", jump);
    }

    function resetObstacle() {
      obstacleX = 600;
      const randomImg =
        obstacleImgs[Math.floor(Math.random() * obstacleImgs.length)];
      if (obstacle) {
        obstacle.style.backgroundImage = `url('${randomImg}')`;
      }
      hit = false;
    }

    function checkCollision() {
      const playerTop = parseInt(getComputedStyle(player).bottom);
      return obstacleX < 100 && obstacleX > 50 && playerTop < 80;
    }

    function generateCode() {
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ01256789";
      return (
        "SAVE5-" +
        Array.from(
          { length: 5 },
          () => chars[Math.floor(Math.random() * chars.length)]
        ).join("")
      );
    }

    function updateGame() {
      if (!obstacle) {
        cancelAnimationFrame(animationFrame);
        return;
      }
      obstacleX -= speed;
      obstacle.style.left = obstacleX + "px";

      if (checkCollision() && !hit) {
        hit = true;
        score = 0;
        rewardShown = false;
        if (scoreDisplay) scoreDisplay.innerText = "Punkte: " + score;
      }

      if (obstacleX < -50) {
        if (!hit) {
          score++;
          if (scoreDisplay) scoreDisplay.innerText = "Punkte: " + score;

          if (score === 20 && !rewardShown) {
            if (codeEl) codeEl.textContent = generateCode();
            if (reward) reward.classList.remove("hidden");
            cancelAnimationFrame(animationFrame);
            rewardShown = true;
            return;
          }

          if (score % 5 === 0 && speed < 18) speed += 0.8; // CHANGED: Slightly increased speed increment
        }
        resetObstacle();
      }
      animationFrame = requestAnimationFrame(updateGame);
    }

    function startGame() {
      score = 0;
      speed = 7; // CHANGED: Reset speed to new initial value
      obstacleX = 600;
      hit = false;
      rewardShown = false;
      if (scoreDisplay) scoreDisplay.innerText = "Punkte: " + score;
      if (reward) reward.classList.add("hidden");

      resetObstacle();

      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
      animationFrame = requestAnimationFrame(updateGame);
    }

    if (startBtn) {
      startBtn.addEventListener("click", () => {
        startBtn.classList.add("hidden");
        if (game) game.classList.remove("hidden");
        if (scoreDisplay) scoreDisplay.classList.remove("hidden");
        startGame();
      });
    }

    if (restartBtn) {
      restartBtn.addEventListener("click", () => {
        startGame();
      });
    }
  }
});
