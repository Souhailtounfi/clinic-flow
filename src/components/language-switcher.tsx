import { Languages, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useI18n, languages, type Lang } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { lang, setLang, t } = useI18n();
  const current = languages.find((l) => l.code === lang) ?? languages[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size={compact ? "icon" : "sm"}
          className={cn("gap-2 rounded-full", compact ? "" : "px-3")}
          aria-label={t("header.language")}
        >
          <Languages className="h-4 w-4" />
          {!compact && (
            <span className="text-xs font-semibold uppercase tracking-wide">{current.code}</span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuLabel>{t("header.language")}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {languages.map((l) => (
          <DropdownMenuItem
            key={l.code}
            onClick={() => setLang(l.code as Lang)}
            className="flex items-center justify-between gap-2"
          >
            <span className="flex items-center gap-2">
              <span className="text-base leading-none">{l.flag}</span>
              <span className="text-sm">{l.native}</span>
            </span>
            {l.code === lang ? <Check className="h-3.5 w-3.5 text-primary" /> : null}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
