import Link from 'next/link';

export default function LearnPage() {
  const articles = [
    {
      id: 'understanding-real-presence',
      title: 'Understanding the Real Presence',
      category: 'Eucharist Basics',
      description:
        "Discover what the Catholic Church teaches about Christ's true presence in the Eucharist.",
      readTime: '5 min read',
    },
    {
      id: 'biblical-foundation',
      title: 'The Biblical Foundation of the Eucharist',
      category: 'Scripture',
      description:
        'Explore the scriptural roots of the Eucharist from the Last Supper to early Church practice.',
      readTime: '8 min read',
    },
    {
      id: 'eucharistic-miracles',
      title: 'Eucharistic Miracles Through History',
      category: 'History',
      description:
        'Learn about documented miracles that confirm the Real Presence throughout the centuries.',
      readTime: '10 min read',
    },
    {
      id: 'preparing-for-mass',
      title: 'Preparing Your Heart for Mass',
      category: 'Living the Eucharist',
      description: 'Practical guidance on how to prepare spiritually to receive the Eucharist.',
      readTime: '6 min read',
    },
    {
      id: 'parts-of-the-mass',
      title: 'Understanding the Parts of the Mass',
      category: 'Liturgy',
      description: 'A detailed guide to the structure and meaning of the Catholic Mass.',
      readTime: '12 min read',
    },
    {
      id: 'eucharist-and-transformation',
      title: 'The Eucharist and Personal Transformation',
      category: 'Living the Eucharist',
      description: 'How regular reception of the Eucharist shapes and sanctifies our lives.',
      readTime: '7 min read',
    },
  ];

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className="z-10 w-full max-w-6xl">
        <h1 className="text-4xl font-bold mb-4">Learn About the Eucharist</h1>
        <p className="text-xl text-gray-600 mb-12">
          Discover the beauty and depth of Catholic teaching on the Eucharist
        </p>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <Link
              key={article.id}
              href={`/learn/${article.id}`}
              className="group block p-6 bg-white border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-lg transition-all"
            >
              <div className="mb-2">
                <span className="text-sm font-semibold text-blue-600">{article.category}</span>
              </div>
              <h2 className="text-xl font-semibold mb-2 group-hover:text-blue-600 transition-colors">
                {article.title}
              </h2>
              <p className="text-gray-600 mb-4">{article.description}</p>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>{article.readTime}</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </Link>
          ))}
        </div>

        <section className="mt-16 p-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Learning Path</h2>
          <p className="text-gray-700 mb-6">
            New to learning about the Eucharist? We recommend starting with these foundational
            articles:
          </p>
          <ol className="space-y-2">
            <li className="flex items-start">
              <span className="font-semibold text-blue-600 mr-2">1.</span>
              <span>Understanding the Real Presence</span>
            </li>
            <li className="flex items-start">
              <span className="font-semibold text-blue-600 mr-2">2.</span>
              <span>The Biblical Foundation of the Eucharist</span>
            </li>
            <li className="flex items-start">
              <span className="font-semibold text-blue-600 mr-2">3.</span>
              <span>Understanding the Parts of the Mass</span>
            </li>
            <li className="flex items-start">
              <span className="font-semibold text-blue-600 mr-2">4.</span>
              <span>Preparing Your Heart for Mass</span>
            </li>
          </ol>
        </section>
      </div>
    </main>
  );
}
