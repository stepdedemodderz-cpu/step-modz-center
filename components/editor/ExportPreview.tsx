type ExportPreviewProps = {
  data: unknown;
  onExport: () => void;
};

export default function ExportPreview({
  data,
  onExport,
}: ExportPreviewProps) {
  const preview = JSON.stringify(data, null, 2);

  return (
    <div className="flex h-full flex-col p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-white">Export</h2>
        <button
          onClick={onExport}
          className="rounded-xl bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-500"
        >
          JSON exportieren
        </button>
      </div>

      <p className="mt-1 text-xs text-zinc-400">
        Vorschau der Exportdaten für die aktuelle Map.
      </p>

      <pre className="mt-4 min-h-0 flex-1 overflow-auto rounded-xl bg-zinc-950 p-3 text-xs leading-relaxed text-zinc-300">
        {preview}
      </pre>
    </div>
  );
}