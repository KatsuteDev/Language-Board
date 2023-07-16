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
import * as app from "../app";
import * as auth from "../auth";

const typeHTML : http.OutgoingHttpHeaders = {"Content-Type": "text/html"};
const typeCSS  : http.OutgoingHttpHeaders = {"Content-Type": "text/css"};
const typeJS   : http.OutgoingHttpHeaders = {"Content-Type": "text/javascript"};
const typeEvent: http.OutgoingHttpHeaders = {
                                                "Content-Type": "text/event-stream",
                                                "Cache-Control": "no-cache",
                                                "Connection": "keep-alive"
                                            };

const html: string = fs.readFileSync(path.join(__dirname, "../", "web", "index.html"), "utf-8");
const css : string = fs.readFileSync(path.join(__dirname, "../", "web", "style.css"), "utf-8");
const js  : string = fs.readFileSync(path.join(__dirname, "../", "web", "web.js"), "utf-8");

http.globalAgent.maxSockets = 10;

let locked: string;

export const launch: () => void = () => {
    const server: http.Server = http.createServer(handler);

    server.listen(7272, "0.0.0.0"); // <- enforce IPv4 https://stackoverflow.com/a/41295130
}

const state: (ip: string) => "pair" | "auth" | "deny" = (ip: string) => ip === locked ? "auth" : locked ? "deny" : "pair";

export const handler: http.RequestListener = (req: http.IncomingMessage, res: http.ServerResponse) => {
    const ip: string = req.socket.remoteAddress || "";
    const url: string[] = (req.url || "").split('?');
    const p: string = url[0].startsWith('/') ? url[0] : '/' + url[0];
    const q: any = url[1] ? parse(url[1]) : undefined;

    const s: "pair" | "auth" | "deny" = state(ip);
    const deny: boolean = s === "deny";

    if(p === '/'){
        activeWindow().webContents.send("auth:show");

        const code: string = auth.code(ip);

        res.writeHead(!deny ? 200 : 401, typeHTML);
        return res.end(html
            .replace("<var:code>", code)
            .replace("{{ state }}", `${s}`));
    }else if(p === "/favicon.ico"){

    }else if(p === "/index.css"){
        res.writeHead(200, typeCSS);
        return res.end(css);
    }else if(p === "/index.js"){
        res.writeHead(200, typeJS);
        return res.end(js);
    }else if(p == "/state"){
        let interval: NodeJS.Timeout;
        res.writeHead(200, typeEvent);
        return interval = setInterval(() => {
            if(res)
                res.write(`retry: 1000\nid: ${Date.now()}\ndata: ${state(ip)}\n\n`);
            else
                clearInterval(interval);
        }, 500);
    }else if(!deny){
        if(p == "/input")
            app.input(q.value);
        else if(p == "/submit")
            app.submit(q.value);
        else if(p == "/key")
            app.key(q.value);
        else if(p == "/mouse")
            app.pos({
                x: +q.x,
                y: +q.y,
                mx: +q.mx,
                my: +q.my
            });
    }

    res.end();
}

export const lock: (ip: string) => void = (ip: string) => locked = ip;

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