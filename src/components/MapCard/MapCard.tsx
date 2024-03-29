import React, { FC, useState, useCallback } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useMutation, useQueryClient } from 'react-query';
import { Popup } from 'reactjs-popup';

import { Path } from 'src/Constants';
import { deleteMap, getPrivateCode, deleteFavoriteMap, GetMapsResponse, GetFavoriteMapsResponse } from 'src/api';
import Icon from 'src/components/Icon';
import { Card, MapBtn, UpdateMap, CardText, VerticalDivider, SeeMore } from 'src/components/MapCard/styles';
import useAlert from 'src/hooks/useAlert';
import { dateFilter } from 'src/util/string';

import remove from 'src/assets/main/ic-remove.svg';
import share from 'src/assets/main/ic-share.svg';
import circles from 'src/assets/main/ic-vertical-circle.svg';

type MapCardProps = {
    map: { id: number; mapName: string; isPrivate: boolean; created: number; mapId: number };
    onClick: () => void;
    type: 'my' | 'favorite' | 'recent';
};

const MapCard: FC<MapCardProps> = ({ map, onClick, type }) => {
    const client = useQueryClient();
    const { alert, confirm } = useAlert();

    const [privateCode, setPrivateCode] = useState<string>();

    const { mutate } = useMutation(() => getPrivateCode({ mapId: map.id }), {
        onSuccess: response => {
            setPrivateCode(response.code);
        }
    });

    const onPopupClick = useCallback(() => {
        if (!map.isPrivate) return;

        mutate();
    }, [map, mutate]);

    const onCopyClick = useCallback(
        (close: () => void) => {
            if (map.isPrivate && !privateCode) {
                return window.alert('프라이빗 코드 에러');
            }

            close();

            alert('지도 링크를 클립보드에 복사하였습니다.\n지도 링크를 공유해보세요~!');
        },
        [alert, map, privateCode]
    );

    const onDeleteCardClick = useCallback(
        async (mapId: number, close: () => void) => {
            close();

            const flag = await confirm('지도를 삭제하면 복구할 수 없습니다.\n삭제하시겠습니까?');

            if (flag) {
                await deleteMap(mapId);
                client.setQueryData<GetMapsResponse[] | undefined>('getMaps', data => {
                    return data?.filter(map => map.id !== mapId);
                });
            }
        },
        [client, confirm]
    );

    const onRemoveFavoriteMap = useCallback(
        async (mapId: number, close: () => void) => {
            close();
            await deleteFavoriteMap({ favoriteMapId: mapId });
            client.setQueryData<GetFavoriteMapsResponse[] | undefined>('getFavoriteMap', data => {
                return data?.filter(map => map.id !== mapId);
            });
        },
        [client]
    );

    return (
        <Card>
            <CardText onClick={onClick}>
                <span className='map-title'>{map.mapName}</span>
                <span className='create-date'>{dateFilter(map.created)}</span>
            </CardText>
            <UpdateMap>
                <Popup
                    on='click'
                    position='bottom right'
                    trigger={<Icon alt='더보기' className='vertical-circle' src={circles} />}
                    closeOnDocumentClick
                    onOpen={onPopupClick}
                >
                    {close => (
                        <SeeMore>
                            <CopyToClipboard
                                text={`${window.location.origin}${Path.myMap}/${map.id}${map.isPrivate ? `?code=${privateCode}` : ''}`}
                                onCopy={() => onCopyClick(close)}
                            >
                                <MapBtn>
                                    <Icon alt='공유' className='ic-share' src={share} />
                                    공유
                                </MapBtn>
                            </CopyToClipboard>
                            <VerticalDivider />
                            {type !== 'recent' && (
                                <MapBtn onClick={() => (type === 'my' ? onDeleteCardClick : onRemoveFavoriteMap)(map.id, close)}>
                                    <Icon alt='삭제' className='ic-remove' src={remove} />
                                    {type === 'my' ? '삭제' : '해제'}
                                </MapBtn>
                            )}
                        </SeeMore>
                    )}
                </Popup>
            </UpdateMap>
        </Card>
    );
};

export default MapCard;
