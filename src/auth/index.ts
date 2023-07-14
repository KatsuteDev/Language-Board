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

import * as qrcode from "qrcode";
import { BrowserWindow } from "electron";

import * as os from "os";
import * as http from "http";
import * as path from "path";

import { activeWindow } from "..";
import { handler } from "./server";

http.globalAgent.maxSockets = 10;

const width: number = 275;
const height: number = 400;

let auth: string = "";

export const launch = async () => {
    const url: string = `http://${ip()}`;
    const qr: string = await qrcode.toDataURL(url);

    const window: BrowserWindow = activeWindow(new BrowserWindow({
        title: "Mobile Board Pairing",
        show: false,

        width,
        height,
        minWidth: width,
        minHeight: height,

        resizable: false,
        maximizable: false,

        fullscreenable: false,

        webPreferences: {
            nodeIntegration: true,
            contextIsolation: true,
            preload: path.join(__dirname, "../", "interface.js")
        }
    }));

    window.loadFile(path.join(__dirname, "index.html"));
    // window.removeMenu();
    window.once("ready-to-show", () => {
        window.show();
        window.webContents.send("init", {qr, url});
    });

    const server: http.Server = http.createServer(handler).listen(7272);
}

const ip: () => string = () => Object
    .values(os.networkInterfaces())
    .map(v => v!.filter((i: os.NetworkInterfaceInfo) => i.family === "IPv4" && !i.internal)[0])[0].address;

const chars: string = "abcdefghijklmnopqrstuvwxyz0123456789-_";

const code: (length: number) => string = (length: number) => {
    let result: string = "";
    for(let i = 0; i < length; i++)
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    return result;
}