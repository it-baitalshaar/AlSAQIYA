import tile1 from "@/assets/tiles/tile.png";
import tile2 from "@/assets/tiles/tile-2.png";
import tile3 from "@/assets/tiles/tile-3.png";
import tile4 from "@/assets/tiles/tile-4.png";
import tile5 from "@/assets/tiles/tile-5.png";
import tile6 from "@/assets/tiles/tile-6.png";
import tile7 from "@/assets/tiles/tile-7.png";
import tile8 from "@/assets/tiles/tile-8.png";

export const catalogImages = {
  tile1,
  tile2,
  tile3,
  tile4,
  tile5,
  tile6,
  tile7,
  tile8,
} as const;

const byFilename: Record<string, string> = {
  "tile.png": tile1,
  "tile-2.png": tile2,
  "tile-3.png": tile3,
  "tile-4.png": tile4,
  "tile-5.png": tile5,
  "tile-6.png": tile6,
  "tile-7.png": tile7,
  "tile-8.png": tile8,
};

/** Map leftover Lovable CDN / stale public paths onto bundled tile photos. */
export function localizeImageUrl(url: string) {
  const file = url.match(/\/(tile(?:-\d+)?\.png)(?:\?.*)?$/i)?.[1];
  if (file && byFilename[file]) return byFilename[file];
  return url;
}
