/* eslint-disable */

import { VueBaseRepository } from "./base_repository";

function parseJwt(token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
}

const get_exp_time_from_token = (encoded_token) => {
  const payload = parseJwt(encoded_token)
  return payload['exp']
}

function getCookie(name) {
  let matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

function deleteCookie(name) {
  setCookie(name, "", {
    'max-age': -1
  })
}

function setCookie(name, value, options = {}) {

  options = {
    path: '/',
    // при необходимости добавьте другие значения по умолчанию
    ...options
  };

  if (options.expires instanceof Date) {
    options.expires = options.expires.toUTCString();
  }

  let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);

  for (let optionKey in options) {
    updatedCookie += "; " + optionKey;
    let optionValue = options[optionKey];
    if (optionValue !== true) {
      updatedCookie += "=" + optionValue;
    }
  }
  console.log(updatedCookie)
  document.cookie = updatedCookie;
}



const VueTokenMixin = {
  get_access_token() {
    return getCookie('access_token')
  },

  get_refresh_token() {
    return getCookie('refresh_token')
  },

  _set_token(name, token) {
    const exp = get_exp_time_from_token(token)
    const date = new Date(exp * 1000);
    setCookie(name, token, {sameSite: 'strict', 'expires': date});
  },

  set_access_token(token) {
    this._set_token("access_token", token);
  },

  set_refresh_token(token) {
    this._set_token("refresh_token", token);
  },
};

const VueResetMixin = {
  reset() {
    deleteCookie('access_token');
    deleteCookie('refresh_token');
  },
};

class VueTokenRepository extends VueBaseRepository {}
Object.assign(VueTokenRepository.prototype, VueTokenMixin, VueResetMixin);

export { VueTokenRepository };
