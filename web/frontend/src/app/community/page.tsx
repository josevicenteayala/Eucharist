export default function CommunityPage() {
  const prayerIntentions = [
    {
      id: 1,
      author: "Maria G.",
      intention: "For my mother's healing and comfort during her illness",
      prayers: 234,
      timeAgo: "2 hours ago"
    },
    {
      id: 2,
      author: "John D.",
      intention: "Thanksgiving for answered prayers and blessings received",
      prayers: 156,
      timeAgo: "5 hours ago"
    },
    {
      id: 3,
      author: "Patricia L.",
      intention: "For peace in our troubled world and unity among all people",
      prayers: 412,
      timeAgo: "1 day ago"
    }
  ];

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className="z-10 w-full max-w-6xl">
        <h1 className="text-4xl font-bold mb-4">Community</h1>
        <p className="text-xl text-gray-600 mb-12">
          Share prayer intentions and connect with fellow believers
        </p>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
            <div className="text-3xl font-bold text-blue-600 mb-2">1,247</div>
            <div className="text-gray-700">Active Members</div>
          </div>
          <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
            <div className="text-3xl font-bold text-purple-600 mb-2">3,891</div>
            <div className="text-gray-700">Prayer Intentions</div>
          </div>
          <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
            <div className="text-3xl font-bold text-green-600 mb-2">12,459</div>
            <div className="text-gray-700">Prayers Offered</div>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Prayer Intentions</h2>
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Share Your Intention
            </button>
          </div>

          <div className="space-y-4">
            {prayerIntentions.map((item) => (
              <div
                key={item.id}
                className="p-6 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="font-semibold text-gray-900">{item.author}</span>
                    <span className="text-gray-500 text-sm ml-2">{item.timeAgo}</span>
                  </div>
                  <button className="text-blue-600 hover:text-blue-700 font-semibold text-sm">
                    🙏 Pray
                  </button>
                </div>
                <p className="text-gray-700 mb-3">{item.intention}</p>
                <div className="text-sm text-gray-500">
                  {item.prayers} people are praying for this intention
                </div>
              </div>
            ))}
          </div>
        </div>

        <section className="mt-12 p-8 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Community Guidelines</h2>
          <p className="text-gray-700 mb-4">
            Our community is built on faith, charity, and respect. Please observe these guidelines:
          </p>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Share prayer intentions with sincerity and respect for others</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Maintain confidentiality and privacy</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Follow Catholic teaching and be charitable in all discussions</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Report any concerns to moderators</span>
            </li>
          </ul>
        </section>
      </div>
    </main>
  );
}
