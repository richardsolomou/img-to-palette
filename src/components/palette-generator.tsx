import { ResultsView } from "~/components/results-view";
import { UploadZone } from "~/components/upload-zone";
import { usePaletteGenerator } from "~/hooks/use-palette-generator";

export function PaletteGenerator() {
  const { processing, processedPalettes, processFiles, clearAll } =
    usePaletteGenerator();

  const showResults = processedPalettes.length > 0;

  return (
    <div className="w-full">
      {!!showResults && !!processedPalettes[0] ? (
        <ResultsView
          onProcessMore={clearAll}
          processedPalette={processedPalettes[0]}
        />
      ) : (
        <UploadZone onDrop={processFiles} processing={processing} />
      )}
    </div>
  );
}
