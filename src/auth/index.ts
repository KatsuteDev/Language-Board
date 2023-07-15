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
import { BrowserWindow, ipcMain } from "electron";

import * as os from "os";
import * as path from "path";

import { activeWindow } from "..";
import * as app from "../app";
import * as server from "../web";

const width: number = 275;
const height: number = 400;

const title: string = "Mobile Board Pairing";

const codes: {[ip: string]: string} = {};

export const launch: () => void = async () => {
    const url: string = `${ip()}:7272`;
    const qr: string = await qrcode.toDataURL(`http://${url}`, {margin: 0});

    const window: BrowserWindow = activeWindow(new BrowserWindow({
        title: "Mobile Board Pairing",
        show: false,

        width,
        height,

        resizable: false,
        minimizable: false,
        maximizable: false,
        fullscreenable: false,

        titleBarStyle: "hidden",

        webPreferences: {
            preload: path.join(__dirname, "../", "interface.js")
        }
    }));

    window.loadFile(path.join(__dirname, "index.html"));
    // window.removeMenu();
    window.once("ready-to-show", () => {
        window.webContents.send("auth:init", {title, qr, url});
        window.show();
    });

    ipcMain.on("auth:close", (event: Electron.IpcMainEvent, ...args: any[]) => {
        window.hide();
        window.destroy();
    });

    ipcMain.on("auth:code", (event: Electron.IpcMainEvent, ...args: any[]) => {
        const match: string = (args[0] || "").toUpperCase();
        let ip: string | undefined;

        for(const [k, v] of Object.entries(codes)){
            if(v === match){
                ip = k;
                break;
            }
        }

        if(ip){
            server.lock(ip);
            ipcMain.removeAllListeners("auth:init");
            ipcMain.removeAllListeners("auth:show");
            ipcMain.removeAllListeners("auth:code");
            app.launch();
        }
    });

    server.launch();
}

export const code: (ip: string) => string = (ip: string) => {
    if(codes[ip]) return codes[ip];

    const taken: string[] = Object.values(codes);

    let c: string;
    do c = generateCode(4);
    while(taken.includes(c));
    return codes[ip] = c;
}

const ip: () => string = () => Object
    .values(os.networkInterfaces())
    .map(v => v!.filter((i: os.NetworkInterfaceInfo) => i.family === "IPv4" && !i.internal)[0])[0].address;

const chars: string = "BCDFGHJKLMNPQRSTVWXZ2456789";

export const generateCode: (length: number) => string = (length: number) => {
    let result: string = "";
    for(let i = 0; i < length; i++)
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    return result;
}