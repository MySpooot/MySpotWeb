import axios, { AxiosRequestConfig } from 'axios';

const instance = axios.create({
    baseURL: 'https://nestjs-map.herokuapp.com/',
    headers: {
        clientVersion: require('../../package.json').version // eslint-disable-line @typescript-eslint/no-var-requires
    }
});

export const request = async <T>(config: AxiosRequestConfig): Promise<T> => {
    const { data } = await instance(config);

    return data;
};

export const setAccessToken = (token: string) => {
    instance.defaults.headers.common['Authorization'] = token;
};

export const clearAccessToken = () => {
    instance.defaults.headers.common['Authorization'] = '';
};