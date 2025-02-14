document.addEventListener("DOMContentLoaded", () => {
    // --- Section Elements ---
    const landing = document.getElementById("landing");
    const timeline = document.getElementById("timeline");
    const memoryDetail = document.getElementById("memoryDetail");
    const game1 = document.getElementById("game1");
    const game2 = document.getElementById("game2");
    const game3 = document.getElementById("game3");
    const finalSection = document.getElementById("final");
    const whyLovedSection = document.getElementById("whyLoved");
  
    // --- Button Elements ---
    const startBtn = document.getElementById("startBtn");
    const toGame1Btn = document.getElementById("toGame1Btn");
    const toGame1BtnFromDetail = document.getElementById("toGame1BtnFromDetail");
    const backToTimelineBtn = document.getElementById("backToTimelineBtn");
    const toGame2Btn = document.getElementById("toGame2Btn");
    const toGame3Btn = document.getElementById("toGame3Btn");
    const toFinalBtn = document.getElementById("toFinalBtn");
    const toFinalFromWhyBtn = document.getElementById("toFinalFromWhyBtn");
    const claimGiftBtn = document.getElementById("claimGiftBtn");
  
    // --- Memory Detail Elements ---
    const memoryTitle = document.getElementById("memoryTitle");
    const memoryText = document.getElementById("memoryText");
    const memoryImage = document.getElementById("memoryImage");
  
    // --- Love Sentences Elements ---
    const loveSentencesContainer = document.getElementById("loveSentencesContainer");
  
    // --- Audio ---
    const backgroundMusic = document.getElementById("backgroundMusic");
    const heartSound = document.getElementById("heartSound");
  
    // --- Memories Data ---
    const memories = {
        "first-kiss": {
          title: "Our First Kiss",
          text: "The moment our lips met, everything else faded away. 17/3/2022",
          image: "C:/theproject/assests/firstkiss.jpg"
        },
        "first-date": {
          title: "Our First Date",
          text: "A night under the stars that changed everything. 10/3/2022",
          image: "/first-date.jpg"
        },
        "anniversary": {
          title: "Our Anniversary",
          text: "Celebrating our love and all the moments we've shared. 10/3/2022",
          image: "assets/pictures/anniversary.jpg"
        }
      };
      
  
    // --- Utility: Show Section ---
    function showSection(section) {
      document.querySelectorAll(".section").forEach(sec => sec.classList.add("hidden"));
      section.classList.remove("hidden");
    }
  
    // --- Landing Page ---
    startBtn.addEventListener("click", () => {
      showSection(timeline);
      backgroundMusic.play().catch(err => console.warn("Music error:", err));
    });
  
    // --- Timeline: Memory Clicks ---
    document.querySelectorAll(".memory").forEach(item => {
      item.addEventListener("click", () => {
        const memKey = item.getAttribute("data-memory");
        if (memories[memKey]) {
          memoryTitle.textContent = memories[memKey].title;
          memoryText.textContent = memories[memKey].text;
          memoryImage.src = memories[memKey].image;
          showSection(memoryDetail);
        }
      });
    });
  
    // --- Timeline Navigation ---
    toGame1Btn.addEventListener("click", () => {
      showSection(game1);
      startHeartCatchingGame();
    });
    toGame1BtnFromDetail.addEventListener("click", () => {
      showSection(game1);
      startHeartCatchingGame();
    });
    backToTimelineBtn.addEventListener("click", () => {
      showSection(timeline);
    });
  
    // ======================================================
    // Game 1: Heart Catching (Draw Actual Hearts Instead of Circles)
    // ======================================================
    let game1Score = 0;
    let hearts = [];
    let heartSpawnInterval, heartAnimationFrame;
    function startHeartCatchingGame() {
      // Reset
      game1Score = 0;
      hearts = [];
      document.getElementById("scoreDisplay").textContent = `Hearts Collected: ${game1Score} / 10`;
      toGame2Btn.classList.add("hidden");
  
      const canvas = document.getElementById("heartGameCanvas");
      const ctx = canvas.getContext("2d");
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
  
      let basketX = canvas.width / 2 - 75;
      const basketWidth = 150;
      const basketHeight = 20;
      const basketY = canvas.height - 70;
  
      function spawnHeart() {
        hearts.push({
          x: Math.random() * canvas.width,
          y: -20,
          size: 15 + Math.random() * 15,
          speed: 2 + Math.random() * 2
        });
      }
  
      function drawHeartShape(context, x, y, size) {
        context.beginPath();
        context.moveTo(x, y);
        context.bezierCurveTo(
          x - size, y - size,
          x - 2 * size, y + size / 3,
          x, y + size
        );
        context.bezierCurveTo(
          x + 2 * size, y + size / 3,
          x + size, y - size,
          x, y
        );
        context.fill();
      }
  
      function updateHearts() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        hearts.forEach((heart, i) => {
          // Draw heart
          ctx.fillStyle = "red";
          drawHeartShape(ctx, heart.x, heart.y, heart.size);
  
          // Move heart
          heart.y += heart.speed;
  
          // Out of bounds
          if (heart.y - heart.size > canvas.height) {
            hearts.splice(i, 1);
            return;
          }
  
          // Check collision with basket
          if (
            heart.y + heart.size >= basketY &&
            heart.x >= basketX &&
            heart.x <= basketX + basketWidth
          ) {
            game1Score++;
            document.getElementById("scoreDisplay").textContent = `Hearts Collected: ${game1Score} / 10`;
            hearts.splice(i, 1);
            if (heartSound) {
              heartSound.currentTime = 0;
              heartSound.play().catch(err => console.warn("Sound error:", err));
            }
            if (game1Score >= 10) {
              toGame2Btn.classList.remove("hidden");
            }
          }
        });
  
        // Draw basket
        ctx.fillStyle = "#ff4d6d";
        ctx.fillRect(basketX, basketY, basketWidth, basketHeight);
  
        heartAnimationFrame = requestAnimationFrame(updateHearts);
      }
  
      document.addEventListener("mousemove", moveBasket);
      function moveBasket(e) {
        basketX = e.clientX - basketWidth / 2;
      }
  
      // Start spawns and animation
      heartSpawnInterval = setInterval(spawnHeart, 1000);
      updateHearts();
    }
  
    toGame2Btn.addEventListener("click", () => {
      // Cleanup game 1
      cancelAnimationFrame(heartAnimationFrame);
      clearInterval(heartSpawnInterval);
      showSection(game2);
      startAdvancedMaze();
    });
  
    // ======================================================
    // Game 2: Advanced Maze (Replace Circles with Hearts + "me" / "you")
    // ======================================================
    let mazeData = [];
    let mazeRows = 15;
    let mazeCols = 15;
    let cellSize = 30;
    let player = { row: 0, col: 0 };
    let mazeCanvas, mazeCtx;
    let mazeKeyHandler;
  
    function startAdvancedMaze() {
      toGame3Btn.classList.add("hidden");
      mazeCanvas = document.getElementById("mazeCanvas");
      mazeCtx = mazeCanvas.getContext("2d");
      // Adjust canvas size for a bigger, more “professional” maze
      mazeCanvas.width = mazeCols * cellSize;
      mazeCanvas.height = mazeRows * cellSize;
  
      // Generate Maze with DFS
      mazeData = generateMaze(mazeRows, mazeCols);
      // Place player at top-left & exit at bottom-right
      player = { row: 0, col: 0 };
  
      drawMaze();
      document.body.classList.add("maze-active");
  
      // Listen for keys
      mazeKeyHandler = (e) => {
        if (!document.body.classList.contains("maze-active")) return;
        let { row, col } = player;
        switch (e.key) {
          case "ArrowUp":
          case "w":
            if (!mazeData[row][col].walls.top) row--;
            break;
          case "ArrowDown":
          case "s":
            if (!mazeData[row][col].walls.bottom) row++;
            break;
          case "ArrowLeft":
          case "a":
            if (!mazeData[row][col].walls.left) col--;
            break;
          case "ArrowRight":
          case "d":
            if (!mazeData[row][col].walls.right) col++;
            break;
        }
        if (row < 0) row = 0;
        if (row >= mazeRows) row = mazeRows - 1;
        if (col < 0) col = 0;
        if (col >= mazeCols) col = mazeCols - 1;
        player = { row, col };
        drawMaze();
  
        // Check if reached exit (bottom-right)
        if (row === mazeRows - 1 && col === mazeCols - 1) {
          toGame3Btn.classList.remove("hidden");
        }
      };
      window.addEventListener("keydown", mazeKeyHandler);
    }
  
    toGame3Btn.addEventListener("click", () => {
      // Cleanup Maze
      document.body.classList.remove("maze-active");
      window.removeEventListener("keydown", mazeKeyHandler);
      showSection(game3);
      startMatchingGame();
    });
  
    // Maze Generation with DFS
    function generateMaze(rows, cols) {
      let grid = [];
      // Each cell: { visited, walls: { top, right, bottom, left } }
      for (let r = 0; r < rows; r++) {
        let rowData = [];
        for (let c = 0; c < cols; c++) {
          rowData.push({
            visited: false,
            walls: { top: true, right: true, bottom: true, left: true }
          });
        }
        grid.push(rowData);
      }
  
      function getNeighbors(r, c) {
        let neighbors = [];
        if (r > 0) neighbors.push({ row: r - 1, col: c, dir: "top" });
        if (r < rows - 1) neighbors.push({ row: r + 1, col: c, dir: "bottom" });
        if (c > 0) neighbors.push({ row: r, col: c - 1, dir: "left" });
        if (c < cols - 1) neighbors.push({ row: r, col: c + 1, dir: "right" });
        return neighbors;
      }
  
      // Carve passages
      function carveMaze(r, c) {
        grid[r][c].visited = true;
        let neighbors = getNeighbors(r, c).filter(n => !grid[n.row][n.col].visited);
        // Shuffle neighbors
        neighbors.sort(() => Math.random() - 0.5);
  
        neighbors.forEach(n => {
          if (!grid[n.row][n.col].visited) {
            // Remove walls
            if (n.dir === "top") {
              grid[r][c].walls.top = false;
              grid[n.row][n.col].walls.bottom = false;
            }
            if (n.dir === "bottom") {
              grid[r][c].walls.bottom = false;
              grid[n.row][n.col].walls.top = false;
            }
            if (n.dir === "left") {
              grid[r][c].walls.left = false;
              grid[n.row][n.col].walls.right = false;
            }
            if (n.dir === "right") {
              grid[r][c].walls.right = false;
              grid[n.row][n.col].walls.left = false;
            }
            carveMaze(n.row, n.col);
          }
        });
      }
  
      // Start DFS from (0, 0)
      carveMaze(0, 0);
      return grid;
    }
  
    function drawMazeHeart(ctx, x, y, size) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.bezierCurveTo(
        x - size, y - size,
        x - 2*size, y + size/3,
        x, y + size
      );
      ctx.bezierCurveTo(
        x + 2*size, y + size/3,
        x + size, y - size,
        x, y
      );
      ctx.fill();
    }
  
    function drawMaze() {
      mazeCtx.clearRect(0, 0, mazeCanvas.width, mazeCanvas.height);
  
      // Draw cells/walls
      for (let r = 0; r < mazeRows; r++) {
        for (let c = 0; c < mazeCols; c++) {
          let cell = mazeData[r][c];
          let x = c * cellSize;
          let y = r * cellSize;
          mazeCtx.strokeStyle = "#ff4d6d";
          mazeCtx.lineWidth = 2;
  
          // Draw walls
          if (cell.walls.top) {
            mazeCtx.beginPath();
            mazeCtx.moveTo(x, y);
            mazeCtx.lineTo(x + cellSize, y);
            mazeCtx.stroke();
          }
          if (cell.walls.right) {
            mazeCtx.beginPath();
            mazeCtx.moveTo(x + cellSize, y);
            mazeCtx.lineTo(x + cellSize, y + cellSize);
            mazeCtx.stroke();
          }
          if (cell.walls.bottom) {
            mazeCtx.beginPath();
            mazeCtx.moveTo(x, y + cellSize);
            mazeCtx.lineTo(x + cellSize, y + cellSize);
            mazeCtx.stroke();
          }
          if (cell.walls.left) {
            mazeCtx.beginPath();
            mazeCtx.moveTo(x, y);
            mazeCtx.lineTo(x, y + cellSize);
            mazeCtx.stroke();
          }
        }
      }
  
      // Draw player (red heart labeled "me")
      let px = player.col * cellSize + cellSize / 2;
      let py = player.row * cellSize + cellSize / 2;
      let heartSize = cellSize / 4;
  
      mazeCtx.save();
      mazeCtx.fillStyle = "red";
      drawMazeHeart(mazeCtx, px, py - heartSize / 2, heartSize);
      mazeCtx.fill();
      mazeCtx.fillStyle = "black";
      mazeCtx.font = "bold 14px Arial";
      mazeCtx.fillText("me", px - 10, py - heartSize - 5);
      mazeCtx.restore();
  
      // Draw exit (green heart labeled "you")
      let exitX = (mazeCols - 1) * cellSize + cellSize / 2;
      let exitY = (mazeRows - 1) * cellSize + cellSize / 2;
      mazeCtx.save();
      mazeCtx.fillStyle = "green";
      drawMazeHeart(mazeCtx, exitX, exitY - heartSize / 2, heartSize);
      mazeCtx.fill();
      mazeCtx.fillStyle = "black";
      mazeCtx.fillText("you", exitX - 12, exitY - heartSize - 5);
      mazeCtx.restore();
    }
  
    // ======================================================
    // Game 3: Matching Cards
    // ======================================================
    let flippedCards = [];
    let matchesFound = 0;
    function startMatchingGame() {
      toFinalBtn.classList.add("hidden");
      flippedCards = [];
      matchesFound = 0;
  
      const container = document.getElementById("matchingGameContainer");
      container.innerHTML = "";
  
      // Larger deck => more challenge
      const symbols = ["❤️","💖","💝","💕","💘","💗","💓","💞","💟","❣️"];
      // 20 cards total
      const deck = [...symbols, ...symbols].sort(() => Math.random() - 0.5);
  
      deck.forEach(symbol => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.dataset.symbol = symbol;
        container.appendChild(card);
  
        card.addEventListener("click", () => {
          if (card.classList.contains("flipped") || card.classList.contains("matched")) return;
          if (flippedCards.length === 2) return; // Wait for unmatched to reset
  
          card.classList.add("flipped");
          card.textContent = symbol;
          flippedCards.push(card);
  
          if (flippedCards.length === 2) {
            const [c1, c2] = flippedCards;
            if (c1.dataset.symbol === c2.dataset.symbol) {
              c1.classList.add("matched");
              c2.classList.add("matched");
              matchesFound++;
              flippedCards = [];
              // All pairs matched
              if (matchesFound === symbols.length) {
                toFinalBtn.classList.remove("hidden");
              }
            } else {
              setTimeout(() => {
                c1.classList.remove("flipped");
                c1.textContent = "";
                c2.classList.remove("flipped");
                c2.textContent = "";
                flippedCards = [];
              }, 800);
            }
          }
        });
      });
    }
  
    // --- New Chapter: Why I Loved You ---
    const loveSentences = [
      "I cherish every moment we share.",
      "Your support lifts me up even in the darkest times.",
      "Your love fills my heart with joy.",
      "You are my strength and inspiration.",
      "Your smile brightens my every day.",
      "I admire your courage and resilience.",
      "Your compassion is unmatched.",
      "You are the epitome of grace and power.",
      "Your pure heart radiates warmth.",
      "I am forever grateful for your love."
    ];
  
    function startLoveSentencesAnimation() {
      loveSentencesContainer.innerHTML = "";
      toFinalFromWhyBtn.style.display = "none"; // hide button until all messages are shown
      let index = 0;
      function showNextSentence() {
        if (index < loveSentences.length) {
          const p = document.createElement("p");
          p.textContent = loveSentences[index];
          p.classList.add("fade-in");
          loveSentencesContainer.appendChild(p);
          index++;
          setTimeout(showNextSentence, 1500); // Adjust delay as needed
        } else {
          toFinalFromWhyBtn.style.display = "block";
        }
      }
      showNextSentence();
    }
  
    // When matching game is complete, "Next" goes to the Why I Loved You chapter
    toFinalBtn.addEventListener("click", () => {
      showSection(whyLovedSection);
      startLoveSentencesAnimation();
    });
  
    // In the new chapter, "Next" goes to the Final Chapter
    toFinalFromWhyBtn.addEventListener("click", () => {
      showSection(finalSection);
      initFinalCanvas();
    });
  
    // --- Final Chapter: Claim Gift ---
    claimGiftBtn.addEventListener("click", () => {
      document.getElementById("giftMessage").classList.remove("hidden");
    });
  
    // ======================================================
    // Final Chapter Particle Animation
    // ======================================================
    function initFinalCanvas() {
      const canvas = document.getElementById("finalCanvas");
      const ctx = canvas.getContext("2d");
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
  
      const particles = [];
      class Particle {
        constructor(x, y) {
          this.x = x;
          this.y = y;
          this.size = Math.random() * 5 + 2;
          this.alpha = 1;
          this.velocity = {
            x: (Math.random() - 0.5) * 4,
            y: (Math.random() - 0.5) * 4
          };
        }
        update() {
          this.x += this.velocity.x;
          this.y += this.velocity.y;
          this.alpha -= 0.01;
        }
        draw() {
          ctx.save();
          ctx.globalAlpha = this.alpha;
          ctx.fillStyle = "red";
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }
      function animateFinal() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = particles.length - 1; i >= 0; i--) {
          particles[i].update();
          particles[i].draw();
          if (particles[i].alpha <= 0) particles.splice(i, 1);
        }
        requestAnimationFrame(animateFinal);
      }
  
      setInterval(() => {
        particles.push(new Particle(Math.random() * canvas.width, canvas.height));
      }, 200);
      animateFinal();
    }
  
    // ======================================================
    // Landing Canvas (Hearts) - Fix to Show Real Hearts
    // ======================================================
    const landingCanvas = document.getElementById("landing-canvas");
    const landingCtx = landingCanvas.getContext("2d");
    landingCanvas.width = window.innerWidth;
    landingCanvas.height = window.innerHeight;
  
    const fallingHearts = Array.from({ length: 50 }, () => ({
      x: Math.random() * landingCanvas.width,
      y: Math.random() * landingCanvas.height,
      size: Math.random() * 8 + 4,
      speed: Math.random() * 1.5 + 0.5
    }));
  
    function drawFallingHeart(ctx, x, y, size) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.bezierCurveTo(
        x - size, y - size,
        x - 2 * size, y + size / 3,
        x, y + size
      );
      ctx.bezierCurveTo(
        x + 2 * size, y + size / 3,
        x + size, y - size,
        x, y
      );
      ctx.fill();
    }
  
    function animateLanding() {
      landingCtx.clearRect(0, 0, landingCanvas.width, landingCanvas.height);
      fallingHearts.forEach(h => {
        landingCtx.fillStyle = "#ff4d6d";
        drawFallingHeart(landingCtx, h.x, h.y, h.size);
        h.y += h.speed;
        if (h.y > landingCanvas.height) {
          h.y = -h.size;
          h.x = Math.random() * landingCanvas.width;
        }
      });
      requestAnimationFrame(animateLanding);
    }
    animateLanding();
  });
  
