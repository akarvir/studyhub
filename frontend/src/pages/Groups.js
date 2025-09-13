import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { apiGet, apiPost } from '@/lib/api';
import Card from '@/components/Card';
export default function Groups() {
    const [groups, setGroups] = useState([]);
    const [pendingInvites, setPendingInvites] = useState([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [selected, setSelected] = useState('');
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteRole, setInviteRole] = useState('member');
    const [posts, setPosts] = useState([]);
    const [newPost, setNewPost] = useState('');
    const [scoreboard, setScoreboard] = useState([]);
    async function loadGroups() {
        const data = await apiGet('/groups/');
        setGroups(data);
    }
    async function loadInvites() {
        const data = await apiGet('/groups/invites');
        setPendingInvites(data);
    }
    async function loadPosts(groupId) {
        const data = await apiGet(`/groups/${groupId}/posts`);
        setPosts(data);
    }
    async function loadScoreboard(groupId) {
        const data = await apiGet(`/groups/${groupId}/scoreboard`);
        setScoreboard(data);
    }
    useEffect(() => { loadGroups(); loadInvites(); }, []);
    useEffect(() => { if (selected) {
        loadPosts(selected);
        loadScoreboard(selected);
    } }, [selected]);
    async function createGroup(e) {
        e.preventDefault();
        if (!name.trim())
            return alert('Group name required');
        await apiPost('/groups/', { name: name.trim(), description: description.trim() });
        setName('');
        setDescription('');
        await loadGroups();
    }
    async function createPost(e) {
        e.preventDefault();
        if (!selected || !newPost.trim())
            return;
        await apiPost(`/groups/${selected}/posts`, { content: newPost.trim() });
        setNewPost('');
        await loadPosts(selected);
        await loadScoreboard(selected);
    }
    async function inviteMember(e) {
        e.preventDefault();
        if (!inviteEmail.trim())
            return;
        await apiPost(`/groups/${selected}/invite`, { email: inviteEmail.trim(), role: inviteRole });
        setInviteEmail('');
        alert('Invitation sent!');
    }
    async function acceptInvite(inviteId) {
        await apiPost(`/groups/invites/${inviteId}/accept`, {});
        await loadGroups();
        await loadInvites();
    }
    async function declineInvite(inviteId) {
        await apiPost(`/groups/invites/${inviteId}/decline`, {});
        await loadInvites();
    }
    return (_jsxs("div", { className: "mx-auto max-w-6xl p-4 space-y-6", children: [_jsx("h1", { className: "text-2xl font-semibold", children: "Groups" }), pendingInvites.length > 0 && (_jsxs(Card, { children: [_jsx("h2", { className: "font-medium mb-2", children: "Pending Invites" }), _jsx("ul", { className: "space-y-2", children: pendingInvites.map(inv => (_jsxs("li", { className: "flex justify-between items-center border rounded-lg p-2", children: [_jsxs("div", { children: [_jsx("div", { className: "font-medium", children: inv.group.name }), inv.group.description && _jsx("div", { className: "text-sm text-gray-600", children: inv.group.description })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: () => acceptInvite(inv.id), className: "btn", children: "Accept" }), _jsx("button", { onClick: () => declineInvite(inv.id), className: "btn btn-outline", children: "Decline" })] })] }, inv.id))) })] })), _jsx(Card, { children: _jsxs("form", { onSubmit: createGroup, className: "grid gap-3 md:grid-cols-3", children: [_jsx("input", { className: "input", placeholder: "Group name", value: name, onChange: e => setName(e.target.value) }), _jsx("input", { className: "input", placeholder: "Description", value: description, onChange: e => setDescription(e.target.value) }), _jsx("button", { className: "btn", children: "Create group" })] }) }), selected && (_jsxs(Card, { children: [_jsx("h2", { className: "font-medium mb-2", children: "Invite a Friend" }), _jsxs("form", { onSubmit: inviteMember, className: "grid gap-3 md:grid-cols-3", children: [_jsx("input", { className: "input md:col-span-2", placeholder: "User email", value: inviteEmail, onChange: e => setInviteEmail(e.target.value) }), _jsxs("select", { className: "select", value: inviteRole, onChange: e => setInviteRole(e.target.value), children: [_jsx("option", { value: "member", children: "Member" }), _jsx("option", { value: "owner", children: "Owner" })] }), _jsx("button", { className: "btn md:col-span-3", children: "Send Invite" })] })] })), _jsxs("div", { className: "grid md:grid-cols-3 gap-4", children: [_jsxs(Card, { children: [_jsx("h2", { className: "font-medium mb-2", children: "Your Groups" }), _jsx("ul", { className: "space-y-2", children: groups.map(g => (_jsx("li", { children: _jsxs("button", { onClick: () => setSelected(g.id), className: `w-full text-left px-3 py-2 rounded-lg border ${selected === g.id ? 'border-brand-500 bg-brand-50' : 'border-gray-200 hover:bg-gray-50'}`, children: [_jsx("div", { className: "font-medium", children: g.name }), g.description && _jsx("div", { className: "text-sm text-gray-600", children: g.description })] }) }, g.id))) })] }), _jsx("div", { className: "md:col-span-2 space-y-4", children: selected ? (_jsxs(_Fragment, { children: [_jsxs(Card, { children: [_jsx("h2", { className: "font-medium mb-2", children: "Group Feed" }), _jsxs("form", { onSubmit: createPost, className: "flex gap-2", children: [_jsx("input", { className: "input flex-1", placeholder: "Write a post...", value: newPost, onChange: e => setNewPost(e.target.value) }), _jsx("button", { className: "btn", children: "Post" })] })] }), _jsx(Card, { children: _jsxs("ul", { className: "space-y-3 max-h-80 overflow-auto", children: [posts.map(p => (_jsxs("li", { className: "border-b pb-2", children: [_jsx("div", { className: "text-sm text-gray-600", children: new Date(p.created_at).toLocaleString() }), _jsx("div", { children: p.content })] }, p.id))), !posts.length && _jsx("div", { className: "text-sm text-gray-500", children: "No posts yet." })] }) }), _jsxs(Card, { children: [_jsx("h2", { className: "font-medium mb-2", children: "Comments Leaderboard" }), _jsxs("table", { className: "table", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b", children: [_jsx("th", { children: "User" }), _jsx("th", { children: "Posts" })] }) }), _jsxs("tbody", { children: [scoreboard.map((s, idx) => (_jsxs("tr", { className: "table-row", children: [_jsx("td", { children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "inline-flex h-6 w-6 items-center justify-center rounded-lg bg-gray-100 text-gray-700 text-xs", children: idx + 1 }), _jsx("span", { children: s.username || s.user_id.slice(0, 6) })] }) }), _jsx("td", { children: s.post_count })] }, s.user_id))), !scoreboard.length && (_jsx("tr", { children: _jsx("td", { className: "py-2 px-2 text-gray-500", colSpan: 2, children: "No activity yet." }) }))] })] })] })] })) : (_jsx("div", { className: "text-gray-500", children: "Select a group to view feed & leaderboard." })) })] })] }));
}
