import { useEffect, useRef, useState } from 'react';
import GameControls from './GameControls';

const PongGame = () => {
    const canvasRef = useRef(null);
    const [gameStarted, setGameStarted] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [playerScore, setPlayerScore] = useState(0);
    const [cpuScore, setCpuScore] = useState(0);

    // Game constants
    const PADDLE_HEIGHT = 100;
    const PADDLE_WIDTH = 10;
    const BALL_SIZE = 10;
    const PADDLE_SPEED = 10;

    // Game state
    const gameState = useRef({
        playerY: 0,
        cpuY: 0,
        ballX: 0,
        ballY: 0,
        ballSpeedX: 0,
        ballSpeedY: 0,
    });

    // Initialize game state
    const initGame = () => {
        if (!canvasRef.current) return;

        const canvas = canvasRef.current;
        const { width, height } = canvas;
        gameState.current = {
            playerY: height / 2 - PADDLE_HEIGHT / 2,
            cpuY: height / 2 - PADDLE_HEIGHT / 2,
            ballX: width / 2,
            ballY: height / 2,
            ballSpeedX: 5,
            ballSpeedY: 5,
        };
        setPlayerScore(0);
        setCpuScore(0);
    };

    useEffect(() => {
        if (!gameStarted) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        // Handle keyboard input
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                e.preventDefault(); // Prevent default scrolling
                if (e.key === 'ArrowUp') {
                    gameState.current.playerY = Math.max(0, gameState.current.playerY - PADDLE_SPEED);
                } else if (e.key === 'ArrowDown') {
                    gameState.current.playerY = Math.min(
                        canvas.height - PADDLE_HEIGHT,
                        gameState.current.playerY + PADDLE_SPEED
                    );
                }
            }
        };

        // Update game state
        const update = () => {
            if (isPaused) return;

            const { width, height } = canvas;
            const state = gameState.current;

            // Move ball
            state.ballX += state.ballSpeedX;
            state.ballY += state.ballSpeedY;

            // Ball collision with top and bottom
            if (state.ballY <= 0 || state.ballY >= height) {
                state.ballSpeedY *= -1;
            }

            // Ball collision with paddles
            if (
                state.ballX <= PADDLE_WIDTH &&
                state.ballY >= state.playerY &&
                state.ballY <= state.playerY + PADDLE_HEIGHT
            ) {
                state.ballSpeedX *= -1;
            }

            if (
                state.ballX >= width - PADDLE_WIDTH &&
                state.ballY >= state.cpuY &&
                state.ballY <= state.cpuY + PADDLE_HEIGHT
            ) {
                state.ballSpeedX *= -1;
            }

            // CPU paddle movement
            const cpuPaddleCenter = state.cpuY + PADDLE_HEIGHT / 2;
            if (cpuPaddleCenter < state.ballY - 35) {
                state.cpuY = Math.min(height - PADDLE_HEIGHT, state.cpuY + 2);
            } else if (cpuPaddleCenter > state.ballY + 35) {
                state.cpuY = Math.max(0, state.cpuY - 2);
            }

            // Scoring
            if (state.ballX <= 0) {
                setCpuScore(prev => prev + 1);
                resetBall();
            } else if (state.ballX >= width) {
                setPlayerScore(prev => prev + 1);
                resetBall();
            }
        };

        const resetBall = () => {
            const { width, height } = canvas;
            gameState.current.ballX = width / 2;
            gameState.current.ballY = height / 2;
            gameState.current.ballSpeedX *= -1;
            gameState.current.ballSpeedY = Math.random() * 10 - 5;
        };

        // Render game
        const render = () => {
            const { width, height } = canvas;
            const state = gameState.current;

            // Clear canvas
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, width, height);

            // Draw paddles
            ctx.fillStyle = '#fff';
            ctx.fillRect(0, state.playerY, PADDLE_WIDTH, PADDLE_HEIGHT);
            ctx.fillRect(width - PADDLE_WIDTH, state.cpuY, PADDLE_WIDTH, PADDLE_HEIGHT);

            // Draw ball
            ctx.beginPath();
            ctx.arc(state.ballX, state.ballY, BALL_SIZE / 2, 0, Math.PI * 2);
            ctx.fill();

            // Draw pause overlay if game is paused
            if (isPaused) {
                ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
                ctx.fillRect(0, 0, width, height);
                ctx.fillStyle = '#fff';
                ctx.font = '48px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('PAUSED', width / 2, height / 2);
            }
        };

        // Game loop
        const gameLoop = () => {
            update();
            render();
            animationFrameId = requestAnimationFrame(gameLoop);
        };

        // Start game loop
        window.addEventListener('keydown', handleKeyDown);
        gameLoop();

        // Cleanup
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            cancelAnimationFrame(animationFrameId);
        };
    }, [gameStarted, isPaused]);

    const handlePauseToggle = () => {
        setIsPaused(!isPaused);
    };

    const handleStartGame = () => {
        setGameStarted(true);
    };

    // Initialize game after canvas is rendered
    useEffect(() => {
        if (gameStarted) {
            initGame();
        }
    }, [gameStarted]);

    return (
        <div className="pong-game">
            {!gameStarted ? (
                <button
                    onClick={handleStartGame}
                    className="play-button"
                >
                    Play Pong
                </button>
            ) : (
                <>
                    <GameControls
                        playerScore={playerScore}
                        cpuScore={cpuScore}
                        onPauseToggle={handlePauseToggle}
                        isPaused={isPaused}
                    />
                    <canvas
                        ref={canvasRef}
                        width={800}
                        height={600}
                        style={{ border: '2px solid white' }}
                    />
                </>
            )}
        </div>
    );
};

export default PongGame; 