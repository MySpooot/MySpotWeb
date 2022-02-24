import React, { FC } from 'react';

import { Iframe } from './styles';

type KakaoPlaceIframeProps = {
    addressId: string;
};

const KakaoPlaceIframe: FC<KakaoPlaceIframeProps> = ({ addressId }) => {
    return <Iframe src={`https://place.map.kakao.com/m/${addressId}`} />;
};

export default KakaoPlaceIframe;
