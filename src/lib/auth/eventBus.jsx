"use client";

import mitt from "mitt";
import Cookies from "js-cookie";

const eventBus = mitt();

const COOKIE_HEAD = "_head";
const COOKIE_TOKEN = "_token";
const COOKIE_KEY = "_key";

export const establecerToken = (token) => {
    const isProduction = process.env.NODE_ENV === 'production';
    if (!token) return;

    try {
        const parts = token.split(".");
        if(parts.length === 3) {
            Cookies.set(COOKIE_HEAD, parts[0], { secure: isProduction, sameSite: 'lax' });
            Cookies.set(COOKIE_TOKEN, parts[1], { secure: isProduction, sameSite: 'lax' });
            Cookies.set(COOKIE_KEY, parts[2], { secure: isProduction, sameSite: 'lax' });
            eventBus.emit("establecerToken", token);
        } else {
            console.warn("Token JWT inválido, formato incorrecto.");
        }
    } catch (error) {
        console.error("Error al establecer el token:", error);
    }
}

export const eliminarToken = () => {
    Cookies.remove(COOKIE_HEAD);
    Cookies.remove(COOKIE_TOKEN);
    Cookies.remove(COOKIE_KEY);
    eventBus.emit("eliminarToken");
}


export const obtenerToken = () => {
    try {
        const head = Cookies.get(COOKIE_HEAD);
        const token = Cookies.get(COOKIE_TOKEN);
        const key = Cookies.get(COOKIE_KEY);
        if(head && token && key) {
            return `${head}.${token}.${key}`;
        }
    } catch (error) {
        console.error("Error al obtener el token:", error);
    }
    return null;
}

export const usuario = {
    data: {},
};

export { eventBus };