<div align="center">
  <img src="https://i.imgur.com/your-awesome-banner.png" alt="RSK-UHQ FiveM Color Tools Banner" width="700"/>
  <h1>FiveM ColorTools // RSK-UHQ</h1>
  <p>A powerful and interactive tool to seamlessly transform colors within your FiveM resources.</p>
  <p>
    <a href="#features">Features</a> •
    <a href="#prerequisites">Prerequisites</a> •
    <a href="#installation">Installation</a> •
    <a href="#usage">Usage</a> •
    <a href="#supported-color-formats">Supported Formats</a> •
    <a href="#contribution">Contribution</a> •
    <a href="#license">License</a>
  </p>
</div>

---

## 🌟 Introduction

The **FiveM ColorTools** is a universal script designed to simplify the modification of colors within your FiveM resources. Whether you aim to harmonize your server's color palette, or simply replace a specific color with another, this intuitive and interactive tool is built for you!

It supports a wide range of file formats and color notations, offering maximum flexibility.

## ✨ Features

* **🔍 Intelligent Detection:** Identifies colors by names (e.g., `pink`, `purple`), hexadecimal codes (`#FF0000`, `#F00`), and RGBA/RGB formats (`{255, 0, 0, 255}`, `rgba(255, 0, 0, 1)`).
* **📂 Multi-file Support:** Scans and modifies `.js`, `.css`, `.lua`, `.json`, `.html`, `.xml`, `.yml`, `.yaml` files.
* **🤖 Multiple Replacement Modes:**
    * **Automatic:** Replaces all occurrences automatically, preserving the original format.
    * **Manual by Unique Color:** Allows you to choose a different replacement color for each unique detected color.
    * **Manual Line-by-Line:** Offers granular control by validating or modifying each replacement on its specific line.
* **💾 Secure Saving:** Modified files are saved to a separate `result-uhq` folder, preserving your original files.
* **🌈 Interactive Interface:** Utilizes `inquirer` for user-friendly prompts and `chalk` for colorful terminal output.

## 🚀 Prerequisites

Before you begin, ensure you have the following installed:

* [**Node.js**](https://nodejs.org/en/download/) (version 14.x or newer recommended)
* [**npm**](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) (usually included with Node.js)

## 📦 Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/RSK-uhq/FiveM-ColorTools.git](https://github.com/RSK-uhq/FiveM-ColorTools.git)
    cd FiveM-ColorTools
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

## 🎮 Usage

1.  **Launch the script:**
    ```bash
    npm start
    ```
    Or directly:
    ```bash
    node index.js
    ```

2.  **Follow the instructions** in the terminal:
    * Enter the color(s) you wish to search for (separated by commas).
    * Specify the color you want to replace them with.
    * Provide the full path to your FiveM `resources` folder to be scanned.

    The script will then guide you through each detected file, allowing you to choose the replacement mode.

3.  **Check your files:** Once the script completes, all modified files will be located in the `result-uhq` folder created next to your original `resources` folder. It is **HIGHLY RECOMMENDED** to review these files before deploying them to your server.

## 🎨 Supported Color Formats

The script is capable of detecting and replacing the following color formats:

* **HTML/CSS Color Names:** `red`, `blue`, `pink`, `purple`, `lime`, `orange`, `white`, `black`, etc.
* **Hexadecimal Codes:** `#FF0000` (6-digit), `#F00` (3-digit).
* **RGBA/RGB Formats (Lua/FiveM style):** `{255, 0, 0, 255}` (with or without alpha).
* **RGBA/RGB Formats (CSS style):** `rgb(255, 0, 0)`, `rgba(255, 0, 0, 0.5)`.

## 🤝 Contribution

Contributions are welcome! If you have ideas for improvements, bug reports, or features to add, feel free to open an issue or submit a pull request.

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for more details.

---

<div align="center">
  <h3>✨ RSK-UHQ - All rights reserved ✨</h3>
  <p>🔥 The script you need! 🔥</p>
</div>
