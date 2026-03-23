import type { Tool } from "./EditorLayout";

type ToolSidebarProps = {
  activeTool: Tool;
  onToolChange: (tool: Tool) => void;
};

const tools: { key: Tool; label: string; hint: string }[] = [
  { key: "place", label: "Place", hint: "Klick setzt Spawnpoints" },
  { key: "generate", label: "Generate", hint: "Setzt Generator-Zentrum" },
];

export default function ToolSidebar({
  activeTool,
  onToolChange,
}: ToolSidebarProps) {
  return (
    <aside className="flex w-24 shrink-0 flex-col items-center border-r border-zinc-800 bg-zinc-950 py-4">
      <div className="mb-6 text-center">
        <div className="text-lg font-bold text-white">SMZ</div>
        <div className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">
          Tools
        </div>
      </div>

      <div className="flex w-full flex-1 flex-col gap-3 px-2">
        {tools.map((tool) => {
          const isActive = activeTool === tool.key;

          return (
            <button
              key={tool.key}
              onClick={() => onToolChange(tool.key)}
              className={`rounded-2xl border px-2 py-3 text-left transition ${
                isActive
                  ? "border-blue-500 bg-blue-600/15 text-white"
                  : "border-zinc-800 bg-zinc-900 text-zinc-300 hover:bg-zinc-800"
              }`}
            >
              <div className="text-sm font-semibold">{tool.label}</div>
              <div className="mt-1 text-[10px] leading-tight text-zinc-500">
                {tool.hint}
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
}