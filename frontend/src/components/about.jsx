import React, { useEffect, useState } from 'react';
import rescue from '../assets/about/rescue.jpg';
import wild from '../assets/about/wild.jpg';
import partners from '../assets/about/partners.jpg';
import AboutSkeleton from './skeleton/AboutSkeleton'; // <- import skeleton

function About() {
  const [loading, setLoading] = useState(true);

  // Simulate loading delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); // 1 second delay

    return () => clearTimeout(timer);
  }, []);

  const cards = [
    {
      title: 'READY FOR ANOTHER GO',
      text: 'Built for the wild gear doesn’t give up easily. YETI RESCUES™ gear finds its way back into the wild.',
      button: 'CHECK OUT RESCUES',
      image: rescue,
    },
    {
      title: 'STORIES FROM THE WILD',
      text: 'Award-winning films. Long roads out short. Some unbelievable, but all true.',
      button: 'SEE OUR STORIES',
      image: wild,
    },
    {
      title: 'PARTNERS',
      text: 'Organizations who share our love for the wild and never quit dedication to their work.',
      button: 'MEET OUR PARTNERS',
      image: partners,
    },
  ];

  if (loading) return <AboutSkeleton />;

  return (
    <div className="py-12 px-6 md:px-12">
      <h1 className="text-3xl font-bold text-center mb-10 dark:text-brandWhite">
        THERE'S MORE TO OUR STORY
      </h1>

      <div className="grid md:grid-cols-3 gap-8">
        {cards.map((card, index) => (
          <div
            key={index}
            className="flex flex-col dark:bg-black shadow-md dark:shadow-gray-800 rounded overflow-hidden h-[450px]"
          >
            <img
              src={card.image}
              alt={card.title}
              className="w-full h-56 object-cover"
            />
            <div className="flex flex-col flex-1 justify-between p-6">
              <div>
                <h2 className="text-lg font-semibold mb-2 dark:text-gray-200">{card.title}</h2>
                <p className="text-sm text-gray-600">{card.text}</p>
              </div>
              <div className="mt-4">
                <button className="w-full bg-brandGreen text-white px-4 py-2 text-sm hover:bg-brandWhite hover:text-black transition duration-300 hover:font-bold">
                  {card.button}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default About;
