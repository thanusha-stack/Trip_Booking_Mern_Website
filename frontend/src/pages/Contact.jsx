import React from "react";
import {
  Navbar,
  Nav,
  Container,
  NavDropdown,
  Button,
  Row,
  Col,
  Card,
  Form
} from "react-bootstrap";

const Contact = () => {
  return (
    <>
      {/* Contact Section */}
      <section className="py-5">
        <Container>
          <Row>
            <Col md={5}>
              <h4 className="fw-bold">Get in Touch</h4>
              <p>
                Have questions about tour packages, bookings, or payments?
                Reach out to us — our team is happy to assist you.
              </p>

              <p>
                <strong>Address:</strong>
                <br />
                Mysore Tourism Office,
                <br />
                Mysuru, Karnataka
              </p>

              <p>
                <strong>Phone:</strong>
                <br />
                +91 98765 43210
              </p>

              <p>
                <strong>Email:</strong>
                <br />
                support@mysoretourism.com
              </p>
            </Col>

            <Col md={7}>
              <Card className="shadow-sm">
                <Card.Body>
                  <h5 className="fw-bold mb-3">Send Us a Message</h5>

                  <Form>
                    <Form.Group className="mb-3">
                      <Form.Label>Full Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter your name"
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Email Address</Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="Enter your email"
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Phone Number</Form.Label>
                      <Form.Control
                        type="tel"
                        placeholder="Enter your phone number"
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Message</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={4}
                        placeholder="Write your message here..."
                      />
                    </Form.Group>

                    <Button variant="success" className="w-100">
                      Submit
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      <footer className="bg-dark text-white text-center py-3">
        <p className="mb-0">
          © 2025 Mysore Tourism. All Rights Reserved.
        </p>
      </footer>
    </>
  );
};

export default Contact;
