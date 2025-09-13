import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { apiGet, apiPost, apiPatch, apiDelete } from '@/lib/api';
import Card from '@/components/Card';
export default function Notes() {
    const [notes, setNotes] = useState([]);
    const [title, setTitle] = useState('');
    const [updatetitle, setUpdatetitle] = useState('');
    const [updatecontent, setUpdatecontent] = useState('');
    const [content, setContent] = useState('');
    const [updatewanted, setUpdatewanted] = useState('');
    async function load() {
        const data = await apiGet("/notes/");
        setNotes(data);
    }
    useEffect(() => { load(); }, []);
    async function create(e) {
        e.preventDefault();
        if (!title.trim()) {
            alert("Deck title is required");
            return;
        }
        await apiPost("/notes/", { title, content });
        setTitle('');
        setContent('');
        await load();
    }
    async function update(id) {
        await apiPatch(`/notes/${id}`, { title: updatetitle, content: updatecontent });
        setUpdatetitle('');
        setUpdatecontent('');
        setUpdatewanted('');
        await load();
    }
    async function remove(id) {
        await apiDelete(`/notes/${id}`);
        await load();
    }
    return (_jsxs("div", { className: "mx-auto max-w-6xl p-4 space-y-6", children: [_jsx("h1", { className: "text-2xl font-semibold", children: "Notes" }), _jsx(Card, { children: _jsxs("form", { onSubmit: create, className: "grid gap-3 md:grid-cols-2", children: [_jsx("input", { className: "input", placeholder: "Title", value: title, onChange: e => setTitle(e.target.value) }), _jsx("div", { className: "md:col-span-2", children: _jsx("textarea", { className: "textarea w-full", rows: 4, placeholder: "Content", value: content, onChange: e => setContent(e.target.value) }) }), _jsx("div", { className: "md:col-span-2", children: _jsx("button", { className: "btn", children: "Add note" }) })] }) }), _jsx("div", { className: "grid gap-4", children: notes.map(n => (_jsx(Card, { children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("div", { className: "font-medium", children: n.title || 'Untitled' }), _jsx("div", { className: "text-sm text-gray-600 whitespace-pre-line", children: n.content })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { className: "btn-outline", onClick: () => { setUpdatewanted(n.id); setUpdatecontent(''); setUpdatetitle(''); }, children: "Edit" }), _jsx("button", { className: "btn-outline", onClick: () => remove(n.id), children: "Delete" })] })] }) }, n.id))) }), _jsx("div", { children: updatewanted && (_jsx(Card, { children: _jsxs("form", { id: "Noteupdateform", onSubmit: (e) => { e.preventDefault(); update(updatewanted); }, className: "grid gap-2 md:grid-cols-2", children: [_jsx("input", { className: "input", type: 'text', placeholder: 'Edit note title..', value: updatetitle, onChange: (e) => { setUpdatetitle(e.target.value); } }), _jsx("input", { className: "input", type: 'text', placeholder: 'Edit note content..', value: updatecontent, onChange: (e) => { setUpdatecontent(e.target.value); } }), _jsx("div", { className: "md:col-span-2", children: _jsx("button", { className: "btn", type: 'submit', children: "Save changes" }) })] }) })) })] }));
}
