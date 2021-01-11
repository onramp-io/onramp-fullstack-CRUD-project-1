import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import BlogCard from "../BlogCard";

interface IProps {
  posts: Array<any>;
}

function BlogList({ posts }: IProps) {
  return (
    <Container className="BlogList">
      <Row>
        {posts.length > 0
          ? posts.map(p => {
            return (
              <Col key={p.id} md={12}>
                <BlogCard post={p}/>
              </Col>
            );
          })
          : <Col md={12}> 
           <p className="mt-5">No posts made yet.</p>
          </Col>
        }
          </Row>
    </Container>
  );
};

export default BlogList;