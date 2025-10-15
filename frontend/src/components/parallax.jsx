import React from 'react'

function Parallax() {
      const [email, setEmail] = React.useState('');
  const [submitted, setSubmitted] = React.useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would normally handle submission (API call, etc)
    setSubmitted(true);
  };

  return (
    <div
      className="max-h-80 h-screen bg-fixed bg-center bg-cover flex items-center justify-center "
      style={{ backgroundImage: "url('https://img.lovepik.com/background/20211021/large/lovepik-taobao-e-commerce-poster-banner-background-image_400167663.jpg')" }}
    >
      <section className="rounded">
        <div className="max-w-xl mx-auto px-18 text-center">
          <h2 className="text-3xl font-bold mb-4 text-brandWhite dark:text-brandBlue">Subscribe to our Newsletter</h2>
          <p className="text-gray-600 mb-8">
            Get the latest updates and offers right in your inbox.
          </p>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="flex max-w-md mx-auto">
              <input
                type="email"
                required
                placeholder="Enter your email"
                className="flex-grow px-4 py-3 rounded-l-md border border-gray-300 focus:outline-none "
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                type="submit"
                className="bg-brandWhite text-branBlue dark:text-brandWhite px-6 py-3 rounded-r-md hover:bg-brandGreen hover:text-brandWhite
                dark:bg-brandGreen dark:hover:bg-brandWhite dark:hover:text-brandGreen font-bold  transition"
              >
                Subscribe
              </button>
            </form>
          ) : (
            <p className="text-green-600 font-semibold">Thank you for subscribing!</p>
          )}
        </div>
      </section>
    </div>
  )
}

export default Parallax