/**
 * Unicode Character Maps for LinkedIn Formatting
 */

const MAPS = {
  bold_serif: {
    upper: 0x1D400, // 𝐀
    lower: 0x1D41A, // 𝐚
    digits: 0x1D7CE, // 𝟎
  },
  bold_sans: {
    upper: 0x1D5EE, // 𝗔
    lower: 0x1D608, // 𝗮
    digits: 0x1D7EC, // 𝟬
  },
  italic_serif: {
    upper: 0x1D434, // 𝐴
    lower: 0x1D44E, // 𝑎
  },
  bold_italic_serif: {
    upper: 0x1D468, // 𝑨
    lower: 0x1D482, // 𝒂
  },
  monospace: {
    upper: 0x1D670, // 𝙰
    lower: 0x1D68A, // 𝚊
    digits: 0x1D7F6, // 𝟶
  },
  script: {
    upper: 0x1D49C, // 𝒜
    lower: 0x1D4B6, // 𝒶
  },
  italic_sans: {
    upper: 0x1D622, // 𝘈
    lower: 0x1D63C, // 𝘢
  }
};

const DIVIDER = "━━━━━━━━━━━━━━━━━━━━━━━━";

const BULLETS = {
  classic: "•",
  arrow: "➜",
  check: "✅",
  star: "⭐",
  diamond: "🔹",
  dot: "‣"
};

const NUMBERS = {
  circled: ["①", "②", "③", "④", "⑤", "⑥", "⑦", "⑧", "⑨", "⑩"],
  filled: ["❶", "❷", "❸", "❹", "❺", "❻", "❼", "❽", "❾", "❿"],
};

export type FormatType = keyof typeof MAPS | "bullet" | "number" | "spacer" | "divider";

/**
 * Transforms a string into its Unicode counterpart
 */
export function transformToUnicode(text: string, type: FormatType, subType?: string): string {
  if (type === "spacer") {
    // Replace empty lines with Unicode Braille Blank to prevent collapse
    return text.split("\n").map(line => line.trim() === "" ? "\u2800" : line).join("\n");
  }

  if (type === "divider") {
    return text + (text ? "\n" : "") + DIVIDER + "\n";
  }

  if (type === "bullet" && subType) {
    const bullet = BULLETS[subType as keyof typeof BULLETS] || BULLETS.classic;
    return text.split("\n").map(line => line.trim() ? `${bullet} ${line}` : line).join("\n");
  }

  if (type === "number" && subType) {
    const numSet = NUMBERS[subType as keyof typeof NUMBERS] || NUMBERS.circled;
    return text.split("\n").map((line, i) => {
      if (!line.trim()) return line;
      const num = numSet[i] || `${i + 1}.`;
      return `${num} ${line}`;
    }).join("\n");
  }

  const map = MAPS[type as keyof typeof MAPS] as { upper: number, lower: number, digits?: number } | undefined;
  if (!map) return text;

  return text.split("").map(char => {
    const code = char.charCodeAt(0);
    
    // Uppercase A-Z
    if (code >= 65 && code <= 90) {
      const offset = code - 65;
      
      // Script exceptions
      if (type === "script") {
        const scriptUpperExceptions: Record<number, string> = {
          66: "\u212C", // B
          69: "\u2130", // E
          70: "\u2131", // F
          72: "\u210B", // H
          73: "\u2110", // I
          76: "\u2112", // L
          77: "\u2133", // M
          82: "\u211B", // R
        };
        if (scriptUpperExceptions[code]) return scriptUpperExceptions[code];
      }
      
      return String.fromCodePoint(map.upper + offset);
    }

    // Lowercase a-z
    if (code >= 97 && code <= 122) {
      const offset = code - 97;

      // Italic Serif exceptions
      if (type === "italic_serif" && code === 104) {
        return "\u210E"; // h
      }

      // Script exceptions
      if (type === "script") {
        const scriptLowerExceptions: Record<number, string> = {
          101: "\u212F", // e
          103: "\u210A", // g
          111: "\u2134", // o
        };
        if (scriptLowerExceptions[code]) return scriptLowerExceptions[code];
      }

      return String.fromCodePoint(map.lower + offset);
    }

    // Digits 0-9
    if (code >= 48 && code <= 57 && map.digits !== undefined) {
      return String.fromCodePoint(map.digits + (code - 48));
    }
    
    return char;
  }).join("");
}

/**
 * Applies smart formatting for LinkedIn
 */
export function smartFormat(text: string): string {
  if (!text) return text;
  
  const lines = text.split("\n");
  
  // 1. Bold the first non-empty line (the hook)
  let foundHook = false;
  const formattedLines = lines.map(line => {
    if (!foundHook && line.trim()) {
      foundHook = true;
      return transformToUnicode(line, "bold_serif");
    }
    
    // 2. Add spacers to empty lines
    if (line.trim() === "") {
      return "\u2800";
    }
    
    return line;
  });

  return formattedLines.join("\n");
}

/**
 * Strips formatting and invisible characters
 */
export function stripFormatting(text: string): string {
  return text.replace(/\u2800/g, "");
}

export const FORMAT_OPTIONS = {
  BULLETS,
  NUMBERS,
  MAPS: Object.keys(MAPS)
};
