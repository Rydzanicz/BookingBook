import { useState, useEffect } from 'react';

interface Props {
    fetchMore: () => Promise<void>;
    hasMore: boolean;
    loading: boolean;
    threshold?: number;
}

export const useInfiniteScroll = ({
                                      fetchMore, hasMore, loading, threshold = 100
                                  }: Props) => {
    const [isFetching, setIsFetching] = useState(false);

    useEffect(() => {
        const onScroll = () => {
            if (
                window.innerHeight + window.scrollY >=
                document.body.offsetHeight - threshold &&
                hasMore && !loading && !isFetching
            ) {
                setIsFetching(true);
            }
        };
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, [hasMore, loading, isFetching, threshold]);

    useEffect(() => {
        if (!isFetching) return;
        const load = async () => {
            await fetchMore();
            setIsFetching(false);
        };
        load();
    }, [isFetching, fetchMore]);

    return { isFetching };
};
