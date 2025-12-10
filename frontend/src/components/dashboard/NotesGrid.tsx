import NoteCard from "./NoteCard";

export default function NotesGrid({ notes, onView, onEdit, refresh }: any) {
  if (notes.length === 0)
    return (
      <p className="text-center text-slate-500 py-20">No notes yet</p>
    );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {notes.map((n: any) => (
        <NoteCard
          key={n.id}
          note={n}
          onClick={() => onView(n)}
          onEdit={(e: any) => {
            e.stopPropagation();
            onEdit(n);
          }}
          refresh={refresh}
        />
      ))}
    </div>
  );
}
