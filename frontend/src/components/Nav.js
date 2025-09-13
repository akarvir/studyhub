import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link, useLocation } from 'react-router-dom';
import UserMenu from '@/components/UserMenu';
const tabs = [
    { to: '/', label: 'Dashboard' },
    { to: '/notes', label: 'Notes' },
    { to: '/decks', label: 'Decks' },
    { to: '/groups', label: 'Groups' }
];
export default function Nav() {
    const { pathname } = useLocation();
    return (_jsx("header", { className: "sticky top-0 z-10 bg-white/80 backdrop-blur border-b", children: _jsxs("div", { className: "mx-auto max-w-6xl px-4 h-16 flex items-center justify-between", children: [_jsxs(Link, { to: "/", className: "font-semibold text-gray-800 flex items-center gap-2", children: [_jsx("span", { className: "inline-flex h-6 w-6 items-center justify-center rounded-lg bg-brand-600 text-white text-xs", children: "SH" }), _jsx("span", { style: { fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif' }, children: "StudyHub" })] }), _jsx("nav", { className: "flex gap-1 text-sm", children: tabs.map(t => (_jsx(Link, { to: t.to, className: `px-3 py-2 rounded-lg transition ${pathname === t.to ? 'bg-gray-100 text-gray-900 shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`, children: t.label }, t.to))) }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("button", { className: "btn-ghost hidden md:inline-flex", onClick: () => window.dispatchEvent(new Event('open-command-palette')), "aria-label": "Open command palette", children: "\u2318K" }), _jsx(UserMenu, {})] })] }) }));
}
