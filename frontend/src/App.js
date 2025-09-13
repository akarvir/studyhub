import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Protected from '@/components/Protected';
import Nav from '@/components/Nav';
import CommandPalette from '@/components/CommandPalette';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import Notes from '@/pages/Notes';
import Decks from '@/pages/Decks';
import Groups from '@/pages/Groups';
import Study from '@/pages/Study';
export default function App() {
    return (_jsx(BrowserRouter, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/login", element: _jsx(Login, {}) }), _jsx(Route, { path: "/", element: _jsx(Protected, { children: _jsx(WithNav, { children: _jsx(Dashboard, {}) }) }) }), _jsx(Route, { path: "/notes", element: _jsx(Protected, { children: _jsx(WithNav, { children: _jsx(Notes, {}) }) }) }), _jsx(Route, { path: "/decks", element: _jsx(Protected, { children: _jsx(WithNav, { children: _jsx(Decks, {}) }) }) }), _jsx(Route, { path: "/groups", element: _jsx(Protected, { children: _jsx(WithNav, { children: _jsx(Groups, {}) }) }) }), _jsx(Route, { path: "/study/:deckId", element: _jsx(Protected, { children: _jsx(WithNav, { children: _jsx(Study, {}) }) }) })] }) }));
}
function WithNav({ children }) {
    return (_jsxs("div", { className: "min-h-screen", children: [_jsx(Nav, {}), _jsx("main", { children: children }), _jsx(CommandPalette, {})] }));
}
