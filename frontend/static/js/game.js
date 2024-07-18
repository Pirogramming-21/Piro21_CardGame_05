const GameApp = (function() {
    let currentPlayer = '';

    function init() {
        currentPlayer = localStorage.getItem('username') || 'Unknown Player';
        document.getElementById('current-player-name').textContent = currentPlayer;
        loadGameList();
    }

    function loadGameList() {
        fetch('/api/games')
            .then(response => response.json())
            .then(games => {
                renderGameHistory(games);
                if (games.length > 0) {
                    showGameInfo(games[0].id); // 첫 번째 게임 정보를 기본으로 표시
                }
            })
            .catch(error => console.error('Error loading game list:', error));
    }

    function renderGameHistory(games) {
        const tbody = document.getElementById('game-history-body');
        tbody.innerHTML = '';
        games.forEach((game, index) => {
            const row = tbody.insertRow();
            row.insertCell().textContent = index + 1;
            row.insertCell().textContent = `${game.player1} vs ${game.player2}`;
            row.addEventListener('click', () => showGameInfo(game.id));
        });
    }

    function showGameInfo(gameId) {
        fetch(`/api/games/${gameId}`)
            .then(response => response.json())
            .then(game => {
                renderCounterAttack(game);
                renderGameInfo(game);
            })
            .catch(error => console.error('Error loading game info:', error));
    }

    function renderCounterAttack(game) {
        const content = document.getElementById('counter-attack-content');
        if (game.status === '진행중') {
            content.innerHTML = `
                <p>상태: 진행중</p>
                <button onclick="GameApp.cancelGame(${game.id})">게임 취소</button>
            `;
        } else {
            content.innerHTML = `
                <p>결과: ${game.result}</p>
            `;
        }
    }

    function renderGameInfo(game) {
        const content = document.getElementById('game-info-content');
        content.innerHTML = `
            <h4>${game.player1} vs ${game.player2}</h4>
            <p>상태: ${game.status}</p>
            ${game.status !== '진행중' ? `
                <p>이기는 조건: ${game.winCondition}</p>
                <p>${game.player1}의 숫자: ${game.player1Card}</p>
                <p>${game.player2}의 숫자: ${game.player2Card}</p>
                <p>결과: ${game.result}</p>
                <p>점수: ${game.score}</p>
            ` : ''}
            <button onclick="GameApp.loadGameList()">전체 목록</button>
        `;
    }

    function cancelGame(gameId) {
        fetch(`/api/games/${gameId}/cancel`, { method: 'POST' })
            .then(response => response.json())
            .then(result => {
                if (result.success) {
                    loadGameList();
                } else {
                    alert('게임 취소에 실패했습니다.');
                }
            })
            .catch(error => console.error('Error canceling game:', error));
    }

    return {
        init: init,
        loadGameList: loadGameList,
        cancelGame: cancelGame,
        showGameInfo: showGameInfo
    };
})();

document.addEventListener('DOMContentLoaded', GameApp.init);