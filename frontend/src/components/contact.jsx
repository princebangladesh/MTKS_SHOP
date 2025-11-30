import React from 'react'

function Contact() {
  return (
     
    <div className="min-h-screen  text-gray-800 p-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          
          <h1 className="text-4xl dark:text-brandWhite font-bold mt-2 mb-4">Contact Us</h1>
          <p className="text-gray-400 mb-6">
            As you might expect of a company that began as a high-end interiors contractor, we pay strict attention.
          </p>

          <div className="mb-4 dark:text-gray-400">
            <h2 className="font-bold text-lg ">America</h2>
            <p>195 E Parker Square Dr, Parker, CO 801</p>
            <p className="text-blue-400">+43 982-314-0958</p>
          </div>

          <div className="mb-4 dark:text-gray-400">
            <h2 className="font-bold text-lg">France</h2>
            <p>109 Avenue Léon, 63 Clermont-Ferrand</p>
            <p className="text-blue-400">+12 345-423-9893</p>
          </div>

          <div className="mt-6 space-y-2 dark:text-gray-400">
            <p><strong>Facebook:</strong> <a href="https://facebook.com/yourpage" className="text-blue-600 hover:underline" target="_blank">facebook.com/yourpage</a></p>
            <p><strong>X (Twitter):</strong> <a href="https://x.com/yourhandle" className="text-blue-600 hover:underline" target="_blank">x.com/yourhandle</a></p>
            <p><strong>Google:</strong> <a href="mailto:yourname@gmail.com" className="text-blue-600 hover:underline">yourname@gmail.com</a></p>
            <p><strong>Mailing:</strong> P.O. Box 123, YourCity, YourCountry</p>
          </div>
        </div>


        <div className="flex flex-col gap-6">

          <div className="h-48 w-full rounded overflow-hidden border border-gray-300">
            <iframe
              title="Google Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3068.6683593033615!2d-104.76533498461662!3d39.51756097947885!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x876caa8d7f79dfc3%3A0x5d2d01e8f3fd2540!2s195%20E%20Parker%20Square%20Dr%2C%20Parker%2C%20CO%208014%2C%20USA!5e0!3m2!1sen!2s!4v1692699012345!5m2!1sen!2s"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>

          {/* Contact Form */}
          <form className="flex flex-col space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                placeholder="Name"
                className="w-full dark:bg-black dark:text-brandWhite border border-gray-300 px-4 py-2 rounded"
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full dark:bg-black dark:text-brandWhite border border-gray-300 px-4 py-2 rounded"
              />
            </div>
            <textarea
              placeholder="Message"
              className="w-full dark:bg-black dark:text-brandWhite border border-gray-300 px-4 py-2 rounded h-40"
            ></textarea>
            <button
              type="submit"
              className="bg-brandGreen text-white hover:bg-brandBlue
              dark:bg-brandWhite dark:hover:bg-brandGreen dark:text-black dark:hover:text-brandWhite
              uppercase tracking-wider px-6 py-3 rounded  transition duration-300 font-bold"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Contact