//
// Script de Remplacement de Couleurs FiveM - RSK-UHQ
// Version universelle
//
// Ce script permet de rechercher et remplacer des couleurs dans les fichiers
// de ressources FiveM (.js, .css, .lua, .json, .html, .xml, .yml, .yaml).
//
// Il supporte la recherche par noms de couleurs (ex: "pink", "purple"),
// par codes hexadécimaux (ex: "#FF0000", "#F00"), et par formats RGBA/RGB
// (ex: "{255, 0, 0, 255}", "rgba(255, 0, 0, 1)").
//
// Les fichiers modifiés sont sauvegardés dans un dossier séparé "result-uhq_modified_resources".
//
// Copyright (c) 2025 RSK-UHQ. Tous droits réservés.
//

const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');
const chalk = require('chalk');

// --- Color conversion utilities (simple for this example) ---
// Note: For very precise detection of specific colors like "pink" or "orange" in RGBA/Hex format,
// a more robust color library or very fine heuristics would be needed.
// Here, we perform a basic conversion for names and hex to RGB.

function hexToRgb(hex) {
    let r = 0, g = 0, b = 0;
    // Handle 3-digit hex
    if (hex.length === 4) {
        r = parseInt(hex[1] + hex[1], 16);
        g = parseInt(hex[2] + hex[2], 16);
        b = parseInt(hex[3] + hex[3], 16);
    }
    // Handle 6-digit hex
    else if (hex.length === 7) {
        r = parseInt(hex.substring(1, 3), 16);
        g = parseInt(hex.substring(3, 5), 16);
        b = parseInt(hex.substring(5, 7), 16);
    }
    return { r, g, b };
}

// Map of some common color names to their RGB values
const namedColorsRgb = {
    'red': { r: 255, g: 0, b: 0 },
    'green': { r: 0, g: 128, b: 0 },
    'blue': { r: 0, g: 0, b: 255 },
    'purple': { r: 128, g: 0, b: 128 },
    'violet': { r: 238, g: 130, b: 238 },
    'pink': { r: 255, g: 192, b: 203 },
    'rose': { r: 255, g: 0, b: 127 }, // A specific type of pink
    'magenta': { r: 255, g: 0, b: 255 },
    'cyan': { r: 0, g: 255, b: 255 },
    'yellow': { r: 255, g: 255, b: 0 },
    'black': { r: 0, g: 0, b: 0 },
    'white': { r: 255, g: 255, b: 255 },
    'orange': { r: 255, g: 165, b: 0 },
    'gray': { r: 128, g: 128, b: 128 }
};

/**
 * Attempts to convert a color (name, hex) into an RGB object.
 * @param {string} colorStr - The color string (e.g., 'red', '#FF0000').
 * @returns {Object|null} {r, g, b} or null if not recognized.
 */
function parseColorToRgb(colorStr) {
    colorStr = colorStr.toLowerCase();
    if (colorStr.startsWith('#')) {
        return hexToRgb(colorStr);
    }
    if (namedColorsRgb[colorStr]) {
        return namedColorsRgb[colorStr];
    }
    // Simplification: does not handle RGBA conversion from user input
    // We assume the user will enter a name or hex for the target color.
    return null;
}

// --- Regular expressions for detection (global as used for lastIndex) ---
const hexRegex = /#(?:[0-9a-fA-F]{3}){1,2}\b/g;
// namedRegex will be created dynamically
const luaRgbaRegex = /\{\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\}/g;
const cssRgbRegex = /rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*([\d.]+)\s*)?\)/g;

/**
 * Detects occurrences of target colors in a line of text.
 * @param {string} content - The full content of the file.
 * @param {Object} targetRgb - The target RGB object {r,g,b}.
 * @param {Array<string>} targetNames - The target color names (e.g., ['pink', 'rose']).
 * @returns {Array<Object>} A list of detections, with the line, line number, and found colors.
 */
