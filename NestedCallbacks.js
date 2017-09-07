const get = require('axios').get;
const keyBy = require('lodash/keyBy');
const groupBy = require('lodash/groupBy');

const baseUrl = 'http://jsonplaceholder.typicode.com/';
const userEndpoint = `${baseUrl}users`;
const postsEndpoint = `${baseUrl}posts`;
const commentsEndpoint = `${baseUrl}comments`;

/*
const request = require('request');
request.get(postsEndpoint, function(err, postData) {
  if (err) {
    console.err(err);
    return;
  }

  const parsedPosts = JSON.parse(postData.body);
  const posts = keyBy(parsedPosts, 'id');

  request.get(commentsEndpoint, function(err, commentData) {
    if (err) {
      console.err(err);
      return;
    }

    const parsedComments = JSON.parse(commentData.body);
    const groupedComments = groupBy(parsedComments, 'postId');

    Object.keys(groupedComments).forEach(key => {
      posts[key].comments = groupedComments[key];
    });

    request.get(userEndpoint, function(err, userData) {
      if (err) {
        console.err(err);
        return;
      }

      const parsedUsers = JSON.parse(userData.body);
      const users = keyBy(parsedUsers, 'id');

      const finalPosts = Object.keys(posts).map(key => {
        const post = posts[key];
        post.user = users[post.userId];
        delete post.userId;
        return post;
      });

      console.log('Done');
    });
  });
});

*/


/*
  The main issue with the old version of the code is that it contains nested callbacks.  Nested callbacks are problematic from a maintainability, readility, and testing perspective.  Specifically:
     - they are very hard to read and reason about because of multiple levels of indentation and mixing of scope.  New developers reading the code will have hard time.
     - adding new code to a set of already nested callbacks is a nightmare.  You end up making the code even more unreadable.
     - error checking has to be done every step of the way.  It is easy for someone to forget to do that.  This is also likely to result in incosistent handling of errors vis a vis logging or other things.
     - return statements with callbacks can be a source of bugs.  For example, often with callback code, because of poorly placed return statments, callbacks will get executed twice.
     - they are nearly impossible to unit test.  It would be very challenging to isolate the specific conditions that you want to test in your unit test

  Another flaw in the code is that it makes all 3 API requests sequentially when they can actually be done at the same time.

  Another flaw in the code is that the data processing logic was hidden inside the callbacks and therefore not easy to test.

  In my new version of the code, I have abstracted all of the 3 API requests to their own functions which are easily unit-testable.  I have created a finalizeData function that has the logic for combining all the data, which is also now easily unit-testable.  I have then used Promise.all to execute all 3 requests asynchronously and process the result once all the data has been fetched.  With that, only one error handling block needs to be used.
*/

const getPosts = () => {
  return get(postsEndpoint)
    .then(({ data }) => keyBy(data, 'id'));
};

const getComments = () => {
  return get(commentsEndpoint)
    .then(({ data }) => groupBy(data, 'postId'));
};

const getUsers = () => {
  return get(userEndpoint)
    .then(({ data}) => keyBy(data, 'id'));
};

const finalizeData = (posts, users, comments) => {
  Object.keys(comments).forEach(key => {
    posts[key].comments = comments[key];
  });

  return Object.keys(posts).map(key => {
    const post = posts[key];
    post.user = users[post.userId];
    delete post.userId;
    return post;
  });
}

const fetchAll = () => {
  Promise.all([
    getPosts(),
    getComments(),
    getUsers(),
  ]).then(result => {
    const finalResult = finalizeData(...result);

    console.log('Done');

    return finalResult;
  }).catch(err => console.log(`something went wrong: ${err}`))
}

fetchAll();
