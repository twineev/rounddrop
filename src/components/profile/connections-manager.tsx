"use client";

import { useState } from "react";
import { addConnection, importConnectionsFromCsv, removeConnection } from "@/actions/connections";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Users, Plus, Upload, Trash2, Link2 } from "lucide-react";

interface Connection {
  id: string;
  linkedin_url: string;
  full_name: string | null;
  headline: string | null;
}

const input =
  "block w-full rounded-lg border border-gray-200 px-3 py-2 text-sm placeholder:text-gray-400 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500";

export function ConnectionsManager({
  connections,
  linkedinUrl,
}: {
  connections: Connection[];
  linkedinUrl: string;
}) {
  const [list, setList] = useState<Connection[]>(connections);
  const [addUrl, setAddUrl] = useState("");
  const [addName, setAddName] = useState("");
  const [adding, setAdding] = useState(false);
  const [importing, setImporting] = useState(false);

  async function onAdd() {
    if (!addUrl.trim()) return;
    setAdding(true);
    try {
      await addConnection({ linkedin_url: addUrl, full_name: addName || undefined });
      toast.success("Connection added");
      setList([
        { id: `tmp-${Date.now()}`, linkedin_url: addUrl, full_name: addName || null, headline: null },
        ...list,
      ]);
      setAddUrl("");
      setAddName("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to add");
    } finally {
      setAdding(false);
    }
  }

  async function onImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    try {
      const text = await file.text();
      const result = await importConnectionsFromCsv(text);
      toast.success(`Imported ${result.imported} connections`);
      // Soft refresh — in real app we'd refetch
      window.location.reload();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to import");
    } finally {
      setImporting(false);
    }
  }

  async function onRemove(id: string) {
    try {
      await removeConnection(id);
      setList(list.filter((c) => c.id !== id));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to remove");
    }
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-5">
      <div className="flex items-center gap-2">
        <Users className="h-5 w-5 text-gray-400" />
        <h2 className="text-lg font-bold" style={{ color: "#0F1A2E" }}>Your LinkedIn network</h2>
      </div>
      <p className="text-sm text-gray-600">
        Paste the LinkedIn URLs of people in your network so we can surface{" "}
        <span className="font-semibold">mutual connections</span> on founder and investor profiles.
        The quickest way is to{" "}
        <a
          href="https://www.linkedin.com/mypreferences/d/download-my-data"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
          style={{ color: "#2E6BAD" }}
        >
          export your connections from LinkedIn
        </a>{" "}
        and upload the Connections.csv here.
      </p>

      {!linkedinUrl && (
        <div className="rounded-lg p-3" style={{ background: "rgba(232,192,38,0.1)", color: "#92400e" }}>
          <p className="text-sm">
            <span className="font-semibold">Tip:</span> add your own LinkedIn URL on your profile so other users can see when you&apos;re directly connected.
          </p>
        </div>
      )}

      {/* Import */}
      <div className="rounded-lg border border-dashed border-gray-300 p-4 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <Upload className="h-5 w-5 text-gray-400" />
          <div>
            <p className="text-sm font-semibold text-gray-900">Import Connections.csv</p>
            <p className="text-xs text-gray-500">Direct from LinkedIn data export</p>
          </div>
        </div>
        <label className="cursor-pointer">
          <input type="file" accept=".csv" onChange={onImport} className="hidden" disabled={importing} />
          <span className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:border-gray-300">
            {importing ? "Importing..." : "Choose file"}
          </span>
        </label>
      </div>

      {/* Manual add */}
      <div className="grid md:grid-cols-[1fr_1fr_auto] gap-2 items-end">
        <div>
          <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">LinkedIn URL</label>
          <input className={input + " mt-1"} value={addUrl} onChange={(e) => setAddUrl(e.target.value)} placeholder="https://linkedin.com/in/..." />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Name (optional)</label>
          <input className={input + " mt-1"} value={addName} onChange={(e) => setAddName(e.target.value)} placeholder="Jane Doe" />
        </div>
        <Button onClick={onAdd} disabled={adding || !addUrl.trim()} className="gap-1 h-10">
          <Plus className="h-4 w-4" />
          {adding ? "Adding..." : "Add"}
        </Button>
      </div>

      {/* List */}
      {list.length > 0 ? (
        <div>
          <p className="text-xs text-gray-500 mb-2">
            {list.length} connection{list.length === 1 ? "" : "s"}
          </p>
          <div className="max-h-96 overflow-y-auto divide-y divide-gray-100 rounded-lg border border-gray-200">
            {list.map((c) => (
              <div key={c.id} className="flex items-center justify-between gap-3 p-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 shrink-0">
                    <Link2 className="h-4 w-4 text-gray-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{c.full_name || c.linkedin_url}</p>
                    {c.full_name && (
                      <p className="text-xs text-gray-500 truncate">{c.linkedin_url}</p>
                    )}
                  </div>
                </div>
                <button onClick={() => onRemove(c.id)} className="text-gray-400 hover:text-red-600 shrink-0">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-sm text-gray-500 text-center py-4">No connections yet — import from LinkedIn or add manually above.</p>
      )}
    </div>
  );
}
