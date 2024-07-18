const GameApp = (function() {
    let currentPlayer = '';

    function init() {
        currentPlayer = localStorage.getItem('username') || 'Unknown Player';
        document.getElementById('current-player-name').textContent = currentPlayer;
    }

    function loadGameList() {
        fetch('/api/games')
            .then(response => response.json())
            .then(games => {
                renderGameHistory(games.history);
                renderCounterAttackList(games.counterAttacks);
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
            row.insertCell().textContent = game.status;
            const actionCell = row.insertCell();
            if (game.status === '진행중...') {
                const cancelBtn = createButton('취소', () => cancelGame(game.id));
                actionCell.appendChild(cancelBtn);
            }
            const infoBtn = createButton('정보', () => showGameInfo(game.id));
            actionCell.appendChild(infoBtn);
        });
    }

    function renderCounterAttackList(games) {
        const tbody = document.getElementById('counter-attack-body');
        tbody.innerHTML = '';
        games.forEach((game, index) => {
            const row = tbody.insertRow();
            row.insertCell().textContent = index + 1;
            row.insertCell().textContent = `${game.player1} vs ${game.player2}`;
            row.insertCell().textContent = game.status;
            const actionCell = row.insertCell();
            if (game.status === '대기중') {
                const counterAttackBtn = createButton('반격', () => showCounterAttack(game.id));
                actionCell.appendChild(counterAttackBtn);
            }
        });
    }

    function createButton(text, onClick) {
        const button = document.createElement('button');
        button.textContent = text;
        button.className = 'btn btn-small';
        button.addEventListener('click', onClick);
        return button;
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

    function showGameInfo(gameId) {
        window.location.href = `game_detail.html?gameId=${gameId}`;
    }

    function showCounterAttack(gameId) {
        window.location.href = `counter_attack.html?gameId=${gameId}`;
    }

    function loadGameDetail(gameId) {
        fetch(`/api/games/${gameId}`)
            .then(response => response.json())
            .then(game => {
                const content = document.getElementById('game-detail-content');
                content.innerHTML = `
                    <h3>게임 정보</h3>
                    <p>대결: ${game.player1} vs ${game.player2}</p>
                    <p>상태: ${game.status}</p>
                    ${game.status === '종료' ? `
                        <p>이기는 조건: ${game.winCondition}</p>
                        <p>${game.player1}의 숫자: ${game.player1Card}</p>
                        <p>${game.player2}의 숫자: ${game.player2Card}</p>
                        <p>결과: ${game.result}</p>
                        <p>획득/차감 점수: ${game.score}</p>
                    ` : ''}
                `;

                const cancelBtn = document.getElementById('cancel-game-btn');
                const counterAttackBtn = document.getElementById('counter-attack-btn');

                if (game.status === '진행중...' && game.currentPlayer === currentPlayer) {
                    cancelBtn.style.display = 'inline-block';
                    cancelBtn.onclick = () => cancelGame(gameId);
                } else {
                    cancelBtn.style.display = 'none';
                }

                if (game.status === '대기중' && game.currentPlayer !== currentPlayer) {
                    counterAttackBtn.style.display = 'inline-block';
                    counterAttackBtn.onclick = () => showCounterAttack(gameId);
                } else {
                    counterAttackBtn.style.display = 'none';
                }
            })
            .catch(error => console.error('Error loading game detail:', error));
    }

    function initCounterAttack() {
        const urlParams = new URLSearchParams(window.location.search);
        const gameId = urlParams.get('gameId');
        if (gameId) {
            loadGameForCounterAttack(gameId);
        } else {
            console.error('Game ID not provided for counter attack');
        }
    }

    function loadGameForCounterAttack(gameId) {
        fetch(`/api/games/${gameId}`)
            .then(response => response.json())
            .then(game => {
                renderCounterAttackForm(game);
            })
            .catch(error => console.error('Error loading game for counter attack:', error));
    }

    function renderCounterAttackForm(game) {
        const cardSelection = document.getElementById('card-selection');
        cardSelection.innerHTML = '';
        const numbers = getRandomNumbers(5, 1, 10);
        numbers.forEach(num => {
            const card = document.createElement('div');
            card.className = 'card';
            card.textContent = num;
            card.addEventListener('click', () => selectCard(card));
            cardSelection.appendChild(card);
        });

        document.getElementById('counter-attack-btn').onclick = () => handleCounterAttack(game.id);
    }

    function selectCard(card) {
        document.querySelectorAll('.card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
    }

    function handleCounterAttack(gameId) {
        const selectedCard = document.querySelector('.card.selected');
        if (!selectedCard) {
            alert('카드를 선택해주세요.');
            return;
        }

        const cardValue = parseInt(selectedCard.textContent);

        fetch(`/api/games/${gameId}/counter-attack`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ card: cardValue }),
        })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                showGameResult(result.game);
            } else {
                alert('반격 제출에 실패했습니다: ' + result.message);
            }
        })
        .catch(error => console.error('Error submitting counter attack:', error));
    }

    function showGameResult(game) {
        document.querySelector('.counter-attack-container').style.display = 'none';
        const resultContent = document.getElementById('game-result-content');
        resultContent.innerHTML = `
            <p>${game.player1} vs ${game.player2}</p>
            <p>이기는 조건: ${game.winCondition}</p>
            <p>${game.player1}의 숫자: ${game.player1Card}</p>
            <p>${game.player2}의 숫자: ${game.player2Card}</p>
            <p>결과: ${game.result}</p>
            <p>점수: ${game.score}</p>
        `;
        document.getElementById('game-result').style.display = 'block';
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

    return {
        init: init,
        loadGameList: loadGameList,
        loadGameDetail: loadGameDetail,
        initCounterAttack: initCounterAttack,
    };
})();

document.addEventListener('DOMContentLoaded', () => {
    GameApp.init();
    const path = window.location.pathname;
    if (path.includes('game_list.html')) {
        GameApp.loadGameList();
    } else if (path.includes('game_detail.html')) {
        const urlParams = new URLSearchParams(window.location.search);
        const gameId = urlParams.get('gameId');
        if (gameId) {
            GameApp.loadGameDetail(gameId);
        }
    } else if (path.includes('counter_attack.html')) {
        GameApp.initCounterAttack();
    }
});