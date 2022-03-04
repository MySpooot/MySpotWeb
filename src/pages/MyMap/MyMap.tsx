import React, { FC, useEffect } from 'react';
import { Outlet, useParams } from 'react-router';
import { useQuery } from 'react-query';

import { getMapDetail } from 'src/api/map';
import { getMarkers } from 'src/api/marker';
import { useMapDetailState, useMapMarkerState, useMapAccessible, useMapPlaceOverlayReset } from 'src/atoms';
import { MapDetailVO, MapMarkerVO } from 'src/vo';
import Loading from 'src/components/Loading';
import PrivateCodeModal from 'src/components/PrivateCodeModal/PrivateCodeModal';

const MyMap: FC = () => {
    const { mapId } = useParams<{ mapId: string }>();

    const { mapDetail, setMapDetail } = useMapDetailState();
    const { markers, setMarkers } = useMapMarkerState();
    const { mapAccessible, setMapAccessible } = useMapAccessible();
    const reset = useMapPlaceOverlayReset();

    useQuery(['getMapDetail', mapId], () => getMapDetail({ mapId: Number(mapId) }), {
        onSuccess: data => {
            setMapAccessible(data.accessible);
            setMapDetail(MapDetailVO.from(data));
        }
    });

    useQuery(['getMarkers', mapId], () => getMarkers({ mapId: Number(mapId) }), {
        enabled: mapAccessible,
        onSuccess: data => {
            setMarkers(data.map(MapMarkerVO.from));
        }
    });

    useEffect(() => {
        return () => reset();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    if (!mapDetail) {
        return <Loading />;
    }

    if (!mapAccessible) {
        return <PrivateCodeModal />;
    }

    if (!markers) {
        return <Loading />;
    }

    return <Outlet />;
};

export default MyMap;
