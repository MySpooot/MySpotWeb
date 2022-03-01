import React, { FC, MouseEvent, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation } from 'react-query';
import { Popup } from 'reactjs-popup';

import { Container, Wrapper, EqRightIcon, BookMarkIcon, VerticalThreeIcon, DeletePopup, Address, RoadAddress } from './styles';
import { useMapPlaceOverlayState, useMapMarkerState } from 'src/atoms';
import { MapMarkerVO } from 'src/vo';
import { deleteMarker } from 'src/api';
import useMarkerUserAction from 'src/hooks/useMarkerUserAction';

import icEqRight from 'src/assets/mymap/ic_eq_right.svg';
import icBookmark from 'src/assets/mymap/ic_bookmark.svg';
import icMarkedBookmark from 'src/assets/mymap/ic_marked_bookmark.svg';
import icDotThree from 'src/assets/main/ic-vertical-circle.svg';

const PlaceOverlay: FC = () => {
    const navigate = useNavigate();
    const { mapId } = useParams<{ mapId: string }>();

    const { setMarkers } = useMapMarkerState();
    const { mapPlaceOverlay, setMapPlaceOverlay } = useMapPlaceOverlayState();

    const { onBookmarkClick: onBookmarkClick_ } = useMarkerUserAction();

    const { mutate: fetchDeleteMarker } = useMutation(deleteMarker, {
        onMutate: () => {
            setMapPlaceOverlay(undefined);
            setMarkers(markers => {
                if (!markers) return undefined;

                return markers.filter(marker => marker.kakaoAddressId !== mapPlaceOverlay?.kakaoAddressId);
            });
        }
    });

    const onPlaceOverlayClick = useCallback(() => {
        navigate(`/map/${mapId}/kakao/${mapPlaceOverlay?.kakaoAddressId}`);
    }, [navigate, mapId, mapPlaceOverlay]);

    const onBookMarkClick = useCallback(
        (marker: MapMarkerVO) => {
            setMapPlaceOverlay(value => {
                if (!value) return;

                return { ...value, isMyLocation: !marker.isMyLocation };
            });

            onBookmarkClick_(marker);
        },
        [onBookmarkClick_, setMapPlaceOverlay]
    );

    const onDeleteClick = useCallback(() => {
        if (!mapPlaceOverlay) return;

        fetchDeleteMarker({ markerId: Number(mapPlaceOverlay.id) });
    }, [mapPlaceOverlay, fetchDeleteMarker]);

    if (!mapPlaceOverlay) {
        return <></>;
    }

    return (
        <Container>
            <Wrapper>
                <div className='title'>
                    <BookMarkIcon
                        src={mapPlaceOverlay.isMyLocation ? icMarkedBookmark : icBookmark}
                        onClick={() => onBookMarkClick(mapPlaceOverlay)}
                    />
                    <div style={{ display: 'flex' }} onClick={onPlaceOverlayClick}>
                        <div>{mapPlaceOverlay.name}</div>
                        <EqRightIcon src={icEqRight} />
                    </div>
                    <Popup
                        on='click'
                        position='bottom right'
                        trigger={<VerticalThreeIcon src={icDotThree} onClick={(event: MouseEvent<HTMLImageElement>) => event.stopPropagation()} />}
                        closeOnDocumentClick
                    >
                        {() => <DeletePopup onClick={onDeleteClick}>삭제</DeletePopup>}
                    </Popup>
                </div>
                <Address>{mapPlaceOverlay.address}</Address>
                {mapPlaceOverlay.roadAddress && (
                    <RoadAddress>
                        <div className='label'>지번</div>
                        <div>{mapPlaceOverlay.roadAddress}</div>
                    </RoadAddress>
                )}
            </Wrapper>
        </Container>
    );
};

export default PlaceOverlay;
