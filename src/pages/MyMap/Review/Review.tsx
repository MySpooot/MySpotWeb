import React, { FC, useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useInfiniteQuery, useMutation } from 'react-query';
import { useInView } from 'react-intersection-observer';

import {
    Container,
    Main,
    Info,
    PlaceName,
    Address,
    RoadAddressArea,
    AddressLabel,
    RoadAddress,
    TextAreaWrapper,
    TextArea,
    CommentCounter,
    Line,
    ReviewArea,
    Top,
    ReviewTitle,
    ReviewCount,
    ReviewList,
    NoReview
} from './styles';
import { ReplyItem } from './components';
import { Path } from 'src/Constants';
import { useMarkerRepliesState, useMeState } from 'src/atoms';
import { getMarkersHelper } from 'src/query';
import { MapMarkerVO, MarkerReplyVO } from 'src/vo';
import { getReplies, createReply, CreateReplyParam, CreateReplyBody, CreateReplyResponse } from 'src/api';
import MapDetailFooter from 'src/components/MapDetailFooter';
import Button from 'src/components/Button';
import Loading from 'src/components/Loading';

const Review: FC = () => {
    const { mapId, kakaoAddressId } = useParams<{ mapId: string; kakaoAddressId: string }>();
    const navigate = useNavigate();

    const { ref, inView } = useInView();

    const { me } = useMeState();

    const { markerReplies, setMarkerReplies } = useMarkerRepliesState();

    const { data: markers } = getMarkersHelper.useQuery(Number(mapId));

    const [place, setPlace] = useState<MapMarkerVO>();
    const [textAreaValue, setTextAreaValue] = useState('');
    const [replyOffset, setReplyOffset] = useState(0);

    const [isFirstPlaceLoaded, setIsFirstPlaceLoaded] = useState(false);
    const [isReplyLoadActive, setIsReplyLoadActive] = useState(false);

    const { fetchNextPage, isLoading, isFetchingNextPage, remove } = useInfiniteQuery(
        ['getReplies', place?.id],
        ({ pageParam }) => getReplies({ markerId: Number(place?.id) }, { offset: pageParam?.offset ?? 0 }),
        {
            enabled: place && place.replyCount > 0 && isReplyLoadActive,
            onSuccess: ({ pages }) => {
                setMarkerReplies(pages.flatMap(replyList => replyList.map(reply => MarkerReplyVO.from(reply))));
                setReplyOffset(offset => offset + 10);
            }
        }
    );

    const { mutate: mutateCreateReply, isLoading: isMutationLoading } = useMutation<CreateReplyResponse, unknown, CreateReplyParam & CreateReplyBody>(
        ({ markerId, message }) => createReply({ markerId }, { message }),
        {
            onSuccess(response) {
                setMarkerReplies(replies => [MarkerReplyVO.from(response), ...replies]);

                setPlace(place => {
                    if (!place) return;

                    return { ...place, replyCount: place.replyCount + 1 };
                });
                getMarkersHelper.setQueryData(Number(mapId), markers => {
                    if (!markers) return;

                    return markers.map(marker => {
                        if (marker.kakaoAddressId === Number(kakaoAddressId)) {
                            return { ...marker, replyCount: marker.replyCount + 1 };
                        }

                        return marker;
                    });
                });
            },
            onError(error) {
                console.error(error);

                setMarkerReplies(replies => replies.filter((_, index) => index !== 0));

                setPlace(place => {
                    if (!place) return;

                    return { ...place, replyCount: place.replyCount - 1 };
                });
                getMarkersHelper.setQueryData(Number(mapId), markers => {
                    if (!markers) return;

                    return markers.map(marker => {
                        if (marker.kakaoAddressId === Number(kakaoAddressId)) {
                            return { ...marker, replyCount: marker.replyCount - 1 };
                        }

                        return marker;
                    });
                });
            }
        }
    );

    useEffect(() => {
        return () => {
            setMarkerReplies([]);
            remove();
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (place?.replyCount === 0) {
            setIsReplyLoadActive(false);
        }

        if (!place || isFirstPlaceLoaded) return;

        setIsFirstPlaceLoaded(true);

        setIsReplyLoadActive(place.replyCount !== 0);
    }, [place]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (inView && !isFetchingNextPage && (markerReplies?.length || 0) < (place?.replyCount ?? 0) && replyOffset < (place?.replyCount ?? 0)) {
            fetchNextPage({ pageParam: { offset: replyOffset } });
        }
    }, [inView]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        const place = markers?.find(marker => marker.kakaoAddressId === Number(kakaoAddressId));

        if (!place) {
            return navigate(Path.home);
        }

        setPlace(place);
    }, [markers]); // eslint-disable-line react-hooks/exhaustive-deps

    const onRegisterClick = useCallback(() => {
        mutateCreateReply({ markerId: Number(place?.id), message: textAreaValue });
        setTextAreaValue('');
    }, [mutateCreateReply, place, textAreaValue]);

    if (!place) {
        return <></>;
    }

    return (
        <Container>
            <Main data-testid='reviewMain'>
                <Info>
                    <PlaceName>{place.name}</PlaceName>
                    <Address>{place.address}</Address>
                    <RoadAddressArea>
                        <AddressLabel>??????</AddressLabel>
                        <RoadAddress>{place.roadAddress}</RoadAddress>
                    </RoadAddressArea>
                    <TextAreaWrapper>
                        <TextArea
                            data-testid='commentTextarea'
                            disabled={!me}
                            placeholder={me ? '????????? ????????? ?????????.' : '???????????? ????????? ????????? ????????? ??? ????????????.'}
                            rows={3}
                            value={textAreaValue}
                            onChange={event => setTextAreaValue(event.target.value)}
                        />
                        <CommentCounter error={textAreaValue.length > 64}>{textAreaValue.length}/64</CommentCounter>
                    </TextAreaWrapper>
                    <Button
                        data-testid='registerButton'
                        disabled={textAreaValue.length === 0 || textAreaValue.length > 64}
                        style={{ marginTop: '0.875rem' }}
                        type='primary'
                        onClick={onRegisterClick}
                    >
                        ????????????
                    </Button>
                </Info>
                <Line />
                <ReviewArea>
                    <Top>
                        <ReviewTitle>??????</ReviewTitle>
                        <ReviewCount data-testid='replyCount'>{place.replyCount}???</ReviewCount>
                    </Top>
                    <ReviewList>
                        {isMutationLoading && <Loading />}
                        {place.replyCount > 0 && isLoading ? (
                            <Loading />
                        ) : markerReplies.length === 0 ? (
                            <NoReview>????????? ????????????.</NoReview>
                        ) : (
                            markerReplies.map(reply => <ReplyItem key={reply.id} reply={reply} />)
                        )}
                    </ReviewList>
                    <div ref={ref} />
                    {isFetchingNextPage && <Loading />}
                </ReviewArea>
            </Main>

            <MapDetailFooter
                marker={place}
                viewButton={{ text: '????????? ??? ??????', onClick: () => navigate(`${Path.myMap}/${mapId}/kakao/${kakaoAddressId}`) }}
            />
        </Container>
    );
};

export default Review;
