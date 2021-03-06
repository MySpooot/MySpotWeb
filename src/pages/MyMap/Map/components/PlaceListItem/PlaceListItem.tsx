import React, { FC, useCallback, MouseEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation } from 'react-query';

import {
    Container,
    BookmarkIcon,
    CenterArea,
    AddressName,
    JibunAddress,
    RoadAddressWrapper,
    RoadAddressLabel,
    RoadAddress,
    DeleteButton,
    ButtonArea,
    ButtonWrapper,
    PlaceActionIcon,
    ActiveSpan
} from './styles';
import { Path } from 'src/Constants';
import { MapMarkerVO } from 'src/vo';
import useMarkerUserAction from 'src/hooks/useMarkerUserAction';
import { deleteMarker } from 'src/api';
import { getMapDetailHelper, getMarkersHelper } from 'src/query';

import icBookmark from 'src/assets/mymap/ic_bookmark.svg';
import icMarkedBookmark from 'src/assets/mymap/ic_marked_bookmark.svg';
import icLikeOn from 'src/assets/mymap/ic_like_on.svg';
import icLikeOff from 'src/assets/mymap/ic_like_off.svg';
import icComment from 'src/assets/mymap/ic_comment.svg';

type PlaceListItemProps = {
    place: MapMarkerVO;
};

const PlaceListItem: FC<PlaceListItemProps> = ({ place }) => {
    const navigate = useNavigate();
    const { mapId } = useParams<{ mapId: string }>();

    const { onBookmarkClick: onBookmarkClick_, onLikeClick: onLikeClick_ } = useMarkerUserAction(mapId);

    const { data: mapDetail } = getMapDetailHelper.useQuery(Number(mapId));

    const { mutate: fetchDeleteMarker } = useMutation(deleteMarker, {
        onSuccess: () => {
            getMarkersHelper.setQueryData(Number(mapId), markers => {
                if (!markers) return;

                return markers.filter(marker => marker.id !== place.id);
            });
        }
    });

    const onBookmarkClick = useCallback(
        (event: MouseEvent<HTMLImageElement>) => {
            event.stopPropagation();

            onBookmarkClick_(place);
        },
        [place, onBookmarkClick_]
    );

    const onPlaceClick = useCallback(() => {
        navigate(`${Path.myMap}/${mapId}/kakao/${place.kakaoAddressId}`);
    }, [navigate, mapId, place]);

    const onLikeClick = useCallback(() => {
        onLikeClick_(place);
    }, [onLikeClick_, place]);

    const onCommentClick = useCallback(() => {
        navigate(`${Path.myMap}/${mapId}/review/${place.kakaoAddressId}`);
    }, [navigate, mapId, place]);

    const onDeleteClick = useCallback(() => {
        if (!confirm('?????? ?????????????????????????')) return;

        fetchDeleteMarker({ markerId: place.id });
    }, [fetchDeleteMarker, place]);

    return (
        <Container>
            <div style={{ display: 'flex' }}>
                <BookmarkIcon alt='bookmark' src={place.isMyLocation ? icMarkedBookmark : icBookmark} onClick={event => onBookmarkClick(event)} />
                <CenterArea onClick={onPlaceClick}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <AddressName>{place.name}</AddressName>
                        {mapDetail?.isOwner && <DeleteButton onClick={onDeleteClick}>??????</DeleteButton>}
                    </div>
                    {place.address && <JibunAddress>{place.address}</JibunAddress>}
                    {place.roadAddress && (
                        <RoadAddressWrapper>
                            <RoadAddressLabel>??????</RoadAddressLabel>
                            <RoadAddress>{place.roadAddress}</RoadAddress>
                        </RoadAddressWrapper>
                    )}
                </CenterArea>
            </div>
            <ButtonArea>
                <ButtonWrapper onClick={onLikeClick}>
                    <PlaceActionIcon alt='like' src={place.isLike ? icLikeOn : icLikeOff} />
                    <ActiveSpan active={place.isLike}>{place.likeCount}</ActiveSpan>
                </ButtonWrapper>
                <ButtonWrapper onClick={onCommentClick}>
                    <PlaceActionIcon alt='comment' src={icComment} />
                    <ActiveSpan>{place.replyCount}</ActiveSpan>
                </ButtonWrapper>
            </ButtonArea>
        </Container>
    );
};

export default PlaceListItem;
