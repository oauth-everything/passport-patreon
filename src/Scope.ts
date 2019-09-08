export enum Scope {

    /** Provides read access to data about the user. See the /identity endpoint documentation for details about what data is available. */
    IDENTITY = "identity",

    /** Provides read access to the user’s email. */
    IDENTITY_EMAIL = "identity[email]",
    
    /** Provides read access to the user’s memberships. */
    IDENTITY_MEMBERSHIPS = "identity.memberships",
    
    /** Provides read access to basic campaign data. See the /campaign endpoint documentation for details about what data is available. */
    CAMPAIGNS = "campaigns",
    
    /** Provides read, write, update, and delete access to the campaign’s webhooks created by the client. */
    W_CAMPAIGNS_WEBHOOK = "w:campaigns.webhook",
    
    /** Provides read access to data about a campaign’s members. See the /members endpoint documentation for details about what data is available. Also allows the same information to be sent via webhooks created by your client. */
    CAMPAIGNS_MEMBERS = "campaigns.members",
    
    /** Provides read access to the member’s email. Also allows the same information to be sent via webhooks created by your client. */
    CAMPAIGNS_MEMBERS_EMAIL = "campaigns.members[email]",
    
    /** Provides read access to the member’s address, if an address was collected in the pledge flow. Also allows the same information to be sent via webhooks created by your client. */
    CAMPAIGNS_MEMBERS_ADDRESS = "campaigns.members.address",

}