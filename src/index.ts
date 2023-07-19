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

import { app, BrowserWindow } from "electron";

import * as config from "./config";
import { activeTray } from "./tray";
import * as auth from "./auth/index";

let window: BrowserWindow;

export const activeWindow: (browserWindow?: BrowserWindow) => BrowserWindow = (browserWindow?: BrowserWindow) => {
    if(browserWindow && browserWindow !== window){
        let old = window;
        window = browserWindow;
        old && old.destroy();
    }
    return window;
};

export const launch: () => void = async () => {
    if(require("electron-squirrel-startup") || !app.requestSingleInstanceLock()){
        app.quit();
        process.exit(0);
    }

    app
        .on("second-instance", () => {
            if(window){
                !window.isMinimized() || window.restore();
                window.focus();
            }
        })
        .on("window-all-closed", () => {
            activeTray() && activeTray().destroy();
            app.quit();
            process.exit(0);
        });

    config.launch();

    auth.launch();
}

process.on("unhandledRejection", (error: Error, promise: Promise<unknown>) => {
    console.error(`Unhandled rejection at: \n Promise ${promise}\n  ${error.stack}}`);
    app && app.quit();
    process.exit(-1);
});

app && app.whenReady().then(launch).catch((rej: any) => {
    console.error(`Unhandled rejection at: ${rej}}`);
    app && app.quit();
    process.exit(-1);
});