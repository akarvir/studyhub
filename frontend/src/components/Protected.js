import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Navigate } from 'react-router-dom';
export default function Protected({ children }) {
    const [loading, setLoading] = useState(true);
    const [authed, setAuthed] = useState(false);
    useEffect(() => {
        let mounted = true;
        supabase.auth.getSession().then(({ data }) => {
            if (!mounted)
                return;
            setAuthed(!!data.session);
            setLoading(false);
        });
        const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
            setAuthed(!!session);
        });
        return () => { mounted = false; sub.subscription.unsubscribe(); };
    }, []);
    if (loading)
        return _jsx("div", { className: "min-h-screen grid place-items-center text-gray-600", children: "Loading\u2026" });
    if (!authed)
        return _jsx(Navigate, { to: "/login", replace: true });
    return children;
}
