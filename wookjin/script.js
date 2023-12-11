
// 이벤트가 모두 로드되면 실행되는 함수
// 캔버스 엘리먼트를 가져오고 너비와 높이를 윈도우의 크기로 설정

window.onload = function(){
  var c = document.querySelector("canvas");
  var canvas = document.querySelector("canvas");
  c.width = innerWidth;
  c.height = innerHeight;
  c = c.getContext("2d");

  function gameOver() {
    gameOverFlag = true;
    // 캔버스를 지웁니다
    c.clearRect(0, 0, innerWidth, innerHeight);
  
    // 게임 오버 메시지를 표시합니다
    c.fillStyle = 'red';
    c.font = '4em Arial';
    c.fillText('게임 오버', innerWidth / 2 - 150, innerHeight / 2 - 40);
  
    // 최종 점수를 표시합니다
    c.fillStyle = 'white';
    c.font = '2em Arial';
    c.fillText('최종 점수: ' + score, innerWidth / 2 - 100, innerHeight / 2 + 20);
  
  
    
  }
  
  

  

  function startGame(){
    // 게임이 재시작되었으므로 플래그 초기화
    gameOverFlag = false;

  mouse = {
    x: innerWidth/2,
    y: innerHeight-33
  };
    
  touch = {
    x: innerWidth/2,
    y: innerHeight-33
  };
  // 마우스 이벤트 리스너 등록
  canvas.addEventListener("mousemove", function(event){
  mouse.x = event.clientX;
  });
  canvas.addEventListener("touchmove", function(event){
    var rect = canvas.getBoundingClientRect();
    var root = document.documentElement;
    var touch = event.changedTouches[0];
    var touchX = parseInt(touch.clientX);
    var touchY = parseInt(touch.clientY) - rect.top - root.scrollTop;
    event.preventDefault();
    mouse.x = touchX;
    mouse.y = touchY;
  });

    // 플레이어 및 총알, 적, 힐팩 초기화
  var player_width = 32;
  var player_height = 32;
  var playerImg = new Image();
  var score = 0;
  var health = 100;
  playerImg.src = "Spaceship_Green64.gif";
  
  var _bullets = []; 
  var bullet_width = 6;
  var bullet_height = 13;
  var bullet_speed = 10;

  var _enemies = []; 
  var enemyImg = new Image();
  enemyImg.src = "asteroid3.png"
  var enemy_width = 32;
  var enemy_height = 32;

  var _healthkits = []; 
  var healthkitImg = new Image();
  healthkitImg.src = "https://image.ibb.co/gFvSEU/first_aid_kit.png";
  var healthkit_width = 32;
  var healthkit_height = 32;

    // 플레이어 클래스 정의
  function Player(x, y, width, height){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    
    this.draw = function(){
      c.beginPath();
      c.drawImage(playerImg, mouse.x-player_width, mouse.y-player_height); 
    };
    
    this.update = function(){
      this.draw();
    };
  }
  // 투사체 클래스
  function Bullet(x, y, width, height, speed){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = speed;
    
    this.draw = function(){
      c.beginPath();
      c.rect(this.x, this.y, this.width, this.height);
      c.fillStyle = "yellow";  //투사체 색
      c.fill();
    };
    
    this.update = function(){
      this.y -= this.speed;
      this.draw();
    };
  }
   // 적 클래스 정의
  function Enemy(x, y, width, height, speed){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = speed;
    
    this.draw = function(){
      c.beginPath();
      c.drawImage(enemyImg, this.x, this.y);
    };
    
    this.update = function(){
      this.y += this.speed;
      this.draw();
    };
  }
  

  // 힐팩 클래스 정의
  function Healthkit(x, y, width, height, speed){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = speed;
    
    this.draw = function(){
      c.beginPath();
      c.drawImage(healthkitImg, this.x, this.y);
    };
    
    this.update = function(){
      this.y += this.speed;
      this.draw();
    };
  }
      // 플레이어 객체 생성
  var __player = new Player(mouse.x, mouse.y, player_width, player_height);

  // 적 생성 함수
  function drawEnemies(){
    for (var _ = 0; _<4; _++){ 
      var x = Math.random()*(innerWidth-enemy_width);
      var y = -enemy_height; 
      var width = enemy_width;
      var height = enemy_height;
      var speed = Math.random()*2;
      var __enemy = new Enemy(x, y, width, height, speed);
      _enemies.push(__enemy);
    }
  }setInterval(drawEnemies, 1234);  // 적생성 텀
    

   // 힐팩 생성 함수 
  function drawHealthkits(){
    for (var _ = 0; _<1; _++){   
      var x = Math.random()*(innerWidth-enemy_width);
      var y = -enemy_height; 
      var width = healthkit_width;
      var height = healthkit_height;
      var speed = Math.random()*2.6;
      var __healthkit = new Healthkit(x, y, width, height, speed);
      _healthkits.push(__healthkit); 
    }
  }setInterval(drawHealthkits, 15000);  //생성시간
  
  //투사체 함수
  function fire(){ 
    for (var _ = 0; _<1; _++){
      var x = mouse.x-bullet_width/2;
      var y = mouse.y-player_height;
      var __bullet = new Bullet(x, y, bullet_width, bullet_height, bullet_speed);
      _bullets.push(__bullet);
    }
  }setInterval(fire, 170);  //숫자를 낮추면 발사간격이 빨라짐
    
  canvas.addEventListener("click", function(){
  });
     
  // 충돌 감지 함수 
  function collision(a,b){
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
  }
  c.font = "2em Arial"; //글자크기
  
  function stoperror() {
    return true;
  }  
  window.onerror = stoperror;
     // 애니메이션 함수
  function animate(){
    // 게임 종료 여부 확인 c
    if (gameOverFlag) {
      return;
    }
    requestAnimationFrame(animate); 
    c.beginPath(); 
    c.clearRect(0,0,innerWidth,innerHeight); 
    c.fillStyle = 'white';
    c.fillText("Health: " + health, 5, 40); 
    c.fillStyle = 'yellow';
    c.fillText("Score: " + score, innerWidth-150, 40); 
    
    
    __player.update();
    
    // 총알 업데이트 및 화면 이탈 시 삭제
    for (var i=0; i < _bullets.length; i++){
      _bullets[i].update();
      if (_bullets[i].y < 0){
        _bullets.splice(i, 1);
      }
    }
     // 적 업데이트 및 화면 이탈 시 삭제 및 플레이어 피해 처리
    for (var k=0; k < _enemies.length; k++){
      _enemies[k].update();
      if(_enemies[k].y > innerHeight){
        _enemies.splice(k, 1);
        health -= 10;
      if(health == 0){
        gameOver();
        return;
       }
      }
    }
     // 충돌 검사 및 점수 갱신
    for(var j = _enemies.length-1; j >= 0; j--){
      for(var l = _bullets.length-1; l >= 0; l--){
        if(collision(_enemies[j], _bullets[l])){
          _enemies.splice(j, 1);
          _bullets.splice(l, 1);
          score++;
        }
      }
    }
     // 힐팩 업데이트
    for(var h=0; h < _healthkits.length; h++){
      _healthkits[h].update();
    }
    // 충돌 검사 및 체력 회복
    for(var hh = _healthkits.length-1; hh >= 0; hh--){
      for(var hhh = _bullets.length-1; hhh >= 0; hhh--){
        if(collision(_healthkits[hh], _bullets[hhh])){
          _healthkits.splice(hh, 1);
          _bullets.splice(hhh, 1);
          health += 10;
        }
      }
    } 
    
  }
  animate();
  }startGame();
  }; 