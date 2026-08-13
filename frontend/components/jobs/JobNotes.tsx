"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import type { JobNote } from "@/lib/types";

interface JobNotesProps {
  notes: JobNote[];
  onAdd: (text: string) => Promise<unknown>;
}

function authorName(author: JobNote["author"]) {
  return typeof author === "string" ? author : author.name;
}

function formatTimestamp(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function JobNotes({ notes, onAdd }: JobNotesProps) {
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    if (!text.trim()) return;
    setSubmitting(true);
    try {
      await onAdd(text.trim());
      setText("");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 max-h-72 overflow-y-auto">
        {notes.length === 0 ? (
          <p className="text-[13px] text-ink-500 m-0">No notes yet.</p>
        ) : (
          [...notes]
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .map((note, i) => (
              <div key={i} className="rounded-lg border border-line px-3.5 py-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[13px] font-semibold text-ink-900">
                    {authorName(note.author)}
                  </span>
                  <span className="text-[11px] text-ink-500">{formatTimestamp(note.createdAt)}</span>
                </div>
                <p className="text-sm text-ink-700 m-0 whitespace-pre-wrap">{note.text}</p>
              </div>
            ))
        )}
      </div>

      <div className="flex flex-col gap-2">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a note…"
          rows={3}
          className="rounded-lg border border-line px-3 py-2.5 text-sm outline-none resize-none focus:border-brand focus:ring-2 focus:ring-brand/20"
        />
        <Button size="sm" className="self-end" disabled={submitting} onClick={submit}>
           {submitting ? "Adding..." : "Add note"}
        </Button>
      </div>
    </div>
  );
}