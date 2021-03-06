import { useMutation } from 'react-query';

import { updateReply, deleteReply, UpdateReplyParam, UpdateReplyBody } from 'src/api';
import { useMarkerRepliesState } from 'src/atoms';
import { getMarkersHelper } from 'src/query';

const useReplyItem = (mapId?: string, kakaoAddressId?: string) => {
    const { setMarkerReplies } = useMarkerRepliesState();

    const { mutate: mutateUpdateReply } = useMutation<unknown, unknown, UpdateReplyParam & UpdateReplyBody>(
        ({ replyId, message }) => updateReply({ replyId }, { message }),
        {
            onMutate: ({ replyId, message }) => {
                setMarkerReplies(replies => {
                    return replies.map(reply => {
                        if (reply.id === replyId) {
                            return { ...reply, message };
                        }

                        return reply;
                    });
                });
            },
            onError: error => {
                console.error(error);
            }
        }
    );

    const { mutate: mutateDeleteReply } = useMutation(deleteReply, {
        onMutate: ({ replyId }) => {
            getMarkersHelper.setQueryData(Number(mapId), markers => {
                if (!markers) return;

                return markers.map(marker => {
                    if (marker.kakaoAddressId === Number(kakaoAddressId)) {
                        return { ...marker, replyCount: marker.replyCount - 1 };
                    }
                    return marker;
                });
            });
            setMarkerReplies(replies => replies.filter(reply => reply.id !== replyId));
        },
        onError: error => {
            console.error(error);
        }
    });

    return { mutateUpdateReply, mutateDeleteReply };
};

export default useReplyItem;
