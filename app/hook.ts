import { useState, useEffect, useCallback, useRef } from 'react';

export interface User {
    id: number;
    username: string;
    name: string;
    avatar_template: string;
}

export interface Post {
    id: number;
    name: string;
    username: string;
    avatar_template: string;
    created_at: string;
    like_count: number;
    blurb: string;
    post_number: number;
    topic_id: number;
}

export interface Topic {
    id: number;
    title: string;
    fancy_title: string;
    slug: string;
    posts_count: number;
    reply_count: number;
    highest_post_number: number;
    created_at: string;
    last_posted_at: string;
    bumped: boolean;
    bumped_at: string;
    archetype: string;
    unseen: boolean;
    pinned: boolean;
    unpinned: boolean | null;
    visible: boolean;
    closed: boolean;
    archived: boolean;
    bookmarked: boolean | null;
    liked: boolean | null;
    tags: string[];
    tags_descriptions: Record<string, string>;
    category_id: number;
    has_accepted_answer: boolean;
    can_have_answer: boolean;
}

export interface DiscussionStream {
    posts: Post[];
    topics: Topic[];
    users: User[];
}

export interface DiscussionDataResponse {
    data: DiscussionStream;
    status: string;
}

const mapApiDataToDiscussionStream = (apiData: any): DiscussionStream => {
    const posts: Post[] = apiData.hits.map((hit: any) => ({
        id: hit.objectID,
        name: hit.title,
        username: hit.author,
        avatar_template: '', // Assuming avatar_template is not available in the sample data
        created_at: hit.created_at,
        like_count: hit.points,
        blurb: '', // Assuming blurb is not available in the sample data
        post_number: 0, // Assuming post_number is not available in the sample data
        topic_id: hit.story_id,
    }));

    const topics: Topic[] = apiData.hits.map((hit: any) => ({
        id: hit.objectID,
        title: hit.title,
        fancy_title: hit.title,
        slug: hit.url,
        posts_count: hit.num_comments,
        reply_count: hit.num_comments,
        highest_post_number: 0, // Assuming highest_post_number is not available in the sample data
        created_at: hit.created_at,
        last_posted_at: hit.updated_at,
        bumped: false, // Assuming bumped is not available in the sample data
        bumped_at: '', // Assuming bumped_at is not available in the sample data
        archetype: '', // Assuming archetype is not available in the sample data
        unseen: false, // Assuming unseen is not available in the sample data
        pinned: false, // Assuming pinned is not available in the sample data
        unpinned: null, // Assuming unpinned is not available in the sample data
        visible: true, // Assuming visible is true
        closed: false, // Assuming closed is not available in the sample data
        archived: false, // Assuming archived is not available in the sample data
        bookmarked: null, // Assuming bookmarked is not available in the sample data
        liked: null, // Assuming liked is not available in the sample data
        tags: hit._tags,
        tags_descriptions: {}, // Assuming tags_descriptions is not available in the sample data
        category_id: 0, // Assuming category_id is not available in the sample data
        has_accepted_answer: false, // Assuming has_accepted_answer is not available in the sample data
        can_have_answer: false, // Assuming can_have_answer is not available in the sample data
    }));

    const users: User[] = [...(new Set(apiData.hits.map((hit: any) => ({
        id: hit.author,
        username: hit.author,
        name: hit.author, // Assuming name is the same as username
        avatar_template: '', // Assuming avatar_template is not available in the sample data
    })))) as any];

    return { posts, topics, users };
};

export const reindexData = (data: any): DiscussionStream => {
    return mapApiDataToDiscussionStream(data);
};

export const useData = (searchTerm: string, interval: number = 60000) => {
    const [data, setData] = useState<DiscussionStream | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const hasFetchedOnce = useRef(false);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/search?term=${searchTerm}`, {
                cache: 'no-cache',
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const rawData: DiscussionDataResponse = await response.json();
            const reindexedData = reindexData(rawData);
            setData(reindexedData);
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    }, [searchTerm]);

    useEffect(() => {
        if (searchTerm && !hasFetchedOnce.current) {
            fetchData();
            hasFetchedOnce.current = true;
            const intervalId = setInterval(fetchData, interval);

            return () => clearInterval(intervalId);
        }
    }, [searchTerm, fetchData, interval]);

    const refresh = () => {
        setError(null);
        setData(null);
        fetchData();
    };

    return { data, error, loading, refresh };
};

export default useData;