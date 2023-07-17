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

import * as fs from "fs";
import * as yaml from "yaml";

import * as constants from "./constants";

let def: any;
let cfg: any;

export const get: (key: string) => any = (key: string) => cfg[key] || def[key];

export const launch: () => void = () => {
    if(!fs.existsSync(constants.config))
        fs.copyFileSync(constants.defConfig, constants.config);

    def = yaml.parse(fs.readFileSync(constants.defConfig, "utf-8"));
    cfg = yaml.parse(fs.readFileSync(constants.config, "utf-8"));
}