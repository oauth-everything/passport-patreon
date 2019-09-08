import { Strategy as OAuth2Strategy, StrategyOptions as OAuth2StrategyOptions, InternalOAuthError } from "passport-oauth2";
import { Profile as OAuth2Profile } from "@oauth-everything/profile";
import {
    ExtendableStrategyOptions,
    ExtendableStrategyOptionsWithRequest,
    OAuth2VerifyCallback,
    OAuth2VerifyFunction,
    OAuth2VerifyFunctionWithRequest,
    OAuth2VerifyFunctionWithResults,
    OAuth2VerifyFunctionWithRequestAndResults
} from "@oauth-everything/oauth2-types";

import { User } from "./ApiData";
import { UserResponse } from "./ApiData/UserResponse";
import { Scope } from "./Scope";
import { buildEmails, buildPhotos, buildAccounts } from "./Util";

interface OptionsMixin {
    profileFields?: Array<keyof User>;
}

export interface TokenResponse {
    access_token: string;
    token_type: string;
    scope: string;
    user: {
        id: string;
        name: string;
        email?: string;
    };
}

export type Profile = OAuth2Profile<UserResponse>;
export type StrategyOptions = ExtendableStrategyOptions<OptionsMixin>;
export type StrategyOptionsWithRequest = ExtendableStrategyOptionsWithRequest<OptionsMixin>;
export type VerifyCallback<TUser = object, TInfo = object> = OAuth2VerifyCallback<TUser, TInfo>;
export type VerifyFunction<TUser, TInfo> = OAuth2VerifyFunction<Profile, TUser, TInfo>;
export type VerifyFunctionWithRequest<TUser, TInfo> = OAuth2VerifyFunctionWithRequest<Profile, TUser, TInfo>;
export type VerifyFunctionWithResults<TUser, TInfo> = OAuth2VerifyFunctionWithResults<TokenResponse, Profile, TUser, TInfo>;
export type VerifyFunctionWithRequestAndResults<TUser, TInfo> = OAuth2VerifyFunctionWithRequestAndResults<TokenResponse, Profile, TUser, TInfo>;

export class Strategy<TUser = object, TInfo = object> extends OAuth2Strategy {

    public name = "patreon";
    private fields: Array<keyof User>;

    constructor(
        options: StrategyOptions,
        verify: VerifyFunction<TUser, TInfo>
            | VerifyFunctionWithResults<TUser, TInfo>
    )

    constructor(
        options: StrategyOptionsWithRequest,
        verify: VerifyFunctionWithRequest<TUser, TInfo>
            | VerifyFunctionWithRequestAndResults<TUser, TInfo>
    )

    constructor(
        options: StrategyOptions
            | StrategyOptionsWithRequest,
        verify: VerifyFunction<TUser, TInfo>
            | VerifyFunctionWithResults<TUser, TInfo>
            | VerifyFunctionWithRequest<TUser, TInfo>
            | VerifyFunctionWithRequestAndResults<TUser, TInfo>
    ) {

        super(
            {
                authorizationURL: "https://www.patreon.com/oauth2/authorize",
                tokenURL: "https://www.patreon.com/api/oauth2/token",
                scope: [Scope.IDENTITY],
                ...options
            } as OAuth2StrategyOptions,
            verify as VerifyFunction<TUser, TInfo>
        );

        this.fields = options.profileFields || ["email", "first_name", "last_name", "full_name", "is_email_verified", "vanity", "image_url", "thumb_url", "url", "about", "created"];
    }

    public userProfile(accessToken: string, done: (err?: Error | null, profile?: Profile | null) => void): void {

        this._oauth2.useAuthorizationHeaderforGET(true);
        this._oauth2.get("https://www.patreon.com/api/oauth2/v2/identity?fields[user]=" + this.fields.join(","), accessToken, (error, result) => {

            if (error) return done(new InternalOAuthError("Failed to fetch user profile", error));

            let json: UserResponse;

            try {
                json = JSON.parse(result as string) as UserResponse;
            }
            catch (parseError) {
                return done(new InternalOAuthError("Failed to parse user profile", parseError));
            }

            if(!json.data || !json.data.attributes) return done(new InternalOAuthError("Unexpected user profile format", new Error()));

            done(null, {
                provider: this.name,
                id: json.data.id,
                username: json.data.attributes.vanity,
                displayName: json.data.attributes.full_name,
                profileUrl: json.data.attributes.url,
                aboutMe: json.data.attributes.about,
                created: json.data.attributes.created ? new Date(json.data.attributes.created) : undefined,
                name: {
                    formatted: json.data.attributes.full_name,
                    givenName: json.data.attributes.first_name,
                    familyName: json.data.attributes.last_name
                },
                emails: buildEmails(json),
                photos: buildPhotos(json),
                accounts: buildAccounts(json),
                _raw: result as string,
                _json: json
            });

        });

    }

}
