import { useNavigate } from 'react-router';
import { BookOpen, GraduationCap, ArrowRight } from 'lucide-react';

export default function PortalSelection() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Academic Concept Mastery Tracking
          </h1>
          <p className="text-xl text-gray-600">
            Select your portal to continue
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <button
            onClick={() => navigate('/staff/login')}
            className="group bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all transform hover:-translate-y-1"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-indigo-600 rounded-full flex items-center justify-center mb-6 group-hover:bg-indigo-700 transition-colors">
                <BookOpen className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                Staff Portal
              </h2>
              <p className="text-gray-600 mb-6">
                Access teaching tools, create assignments, track student progress, and manage concept mastery assessments
              </p>
              <div className="flex items-center text-indigo-600 font-medium group-hover:text-indigo-700">
                Continue as Staff
                <ArrowRight className="ml-2 w-5 h-5" />
              </div>
            </div>
          </button>

          <button
            onClick={() => navigate('/student/login')}
            className="group bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all transform hover:-translate-y-1"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-emerald-600 rounded-full flex items-center justify-center mb-6 group-hover:bg-emerald-700 transition-colors">
                <GraduationCap className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                Student Portal
              </h2>
              <p className="text-gray-600 mb-6">
                View assignments, submit responses, track your learning progress, and demonstrate concept mastery
              </p>
              <div className="flex items-center text-emerald-600 font-medium group-hover:text-emerald-700">
                Continue as Student
                <ArrowRight className="ml-2 w-5 h-5" />
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
