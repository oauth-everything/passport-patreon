import { AttributesObject } from 'jsonapi-typescript';

export interface User extends AttributesObject {
    email: string;
    first_name: string;
    last_name: string;
    full_name: string;
    is_email_verified: boolean;
    vanity: string;
    about: string;
    image_url: string;
    thumb_url: string;
    can_see_nsfw: boolean;
    created: string;
    url: string;
    like_count: number;
    hide_pledges: boolean;
    social_connections: Record<string, { user_id: string }>;
}
