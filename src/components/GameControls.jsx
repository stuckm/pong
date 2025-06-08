import { useState } from 'react';

const GameControls = ({ playerScore, cpuScore, onPauseToggle, isPaused }) => {
    return (
        <div className="game-controls">
            <div className="scores">
                <div className="score">
                    <span className="label">Player</span>
                    <span className="value">{playerScore}</span>
                </div>
                <div className="score">
                    <span className="label">CPU</span>
                    <span className="value">{cpuScore}</span>
                </div>
            </div>
            <button
                className="pause-button"
                onClick={onPauseToggle}
                aria-label={isPaused ? "Resume game" : "Pause game"}
            >
                {isPaused ? (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                        <path d="M8 5v14l11-7z" />
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                    </svg>
                )}
            </button>
        </div>
    );
};

export default GameControls; 