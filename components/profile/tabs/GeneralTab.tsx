"use client";

import { useApp } from "@/lib/store";
import { ICPS } from "@/lib/icps";
import { ACCENTS } from "@/lib/accents";
import { cn } from "@/lib/utils";
import { Section, Segmented, Swatch, ToggleRow } from "./parts";
import { ShortcutsManager } from "./ShortcutsManager";

export function GeneralTab() {
  const {
    theme,
    setTheme,
    resolvedTheme,
    darkStyle,
    setDarkStyle,
    effectiveAccent,
    accentOverrides,
    setAccentForIcp,
    icp,
    textScale,
    setTextScale,
    contrast,
    setContrast,
  } = useApp();

  const personaLabel = ICPS[icp].label;
  const hasOverride = accentOverrides[icp] != null;

  return (
    <div className="animate-fade-in">
      <Section
        title="Appearance"
        desc="Theme and accent color for how PersonaOn looks to you."
      >
        <div className="mb-5">
          <p className="mb-2 text-[12px] font-medium text-muted">Theme</p>
          <Segmented
            value={theme}
            onChange={setTheme}
            options={[
              { value: "light", label: "Light" },
              { value: "dark", label: "Dark" },
              { value: "system", label: "System" },
            ]}
          />
        </div>

        <div className="mb-5">
          <ToggleRow
            label="Deep black"
            desc={
              resolvedTheme === "dark"
                ? "Use a true-black background — easier on OLED screens."
                : "Use a true-black background in dark mode — easier on OLED screens."
            }
            on={darkStyle === "black"}
            onChange={(v) => setDarkStyle(v ? "black" : "slate")}
          />
        </div>

        <div>
          <p className="mb-2 text-[12px] font-medium text-muted">
            Accent for {personaLabel}
          </p>
          <div className="flex flex-wrap items-center gap-2.5">
            {ACCENTS.map((a) => (
              <Swatch
                key={a.key}
                hex={a.hex}
                label={a.label}
                selected={
                  effectiveAccent.toLowerCase() === a.hex.toLowerCase()
                }
                onClick={() => setAccentForIcp(a.hex)}
              />
            ))}
            <button
              onClick={() => setAccentForIcp(null)}
              className={cn(
                "ml-1 rounded-full border px-3 py-1.5 text-[12px] font-medium transition",
                !hasOverride
                  ? "border-accent text-accent"
                  : "border-line text-muted hover:text-ink-soft"
              )}
            >
              Match persona default
            </button>
          </div>
          <p className="mt-2 text-[12px] text-muted">
            Only changes the accent for your {personaLabel} persona — other
            personas keep their own.
          </p>
        </div>
      </Section>

      <Section
        title="Accessibility"
        desc="Make PersonaOn easier to read and navigate."
      >
        <div className="mb-5">
          <p className="mb-2 text-[12px] font-medium text-muted">Text size</p>
          <Segmented
            value={textScale}
            onChange={setTextScale}
            options={[
              { value: "comfortable", label: "Comfortable" },
              { value: "large", label: "Large" },
              { value: "larger", label: "Larger" },
            ]}
          />
        </div>

        <ToggleRow
          label="High contrast"
          desc="Stronger borders and text for better legibility."
          on={contrast === "high"}
          onChange={(v) => setContrast(v ? "high" : "normal")}
        />
      </Section>

      <Section
        title="Keyboard shortcuts"
        desc="Click a shortcut to record a new key. Conflicts are blocked."
      >
        <ShortcutsManager />
      </Section>
    </div>
  );
}
