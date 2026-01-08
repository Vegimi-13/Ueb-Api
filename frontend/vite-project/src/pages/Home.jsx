import Hero from "../components/Hero";
// import LatestJobs from "../components/LatestJobs";

export default function Home() {
    return (
        <div className="d-flex flex-column flex-grow-1 w-100">
            <Hero />
            {/* <LatestJobs /> */}
        </div>
    );
}

