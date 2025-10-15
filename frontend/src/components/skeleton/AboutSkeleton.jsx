import React from 'react';

const AboutSkeleton = () => {
  const skeletons = [1, 2, 3]; // 3 cards

  return (
    <div className="py-12 px-6 md:px-12">
      <h1 className="text-3xl font-bold text-center mb-10 dark:text-brandWhite">
        THERE'S MORE TO OUR STORY
      </h1>

      <div className="grid md:grid-cols-3 gap-8">
        {skeletons.map((_, index) => (
          <div
            key={index}
            className="flex flex-col dark:bg-black shadow-md dark:shadow-gray-800 rounded overflow-hidden h-[450px] animate-pulse"
          >
            {/* Skeleton Image */}
            <div className="w-full h-56 bg-gray-300 dark:bg-gray-700" />

            {/* Skeleton Text */}
            <div className="flex flex-col flex-1 justify-between p-6">
              <div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 mb-4 w-3/4 rounded" />
                <div className="h-3 bg-gray-300 dark:bg-gray-700 mb-2 w-full rounded" />
                <div className="h-3 bg-gray-300 dark:bg-gray-700 w-5/6 rounded" />
              </div>

              {/* Skeleton Button */}
              <div className="mt-4">
                <div className="h-8 bg-gray-300 dark:bg-gray-700 w-full rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AboutSkeleton;
