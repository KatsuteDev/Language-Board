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

const fs = require("fs");
const path = require("path");

const pkg = require("./package.json");

const make = path.join(__dirname, "out", "make");

{
    const dir = path.join(make, "squirrel.windows", "ia32");
    fs.renameSync(path.join(dir, `Language Board Setup.exe`), path.join(dir, `Language-Board-Setup-${pkg.version}-Windows-x86-32.exe`));
}
{
    const dir = path.join(make, "squirrel.windows", "x64");
    fs.renameSync(path.join(dir, `Language Board Setup.exe`), path.join(dir, `Language-Board-Setup-${pkg.version}-Windows-x64.exe`));
}

{
    const dir = path.join(make, "wix", "ia32");
    fs.renameSync(path.join(dir, `Language Board.msi`), path.join(dir, `Language-Board-Setup-${pkg.version}-Windows-x86-32.msi`));
}
{
    const dir = path.join(make, "wix", "x64");
    fs.renameSync(path.join(dir, `Language Board.msi`), path.join(dir, `Language-Board-Setup-${pkg.version}-Windows-x64.msi`));
}

{
    const dir = path.join(make, "zip", "win32", "ia32");
    fs.renameSync(path.join(dir, `Language Board-win32-ia32-${pkg.version}.zip`), path.join(dir, `Language-Board-${pkg.version}-Windows-x86-32.zip`));
}
{
    const dir = path.join(make, "zip", "win32", "x64");
    fs.renameSync(path.join(dir, `Language Board-win32-x64-${pkg.version}.zip`), path.join(dir, `Language-Board-${pkg.version}-Windows-x64.zip`));
}