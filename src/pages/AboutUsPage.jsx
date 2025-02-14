const AboutUsPage = () => {
  return (
    <div style={{ backgroundColor: "#f8f9fa" }}>
      <div className="container py-5 text-center">
        <h1 className="fw-bold display-4 text-primary mb-4 mt-5">About Us</h1>
        <p className="lead text-secondary w-75 mx-auto mb-5">
          Connecting passionate writers with eager readers. We provide a
          platform for sharing stories, insights, and knowledge in a dynamic and
          engaging way.
        </p>

        {/* Mission Section */}
        <div className="row align-items-center mb-5">
          <div className="col-md-6 text-md-start">
            <h2 className="fw-bold text-dark">Our Mission</h2>
            <p className="text-muted">
              At Blogology, we believe that everyone has a story to tell and a
              perspective worth sharing. Our mission is to provide a platform
              where writers of all backgrounds can express their thoughts,
              ideas, and experiences freely. Whether you&apos;re an aspiring
              blogger or an experienced writer, Blogology offers the tools and
              space to bring your words to life. We are committed to fostering a
              community that thrives on creativity, knowledge, and meaningful
              meaningful conversations.
            </p>
          </div>
          <div className="col-md-6">
            <img
              src="https://images.pexels.com/photos/256514/pexels-photo-256514.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              className="img-fluid rounded shadow"
              alt="Mission"
              style={{ height: "300px", width: "500px" }}
            />
          </div>
        </div>

        {/* What We Offer Section */}
        <h2 className="fw-bold text-dark mb-5" style={{ marginTop: "100px" }}>
          What We Offer
        </h2>
        <div className="row g-4">
          {[
            {
              title: "Engaging Articles",
              description:
                "Explore well-researched articles across various topics, ensuring fresh perspectives and in-depth analysis.",
            },
            {
              title: "Expert Insights",
              description:
                "Learn from industry leaders and subject matter experts who provide real-world knowledge and experience.",
            },
            {
              title: "Community Discussions",
              description:
                "Engage in meaningful conversations, share opinions, and connect with like-minded individuals.",
            },
            {
              title: "Creative Expression",
              description:
                "Unleash your creativity through storytelling, poetry, and innovative content creation.",
            },
            {
              title: "Learning Resources",
              description:
                "Access a wealth of tutorials, guides, and educational materials to enhance your skills.",
            },
            {
              title: "Networking Opportunities",
              description:
                "Build connections with professionals, writers, and thought leaders in your field.",
            },
          ].map((offer, index) => (
            <div key={index} className="col-md-4">
              <div className="card border-0 shadow-lg p-4 h-100">
                <h5 className="fw-bold text-dark">{offer.title}</h5>
                <p className="text-muted">{offer.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutUsPage;
