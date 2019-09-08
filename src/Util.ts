import { ProfileItem, ProfileAccount } from "@oauth-everything/profile";

import { UserResponse } from "./ApiData";

export function buildEmails(json: UserResponse): ProfileItem[]  {

    const emails: ProfileItem[] = [];

    if(json.data.attributes && json.data.attributes.email) {
        emails.push({
            value: json.data.attributes.email,
            primary: true,
            verified: !!json.data.attributes.is_email_verified
        });
    }

    return emails;

}

export function buildPhotos(json: UserResponse): ProfileItem[] {

    const photos: ProfileItem[] = [];

    if(json.data.attributes && json.data.attributes.image_url) {
        photos.push({
            value: json.data.attributes.image_url,
            primary: true,
            type: "profile"
        });
    }

    if(json.data.attributes && json.data.attributes.thumb_url) {
        photos.push({
            value: json.data.attributes.thumb_url,
            type: "profile_thumb"
        });
    }

    return photos;

}

export function buildAccounts(json: UserResponse): ProfileAccount[] {
    const accounts: ProfileAccount[] = [];

    if(json.data.attributes && json.data.attributes.social_connections) {

        const connectionNames = Object.getOwnPropertyNames(json.data.attributes.social_connections)

        for(const name of connectionNames) {

            accounts.push({
                domain: name,
                userid: json.data.attributes.social_connections[name].user_id
            });
        }
    }

    return accounts;
}
