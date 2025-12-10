import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Trash, Edit, Calendar } from "lucide-react";
import api from "@/lib/api";

export default function NoteCard({ note, onClick, onEdit, refresh }: any) {
  const remove = async (e: any) => {
    e.stopPropagation();
    if (!confirm("Delete this note?")) return;
    await api.delete(`/notes/${note.id}`);
    refresh();
  };

  return (
    <Card onClick={onClick} className="cursor-pointer hover:shadow-md">
      <CardContent className="p-4">
        <h3 className="font-bold text-lg">{note.title}</h3>
        <p className="text-sm text-slate-600 line-clamp-4 mt-2">
          {note.content}
        </p>
      </CardContent>

      <CardFooter className="flex justify-between text-xs text-slate-400">
        <span>
          <Calendar className="inline-block w-3 h-3 mr-1" />
          {new Date(note.updatedAt).toLocaleDateString()}
        </span>

        <div className="flex gap-2 opacity-60 hover:opacity-100">
          <Edit className="w-4 h-4" onClick={onEdit} />
          <Trash className="w-4 h-4" onClick={remove} />
        </div>
      </CardFooter>
    </Card>
  );
}
