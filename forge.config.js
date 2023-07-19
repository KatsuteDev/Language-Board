/*
 * Copyright (C) 2023 Katsute <https://github.com/Katsute>
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along
 * with this program; if not, write to the Free Software Foundation, Inc.,
 * 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
 */

const path = require("path");

module.exports = {
    packagerConfig: {
        name: "Language Board",
        icon: "assets/icon.ico",
        appCopyright: "Copyright © Katsute 2023",
        ignore: [
            "^/\\.devcontainer$",
            "^/\\.github$",
            "^/src$",
            "^/\\.gitignore$",
            "^/\\w*\\.(js|png|gif)$",
            "^/tsconfig.json$"
        ]
    },
    makers: [
        {
            name: "@electron-forge/maker-squirrel",
            config: {
                name: "Language-Board",
                copyright: "Copyright © Katsute 2023",
                iconUrl: "https://raw.githubusercontent.com/KatsuteDev/Language-Board/main/assets/icon.ico",
                loadingGif: "assets/setup.gif",
                setupExe: "Language Board Setup.exe",
                setupIcon: "assets/icon.ico",
                skipUpdateIcon: true
            }
        },
        {
            name: "@electron-forge/maker-wix",
            config: {
                name: "Language Board",
                manufacturer: "Katsute",
                icon: "assets/icon.ico",
                ui: {
                    chooseDirectory: true,
                    images: {
                        background: path.join(__dirname, "assets", "installer-background.png"),
                        banner: path.join(__dirname, "assets", "installer-banner.png")
                    }
                }
            }
        },
        {
            name: "@electron-forge/maker-zip"
        }
    ]
}