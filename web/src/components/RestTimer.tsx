"use client";

import { useEffect, useRef, useState } from "react";

interface RestTimerProps {
    /** duration in seconds */
    duration?: number;
    /** a signal to (re)start the timer; increment to trigger a start */
    startSignal?: number;
    onComplete?: () => void;
}

export default function RestTimer({ duration = 60, startSignal, onComplete }: RestTimerProps) {
    const [secondsLeft, setSecondsLeft] = useState<number>(duration);
    const [running, setRunning] = useState(false);
    const intervalRef = useRef<number | null>(null);

    // When parent signals start (startSignal changes), reset and start
    useEffect(() => {
        if (typeof startSignal === "number") {
            setSecondsLeft(duration);
            setRunning(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [startSignal, duration]);

    // Keep timer synced if duration prop changes while not running
    useEffect(() => {
        if (!running) {
            setSecondsLeft(duration);
        }
    }, [duration, running]);

    // Timer effect
    useEffect(() => {
        if (!running) {
            if (intervalRef.current) {
                window.clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
            return;
        }

        intervalRef.current = window.setInterval(() => {
            setSecondsLeft((s) => s - 1);
        }, 1000);

        return () => {
            if (intervalRef.current) {
                window.clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [running]);

    // When secondsLeft hits 0
    useEffect(() => {
        if (secondsLeft <= 0 && running) {
            setRunning(false);
            setSecondsLeft(0);
            try {
                // small "ding" using Web Audio API (if available)
                const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
                const o = ctx.createOscillator();
                const g = ctx.createGain();
                o.type = "sine";
                o.frequency.value = 880;
                g.gain.value = 0.02;
                o.connect(g);
                g.connect(ctx.destination);
                o.start();
                setTimeout(() => { o.stop(); ctx.close(); }, 200);
            } catch {
                // ignore if audio not available
            }
            onComplete?.();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [secondsLeft, running]);

    const format = (s: number) => {
        const mm = Math.floor(s / 60)
            .toString()
            .padStart(1, "0");
        const ss = Math.abs(s % 60).toString().padStart(2, "0");
        return mm + ":" + ss;
    };

    return (
        <div className="bg-zinc-900 text-white p-3 rounded-lg w-56">
            <div className="text-sm text-zinc-300 mb-1">Rest Timer</div>
            <div className="text-3xl font-bold tracking-tight">{format(Math.max(0, secondsLeft))}</div>

            <div className="flex gap-2 mt-3">
                {!running ? (
                    <button
                        onClick={() => {
                            setSecondsLeft(duration);
                            setRunning(true);
                        }}
                        className="flex-1 bg-blue-600 py-1 rounded text-sm font-medium"
                    >
                        Start
                    </button>
                ) : (
                    <button
                        onClick={() => setRunning(false)}
                        className="flex-1 bg-yellow-600 py-1 rounded text-sm font-medium"
                    >
                        Pause
                    </button>
                )}

                <button
                    onClick={() => {
                        setRunning(false);
                        setSecondsLeft(duration);
                    }}
                    className="px-3 bg-zinc-700 rounded text-sm"
                >
                    Reset
                </button>
            </div>
        </div>
    );
}
