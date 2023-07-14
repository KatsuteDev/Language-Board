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

const fs = require("fs");
const path = require("path");

const minify = (str) =>
    str .replace(/<!--.*-->/gs, '')          // <!-- comments
        .replace(/\/\*.*\*\//gs, '')         // /* comments
        .replace(/(?<!(`|").*)\/\/.*$/gm,'') // // comments
        .replace(/ +/gm, ' ')                // extra spaces
        .replace(/^ +/gm, '')                // leading space
        .replace(/\r?\n/gm, '')              // new line
        .trim();

const apply = (dir, func, filter) => {
    for(const file of fs.readdirSync(dir, {withFileTypes: true})){
        if(file.isDirectory())
            apply(path.join(dir, file.name), func, filter);
        else if(!filter || filter(path.join(dir, file.name)))
            func(path.join(dir, file.name));
    }
}

apply(
    path.join(__dirname, "src"),
    file => fs.copyFileSync(file, path.join(__dirname, "dist", file.substring(path.join(__dirname, "src").length))),
    file => file.endsWith(".html") || file.endsWith(".css")
);

apply(path.join(__dirname, "dist"), file => fs.writeFileSync(file, minify(fs.readFileSync(file, "utf-8")), "utf-8"));