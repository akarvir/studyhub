import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// src/pages/Study.tsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiGet } from '@/lib/api';
import Card from '@/components/Card';
export default function Study() {
    const { deckId } = useParams();
    const [cards, setCards] = useState([]);
    const [index, setIndex] = useState(0);
    const [showBack, setShowBack] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        let active = true;
        (async () => {
            if (!deckId)
                return;
            setLoading(true);
            setError(null);
            try {
                const data = await apiGet(`/decks/${deckId}/cards`);
                if (!active)
                    return;
                setCards(data);
                setIndex(0);
                setShowBack(false);
            }
            catch (e) {
                if (!active)
                    return;
                setError(e?.message || 'Failed to load cards');
            }
            finally {
                if (active)
                    setLoading(false);
            }
        })();
        return () => {
            active = false;
        };
    }, [deckId]);
    // Keyboard: Left/Right arrows to navigate, Space to flip
    useEffect(() => {
        function onKey(e) {
            if (!cards.length)
                return;
            if (e.key === 'ArrowRight') {
                setIndex(i => Math.min(cards.length - 1, i + 1));
                setShowBack(false);
            }
            else if (e.key === 'ArrowLeft') {
                setIndex(i => Math.max(0, i - 1));
                setShowBack(false);
            }
            else if (e.key === ' ' || e.key === 'Spacebar') {
                e.preventDefault();
                setShowBack(v => !v);
            }
        }
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [cards.length]);
    if (!deckId)
        return _jsx("div", { className: "p-6", children: "Missing deck id." });
    return (_jsxs("div", { className: "mx-auto max-w-2xl p-6", children: [_jsx("h1", { className: "text-2xl font-semibold mb-4", children: "Study" }), loading && _jsx("div", { className: "text-gray-600", children: "Loading cards\u2026" }), error && _jsx("div", { className: "text-red-600", children: error }), !loading && !error && cards.length === 0 && (_jsx("div", { className: "text-gray-600", children: "No cards in this deck." })), !loading && !error && cards.length > 0 && (_jsxs(_Fragment, { children: [_jsx(Card, { children: _jsx("div", { className: "min-h-[220px] md:min-h-[260px] flex items-center justify-center text-xl md:text-2xl font-semibold cursor-pointer select-none p-6 text-center", title: "Click to flip", onClick: () => setShowBack(v => !v), children: showBack ? cards[index].back : cards[index].front }) }), _jsxs("div", { className: "flex items-center justify-between mt-4 gap-3", children: [_jsx("button", { className: "btn-outline", disabled: index === 0, onClick: () => {
                                    setIndex(i => Math.max(0, i - 1));
                                    setShowBack(false);
                                }, children: "Prev" }), _jsxs("div", { className: "text-sm text-gray-600", children: [index + 1, " / ", cards.length] }), _jsx("button", { className: "btn", disabled: index === cards.length - 1, onClick: () => {
                                    setIndex(i => Math.min(cards.length - 1, i + 1));
                                    setShowBack(false);
                                }, children: "Next" })] }), _jsx("div", { className: "mt-3 flex justify-center", children: _jsx("button", { className: "btn-outline", onClick: () => setShowBack(v => !v), children: showBack ? 'Show Front' : 'Show Back' }) })] }))] }));
}
