import { SingleResourceDoc } from 'jsonapi-typescript';

import { User } from "./User";

export interface UserResponse extends SingleResourceDoc<"user", User> {
    data: {
        id: string;
        type: "user";
        attributes: User;
    };
}
