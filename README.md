## React Native Expo Boilerplate (Beta)

### Server Template

**It's important to note**: this boilerplate is designed to work in conjunction with [Node.js Boilerplate](https://github.com/cheatcode/nodejs-server-boilerplate) back-end or API.

### Getting Started Server

To get started, clone a copy of the server boilerplate from Github:

```
git clone git@https://github.com/cheatcode/nodejs-server-boilerplate
```

Once the boilerplate is cloned, `cd` into its folder and run `npm install` to download all of the boilerplate's dependencies:

```
cd nodejs-server-boilerplate && npm install
```

### Next

Modify `api/graphql/server.js`
Replace

```
const token = req?.cookies["app_login_token"];
```

with

```
const authorization = req?.headers["authorization"];
const token = req?.cookies["app_login_token"] || authorization?.replace("Bearer ", "");

```

### Next

Modify `api/users/graphql/mutations.js` both `signup` and `login` mutations should now return a token with the user so in both methods instead of :

```
return user;
```

change to

```
return { ...user, token };
```

### Finally

Modify `api/users/graphql/types.js`
Change the user type to include the token.

```
type User {
    ${UserFields}
    name: Name
    token: String
  }
```

Start server

```
npm run dev

```

### Getting Started Mobile App

```
# Clone the repo
git clone https://github.com/webface/react-native-boilerplate.git

# Navigate to clonned folder and Install dependencies
cd react-native-boilerplate && yarn install

# Install Pods
cd ios && pod install
```

Back in the parent folder modify `ApolloClient.js`

```
const BASE_URL = "http://192.xxx.xx.x:5001/api/graphql";
```

replace I.P. with your local I.P. address

Run

```
expo start
```
