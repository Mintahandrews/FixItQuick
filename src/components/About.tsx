import { useNavigate } from "react-router-dom";
import { BookOpen, ChevronLeft, Code, Lightbulb, Users } from "lucide-react";

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="max-w-3xl mx-auto">
      <button
        className="flex items-center text-blue-600 mb-6 hover:underline"
        onClick={() => navigate(-1)}
      >
        <ChevronLeft size={20} /> Back
      </button>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-8 animate-enter">
        <h1 className="text-3xl font-bold mb-6 text-center">
          About FixItQuick
        </h1>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Lightbulb className="text-blue-600 dark:text-blue-400" />
            Our Mission
          </h2>
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            FixItQuick was created with a simple mission: to help students
            quickly solve common tech problems without paying for knowledge that
            should be freely available.
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            We believe that many tech issues students face have simple solutions
            that don't require advanced technical knowledge or expensive repair
            services. By providing clear, step-by-step guides, we hope to
            empower students to fix their own tech problems and learn in the
            process.
          </p>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Users className="text-blue-600 dark:text-blue-400" />
            Who We Are
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            FixItQuick was developed by a team of former IT support specialists
            and students who noticed that many people were paying for simple
            tech fixes that could be solved with just a bit of guidance. Our
            team combines technical expertise with a commitment to making
            technology more accessible for everyone.
          </p>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Users className="text-blue-600 dark:text-blue-400" />
            Our Developers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800/30">
              <h3 className="font-semibold text-lg mb-1">
                Andrews Mintah (codemintah)
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                Lead developer at FixItQuick, Mintah brings extensive experience
                in building user-friendly applications. With a background in IT
                support, he understands the challenges students face and designs
                solutions with simplicity in mind.
              </p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800/30">
              <h3 className="font-semibold text-lg mb-1">
                Clifford Robin Wreifors
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                As the UX specialist and content strategist, Clifford focuses on
                making technical information accessible to everyone. His
                expertise in educational technology helps ensure our solutions
                are easy to follow regardless of technical skill level.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <BookOpen className="text-blue-600 dark:text-blue-400" />
            How FixItQuick Works
          </h2>
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            We organize tech solutions by category and difficulty level to help
            you quickly find exactly what you need. Each solution provides
            clear, step-by-step instructions that anyone can follow.
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            Our guides are regularly updated to ensure they remain relevant and
            accurate as technology evolves. If you notice anything that needs
            updating or have suggestions for improvements, please let us know
            through our suggestion form.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Code className="text-blue-600 dark:text-blue-400" />
            Contribute
          </h2>
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            FixItQuick is a community-driven resource. If you have expertise in
            solving particular tech problems and want to share your knowledge,
            we welcome your contributions.
          </p>
          <div className="flex justify-center">
            <button
              className="btn btn-primary"
              onClick={() => navigate("/suggest")}
            >
              Suggest a Solution
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