function detectColors(content, targetRgb, targetNames) {
  const lines = content.split('\n');
  const detections = [];
  const dynamicNamedRegex = new RegExp(`\\b(${targetNames.join('|')})\\b`, 'gi');

  lines.forEach((ln, i) => {
    const foundColors = new Set(); // Use a Set to avoid duplicate colors on the same line

    // Reset regex for each line as they maintain internal state (lastIndex)
    hexRegex.lastIndex = 0;
    dynamicNamedRegex.lastIndex = 0;
    luaRgbaRegex.lastIndex = 0;
    cssRgbRegex.lastIndex = 0;

    let match;

    // Hexadecimal detection
    while ((match = hexRegex.exec(ln)) !== null) {
      const hex = match[0];
      let { r, g, b } = hexToRgb(hex);

      // Comparison with target color (with a small tolerance)
      if (Math.abs(r - targetRgb.r) < 50 &&
          Math.abs(g - targetRgb.g) < 50 &&
          Math.abs(b - targetRgb.b) < 50) { // Tolerance of 50 for detection
         foundColors.add(hex);
      }
    }

    // Color name detection
    while ((match = dynamicNamedRegex.exec(ln)) !== null) {
      foundColors.add(match[0]);
    }

    // RGBA/RGB detection (Lua-style)
    while ((match = luaRgbaRegex.exec(ln)) !== null) {
      const [full, rStr, gStr, bStr, aStr] = match;
      const r = parseInt(rStr), g = parseInt(gStr), b = parseInt(bStr);

      if (Math.abs(r - targetRgb.r) < 50 &&
          Math.abs(g - targetRgb.g) < 50 &&
          Math.abs(b - targetRgb.b) < 50) {
        foundColors.add(full);
      }
    }

    // RGBA/RGB detection (CSS-style)
    while ((match = cssRgbRegex.exec(ln)) !== null) {
        const [full, rStr, gStr, bStr, aStr] = match;
        const r = parseInt(rStr), g = parseInt(gStr), b = parseInt(bStr);

        if (Math.abs(r - targetRgb.r) < 50 &&
            Math.abs(g - targetRgb.g) < 50 &&
            Math.abs(b - targetRgb.b) < 50) {
            foundColors.add(full);
        }
    }

    if (foundColors.size > 0) {
      detections.push({ line: ln, number: i + 1, found: Array.from(foundColors) });
    }
  });
  return detections;
}

/**
 * Converts a found color to the replacement color, preserving the original format.
 * @param {string} foundColor - The original color string (hex, name, rgba).
 * @param {Object} replacementRgb - The RGB object of the replacement color {r,g,b}.
 * @param {string} replacementHex - The replacement color in hex format.
 * @param {string} replacementName - The replacement color as a name.
 * @returns {string} The replacement color in the same format as foundColor.
 */
function convertToTargetColorFormat(foundColor, replacementRgb, replacementHex, replacementName) {
  const lowerFoundColor = foundColor.toLowerCase();

  // If it's a color name
  // We compare with the list of names recognized by the script or by the user
  // If it's a color name that we targeted for the search, we replace it with the replacement color name
  if (Object.keys(namedColorsRgb).includes(lowerFoundColor) || targetColorNames.includes(lowerFoundColor)) { // targetColorNames is defined below
    return replacementName;
  }
  // If it's a hexadecimal code
  if (foundColor.startsWith('#')) {
    return replacementHex;
  }
  // If it's a Lua-style RGBA format
  let match = foundColor.match(/\{\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\}/);
  if (match) {
    const alpha = match[4] ? parseInt(match[4]) : 255;
    return `{${replacementRgb.r}, ${replacementRgb.g}, ${replacementRgb.b}, ${alpha}}`;
  }
  // If it's a CSS-style RGB/RGBA format
  match = foundColor.match(/rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*([\d.]+)\s*)?\)/);
  if (match) {
      const alpha = match[4];
      if (alpha !== undefined) {
          return `rgba(${replacementRgb.r}, ${replacementRgb.g}, ${replacementRgb.b}, ${alpha})`;
      } else {
          return `rgb(${replacementRgb.r}, ${replacementRgb.g}, ${replacementRgb.b})`;
      }
  }

  return foundColor; // Return original if format is not recognized
}


/**
 * Highlights found colors in a line for console display.
 * @param {string} line - The text line.
 * @param {Array<string>} colorsToHighlight - Colors to highlight.
 * @returns {string} The line with highlighted colors.
 */
function highlight(line, colorsToHighlight) {
  let output = line;
  colorsToHighlight.forEach(c => {
    // Escape special characters in the color for the regex
    const escapedColor = c.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    let regex;
    // No strict word boundaries here as target names can vary.
    // We use the `targetColorNames` list to determine if it's a name.
    if (targetColorNames.includes(c.toLowerCase())) { // targetColorNames is defined below
        regex = new RegExp(`\\b${escapedColor}\\b`, 'gi');
    } else {
        regex = new RegExp(escapedColor, 'gi');
    }
    // Replace the color with its chalked version (magenta background, white text, bold)
    output = output.replace(regex, chalk.bgMagenta.white.bold(c));
  });
  return output;
}

