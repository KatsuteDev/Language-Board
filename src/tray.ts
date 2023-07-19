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

import { exec }from "child_process";
import { Menu, Tray, nativeImage } from "electron";

import { activeWindow } from ".";
import * as constants from "./constants";

let tray: Tray;

export const activeTray: () => Tray = () => tray;

export const launch: (url: string) => void = (url: string) => {
    tray = new Tray(constants.logo);
    tray.setContextMenu(Menu.buildFromTemplate([
        {
            label: constants.title,
            type: "normal",
            icon: nativeImage.createFromPath(constants.icon).resize({width: 16}),
            enabled: false
        },
        {
            label: url,
            type: "normal",
            enabled: false
        },
        {
            type: "separator"
        },
        {
            label: "Settings",
            type: "normal",
            click: () => exec(`explorer.exe /select,"${constants.config}"`)
        },
        {
            label: "Quit",
            type: "normal",
            click: () => activeWindow().destroy()
        }
    ]));
    tray.setToolTip(constants.title);
    tray.on("click", () => tray.popUpContextMenu());
}