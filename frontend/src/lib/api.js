import { supabase } from '@/lib/supabase';
const API_BASE = import.meta.env.VITE_API_BASE_URL.replace(/\/$/, '');
async function authHeader() {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    return token ? { Authorization: `Bearer ${token}` } : {};
}
export async function apiGet(path) {
    const res = await fetch(`${API_BASE}${path}`, {
        headers: {
            'Content-Type': 'application/json',
            ...(await authHeader()),
        },
        credentials: 'include',
    });
    if (!res.ok)
        throw new Error(await res.text());
    return res.json();
}
export async function apiPost(path, body) {
    const res = await fetch(`${API_BASE}${path}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...(await authHeader()),
        },
        body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok)
        throw new Error(await res.text());
    return res.json();
}
export async function apiPatch(path, body) {
    const res = await fetch(`${API_BASE}${path}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            ...(await authHeader()),
        },
        body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok)
        throw new Error(await res.text());
    return res.json();
}
export async function apiDelete(path) {
    const res = await fetch(`${API_BASE}${path}`, {
        method: 'DELETE',
        headers: {
            ...(await authHeader()),
        },
    });
    if (!res.ok)
        throw new Error(await res.text());
}
