/*
 * Copyright (C) 2024 Katsute <https://github.com/Katsute>
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

import * as fs from "fs";
import * as path from "path";

export const title: string = "Language Board";

export const config: string = fs.existsSync(path.join(__dirname, "../", "src"))
    ? path.join(__dirname, "../", "../", "config.yml")
    : path.join(__dirname, "../", "../", "../", "../", "config.yml");

export const defConfig: string = path.join(__dirname, "config.yml");

export const logo: string = path.join(__dirname, "assets", "icon.png");
export const icon: string = path.join(__dirname, "assets", "icon.ico");

export const authWidth: number = 275;
export const authHeight: number = 400;