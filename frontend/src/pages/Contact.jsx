import React, { useRef } from "react";
import emailjs from "@emailjs/browser";
import {
  Container, Row, Col, Card, Form, Button
} from "react-bootstrap";


const Contact = () => {
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        "service_aky41pr",
        "template_b2sxtqj",
        form.current,
        "OVN4ePYf4s46aWsfn"
      )
      .then(
        () => {
          alert("Email sent successfully ✅");
          form.current.reset();
        },
        (error) => {
          alert("Failed to send email ❌");
          console.log(error.text);
        }
      );
  };

  return (
    <>
      <section className="py-5">
        <Container>
          <Row>
            <Col md={5}>
              <h4 className="fw-bold">Get in Touch</h4>
              <p>Have questions? Reach out to us.</p>
            </Col>

            <Col md={7}>
              <Card className="shadow-sm">
                <Card.Body>
                  <h5 className="fw-bold mb-3">Send Us a Message</h5>

                  <Form ref={form} onSubmit={sendEmail}>
                    <Form.Group className="mb-3">
                      <Form.Label>Full Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="user_name"
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        name="user_email"
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Message</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={4}
                        name="message"
                        required
                      />
                    </Form.Group>

                    <Button type="submit" variant="success" className="w-100">
                      Submit
                    </Button>
                  </Form>

                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default Contact;
