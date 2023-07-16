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

import { BrowserWindow, ipcMain, screen } from "electron";
import { activeWindow } from ".."

import * as path from "path";
import { Point, mouse } from "@nut-tree/nut-js";

type Position = {x: number, y: number};
type Bounds = {top: number, left: number, right: number, bottom: number};

const buffer: number = 25; // area around edge of screen
const cursor: number = 15; // cursor bounds

export const launch: () => void = async () => {
    const wA = screen.getPrimaryDisplay().workAreaSize;
    const bounds: Bounds = {
        top: buffer,
        left: buffer,
        right: wA.width - buffer,
        bottom: wA.height - buffer
    };

    const window: BrowserWindow = activeWindow(new BrowserWindow({
        title: "Mobile Board",
        show: false,

        width: 0,
        height: 0,

        resizable: false,
        minimizable: false,
        maximizable: false,
        fullscreenable: false,

        frame: false,
        hasShadow: false,
        titleBarStyle: "hidden",

        alwaysOnTop: true,
        focusable: false,
        skipTaskbar: true,

        webPreferences: {
            devTools: false,
            preload: path.join(__dirname, "../", "interface.js")
        }
    }));

    window.loadFile(path.join(__dirname, "index.html"));

    window.removeMenu();

    window.once("ready-to-show", () => {
        setInterval(() => adjustPosition(bounds, window), 50);
    });

    ipcMain.on("app:size", (event: Electron.IpcMainEvent, ...args: any[]) => {
        const res: {h: number, w: number} = args[0] || {h: 0, w: 0};

        // NOT FIXED SINCE 2019! https://github.com/electron/electron/issues/15560
        // https://github.com/electron/electron/issues/15560#issuecomment-451395078
        window.setMinimumSize(res.w, res.h);
        window.setSize(res.w, res.h, false);
        adjustPosition(bounds, window);
    });
}

const adjustPosition: (bounds: Bounds, window: BrowserWindow) => void = (bounds: Bounds, window: BrowserWindow) => {
    if(!window.isDestroyed() && window.isVisible())
        mouse
            .getPosition()
            .then((point: Point) => preferredPosition(point, bounds, window))
            .then((pos: Position) => {
                const p: number[] = window.getPosition();
                if(p[0] != pos.x || p[1] != pos.y)
                    window.setPosition(pos.x, pos.y, false);
            });
}

const preferredPosition: (pt: Point, bound: Bounds, window: BrowserWindow) => Position = (pt: Point, bound: Bounds, window: BrowserWindow) => {
    const res: number[] = window.getSize();

    const x: number = pt.x + cursor;
    const y: number = pt.y;
    const w: number = res[0] || 0;
    const h: number = res[1] || 0;

    const pos: Position = {x, y};

    if(x < bound.left)
        pos.x = bound.left;
    else if(x + w > bound.right)
        pos.x = Math.min(x - cursor, bound.right) - w;

    if(y < bound.top)
        pos.y = bound.top;
    else if(y + h > bound.bottom)
        pos.y = Math.min(y, bound.bottom) - h;

    return pos;
}

export const input: (v: string) => void = (v: string) => {
    const input: string = v;
    const window: BrowserWindow = activeWindow();
    window.webContents.send("app:input", input);

    if(input.length == 0)
        window.hide();
    else if(!window.isVisible())
        window.show();
}

export const submit: (v: string) => void = (v: string) => {
    const input: string = v;
}

export const key: (v: string) => void = (k: string) => {
    const key: string = k;
}