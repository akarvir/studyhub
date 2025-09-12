import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Protected from '@/components/Protected'
import Nav from '@/components/Nav'
import Login from '@/pages/Login'
import Dashboard from '@/pages/Dashboard'
import Notes from '@/pages/Notes'
import Decks from '@/pages/Decks'
import Groups from '@/pages/Groups'
import Study from '@/pages/Study'
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Protected><WithNav><Dashboard /></WithNav></Protected>} />
        <Route path="/notes" element={<Protected><WithNav><Notes /></WithNav></Protected>} />
        <Route path="/decks" element={<Protected><WithNav><Decks /></WithNav></Protected>} />
        <Route path="/groups" element={<Protected><WithNav><Groups /></WithNav></Protected>} />
        <Route path="/study/:deckId" element={<Protected><WithNav><Study  /></WithNav></Protected>} />
      </Routes>
    </BrowserRouter>
  )
}

function WithNav({ children }: { children: JSX.Element }) {
  return (
    <div className="min-h-screen">
      <Nav />
      <main>{children}</main>
    </div>
  )
}