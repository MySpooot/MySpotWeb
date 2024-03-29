import React, { FC } from 'react';
import { CustomOverlayMap } from 'react-kakao-maps-sdk';

import { Container, MarkerIcon, CircleMarker, Name } from './styles';

import icMarkedMarker from 'src/assets/mymap/ic_marked_marker.svg';
import icMarker from 'src/assets/mymap/ic_marker.svg';

type MarkerProps = {
    name: string;
    showName: boolean;
    isMyLocation: boolean;
    selected: boolean;
    width: number;
    height: number;
    latitude: number;
    longitude: number;
    onClick: () => void;
};

const Marker: FC<MarkerProps> = ({ name, showName, isMyLocation, selected, width, height, latitude, longitude, onClick }) => (
    <CustomOverlayMap position={{ lat: latitude, lng: longitude }} yAnchor={selected ? 0.5 : 0.55} zIndex={selected ? 2 : 1}>
        <Container selected={selected} onClick={onClick}>
            {showName && <Name isMyLocation={isMyLocation}>{name}</Name>}
            {selected ? (
                <MarkerIcon height={height} src={isMyLocation ? icMarkedMarker : icMarker} width={width} />
            ) : (
                <CircleMarker isMyLocation={isMyLocation} />
            )}
        </Container>
    </CustomOverlayMap>
);

export default Marker;
