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
import * as http from "http";
import * as path from "path";

import { activeWindow } from "..";

const typeHTML : http.OutgoingHttpHeaders = {"Content-Type": "text/html"};
const typeCSS  : http.OutgoingHttpHeaders = {"Content-Type": "text/css"};
const typeJSON : http.OutgoingHttpHeaders = {"Content-Type": "application/json"};
const typeJS   : http.OutgoingHttpHeaders = {"Content-Type": "text/javascript"};
const typeEvent: http.OutgoingHttpHeaders = {
                                                "Content-Type": "text/event-stream",
                                                "Cache-Control": "no-cache",
                                                "Connection": "keep-alive"
                                            };

const html: string = fs.readFileSync(path.join(__dirname, "../", "web", "index.html"), "utf-8");
const css : string = fs.readFileSync(path.join(__dirname, "../", "web", "style.css"), "utf-8");
const js  : string = fs.readFileSync(path.join(__dirname, "../", "web", "index.js"), "utf-8");

export const handler: http.RequestListener = (req: http.IncomingMessage, res: http.ServerResponse) => {
    const url: string[] = (req.url || "").split('?');
    const p: string = url[0].startsWith('/') ? url[0] : '/' + url[0];
    const q: any = url[1] ? parse(url[1]) : undefined;

    if(p === '/'){
        activeWindow().webContents.send("show");

        res.writeHead(200, typeHTML);
        res.end(html);
    }else if(p === "/favicon.ico"){

    }else if(p === "/index.css"){
        res.writeHead(200, typeCSS);
        res.end(css);
    }else if(p === "/index.js"){
        res.writeHead(200, typeJS);
        res.end(js);
    }

    res.end();
}

const parse: (raw: string) => {[k: string]: string | undefined} = (raw: string) => {
    const obj: {[index: string]: string | undefined} = {};
    const pairs: string[] = (raw.startsWith('?') ? raw.substring(1) : raw).split('&');
    for(const pair of pairs){
        if(pair.includes('=')){
            const kv: string[] = pair.split('=');
            obj[decodeURIComponent(kv[0])] = kv.length == 2 ? decodeURIComponent(kv[1]) : undefined;
        }
    }
    return obj;
}