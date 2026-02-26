const DIGIPIN_GRID = [
  ["F", "C", "9", "8"],
  ["J", "3", "2", "7"],
  ["K", "4", "5", "6"],
  ["L", "M", "P", "T"],
];

const BOUNDS = {
  MIN_LAT: 2.5,
  MAX_LAT: 38.5,
  MIN_LON: 63.5,
  MAX_LON: 99.5,
};

export function generateDigipin(lat: number, lon: number): string {
  if (lat < BOUNDS.MIN_LAT || lat > BOUNDS.MAX_LAT) {
    throw new Error(
      "Latitude out of range. Must be between 2.5 and 38.5 degrees north."
    );
  }
  if (lon < BOUNDS.MIN_LON || lon > BOUNDS.MAX_LON) {
    throw new Error(
      "Longitude out of range. Must be between 63.5 and 99.5 degrees east."
    );
  }

  let digipin = "";
  let minLat = BOUNDS.MIN_LAT;
  let maxLat = BOUNDS.MAX_LAT;
  let minLon = BOUNDS.MIN_LON;
  let maxLon = BOUNDS.MAX_LON;

  const latDivBy = 4;
  const lonDivBy = 4;

  for (let level = 1; level <= 10; level++) {
    const latDivDeg = (maxLat - minLat) / latDivBy;
    const lonDivDeg = (maxLon - minLon) / lonDivBy;

    let row = 0;
    let nextLvlMaxLat = maxLat;
    let nextLvlMinLat = maxLat - latDivDeg;

    for (let x = 0; x < latDivBy; x++) {
      if (lat >= nextLvlMinLat && lat < nextLvlMaxLat) {
        row = x;
        break;
      } else {
        nextLvlMaxLat = nextLvlMinLat;
        nextLvlMinLat = nextLvlMaxLat - latDivDeg;
      }
    }

    let column = 0;
    let nextLvlMinLon = minLon;
    let nextLvlMaxLon = minLon + lonDivDeg;

    for (let x = 0; x < lonDivBy; x++) {
      if (lon >= nextLvlMinLon && lon < nextLvlMaxLon) {
        column = x;
        break;
      } else if (nextLvlMinLon + lonDivDeg < maxLon) {
        nextLvlMinLon = nextLvlMaxLon;
        nextLvlMaxLon = nextLvlMinLon + lonDivDeg;
      } else {
        column = x;
      }
    }

    digipin += DIGIPIN_GRID[row][column];

    minLat = nextLvlMinLat;
    maxLat = nextLvlMaxLat;
    minLon = nextLvlMinLon;
    maxLon = nextLvlMaxLon;
  }

  return digipin;
}

export function digipinToCoordinates(digipin: string): {
  lat: number;
  lon: number;
} {
  const cleanDigipin = digipin.replace(/-/g, "");

  if (cleanDigipin.length !== 10) {
    throw new Error("Invalid DIGIPIN. Must be 10 characters long.");
  }

  let minLat = BOUNDS.MIN_LAT;
  let maxLat = BOUNDS.MAX_LAT;
  let minLon = BOUNDS.MIN_LON;
  let maxLon = BOUNDS.MAX_LON;

  const latDivBy = 4;
  const lonDivBy = 4;

  for (let level = 0; level < 10; level++) {
    const digipinChar = cleanDigipin.charAt(level);
    const latDivVal = (maxLat - minLat) / latDivBy;
    const lonDivVal = (maxLon - minLon) / lonDivBy;

    let row = -1;
    let col = -1;
    let found = false;

    for (let r = 0; r < latDivBy && !found; r++) {
      for (let c = 0; c < lonDivBy && !found; c++) {
        if (DIGIPIN_GRID[r][c] === digipinChar) {
          row = r;
          col = c;
          found = true;
        }
      }
    }

    if (!found) {
      throw new Error(`Invalid DIGIPIN character: ${digipinChar}`);
    }

    const lat1 = maxLat - latDivVal * (row + 1);
    const lat2 = maxLat - latDivVal * row;
    const lon1 = minLon + lonDivVal * col;
    const lon2 = minLon + lonDivVal * (col + 1);

    minLat = lat1;
    maxLat = lat2;
    minLon = lon1;
    maxLon = lon2;
  }

  const centerLat = (maxLat + minLat) / 2;
  const centerLon = (maxLon + minLon) / 2;

  return {
    lat: centerLat,
    lon: centerLon,
  };
}

export function isValidDigipin(digipin: string): boolean {
  const cleanDigipin = digipin.replace(/-/g, "");

  if (cleanDigipin.length !== 10) {
    return false;
  }

  const validChars = new Set([
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "C",
    "F",
    "J",
    "K",
    "L",
    "M",
    "P",
    "T",
  ]);

  for (const char of cleanDigipin) {
    if (!validChars.has(char)) {
      return false;
    }
  }

  return true;
}

export function formatDigipin(digipin: string): string {
  const clean = digipin.replace(/-/g, "");
  if (clean.length !== 10) {
    return digipin;
  }
  return `${clean.substring(0, 3)}-${clean.substring(3, 6)}-${clean.substring(6, 10)}`;
}
