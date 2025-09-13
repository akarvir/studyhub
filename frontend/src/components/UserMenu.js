import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { apiGet } from '@/lib/api';
export default function UserMenu() {
    const [open, setOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [profile, setProfile] = useState(null);
    const ref = useRef(null);
    useEffect(() => {
        (async () => {
            const { data } = await supabase.auth.getUser();
            const e = data.user?.email || '';
            setEmail(e);
            try {
                setProfile(await apiGet('/me'));
            }
            catch { }
        })();
    }, []);
    useEffect(() => {
        const onClick = (e) => {
            if (!ref.current)
                return;
            if (!ref.current.contains(e.target))
                setOpen(false);
        };
        document.addEventListener('click', onClick);
        return () => document.removeEventListener('click', onClick);
    }, []);
    const initials = (profile?.username || email || 'U')[0]?.toUpperCase();
    async function signOut() {
        await supabase.auth.signOut();
        window.location.href = '/login'; // Protected has authed state that'll change with changes to session, and it'll redirect to login if not authed. Is there need for this? 
    }
    return (_jsxs("div", { className: "relative", ref: ref, children: [_jsx("button", { onClick: () => setOpen(v => !v), "aria-label": "User menu", className: "w-9 h-9 rounded-full bg-brand-600 text-white grid place-items-center focus:outline-none", children: profile?.avatar_url ? (_jsx("img", { src: profile.avatar_url, className: "w-9 h-9 rounded-full object-cover" })) : (_jsx("span", { className: "font-semibold", children: initials })) }), open && (_jsxs("div", { className: "absolute right-0 mt-2 w-56 rounded-xl border bg-white shadow-md p-2", children: [_jsxs("div", { className: "px-2 py-1.5 text-sm text-gray-700", children: [_jsx("div", { className: "font-medium", children: profile?.username || 'User' }), _jsx("div", { className: "text-gray-500 truncate", children: email })] }), _jsx("div", { className: "h-px bg-gray-100 my-2" }), _jsx("button", { className: "w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 text-sm", onClick: signOut, children: "Sign out" })] }))] }));
}
