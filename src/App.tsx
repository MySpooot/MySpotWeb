import React, { FC } from 'react';
import { Routes, Route } from 'react-router-dom';
import { css } from '@emotion/react';
import loadable from '@loadable/component';

import GlobalStyle from '@components/GlobalStyle';
import useMediaQuery from '@hooks/useMediaQuery';

const SupportNotice = loadable(() => import('@pages/SupportNotice'));
const MyMap = loadable(() => import('@pages/MyMap'));
const Login = loadable(() => import('@pages/Login'));
const NotFound = loadable(() => import('@pages/NotFound'));

const App: FC = () => {
    const { isPhone } = useMediaQuery();

    if (!isPhone) {
        return <SupportNotice />;
    }

    return (
        <div css={appStyle}>
            <GlobalStyle />
            <Routes>
                <Route element={<MyMap />} path='/mymap/:hash' />
                <Route element={<Login />} path='/login' />
                <Route element={<NotFound />} />
            </Routes>
        </div>
    );
};

export default App;

const appStyle = css`
    @media (max-width: 768px) {
        background-color: black;
        color: white;
    }
`;
