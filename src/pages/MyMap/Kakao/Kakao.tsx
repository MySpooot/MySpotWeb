import React, { FC, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Container } from './styles';
import { Path } from 'src/Constants';
import KakaoPlaceIframe from 'src/components/KakaoPlaceIframe';
import MapDetailFooter from 'src/components/MapDetailFooter';
import { getMarkersHelper } from 'src/query';
import { MapMarkerVO } from 'src/vo';

const Kakao: FC = () => {
    const { mapId, kakaoAddressId } = useParams<{ mapId: string; kakaoAddressId: string }>();
    const navigate = useNavigate();

    const { data: markers } = getMarkersHelper.useQuery(Number(mapId));

    const [marker, setMarker] = useState<MapMarkerVO>();

    useEffect(() => {
        const marker = markers?.find(marker => marker.kakaoAddressId === Number(kakaoAddressId));

        if (!marker) {
            return navigate(Path.home);
        }

        setMarker(marker);
    }, [markers]); // eslint-disable-line react-hooks/exhaustive-deps

    if (!kakaoAddressId || !marker) {
        return <></>;
    }

    return (
        <Container>
            <KakaoPlaceIframe addressId={kakaoAddressId} />
            <MapDetailFooter
                marker={marker}
                viewButton={{ text: '후기 보기', onClick: () => navigate(`${Path.myMap}/${mapId}/review/${kakaoAddressId}`) }}
            />
        </Container>
    );
};

export default Kakao;
