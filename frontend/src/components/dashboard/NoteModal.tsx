import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { useState } from "react";

export default function NoteModal({ note, close, refresh }: any) {
  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.content || "");
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      if (note?.id) await api.put(`/notes/${note.id}`, { title, content });
      else await api.post("/notes", { title, content });

      refresh();
      close();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open onOpenChange={close}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{note.id ? "Edit Note" : "New Note"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <Textarea
            rows={10}
            placeholder="Write your note..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={close}>
              Cancel
            </Button>
            <Button onClick={save} disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
