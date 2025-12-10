import { useEffect, useState } from "react";
import api from "@/lib/api";
import NotesGrid from "./NotesGrid";
import NoteModal from "./NoteModal";
import ViewModal from "./ViewModal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, LogOut } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface Note {
    id?: string;
    title?: string;
    content?: string;
    createdAt?: string;
    updatedAt?: string;
}

export default function Dashboard({ logout }: any) {
    const [query, setQuery] = useState("");
    const [loadingSearch, setLoadingSearch] = useState(false);


    const [notes, setNotes] = useState<Note[]>([]);
    const [editingNote, setEditingNote] = useState<Note | null>(null);
    const [viewingNote, setViewingNote] = useState<Note | null>(null);

    const fetchNotes = async () => {
        try {
            setLoadingSearch(true);

            if (query.trim()) {
                const res = await api.get(`/notes/search?q=${query}`);
                setNotes(res.data);
            } else {
                const res = await api.get("/notes");
                setNotes(res.data);
            }
        } finally {
            setLoadingSearch(false);
        }
    };

    useEffect(() => {
        const t = setTimeout(fetchNotes, 400);
        return () => clearTimeout(t);
    }, [query]);

    return (
        <>
            <header className="p-4 border-b bg-white flex justify-between items-center">
                <h1 className="font-bold text-xl">AI Notes</h1>

                <Button variant="destructive" onClick={logout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                </Button>
            </header>

            <main className="max-w-4xl mx-auto mt-6 space-y-6">

                {/* Search Bar */}
                <div className="flex gap-2">
                    <div className="relative w-full">
                        <Search className="absolute left-3 top-3 text-slate-400" />
                        <Input
                            className="pl-10"
                            placeholder="Search notes..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </div>

                    <Button onClick={() => setEditingNote({})}>
                        <Plus className="w-4 h-4 mr-2" /> New
                    </Button>
                </div>

                {/* Notes Grid or Loading Skeletons */}
                {loadingSearch ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Array(6)
                            .fill(0)
                            .map((_, i) => (
                                <div
                                    key={i}
                                    className="border rounded-xl p-4 space-y-4 shadow-sm"
                                >
                                    <Skeleton className="h-6 w-3/4 rounded-md" />
                                    <Skeleton className="h-4 w-full rounded-md" />
                                    <Skeleton className="h-4 w-5/6 rounded-md" />
                                    <Skeleton className="h-4 w-4/6 rounded-md" />
                                    <Skeleton className="h-4 w-2/3 rounded-md" />
                                </div>
                            ))}
                    </div>
                ) : (
                    <NotesGrid
                        notes={notes}
                        onView={(n: Note) => setViewingNote(n)}
                        onEdit={(n: Note) => setEditingNote(n)}
                        refresh={fetchNotes}
                    />
                )}
            </main>

            {/* Modals */}
            {editingNote && (
                <NoteModal
                    note={editingNote}
                    close={() => setEditingNote(null)}
                    refresh={fetchNotes}
                />
            )}

            {viewingNote && (
                <ViewModal
                    note={viewingNote}
                    close={() => setViewingNote(null)}
                    onEdit={(n: Note) => {
                        setViewingNote(null);
                        setEditingNote(n);
                    }}
                />
            )}
        </>
    );
}
