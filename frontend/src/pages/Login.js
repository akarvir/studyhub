import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import Card from '@/components/Card';
export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    async function onSubmit(e) {
        e.preventDefault();
        setError(null);
        setLoading(true);
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        setLoading(false);
        if (error) {
            setError(error.message);
            return;
        }
        // redirect handled by Protected + router
        window.location.href = '/';
    }
    async function onSignUp() {
        setError(null);
        setLoading(true);
        const { error } = await supabase.auth.signUp({ email, password });
        setLoading(false);
        if (error)
            setError(error.message);
        else
            alert('Check your email to confirm your account!');
    }
    return (_jsx("div", { className: "min-h-screen grid place-items-center p-4 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-brand-50 via-white to-white", children: _jsxs("div", { className: "max-w-md w-full", children: [_jsxs("div", { className: "text-center mb-6", children: [_jsx("div", { className: "mx-auto h-14 w-14 rounded-2xl bg-brand-600 text-white grid place-items-center text-xl font-semibold shadow-sm", children: "SH" }), _jsx("h1", { className: "text-2xl font-semibold mt-3", style: { fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif' }, children: "Welcome to StudyHub" }), _jsx("p", { className: "text-sm text-gray-600", children: "Sign in to continue your learning" })] }), _jsxs(Card, { children: [_jsxs("form", { onSubmit: onSubmit, className: "flex flex-col gap-3", children: [_jsx("input", { className: "input", placeholder: "Email", type: "email", value: email, onChange: e => setEmail(e.target.value) }), _jsx("input", { className: "input", placeholder: "Password", type: "password", value: password, onChange: e => setPassword(e.target.value) }), error && _jsx("div", { className: "text-sm text-red-600", children: error }), _jsx("button", { className: "btn w-full", disabled: loading, children: loading ? 'Loading…' : 'Sign in' })] }), _jsxs("div", { className: "mt-3 text-sm text-gray-600", children: ["No account? ", _jsx("button", { className: "text-brand-700 hover:underline", onClick: onSignUp, children: "Sign up" })] })] })] }) }));
}
