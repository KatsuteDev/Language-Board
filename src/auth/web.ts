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

window.onbeforeunload = () => true;

(window as any).api.on("auth:init", (data: {title: string, qr: string, url: string}) => {
    (document.querySelector("#title") as HTMLParagraphElement).innerText = data.title;
    (document.querySelector("#qr") as HTMLImageElement).src = data.qr;
    (document.querySelector("#url") as HTMLParagraphElement).innerText = data.url;
});

(window as any).api.on("auth:show", () => {
    (document.querySelector("#code") as HTMLDivElement).classList.remove("hidden");
});

const codeInput: HTMLInputElement = document.querySelector("#value")!;
const mask: RegExp = /[^a-zA-Z0-9]+/g;

codeInput.oninput = (e: Event) => {
    codeInput.value = codeInput.value.replace(mask, "");
    codeInput.value.length == 4 && submit();
};

codeInput.onkeydown = (e: KeyboardEvent) => {
    e.key === "Enter" && codeInput.value.length == 4 && submit();
};

const submit: () => void = () => (window as any).api.send("auth:code", codeInput.value);

(document.querySelector("#close-button") as HTMLButtonElement).onclick = (e: MouseEvent) => (window as any).api.send("auth:close");