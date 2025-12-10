import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function ViewModal({ note, close, onEdit }: any) {
  return (
    <Dialog open onOpenChange={close}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{note.title}</DialogTitle>
        </DialogHeader>

        <div className="text-slate-700 whitespace-pre-wrap max-h-[50vh] overflow-y-auto">
          {note.content}
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={close}>
            Close
          </Button>
          <Button onClick={() => onEdit(note)}>Edit</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
