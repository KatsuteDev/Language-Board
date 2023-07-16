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

const body: HTMLBodyElement = document.querySelector("body")!;

// requests

const stream: EventSource = new EventSource("state");

stream.onmessage = (e: MessageEvent) => {
    switch(e.data){
        case "auth":
        case "deny":
            stream.close();
        default:
            body.setAttribute("state", e.data);
    }
}

const request: (method: string, url: string) => void = (method: string, url: string) => {
    const request: XMLHttpRequest = new XMLHttpRequest();
    request.open(method.toUpperCase(), url, true);
    request.send(null);
}

// input
const input: HTMLInputElement = document.querySelector("#value")! as HTMLInputElement;

// IME

let before: string = ""; // content excluding in-progress IME
let isIME: boolean = false;

input.addEventListener("compositionstart", (e: CompositionEvent) => {
    isIME = true;
    before = input.value || "";
});

input.addEventListener("compositionend", (e: CompositionEvent) => {
    isIME = false;
    send();
});

input.addEventListener("compositionupdate", (e: CompositionEvent) => {
    send(before + e.data);
});

// submit

input.oninput = (e: Event) => !isIME && send();

input.onkeydown = (e: KeyboardEvent) => {
    if(!isIME){
        const v: string = (input.value || "").trim();

        if(v !== ""){
            if(e.key === "Enter"){
                request("GET", `submit?value=${encodeURIComponent(v)}`);
                input.value = "";
            }
        }else if(e.key === "Enter" || e.key === "Backspace"){
            request("GET", `key?value=${encodeURIComponent(e.key)}`);
            input.value = "";
        }
    }
}

const send: (value?: string) => void = (value?: string) => request("GET", `input?value=${encodeURIComponent(value || (input.value || "").trim())}`);

// lock input
input.onblur = (e: FocusEvent) => input.focus();
input.focus();