/**
 * Processes a single file: detects colors, offers replacement options, and saves.
 * @param {string} filePath - Absolute path to the file to process.
 * @param {string} content - File content.
 * @param {string} baseDir - Original base directory scanned (for calculating relative path).
 * @param {string} outputDir - Directory where modified files will be saved.
 * @param {Object} targetRgb - The target RGB object {r,g,b}.
 * @param {Array<string>} targetNames - The target color names.
 * @param {Object} replacementRgb - The RGB object of the replacement color {r,g,b}.
 * @param {string} replacementHex - The replacement color in hex.
 * @param {string} replacementName - The replacement color as a name.
 */
async function processFile(filePath, content, baseDir, outputDir, targetRgb, targetNames, replacementRgb, replacementHex, replacementName) {
  const detections = detectColors(content, targetRgb, targetNames);

  if (!detections.length) {
    return; // No target colors detected, move to the next file
  }

  console.log(chalk.yellow(`\n--- File detected: ${path.relative(baseDir, filePath)} ---`));

  // Display detections with highlighting
  detections.forEach(d =>
    console.log(chalk.gray(`  L${String(d.number).padStart(4, ' ')}: `) + highlight(d.line, d.found))
  );

  const { action } = await inquirer.prompt({
    type: 'list',
    name: 'action',
    message: 'What do you want to do with this file?',
    choices: [
      { name: '🔄 Automatically replace all target colors with the replacement color (format preserved)', value: 'auto' },
      { name: '🎨 Manually replace each unique target color (you choose for each color)', value: 'manual_map' },
      { name: '✏️ Replace line by line (you confirm each replacement on its line)', value: 'manual_line' },
      { name: '⏭️ Skip this file', value: 'skip' },
    ]
  });

  if (action === 'skip') {
    console.log(chalk.blue(`  Skipped: ${path.basename(filePath)}`));
    return;
  }

  let colorMap = {}; // Map: original_color -> replacement_color

  if (action === 'auto') {
    // Get all unique colors found in the file
    const uniqueColors = new Set(detections.flatMap(d => d.found));
    uniqueColors.forEach(color => {
      colorMap[color] = convertToTargetColorFormat(color, replacementRgb, replacementHex, replacementName);
    });
    console.log(chalk.green(`  Auto mode: ${Object.keys(colorMap).length} colors will be replaced.`));

  } else if (action === 'manual_map') {
    const uniqueColors = new Set(detections.flatMap(d => d.found));
    console.log(chalk.cyan('\n--- Manual replacement of unique detected colors ---'));
    for (const color of uniqueColors) {
      const defaultReplacement = convertToTargetColorFormat(color, replacementRgb, replacementHex, replacementName);
      const { newColor } = await inquirer.prompt({
        type: 'input',
        name: 'newColor',
        message: `Replace ${chalk.bgMagenta.white.bold(color)} with (empty=skip, ${defaultReplacement} for auto-replace):`,
        default: defaultReplacement
      });
      if (newColor) {
        colorMap[color] = newColor;
      }
    }
  } else if (action === 'manual_line') {
    console.log(chalk.cyan('\n--- Line by line replacement ---'));
    for (const detection of detections) {
      console.log(chalk.gray(`  L${String(detection.number).padStart(4, ' ')}: `) + highlight(detection.line, detection.found));
      for (const color of detection.found) {
        const defaultReplacement = convertToTargetColorFormat(color, replacementRgb, replacementHex, replacementName);
        const { confirmReplace, customColor } = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'confirmReplace',
            message: `  Do you want to replace ${chalk.bgMagenta.white.bold(color)} (suggested: ${defaultReplacement})?`,
            default: true
          },
          {
            type: 'input',
            name: 'customColor',
            message: `  Enter the new color (empty for ${defaultReplacement}):`,
            when: (answers) => answers.confirmReplace
          }
        ]);
        if (confirmReplace) {
          colorMap[color] = customColor || defaultReplacement;
        }
      }
    }
  }

  let newContent = content;
  Object.entries(colorMap).forEach(([originalColor, replacementColor]) => {
    // Escape special characters for regex creation
    const escapedOriginalColor = originalColor.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    let regex;

    // Handle word boundaries for color names
    // We use `targetColorNames` here for color names that were *initially* targeted.
    if (targetColorNames.includes(originalColor.toLowerCase())) {
        regex = new RegExp(`\\b${escapedOriginalColor}\\b`, 'gi');
    } else if (originalColor.startsWith('{') && originalColor.endsWith('}')) {
        regex = new RegExp(escapedOriginalColor.replace(/\\s\*/g, '\\s*'), 'gi');
    }
    else if (originalColor.startsWith('rgb') || originalColor.startsWith('rgba')) {
        regex = new RegExp(escapedOriginalColor.replace(/\\s\*/g, '\\s*').replace(/\\\(/g, '\\(').replace(/\\\)/g, '\\)'), 'gi');
    }
    else {
        regex = new RegExp(escapedColor, 'gi');
    }

    newContent = newContent.replace(regex, replacementColor);
  });

  // Save the modified file to the output folder
  const relativePath = path.relative(baseDir, filePath);
  const outputPath = path.join(outputDir, relativePath);

  fs.mkdirSync(path.dirname(outputPath), { recursive: true }); // Ensure output directory exists
  fs.writeFileSync(outputPath, newContent, 'utf8');
  console.log(chalk.green(`  ✅ Modified file saved to: ${chalk.bold(outputPath)}`));
}

