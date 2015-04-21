# Chat app

Create a realtime chat application that allows two or more users to have private conversations.

Create a client app (either web or CLI) that allows users to connect and use the chat application described above.


### Required features

- Room broadcasting. Users can subscribe to the events of a given room or topic, and will receive realtime notifications of what's going on in them.
- Private rooms: users can create and invite other users to private chat rooms.
- One-on-one private chats. Allow conversations between two individuals.
- [Giphy api] integration: during chat, any user can issue a `/giphy <keyword>` command and receive an animated gif url from the service.

All clients must authenticate via the `login` endpoint using a secure, stateless protocol. Any other requests to the API must be authenticated.

Crank it up to eleven: this app needs to be able run on multiple servers. All the above features need work across several server instances and node clusters. Consider this requirement when designing your app.

*Pro tip*: Don't reinvent the wheel! There are dozens of libraries and tools out there that solve your problems already. [Socket.io] is a good starting point.

### Bonus points

- Consider using [Hawk] or [JWT] for authentication and authorization.
- Use NoSQL (Redis or MongoDB are popular, sound choices)
- Tests and coverage: we're always rushing it, but take your time and write some nice looking tests, think about all those green bars.

### Submitting

Your code goes into a public github repo, a working release should be deployed into Heroku or similar.

Happy coding!

![wow](http://i3.kym-cdn.com/photos/images/newsfeed/000/582/577/9bf.jpg)

[Socket.io]: http://socket.io/
[Giphy api]: https://api.giphy.com/
[Hawk]: https://github.com/hueniverse/hawk#readme
[JWT]: http://jwt.io/