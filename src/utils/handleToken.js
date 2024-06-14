// 封装存取方法

const TOKENKEY = 'token_key'

function setValidToken(token) {
    return localStorage.setItem(TOKENKEY, token)
}

function getValidToken() {
    console.log(localStorage.getItem(TOKENKEY));
    return localStorage.getItem(TOKENKEY)
}

function clearValidToken() {
    return localStorage.removeItem(TOKENKEY)
}

export {
    setValidToken,
    getValidToken,
    clearValidToken
}