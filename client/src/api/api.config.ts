import ky from 'ky';

export const api = ky.create({prefixUrl:'https://funny-paint.tw1.ru/api'})