/**
 * Recursively scans a directory to find and process relevant files.
 * @param {string} currentDir - The directory currently being scanned.
 * @param {string} baseDir - The original base directory (for relative paths).
 * @param {string} outputDir - The output directory for modified files.
 * @param {Object} targetRgb - The target RGB object {r,g,b}.
 * @param {Array<string>} targetNames - The target color names.
 * @param {Object} replacementRgb - The RGB object of the replacement color {r,g,b}.
 * @param {string} replacementHex - The replacement color in hex.
 * @param {string} replacementName - The replacement color as a name.
 */
async function scanDirectory(currentDir, baseDir, outputDir, targetRgb, targetNames, replacementRgb, replacementHex, replacementName) {
  const entries = fs.readdirSync(currentDir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(currentDir, entry.name);

    if (entry.isDirectory()) {
      if (fullPath === outputDir) {
        console.log(chalk.gray(`  Ignored output directory: ${path.relative(baseDir, fullPath)}`));
        continue;
      }
      await scanDirectory(fullPath, baseDir, outputDir, targetRgb, targetNames, replacementRgb, replacementHex, replacementName);
    } else if (entry.isFile()) {
      if (/\.(js|css|lua|json|html|xml|yml|yaml)$/i.test(fullPath)) {
        try {
          const fileContent = fs.readFileSync(fullPath, 'utf8');
          await processFile(fullPath, fileContent, baseDir, outputDir, targetRgb, targetNames, replacementRgb, replacementHex, replacementName);
        } catch (error) {
          console.error(chalk.red(`  ❌ Error reading/processing file ${fullPath}: ${error.message}`));
        }
      }
    }
  }
}

// --- Global variables for target and replacement colors ---
let targetColorNames = []; // Names of colors to target (e.g., ['pink', 'rose'])

