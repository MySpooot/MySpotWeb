import React, { FC, useState, useEffect, useCallback } from 'react';
import { useMutation } from 'react-query';
import { useNavigate, useParams, Navigate } from 'react-router-dom';

import { SearchItem } from './components';
import { Container, Main, HeaderIcon } from './styles';
import { Path } from 'src/Constants';
import { createMarker, CreateMarkerBody, CreateMarkerParam, CreateMarkerResponse } from 'src/api/marker';
import FilledLoading from 'src/components/FilledLoading';
import HeaderWithLeftArrow from 'src/components/HeaderWithLeftArrow';
import Input from 'src/components/Input';
import useAlert from 'src/hooks/useAlert';
import useQueryString from 'src/hooks/useQueryString';
import useSearchPlace from 'src/hooks/useSearchPlace';
import { getMapDetailHelper, getMarkersHelper } from 'src/query';

import icSearch from 'src/assets/mymap/ic_search.svg';

const Search: FC = () => {
    const navigate = useNavigate();
    const { mapId } = useParams<{ mapId: string }>();
    const { k } = useQueryString<{ k: string }>();

    const { data: mapDetail } = getMapDetailHelper.useQuery(Number(mapId));

    const { places, searchPlaces } = useSearchPlace();
    const { alert } = useAlert();

    const [keyword, setKeyword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!k) return;

        searchPlaces(k);
    }, [k]); // eslint-disable-line react-hooks/exhaustive-deps

    const onSearchClick = useCallback(() => {
        // searchPlaces(keyword);
        navigate(`${Path.myMap}/${mapId}${Path.search}?k=${keyword}`);
    }, [navigate, keyword, mapId]);

    const { mutate: fetchCreateMarker } = useMutation<CreateMarkerResponse, unknown, CreateMarkerParam & CreateMarkerBody>(
        ({ mapId, ...body }) => createMarker({ mapId }, body),
        {
            onMutate: () => setIsLoading(true),
            onSuccess: async response => {
                await alert('지도에 새로운 장소가 추가되었습니다.\n장소에 한줄평을 추가해보세요~!');

                getMarkersHelper.setQueryData(Number(mapId), markers => {
                    if (!markers) return;

                    return [
                        ...markers,
                        {
                            ...response,
                            name: response.locationName,
                            kakaoAddressId: response.addressId,
                            longitude: Number(response.longitude),
                            latitude: Number(response.latitude),
                            isLike: false,
                            isMyLocation: false,
                            likeCount: 0,
                            replyCount: 0
                        }
                    ];
                });

                navigate(`${Path.myMap}/${mapId}`);
            },
            onSettled: () => setIsLoading(false)
        }
    );

    if (!mapDetail?.isOwner) {
        return <Navigate to={`${Path.myMap}/${mapId}`} />;
    }

    return (
        <Container>
            <HeaderWithLeftArrow style={{ flexShrink: 0 }} onLeftArrowClick={() => navigate(`${Path.myMap}/${mapId}`)} />
            <Input
                placeholder='검색하실 장소를 입력해 주세요'
                style={{ margin: '0 1.25rem', width: 'calc(100% - 2.5rem)', flexShrink: 0 }}
                value={keyword}
                autoFocus
                onChange={event => setKeyword(event.target.value)}
                onEnterPress={onSearchClick}
            >
                <HeaderIcon src={icSearch} onClick={onSearchClick} />
            </Input>
            <Main>
                {places?.map((place, index) => (
                    <SearchItem key={index} activeAddButton={!!mapDetail?.isOwner} place={place} onCreateMarker={fetchCreateMarker} />
                ))}
            </Main>
            {isLoading && <FilledLoading />}
        </Container>
    );
};

export default Search;
