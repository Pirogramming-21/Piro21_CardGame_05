const GameApp = (function() {
    let isLoggedIn = false; // 로그인 상태를 추적합니다

    function init() {
        checkLoginStatus();
        renderMainContent();
    }

    function checkLoginStatus() {
        // 실제로는 서버에 로그인 상태를 확인하는 요청을 보내야 합니다
        // 여기서는 예시로 로컬 스토리지를 사용합니다
        isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    }

    function renderMainContent() {
        const mainContent = document.getElementById('main-content');
        const mainNav = document.getElementById('main-nav');
    
        if (!mainContent || !mainNav) {
            console.error('main-content 또는 main-nav 요소가 존재하지 않습니다.');
            return;
        }
    
        if (isLoggedIn) {
            mainNav.innerHTML = `
                <a href="index.html" class="btn">Main</a>
                <a href="game_start.html" class="btn">게임 시작</a>
                <a href="game_list.html" class="btn">게임 전적</a>
                <a href="ranking.html" class="btn">랭킹</a>
                <a href="#" class="btn" onclick="GameApp.logout(); return false;">로그아웃</a>
            `;
            mainContent.innerHTML = `
                <h2>환영합니다!</h2>
                <p>게임을 시작하거나 전적을 확인하세요.</p>
            `;
        } else {
            mainNav.innerHTML = `
                <a href="index.html" class="btn">Main</a>
                <a href="#" class="btn" onclick="GameApp.showLoginForm(); return false;">로그인</a>
            `;
            mainContent.innerHTML = `
                <h2 class="floating">🃏 숫자 카드 게임 🎮</h2>
                <p>게임을 시작하려면 로그인해주세요.</p>
            `;
        }
    }
    
    
    

    function showLoginForm() {
        const mainContent = document.getElementById('main-content');
        mainContent.innerHTML = `
            <h2>로그인</h2>
            <form id="login-form">
                <input type="text" id="username" placeholder="사용자 이름" required>
                <input type="password" id="password" placeholder="비밀번호" required>
                <button type="submit" class="btn">로그인</button>
            </form>
            <div class="social-login">
                <button onclick="GameApp.socialLogin('google')" class="btn">Google</button>
                <button onclick="GameApp.socialLogin('naver')" class="btn">Naver</button>
                <button onclick="GameApp.socialLogin('kakao')" class="btn">Kakao</button>
            </div>
        `;
        document.getElementById('login-form').addEventListener('submit', handleLogin);
    }

    function handleLogin(event) {
        event.preventDefault();
        // 실제로는 서버에 로그인 요청을 보내야 합니다
        localStorage.setItem('isLoggedIn', 'true');
        isLoggedIn = true;
        renderMainContent();
    }

    function socialLogin(provider) {
        console.log(`${provider} 로그인 시도`);
        // 실제로는 각 소셜 로그인 프로바이더의 OAuth 프로세스를 구현해야 합니다
    }

    function logout() {
        localStorage.setItem('isLoggedIn', 'false');
        isLoggedIn = false;
        renderMainContent();
    }

    function startGame() {
        fetchTemplate('game_start.html').then(template => {
            document.getElementById('main-content').innerHTML = template;
            generateCards();
            fetchOpponents();
            document.getElementById('start-game-btn').addEventListener('click', handleGameStart);
        });
    }

    function generateCards() {
        const cardContainer = document.getElementById('cards');
        const numbers = getRandomNumbers(5, 1, 10);
        numbers.forEach(num => {
            const card = document.createElement('div');
            card.className = 'card';
            card.textContent = num;
            card.addEventListener('click', () => selectCard(card));
            cardContainer.appendChild(card);
        });
    }

    function getRandomNumbers(count, min, max) {
        const numbers = [];
        while (numbers.length < count) {
            const num = Math.floor(Math.random() * (max - min + 1)) + min;
            if (!numbers.includes(num)) {
                numbers.push(num);
            }
        }
        return numbers;
    }

    function selectCard(card) {
        document.querySelectorAll('.card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
    }

    function fetchOpponents() {
        // 실제로는 서버에서 상대 목록을 가져와야 합니다
        const opponents = ['User2', 'User3', 'User4'];
        const select = document.getElementById('opponent-list');
        opponents.forEach(opponent => {
            const option = document.createElement('option');
            option.value = opponent;
            option.textContent = opponent;
            select.appendChild(option);
        });
    }

    function handleGameStart() {
        const selectedCard = document.querySelector('.card.selected');
        const selectedOpponent = document.getElementById('opponent-list').value;
        if (!selectedCard || !selectedOpponent) {
            alert('카드와 상대를 모두 선택해주세요.');
            return;
        }
        // 여기서 서버에 게임 시작 요청을 보내야 합니다
        console.log(`게임 시작: 카드 ${selectedCard.textContent}, 상대 ${selectedOpponent}`);
    }

    function showGameList() {
        fetchTemplate('game_list.html').then(template => {
            document.getElementById('main-content').innerHTML = template;
            fetchGameList();
        });
    }

    function fetchGameList() {
        // 실제로는 서버에서 게임 목록을 가져와야 합니다
        const games = [
            { opponent: 'User2', myCard: 5, opponentCard: 7, result: '패배' },
            { opponent: 'User3', myCard: 8, opponentCard: 3, result: '승리' },
            { opponent: 'User4', myCard: 6, opponentCard: null, result: '진행중' }
        ];
        const tbody = document.getElementById('game-list-body');
        games.forEach(game => {
            const row = tbody.insertRow();
            row.insertCell().textContent = game.opponent;
            row.insertCell().textContent = game.myCard;
            row.insertCell().textContent = game.opponentCard || '-';
            row.insertCell().textContent = game.result;
            const actionCell = row.insertCell();
            if (game.result === '진행중') {
                const cancelBtn = document.createElement('button');
                cancelBtn.textContent = '취소';
                cancelBtn.className = 'btn btn-small';
                cancelBtn.addEventListener('click', () => cancelGame(game));
                actionCell.appendChild(cancelBtn);
            }
        });
    }

    function cancelGame(game) {
        // 실제로는 서버에 게임 취소 요청을 보내야 합니다
        console.log(`게임 취소: 상대 ${game.opponent}`);
        showGameList(); // 목록을 새로고침합니다
    }

    function showRanking() {
        fetchTemplate('ranking.html').then(template => {
            document.getElementById('main-content').innerHTML = template;
            fetchRanking();
        });
    }

    function fetchRanking() {
        // 실제로는 서버에서 랭킹 정보를 가져와야 합니다
        const rankings = [
            { rank: 1, user: 'User1', score: 1000 },
            { rank: 2, user: 'User2', score: 850 },
            { rank: 3, user: 'User3', score: 720 }
        ];
        const tbody = document.getElementById('ranking-body');
        rankings.forEach(ranking => {
            const row = tbody.insertRow();
            row.insertCell().textContent = ranking.rank;
            row.insertCell().textContent = ranking.user;
            row.insertCell().textContent = ranking.score;
        });
    }

    function fetchTemplate(templateName) {
        return fetch(`/templates/${templateName}`)
            .then(response => response.text());
    }

    return {
        init: init,
        showLoginForm: showLoginForm,
        socialLogin: socialLogin,
        logout: logout,
        startGame: startGame,
        showGameList: showGameList,
        showRanking: showRanking,
    };
})();

document.addEventListener('DOMContentLoaded', GameApp.init);