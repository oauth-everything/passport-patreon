@oauth-everything/passport-patreon
==================================

A [Passport](http://passportjs.org/) strategy for authenticating with
[Patreon](https://patreon.com/) using OAuth 2.0 and the Patreon API v2.

This module lets you authenticate using Patreon in your Node.js applications.
By plugging into Passport, Patreon authentication can be easily and
unobtrusively integrated into any application or framework that supports
[Connect](https://www.senchalabs.org/connect/)-style middleware, including
[Express](https://expressjs.com/).

## Install

```bash
$ npm install @oauth-everything/passport-patreon
```
#### Configure Strategy

The Patreon authentication strategy authenticates users using a Patreon
account and OAuth 2.0 tokens.  The app ID and secret obtained when creating an
application are supplied as options when creating the strategy.  The strategy
also requires a `verify` callback, which receives the access token and optional
refresh token, as well as `profile` which contains the authenticated user's
Patreon profile.  The `verify` callback must call `cb` providing a user to
complete authentication.

```ts
passport.use(new Strategy(
    {
        clientID: PATREON_APP_ID,
        clientSecret: PATREON_APP_SECRET,
        callbackURL: "http://localhost:3000/auth/patreon/callback"
    },
    (accessToken: string, refreshToken: string, profile: Profile, cb: VerifyCallback<User>) => {

        User.findOrCreate({ patreonId: profile.id }, (err: Error, user: User) => {
            return cb(err, user);
        });
    }
));
```

#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'patreon'` strategy, to
authenticate requests.

For example, as route middleware in an [Express](https://expressjs.com/)
application:

```javascript
app.get('/auth/patreon',
  passport.authenticate('patreon'));

app.get('/auth/patreon/callback',
  passport.authenticate('patreon', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });
```

## License

[The MPL v2 License](https://opensource.org/licenses/MPL-2.0)
