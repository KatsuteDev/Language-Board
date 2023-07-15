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

const stream: EventSource = new EventSource("authenticated");

const auth: HTMLDivElement = document.querySelector("#auth")!;
const input: HTMLDivElement = document.querySelector("#input")!;

stream.onmessage = (e: MessageEvent) => {
    if(e.data === "true"){
        showInput();
        stream.close();
    }
}

const showCode: () => void = () => {
    document.title = "{{ title }} Pairing";
    auth.classList.remove("hidden");
}

const showInput: () => void = () => {
    document.title = "{{ title }}";
    auth.classList.add("hidden");
    input.classList.remove("hidden");
}