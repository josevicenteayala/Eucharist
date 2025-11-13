export default function GospelPage() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className="z-10 w-full max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Daily Gospel</h1>
        <div className="mb-6">
          <p className="text-sm text-gray-500 mb-2">Monday of the 32nd Week in Ordinary Time</p>
          <p className="text-sm text-gray-500">November 11, 2025</p>
        </div>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">First Reading</h2>
          <p className="text-gray-700 mb-2 italic">A reading from the Book of Wisdom</p>
          <div className="prose prose-lg max-w-none">
            <p className="mb-4">
              The souls of the righteous are in the hand of God, and no torment shall touch them.
              They seemed, in the view of the foolish, to be dead; and their passing away was
              thought an affliction and their going forth from us, utter destruction. But they are
              in peace.
            </p>
          </div>
          <p className="text-sm text-gray-600 mt-2">Wisdom 3:1-9</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Responsorial Psalm</h2>
          <p className="text-gray-700 mb-2 italic">Psalm 23</p>
          <div className="prose prose-lg max-w-none">
            <p className="mb-2 font-semibold">
              R. The Lord is my shepherd; there is nothing I shall want.
            </p>
            <p className="mb-4">
              The LORD is my shepherd; I shall not want. In verdant pastures he gives me repose;
              beside restful waters he leads me; he refreshes my soul.
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Gospel</h2>
          <p className="text-gray-700 mb-2 italic">
            A reading from the holy Gospel according to Luke
          </p>
          <div className="prose prose-lg max-w-none">
            <p className="mb-4">
              Jesus said to his disciples: "Things that cause sin will inevitably occur, but woe to
              the one through whom they occur. It would be better for him if a millstone were put
              around his neck and he be thrown into the sea than for him to cause one of these
              little ones to sin."
            </p>
          </div>
          <p className="text-sm text-gray-600 mt-2">Luke 17:1-6</p>
        </section>

        <section className="mt-12 p-6 bg-blue-50 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Reflection</h2>
          <p className="text-gray-700 mb-4">
            Today's Gospel challenges us to examine our own actions and their impact on others,
            especially those who are vulnerable in faith. Jesus' strong words remind us of our
            responsibility to be witnesses of faith rather than obstacles to it.
          </p>
          <p className="text-gray-700">
            As we prepare to receive the Eucharist, let us ask for the grace to be instruments of
            God's love and truth, drawing others closer to Him through our example.
          </p>
        </section>
      </div>
    </main>
  );
}
