import { MovieSubwayMap } from "@/components/movie-subway-map";
import { edges, lines, stations, transferNotes } from "@/data/movie-map";

export default function Home() {
  return (
    <main>
      <MovieSubwayMap
        edges={edges}
        lines={lines}
        stations={stations}
        transferNotes={transferNotes}
      />
    </main>
  );
}
