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

import { BrowserWindow, ipcMain } from "electron";
import { activeWindow } from ".."

import * as path from "path";

let width: number = 200;
let height: number = 200;

export const launch: () => void = async () => {
    const window: BrowserWindow = activeWindow(new BrowserWindow({
        title: "Mobile Board Pairing",
        show: false,

        width,
        height,

        resizable: false,
        maximizable: false,

        fullscreenable: false,
        webPreferences: {
            preload: path.join(__dirname, "../", "interface.js")
        }
    }));

    window.loadFile(path.join(__dirname, "index.html"));

    window.once("ready-to-show", () => {
        window.show();
    });

    ipcMain.on("app:input", (event: Electron.IpcMainEvent, ...args: any[]) => {

    });

    ipcMain.on("app:submit", (event: Electron.IpcMainEvent, ...args: any[]) => {

    });
}