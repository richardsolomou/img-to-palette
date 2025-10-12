import { Button } from "@ras-sh/ui";
import { Check, Copy } from "lucide-react";
import { useEffect, useState } from "react";
import { codeToHtml } from "shiki";

type ShikiCodeBlockProps = {
  code: string;
  language: string;
};

export function ShikiCodeBlock({ code, language }: ShikiCodeBlockProps) {
  const [html, setHtml] = useState<string>("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    codeToHtml(code, {
      lang: language,
      theme: "github-dark",
    }).then(setHtml);
  }, [code, language]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative">
      <Button
        className="absolute top-2 right-2 z-10"
        onClick={copyToClipboard}
        size="sm"
        variant="ghost"
      >
        {copied ? (
          <Check className="size-4 text-green-500" />
        ) : (
          <Copy className="size-4" />
        )}
      </Button>
      <div
        className="[&_pre]:!bg-zinc-950 overflow-x-auto rounded-lg border border-zinc-800 [&_pre]:p-4 [&_pre]:text-sm"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: Shiki generates safe HTML
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
