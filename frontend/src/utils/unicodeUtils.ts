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
      return String.fromCodePoint(map.upper + (code - 65));
    }
    // Lowercase a-z
    if (code >= 97 && code <= 122) {
      // Script and Italic maps have some gaps/weirdness in Unicode, but most work linearly
      return String.fromCodePoint(map.lower + (code - 97));
    }
    // Digits 0-9
    if (code >= 48 && code <= 57 && map.digits !== undefined) {
      return String.fromCodePoint(map.digits + (code - 48));
    }
    
    return char;
  }).join("");
}

/**
 * Strips formatting and invisible characters
 */
export function stripFormatting(text: string): string {
  // This is a simplified version; full un-mapping is complex
  // For now, we mainly remove the spacers
  return text.replace(/\u2800/g, "");
}

export const FORMAT_OPTIONS = {
  BULLETS,
  NUMBERS,
  MAPS: Object.keys(MAPS)
};
