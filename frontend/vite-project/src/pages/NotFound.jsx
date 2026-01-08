import { Link } from "react-router-dom";
import { Container, Button } from "react-bootstrap";

export default function NotFound() {
    return (
        <Container className="d-flex flex-column align-items-center justify-content-center vh-100 text-center">
            <h1 className="display-1 fw-bold text-primary">404</h1>
            <h2 className="mb-4">Page Not Found</h2>
            <p className="lead text-muted mb-4">
                Oops! The page you are looking for does not exist or has been moved.
            </p>
            <Button as={Link} to="/" variant="primary" size="lg">
                Go Home
            </Button>
        </Container>
    );
}
