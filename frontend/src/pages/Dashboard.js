import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { apiGet } from '@/lib/api';
import Card from '@/components/Card';
import { Link } from 'react-router-dom';
export default function Dashboard() {
    const [counts, setCounts] = useState(null);
    const [recentDecks, setRecentDecks] = useState([]);
    const [recentNotes, setRecentNotes] = useState([]);
    const [recentGroups, setRecentGroups] = useState([]);
    const [tipOfDay, setTipOfDay] = useState('');
    const [showTip, setShowTip] = useState(true);
    useEffect(() => {
        (async () => {
            try {
                const notes = await apiGet("/notes/");
                const decks = await apiGet("/decks/");
                setCounts({ notes: notes.length, decks: decks.length });
                setRecentNotes(notes.slice(0, 3));
                setRecentDecks(decks.slice(0, 3));
            }
            catch (e) {
                console.error(e);
            }
            try {
                const groups = await apiGet("/groups/");
                setRecentGroups(groups.slice(0, 3));
            }
            catch (e) {
                console.error(e);
            }
        })();
        const TIPS = [
            'Short daily sessions beat long cramming — consistency wins.',
            'Recall > reread: test yourself before peeking at notes.',
            'Space reviews: today, 2 days, 1 week, then monthly.',
            'Interleave topics to strengthen transfer and retention.',
            'Teach it to a rubber duck — if you can explain it, you own it.',
            'Make cards atomic: one fact or concept per card.',
            'Vary context: study in different places to reduce context dependence.',
            'Use images or examples on the back of flashcards for richer cues.',
            'Rate your confidence after each card to guide scheduling.',
            'Sleep is a study technique — review before bed for consolidation.',
            'Turn notes into questions; questions drive memory.',
            'Tag tricky cards as “leeches” and rework them into simpler parts.',
            'Define a tiny daily goal (5 minutes). Start small, keep streaks.',
            'Write down errors — analyzing mistakes boosts learning gains.',
            'Chunk complex ideas into layered cards that build up gradually.'
        ];
        // Daily persistence: store dismiss state and selected tip for the day
        const todayKey = new Date().toISOString().slice(0, 10);
        const stored = localStorage.getItem('dashboard.tip');
        try {
            const parsed = stored ? JSON.parse(stored) : null;
            if (parsed && parsed.date === todayKey) {
                setShowTip(!parsed.hidden);
                setTipOfDay(parsed.tip);
            }
            else {
                const tip = TIPS[Math.floor(Math.random() * TIPS.length)];
                setTipOfDay(tip);
                localStorage.setItem('dashboard.tip', JSON.stringify({ date: todayKey, hidden: false, tip }));
            }
        }
        catch {
            const tip = TIPS[Math.floor(Math.random() * TIPS.length)];
            setTipOfDay(tip);
        }
    }, []);
    return (_jsxs("div", { className: "mx-auto max-w-6xl p-4", children: [_jsxs("div", { className: "mb-6", children: [_jsx("h1", { className: "text-2xl font-semibold", children: "Dashboard" }), _jsx("p", { className: "text-sm text-gray-600", children: "Overview of your StudyHub activity" })] }), _jsxs("div", { className: "grid md:grid-cols-3 gap-4", children: [_jsxs("div", { className: "kpi", children: [_jsxs("div", { children: [_jsx("div", { className: "text-gray-500 text-sm", children: "Your Notes" }), _jsx("div", { className: "text-3xl font-semibold", children: counts?.notes ?? '—' })] }), _jsx("span", { className: "badge", children: "+ Focus" })] }), _jsxs("div", { className: "kpi", children: [_jsxs("div", { children: [_jsx("div", { className: "text-gray-500 text-sm", children: "Your Decks" }), _jsx("div", { className: "text-3xl font-semibold", children: counts?.decks ?? '—' })] }), _jsx("span", { className: "badge", children: "Study" })] }), showTip && (_jsx(Card, { children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "h-10 w-10 rounded-xl bg-brand-50 text-brand-700 grid place-items-center", children: "\uD83C\uDFAF" }), _jsxs("div", { className: "flex-1", children: [_jsx("div", { className: "font-medium", children: "Tip of the day" }), _jsx("div", { className: "text-sm text-gray-600", children: tipOfDay })] }), _jsx("button", { className: "btn-ghost", onClick: () => {
                                        setShowTip(false);
                                        const todayKey = new Date().toISOString().slice(0, 10);
                                        try {
                                            localStorage.setItem('dashboard.tip', JSON.stringify({ date: todayKey, hidden: true, tip: tipOfDay }));
                                        }
                                        catch { }
                                    }, children: "Dismiss" })] }) }))] }), _jsxs("div", { className: "grid md:grid-cols-3 gap-4 mt-4", children: [_jsxs(Card, { children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("h2", { className: "font-medium", children: "Recent Decks" }), _jsx(Link, { to: "/decks", className: "btn-ghost text-sm", children: "View all" })] }), _jsxs("ul", { className: "space-y-2", children: [recentDecks.map(d => (_jsxs("li", { className: "p-3 border rounded-lg card-hover", children: [_jsx("div", { className: "font-medium", children: d.title }), d.description && _jsx("div", { className: "text-sm text-gray-600", children: d.description })] }, d.id))), !recentDecks.length && _jsx("div", { className: "text-sm text-gray-500", children: "No decks yet." })] })] }), _jsxs(Card, { children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("h2", { className: "font-medium", children: "Recent Notes" }), _jsx(Link, { to: "/notes", className: "btn-ghost text-sm", children: "View all" })] }), _jsxs("ul", { className: "space-y-2", children: [recentNotes.map(n => (_jsxs("li", { className: "p-3 border rounded-lg card-hover", children: [_jsx("div", { className: "font-medium", children: n.title || 'Untitled' }), n.content && _jsx("div", { className: "text-sm text-gray-600 line-clamp-2", children: n.content })] }, n.id))), !recentNotes.length && _jsx("div", { className: "text-sm text-gray-500", children: "No notes yet." })] })] }), _jsxs(Card, { children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("h2", { className: "font-medium", children: "Your Groups" }), _jsx(Link, { to: "/groups", className: "btn-ghost text-sm", children: "View all" })] }), _jsxs("ul", { className: "space-y-2", children: [recentGroups.map(g => (_jsxs("li", { className: "p-3 border rounded-lg card-hover", children: [_jsx("div", { className: "font-medium", children: g.name }), g.description && _jsx("div", { className: "text-sm text-gray-600", children: g.description })] }, g.id))), !recentGroups.length && _jsx("div", { className: "text-sm text-gray-500", children: "You have no groups yet." })] })] })] })] }));
}
