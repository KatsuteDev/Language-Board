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

let __key__: any = "__key__";
let __mouse__: any = "__mouse__";

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
    request.send();
}

// input

const input: HTMLInputElement = document.querySelector("#value")! as HTMLInputElement;

// IME

let buffer: string = "";
let isIME: boolean = false;

input.addEventListener("compositionstart", (e: CompositionEvent) => {
    isIME = true;
    buffer = input.value || "";
});

input.addEventListener("compositionend", (e: CompositionEvent) => {
    isIME = false;
    buffer = "";
    send();
});

input.addEventListener("compositionupdate", (e: CompositionEvent) => {
    send(buffer + e.data);
});

// submit

input.oninput = (e: Event) => !isIME && send();

input.onkeydown = (e: KeyboardEvent) => {
    if(!isIME){
        const v: string = input.value || "";
        if(v !== ""){
            if(e.key === "Enter"){
                request("HEAD", `submit?value=${encodeURIComponent(v)}`);
                input.value = "";
                send();
            }
        }else if(__key__ && (e.key === "Enter" || e.key === "Backspace")){
            keypress(e.key);
            input.value = "";
        }
    }
}

let kq: number = -1;

const send: (value?: string) => void = (value?: string) => request("HEAD", `input?value=${encodeURIComponent(value || input.value || "")}&queue=${++kq}`);

const keypress: (value: string) => void = (value: string) => request("HEAD", `key?value=${encodeURIComponent(value)}`);

request("HEAD", `input?value=${encodeURIComponent("")}&queue=-1`); // clear input and reset queue on page reload

// mouse

const minput: HTMLDivElement = document.querySelector("#mouseinput")! as HTMLDivElement;
const mousepad: HTMLDivElement = document.querySelector("#mousepad")! as HTMLDivElement;

let mq: number = -1;

let holding: boolean = false;

if(__mouse__ && "ontouchstart" in window){
    minput.classList.remove("hidden");

    mousepad.ontouchstart = (e: TouchEvent) => {
        e.preventDefault();
        holding = true;
    };

    mousepad.ontouchend = mousepad.ontouchcancel = (e: TouchEvent) => {
        e.preventDefault();
        holding = false;
        request("HEAD", "reset");
    };

    mousepad.ontouchmove = (e: TouchEvent) => {
        e.preventDefault();
        if(mousepad === document.elementFromPoint(e.touches[0].pageX, e.touches[0].pageY)){
            if(holding){
                request("HEAD", `mouse?x=${Math.round((e.touches[0].clientX - mousepad.offsetLeft + Number.EPSILON) * 1000) / 1000}&y=${Math.round((e.touches[0].clientY - mousepad.offsetTop + Number.EPSILON) * 1000) / 1000}&queue=${++mq}`);
            }
        }else{
            holding = false;
            request("HEAD", "reset");
        }
    };

    (document.querySelector("#lmb") as HTMLButtonElement).onclick = (e: MouseEvent) => keypress("LeftClick");
    (document.querySelector("#rmb") as HTMLButtonElement).onclick = (e: MouseEvent) => keypress("RightClick");

    request("HEAD", "mouse?queue=-1"); // reset mouse pos and queue on page reload
}