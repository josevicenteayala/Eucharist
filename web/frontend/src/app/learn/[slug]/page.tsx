import Link from "next/link";

interface PageProps {
  params: {
    slug: string;
  };
}

export default function ArticlePage({ params }: PageProps) {
  const { slug } = params;
  
  // This would normally fetch from an API or CMS
  const article = {
    title: slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
    category: "Eucharist Basics",
    author: "Theological Review Team",
    date: "November 2025",
    reviewedBy: "Fr. John Doe",
    readTime: "5 min read"
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <article className="z-10 w-full max-w-4xl">
        <Link href="/learn" className="text-blue-600 hover:underline mb-4 inline-block">
          ← Back to Learning Center
        </Link>
        
        <div className="mb-8">
          <span className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
            {article.category}
          </span>
          <h1 className="text-4xl font-bold mt-2 mb-4">{article.title}</h1>
          <div className="flex items-center text-gray-600 text-sm space-x-4">
            <span>{article.author}</span>
            <span>•</span>
            <span>{article.date}</span>
            <span>•</span>
            <span>{article.readTime}</span>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Reviewed by: {article.reviewedBy}
          </p>
        </div>

        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2>Introduction</h2>
            <p>
              The Catholic Church teaches that in the Eucharist, the bread and wine truly become
              the Body and Blood of Jesus Christ. This teaching, known as the Real Presence, is
              central to Catholic faith and practice.
            </p>
          </section>

          <section className="mb-8">
            <h2>What is the Real Presence?</h2>
            <p>
              The Real Presence refers to the Catholic doctrine that Jesus Christ is truly,
              really, and substantially present in the Eucharist under the appearances of bread
              and wine. This is not merely a symbol or a memorial, but Christ Himself—body, blood,
              soul, and divinity.
            </p>
            <blockquote className="border-l-4 border-blue-500 pl-4 my-6 italic text-gray-700">
              "The mode of Christ's presence under the Eucharistic species is unique...
              In the most blessed sacrament of the Eucharist 'the body and blood, together with
              the soul and divinity, of our Lord Jesus Christ and, therefore, the whole Christ
              is truly, really, and substantially contained.'"
              <footer className="text-sm mt-2 not-italic">— Catechism of the Catholic Church, 1374</footer>
            </blockquote>
          </section>

          <section className="mb-8">
            <h2>Biblical Foundation</h2>
            <p>
              The doctrine of the Real Presence is rooted in Scripture, particularly in Jesus' words
              at the Last Supper and His discourse on the Bread of Life in John 6.
            </p>
            <ul>
              <li>
                <strong>Matthew 26:26-28:</strong> "This is my body... This is my blood"
              </li>
              <li>
                <strong>John 6:51-58:</strong> "Unless you eat the flesh of the Son of Man..."
              </li>
              <li>
                <strong>1 Corinthians 11:23-29:</strong> Paul warns against receiving unworthily
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2>Living Out This Truth</h2>
            <p>
              Understanding the Real Presence should transform how we approach Mass and receive
              Communion. Here are practical ways to deepen your devotion:
            </p>
            <ol>
              <li>Prepare your heart before Mass through prayer and examination of conscience</li>
              <li>Arrive early to spend time in prayer before the Blessed Sacrament</li>
              <li>Fast for at least one hour before receiving Communion</li>
              <li>Make a thanksgiving prayer after receiving the Eucharist</li>
              <li>Visit Jesus in Eucharistic Adoration regularly</li>
            </ol>
          </section>

          <section className="mb-8 p-6 bg-blue-50 rounded-lg">
            <h3 className="mt-0">Reflection Questions</h3>
            <ul className="mb-0">
              <li>How does belief in the Real Presence affect my preparation for Mass?</li>
              <li>What can I do to grow in reverence for the Eucharist?</li>
              <li>How can I help others understand this beautiful teaching?</li>
            </ul>
          </section>
        </div>

        <div className="mt-12 p-6 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Continue Learning</h3>
          <p className="text-gray-600 mb-4">
            Explore more articles to deepen your understanding of the Eucharist
          </p>
          <Link href="/learn" className="text-blue-600 hover:underline">
            View all articles →
          </Link>
        </div>
      </article>
    </main>
  );
}