// --- Main execution function ---
(async () => {
  console.clear();
  console.log(chalk.magenta.bold(`
                                       ##     ###                        ###                          ##                 ###
                    ##                 ##      ##                         ##                          ##                  ##
 ######    #####    ##  ##            #####    ##       ####              ##       ####     #####    #####                ##    ####    ##  ##
  ##  ##  ##        ## ##              ##      #####   ##  ##             #####   ##  ##   ##         ##               #####   ##  ##   ##  ##
  ##       #####    ####               ##      ##  ##  ######             ##  ##  ######    #####     ##              ##  ##   ######   ##  ##
  ##           ##   ## ##              ## ##   ##  ##  ##                 ##  ##  ##            ##    ## ##           ##  ##   ##        ####
 ####     ######    ##  ##              ###   ###  ##   #####            ######    #####   ######      ###             ######   #####     ##


`));
  console.log(chalk.magenta.bold('         Universal FiveM Color Replacement Script\n'));
  console.log(chalk.cyan('Welcome! This script will help you transform any color into another within your FiveM resources.'));
  console.log(chalk.yellow('Modified files will be saved in a new folder "result-uhq" next to your scanned folder.'));
  console.log(chalk.red.bold('Remember to back up your resources before starting!'));

  // --- Ask user for colors ---
  const { searchColorInput } = await inquirer.prompt({
    type: 'input',
    name: 'searchColorInput',
    message: '🎨 Which color(s) do you want to search for? (e.g., "purple", "#800080", "pink,rose" - separated by commas):'
  });

  const { replaceColorInput } = await inquirer.prompt({
    type: 'input',
    name: 'replaceColorInput',
    message: '🌈 What color do you want to replace them with? (e.g., "red", "#FF0000", "green"):',
    default: 'red' // Default value
  });

  // --- Prepare colors for detection and replacement ---
  let targetRgb = null;
  let replacementRgb = null;
  let replacementHex = '#FF0000'; // Default to red hex
  let replacementName = 'red';   // Default to red name

  // Process replacement color first to get its format
  const parsedReplacement = parseColorToRgb(replaceColorInput);
  if (parsedReplacement) {
      replacementRgb = parsedReplacement;
      // Try to determine the preferred format for replacement if the user provided a hex
      if (replaceColorInput.startsWith('#')) {
          replacementHex = replaceColorInput;
          // Try to find a corresponding name if possible
          const foundName = Object.keys(namedColorsRgb).find(key => {
            const rgb = namedColorsRgb[key];
            return rgb.r === replacementRgb.r && rgb.g === replacementRgb.g && rgb.b === replacementRgb.b;
          });
          if (foundName) replacementName = foundName;
      } else {
          replacementName = replaceColorInput;
          // Try to find the corresponding hex if possible
          const foundHex = Object.keys(namedColorsRgb).find(key => key === replaceColorInput.toLowerCase());
          if (foundHex) replacementHex = `#${replacementRgb.r.toString(16).padStart(2, '0')}${replacementRgb.g.toString(16).padStart(2, '0')}${replacementRgb.b.toString(16).padStart(2, '0')}`;
      }
  } else {
      console.warn(chalk.yellow(`⚠️ Replacement color '${replaceColorInput}' was not recognized as a valid name or hex. Using '#FF0000' (red) by default.`));
      replacementRgb = { r: 255, g: 0, b: 0 };
  }


  // Process search colors
  const searchColorsArray = searchColorInput.split(',').map(s => s.trim().toLowerCase()).filter(s => s.length > 0);
  if (searchColorsArray.length === 0) {
      console.error(chalk.red(`\n❌ Error: No colors to search for were specified.`));
      return;
  }

  // For RGB/numeric-based detection, we'll use the first valid color for heuristics
  const firstSearchColorRgb = parseColorToRgb(searchColorsArray[0]);
  if (firstSearchColorRgb) {
      targetRgb = firstSearchColorRgb;
  } else {
      // If the first search color is neither a name nor a hex, we use a default color for RGBA/Hex heuristics
      console.warn(chalk.yellow(`⚠️ The first search color '${searchColorsArray[0]}' was not recognized as a valid name or hex for numeric detection. RGB/Hex based detection might be imprecise.`));
      // Fallback to a neutral color or purple if the search is empty.
      // In this case, we could pass null to detectColors and only do name-based detection.
      targetRgb = { r: 128, g: 0, b: 128 }; // Default to purple for heuristics
  }

  // Filter color names from search targets
  targetColorNames = searchColorsArray.filter(color => Object.keys(namedColorsRgb).includes(color) || !color.startsWith('#')); // Treat all non-hex as potential names


  const { targetDir } = await inquirer.prompt([
    {
      type: 'input',
      name: 'targetDir',
      message: '📁 Enter the full path to the "resources" folder to scan (e.g., C:/fxserver/resources):'
    }
  ]);

  const absoluteTargetDir = path.resolve(targetDir);

  if (!fs.existsSync(absoluteTargetDir) || !fs.statSync(absoluteTargetDir).isDirectory()) {
    console.error(chalk.red(`\n❌ Error: The path '${targetDir}' is not a valid folder or does not exist.`));
    return;
  }

  const outputBaseDir = path.dirname(absoluteTargetDir);
  const outputResultDir = path.join(outputBaseDir, 'result-uhq');
  const gitignorePath = path.join(outputResultDir, '.gitignore');

  if (!fs.existsSync(outputResultDir)) {
    fs.mkdirSync(outputResultDir, { recursive: true });
    fs.writeFileSync(gitignorePath, '*\n!.gitignore\n', 'utf8');
    console.log(chalk.italic.gray(`\n  Output folder created: ${outputResultDir}`));
    console.log(chalk.italic.gray(`  A .gitignore file has been added to '${outputResultDir}'.`));
  } else {
    console.log(chalk.italic.gray(`\n  Existing output folder: ${outputResultDir}`));
  }

  console.log(chalk.cyan(`\n🚀 Starting scan in: ${absoluteTargetDir}`));
  console.log(chalk.cyan(`Modified files will go to: ${outputResultDir}\n`));
  console.log(chalk.magenta(`Searching for: ${chalk.bold(searchColorInput)}`));
  console.log(chalk.magenta(`Replacing with: ${chalk.bold(replaceColorInput)}\n`));


  await scanDirectory(absoluteTargetDir, absoluteTargetDir, outputResultDir, targetRgb, targetColorNames, replacementRgb, replacementHex, replacementName);

  console.log(chalk.magenta('\n🎉 Mission accomplished! All detections have been processed.'));
  console.log(chalk.green(`Modified resources are located in: ${chalk.bold(outputResultDir)}`));
  console.log(chalk.yellow('Carefully check the modified files before using them on your server.'));
})();