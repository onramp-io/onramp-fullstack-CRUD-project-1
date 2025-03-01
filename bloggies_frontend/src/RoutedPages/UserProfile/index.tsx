import React, { useEffect, useState } from "react";
import { Container, Row, Col, Alert } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import BlogList from "../../BlogList";
import { BASE_URL } from "../../config";
import { CustomReduxState, Post } from "../../custom";
import FavoritesList from "../../FavoritesList";
import { removeStrDashes } from "../../helpers";
import { clearPosts } from "../../redux/actionCreators";

/**
 * `UserProfile` renders the page for displaying a user's `FavoritesList` and 
 * Publications (`BlogList`).
 */
function UserProfile() {
  const currUser = useSelector((st: CustomReduxState) => st.user);
  const { userId, displayName } = useParams<{ userId: string, displayName: string }>();
  const [isCurrUserProfile, setIsCurrUserProfile] = useState<boolean>(false);
  const currUserFavs = useSelector((st: CustomReduxState) => st.favorites);
  const [userFavs, setUserFavs] = useState<Array<Post>>([]);
  const [userPosts, setUserPosts] = useState<Array<Post>>([]);
  const [serverErr, setServerErr] = useState("");

  const dispatch = useDispatch();

  useEffect(function checkProfileOwner() {
    // retrieve user favorites by a GET request with user id from params.
    async function getUserFavorites() {
      try {
        const favRes = await fetch(`${BASE_URL}/favorites/${userId}`);
        const favData = await favRes.json();
        setUserFavs(favData.posts);
      } catch (err) {
        setServerErr("This user does not exist.");
      }
    }

    // retrieve user publications by a GET request with user id from params.
    async function getUserPosts() {
      try {
        const userPostsRes = await fetch(`${BASE_URL}/posts/user/${userId}`);
        const userPostsData = await userPostsRes.json();
        setUserPosts(userPostsData.posts);
      } catch (err) {
        setServerErr("This user does not exist.");
      }
    }
    
    /* Clear redux state posts because of a bug
    * where the `bookmark_count` will not increment, if there are posts in the redux state.*/
    dispatch(clearPosts());

    // if profile belongs to the current user, use redux data for bookmarks.
    if (parseInt(userId) === currUser.id) {
      setIsCurrUserProfile(true);
      getUserPosts();
    } else {
      // if not current user's profile, fetch the data from backend.
      getUserFavorites();
      getUserPosts();
    }
  }, [userId]);

  return (
    <Container className="UserProfile">
      <h1 className="mt-4">{removeStrDashes(displayName)}'s profile</h1>
      { serverErr && <Alert>{serverErr}</Alert>}
      <Row>
        <Col md={6}>
          <Container>
            <Row>
              <h3 className="mt-4">Publications</h3>
            </Row>
            <Row>
              <BlogList posts={userPosts} />
            </Row>
          </Container>
        </Col>
        <Col md={6}>
          <FavoritesList favorites={isCurrUserProfile ? currUserFavs : userFavs} />
        </Col>
      </Row>
    </Container>
  );
};

export default UserProfile;