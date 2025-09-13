import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { apiGet, apiPost } from '@/lib/api';
import Card from '@/components/Card';
import { Link } from 'react-router-dom';
export default function Decks() {
    const [decks, setDecks] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [inviteUserId, setInviteUserId] = useState('');
    const [permission, setPermission] = useState('view');
    const [inviteEmail, setInviteEmail] = useState('');
    const [invites, setInvites] = useState([]);
    const [selected, setSelected] = useState('');
    const [front, setFront] = useState('');
    const [back, setBack] = useState('');
    const [cards, setCards] = useState([]);
    const [loadingCards, setLoadingCards] = useState(false);
    async function loadDecks() {
        const data = await apiGet("/decks/");
        setDecks(data);
    }
    async function loadInvites() {
        const data = await apiGet('/decks/invites');
        setInvites(data);
    }
    useEffect(() => {
        loadInvites();
    }, []);
    async function acceptInvite(inviteId) {
        await apiPost(`/decks/invites/${inviteId}/accept`, {});
        await loadInvites();
        await loadDecks(); // refresh deck list after accepting
    }
    async function declineInvite(inviteId) {
        await apiPost(`/decks/invites/${inviteId}/decline`, {});
        await loadInvites();
    }
    async function loadCards(deckId) {
        setLoadingCards(true);
        try {
            const data = await apiGet(`/decks/${deckId}/cards`);
            setCards(data);
        }
        finally {
            setLoadingCards(false);
        }
    }
    useEffect(() => { loadDecks(); }, []);
    useEffect(() => { if (selected)
        loadCards(selected); }, [selected]);
    async function addCard(e) {
        e.preventDefault();
        if (!selected)
            return alert('Select a deck first');
        await apiPost(`/decks/${selected}/cards`, { front, back });
        setFront('');
        setBack('');
        await loadCards(selected);
    }
    async function createDeck(e) {
        e.preventDefault();
        if (!title.trim()) {
            alert("Deck title is required");
            return;
        }
        await apiPost("/decks/", { title: title.trim(), description: description.trim() });
        setTitle('');
        setDescription('');
        await loadDecks();
    }
    return (_jsxs("div", { className: "mx-auto max-w-6xl p-4 space-y-6", children: [_jsx("h1", { className: "text-2xl font-semibold", children: "Decks" }), _jsx(Card, { children: _jsxs("form", { onSubmit: createDeck, className: "grid gap-3 md:grid-cols-3", children: [_jsx("input", { className: "input", placeholder: "Deck title", value: title, onChange: e => setTitle(e.target.value) }), _jsx("input", { className: "input", placeholder: "Description", value: description, onChange: e => setDescription(e.target.value) }), _jsx("button", { className: "btn", children: "Create deck" })] }) }), _jsxs("div", { className: "grid md:grid-cols-2 gap-4", children: [_jsxs(Card, { children: [_jsx("h2", { className: "font-medium mb-2", children: "Deck Invitations" }), _jsxs("ul", { className: "space-y-2", children: [invites.map(invite => (_jsxs("li", { className: "p-3 border rounded-lg", children: [_jsx("div", { className: "font-medium", children: invite.deck?.title || "Untitled Deck" }), _jsxs("div", { className: "text-sm text-gray-600", children: ["Permission: ", invite.permission] }), _jsxs("div", { className: "flex gap-2 mt-2", children: [_jsx("button", { onClick: () => acceptInvite(invite.id), className: "btn btn-sm", children: "Accept" }), _jsx("button", { onClick: () => declineInvite(invite.id), className: "btn btn-sm", children: "Decline" })] })] }, invite.id))), !invites.length && (_jsx("div", { className: "text-sm text-gray-500", children: "No pending invitations." }))] })] }), _jsxs(Card, { children: [_jsx("h2", { className: "font-medium mb-2", children: "Your Decks" }), _jsx("ul", { className: "space-y-2", children: decks.map(d => (_jsx("li", { children: _jsx("div", { className: `card-hover w-full px-3 py-2 rounded-lg border ${selected === d.id ? 'border-brand-500 bg-brand-50' : 'border-gray-200 hover:bg-gray-50'}`, children: _jsxs("div", { className: "flex items-start justify-between gap-3", children: [_jsxs("button", { onClick: () => setSelected(d.id), className: "text-left flex-1", children: [_jsx("div", { className: "font-medium", children: d.title }), d.description && _jsx("div", { className: "text-sm text-gray-600", children: d.description })] }), _jsx(Link, { to: `/study/${d.id}`, className: "btn btn-sm", children: "Study Mode" })] }) }) }, d.id))) })] }), _jsxs(Card, { children: [_jsx("h2", { className: "font-medium mb-2", children: "Add Card to Selected Deck" }), _jsxs("form", { onSubmit: addCard, className: "grid gap-3", children: [_jsx("input", { className: "input", placeholder: "Front", value: front, onChange: e => setFront(e.target.value) }), _jsx("input", { className: "input", placeholder: "Back", value: back, onChange: e => setBack(e.target.value) }), _jsx("button", { className: "btn", children: "Add card" })] }), _jsx("div", { className: "h-px bg-gray-100 my-4" }), _jsxs("h3", { className: "font-medium mb-2", children: ["Cards ", selected && `(Deck ${selected.slice(0, 8)}…)`] }), loadingCards ? (_jsx("div", { className: "text-sm text-gray-600", children: "Loading cards\u2026" })) : (_jsxs("ul", { className: "space-y-2 max-h-72 overflow-auto pr-1", children: [cards.map(c => (_jsxs("li", { className: "p-3 border rounded-lg", children: [_jsx("div", { className: "font-medium", children: c.front }), _jsx("div", { className: "text-sm text-gray-600", children: c.back })] }, c.id))), !cards.length && _jsx("div", { className: "text-sm text-gray-500", children: "No cards yet." })] }))] }), _jsxs(Card, { children: [_jsx("h2", { className: "font-medium mb-2", children: "Share Selected Deck" }), !selected && _jsx("div", { className: "text-sm text-gray-500", children: "Select a deck first." }), selected && (_jsxs("form", { onSubmit: async (e) => {
                                    e.preventDefault();
                                    if (!inviteEmail.trim())
                                        return;
                                    await apiPost(`/decks/${selected}/invite`, { email: inviteEmail.trim(), permission });
                                    setInviteEmail('');
                                    alert('Invitation sent to ' + inviteEmail.trim());
                                }, className: "grid gap-3", children: [_jsx("input", { className: "input", placeholder: "User Email", type: "email", value: inviteEmail, onChange: e => setInviteEmail(e.target.value) }), _jsxs("select", { className: "select", value: permission, onChange: e => setPermission(e.target.value), children: [_jsx("option", { value: "view", children: "View" }), _jsx("option", { value: "edit", children: "Edit" })] }), _jsx("button", { className: "btn", children: "Share" })] }))] })] })] }));
}
