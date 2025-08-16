"use client"

import { useEffect, useState } from "react"
import { useAuth } from "../contexts/AuthContext"
import { supabase } from "../lib/supabase"
import {
  History,
  BookOpen,
  HelpCircle,
  Clock,
  Coins,
  Target,
  Filter,
  Search,
  XCircle,
  ExternalLink,
} from "lucide-react"

interface HistoryItem {
  id: string
  type: "learning_plan" | "quiz"
  title: string
  created_at: string
  credits_used: number
  tier?: string
  score?: number
  total_questions?: number
  difficulty?: string
  content?: string
}

const HistoryPage = () => {
  const { user } = useAuth()
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "learning_plan" | "quiz">("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    if (user) {
      fetchHistory()
    }
  }, [user])

  const fetchHistory = async () => {
    try {
      // Fetch learning plans
      const { data: learningPlans } = await supabase
        .from("learning_plans")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false })

      // Fetch quiz results
      const { data: quizResults } = await supabase
        .from("quiz_results")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false })

      // Combine and sort history
      const combinedHistory: HistoryItem[] = []

      if (learningPlans) {
        combinedHistory.push(
          ...learningPlans.map((plan) => ({
            id: plan.id,
            type: "learning_plan" as const,
            title: plan.title || "Learning Plan",
            created_at: plan.created_at,
            credits_used: plan.credits_used,
            tier: plan.tier,
            content: plan.content,
          })),
        )
      }

      if (quizResults) {
        combinedHistory.push(
          ...quizResults.map((quiz) => ({
            id: quiz.id,
            type: "quiz" as const,
            title: `${quiz.difficulty?.charAt(0).toUpperCase() + quiz.difficulty?.slice(1)} Quiz` || "Quiz",
            created_at: quiz.created_at,
            credits_used: quiz.credits_used,
            score: quiz.score,
            total_questions: quiz.total_questions,
            difficulty: quiz.difficulty,
            content: quiz.quiz_content,
          })),
        )
      }

      combinedHistory.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      setHistory(combinedHistory)
    } catch (error) {
      console.error("Error fetching history:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredHistory = history.filter((item) => {
    const matchesFilter = filter === "all" || item.type === filter
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const handleViewItem = (item: HistoryItem) => {
    setSelectedItem(item)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedItem(null)
  }
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getTierColor = (tier?: string) => {
    switch (tier) {
      case "basic":
        return "text-blue-600 bg-blue-50 border-blue-200"
      case "advanced":
        return "text-green-600 bg-green-50 border-green-200"
      case "premium":
        return "text-purple-600 bg-purple-50 border-purple-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case "easy":
        return "text-green-600 bg-green-50 border-green-200"
      case "medium":
        return "text-yellow-600 bg-yellow-50 border-yellow-200"
      case "hard":
        return "text-red-600 bg-red-50 border-red-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600"
    if (percentage >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-pulse">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="p-4 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 shadow-lg">
              <History className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Learning History
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Track your learning journey and review your progress across all learning plans and quizzes.
          </p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search your history..."
                className="block w-full pl-10 pr-3 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <button
                onClick={() => setFilter("all")}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  filter === "all"
                    ? "bg-blue-100 text-blue-700 border border-blue-200"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter("learning_plan")}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  filter === "learning_plan"
                    ? "bg-green-100 text-green-700 border border-green-200"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
                }`}
              >
                Learning Plans
              </button>
              <button
                onClick={() => setFilter("quiz")}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  filter === "quiz"
                    ? "bg-purple-100 text-purple-700 border border-purple-200"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
                }`}
              >
                Quizzes
              </button>
            </div>
          </div>
        </div>

        {/* History Items */}
        {filteredHistory.length > 0 ? (
          <div className="space-y-6">
            {filteredHistory.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    {/* Icon */}
                    <div
                      className={`p-3 rounded-lg ${
                        item.type === "learning_plan"
                          ? "bg-gradient-to-r from-green-500 to-emerald-500"
                          : "bg-gradient-to-r from-purple-500 to-indigo-500"
                      }`}
                    >
                      {item.type === "learning_plan" ? (
                        <BookOpen className="w-6 h-6 text-white" />
                      ) : (
                        <HelpCircle className="w-6 h-6 text-white" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>{formatDate(item.created_at)}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Coins className="w-4 h-4" />
                              <span>{item.credits_used} credits</span>
                            </span>
                          </div>
                        </div>

                        {/* Type Badge */}
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            item.type === "learning_plan"
                              ? "text-green-700 bg-green-100 border border-green-200"
                              : "text-purple-700 bg-purple-100 border border-purple-200"
                          }`}
                        >
                          {item.type === "learning_plan" ? "Learning Plan" : "Quiz"}
                        </span>
                      </div>

                      {/* Additional Info */}
                      <div className="flex items-center space-x-4">
                        {item.tier && (
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium border ${getTierColor(item.tier)}`}
                          >
                            {item.tier.charAt(0).toUpperCase() + item.tier.slice(1)}
                          </span>
                        )}

                        {item.difficulty && (
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium border ${getDifficultyColor(item.difficulty)}`}
                          >
                            {item.difficulty.charAt(0).toUpperCase() + item.difficulty.slice(1)}
                          </span>
                        )}

                        {item.score !== undefined && item.total_questions && (
                          <div className="flex items-center space-x-2">
                            <Target className="w-4 h-4 text-gray-500" />
                            <span
                              className={`font-semibold ${getScoreColor((item.score / item.total_questions) * 100)}`}
                            >
                              {item.score}/{item.total_questions} (
                              {Math.round((item.score / item.total_questions) * 100)}%)
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* View Button */}
                  <button
                    onClick={() => handleViewItem(item)}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-sm"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <History className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {searchTerm || filter !== "all" ? "No matching results" : "No history yet"}
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {searchTerm || filter !== "all"
                ? "Try adjusting your search or filter to find what you're looking for."
                : "Start creating learning plans or taking quizzes to build your learning history."}
            </p>
            {!searchTerm && filter === "all" && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/learning-plans"
                  className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-sm"
                >
                  Create Learning Plan
                </a>
                <a
                  href="/quiz"
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-sm"
                >
                  Take Quiz
                </a>
              </div>
            )}
          </div>
        )}

        {/* Modal for viewing item details */}
        {showModal && selectedItem && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white border border-gray-200 rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">{selectedItem.title}</h2>
                  <button
                    onClick={closeModal}
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-300"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>
                <p className="text-gray-600 mt-2">{formatDate(selectedItem.created_at)}</p>
              </div>

              <div className="p-6">
                {selectedItem.type === "learning_plan" ? (
                  <div>
                    {selectedItem.content ? (
                      <div className="space-y-6">
                        {(() => {
                          try {
                            const planData = JSON.parse(selectedItem.content)

                            return (
                              <div>
                                <div className="mb-6">
                                  <h3 className="text-xl font-bold text-gray-900 mb-4">Overview</h3>
                                  {planData.overview?.description ? (
                                    <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                                      {planData.overview.description}
                                    </p>
                                  ) : planData.description ? (
                                    <p className="text-gray-700 mb-6 text-lg leading-relaxed">{planData.description}</p>
                                  ) : (
                                    <p className="text-gray-700 mb-6">
                                      Learning plan for: {planData.topic || planData.title || "Unknown topic"}
                                    </p>
                                  )}
                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                                      <p className="text-sm text-gray-600">Duration</p>
                                      <p className="text-gray-900 font-semibold">
                                        {planData.overview?.duration || planData.duration || "Not specified"}
                                      </p>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                                      <p className="text-sm text-gray-600">Level</p>
                                      <p className="text-gray-900 font-semibold">
                                        {planData.overview?.level || planData.level || planData.tier || "Not specified"}
                                      </p>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                                      <p className="text-sm text-gray-600">Style</p>
                                      <p className="text-gray-900 font-semibold">
                                        {planData.overview?.style || planData.learningStyle || "Not specified"}
                                      </p>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                                      <p className="text-sm text-gray-600">Budget</p>
                                      <p className="text-gray-900 font-semibold">
                                        {planData.overview?.budget || planData.budget || "Not specified"}
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                {/* Study Schedule */}
                                {(planData.schedule || planData.studySchedule) && (
                                  <div className="mb-6">
                                    <h3 className="text-xl font-bold text-gray-900 mb-4">Study Schedule</h3>
                                    <div className="grid md:grid-cols-2 gap-4">
                                      {(planData.schedule?.weekly || planData.studySchedule?.weekly) && (
                                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                          <h4 className="text-lg font-semibold text-gray-900 mb-3">Weekly Plan</h4>
                                          <p className="text-gray-700">
                                            {planData.schedule?.weekly || planData.studySchedule?.weekly}
                                          </p>
                                        </div>
                                      )}
                                      {(planData.schedule?.daily || planData.studySchedule?.daily) && (
                                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                          <h4 className="text-lg font-semibold text-gray-900 mb-3">
                                            Daily Recommendations
                                          </h4>
                                          <p className="text-gray-700">
                                            {planData.schedule?.daily || planData.studySchedule?.daily}
                                          </p>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}

                                {planData.phases && (
                                  <div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-4">Learning Phases</h3>
                                    <div className="space-y-4">
                                      {planData.phases.map((phase: any, index: number) => (
                                        <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                          <h4 className="text-lg font-semibold text-gray-900 mb-2">
                                            {phase.title || `Phase ${index + 1}`}
                                          </h4>
                                          <p className="text-gray-700 mb-3">
                                            {phase.description || "No description available"}
                                          </p>
                                          {phase.objectives && (
                                            <div className="mb-3">
                                              <p className="text-sm font-medium text-gray-600 mb-2">Objectives:</p>
                                              <div className="space-y-2">
                                                {phase.objectives.map((obj: any, objIndex: number) => (
                                                  <div
                                                    key={objIndex}
                                                    className="bg-white rounded p-3 border border-gray-200"
                                                  >
                                                    <div className="text-sm text-gray-700">
                                                      {typeof obj === "string"
                                                        ? obj
                                                        : obj.title || obj.description || `Objective ${objIndex + 1}`}
                                                    </div>
                                                    {typeof obj === "object" && obj.timeRequired && (
                                                      <div className="text-xs text-blue-600 mt-1">
                                                        ⏱️ {obj.timeRequired}
                                                      </div>
                                                    )}
                                                  </div>
                                                ))}
                                              </div>
                                            </div>
                                          )}

                                          {/* Resources */}
                                          {phase.resources && (
                                            <div className="mb-3">
                                              <p className="text-sm font-medium text-gray-600 mb-2">Resources:</p>
                                              <div className="space-y-2">
                                                {phase.resources.map((resource: any, resIndex: number) => (
                                                  <div
                                                    key={resIndex}
                                                    className="bg-white rounded p-3 border border-gray-200"
                                                  >
                                                    <div className="text-sm font-medium text-gray-900">
                                                      {resource.title || `Resource ${resIndex + 1}`}
                                                    </div>
                                                    <div className="text-xs text-gray-600">
                                                      {resource.provider || resource.type || "Resource"} •{" "}
                                                      {resource.price || resource.cost || "Free"}
                                                    </div>
                                                    {resource.description && (
                                                      <div className="text-xs text-gray-500 mt-1">
                                                        {resource.description}
                                                      </div>
                                                    )}
                                                    {resource.url && (
                                                      <a
                                                        href={resource.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center space-x-1 text-xs text-blue-600 hover:text-blue-700 mt-1 transition-colors duration-200"
                                                      >
                                                        <span>Visit Resource</span>
                                                        <ExternalLink className="w-3 h-3" />
                                                      </a>
                                                    )}
                                                  </div>
                                                ))}
                                              </div>
                                            </div>
                                          )}

                                          {/* Exercises */}
                                          {phase.exercises && (
                                            <div>
                                              <p className="text-sm font-medium text-gray-600 mb-2">Exercises:</p>
                                              <div className="space-y-2">
                                                {phase.exercises.map((exercise: any, exIndex: number) => (
                                                  <div
                                                    key={exIndex}
                                                    className="bg-white rounded p-3 border border-gray-200"
                                                  >
                                                    <div className="text-sm font-medium text-gray-900">
                                                      {exercise.title || `Exercise ${exIndex + 1}`}
                                                    </div>
                                                    <div className="text-xs text-gray-700 mt-1">
                                                      {exercise.description || "No description available"}
                                                    </div>
                                                    {exercise.timeRequired && (
                                                      <div className="text-xs text-blue-600 mt-1">
                                                        ⏱️ {exercise.timeRequired}
                                                      </div>
                                                    )}
                                                  </div>
                                                ))}
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Projects */}
                                {planData.projects && (
                                  <div className="mb-6">
                                    <h3 className="text-xl font-bold text-gray-900 mb-4">Projects</h3>
                                    <div className="grid md:grid-cols-2 gap-4">
                                      {planData.projects.map((project: any, index: number) => (
                                        <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                          <h4 className="text-lg font-semibold text-gray-900 mb-2">
                                            {project.title || `Project ${index + 1}`}
                                          </h4>
                                          <p className="text-gray-700 text-sm mb-3">
                                            {project.description || "No description available"}
                                          </p>
                                          <div className="flex items-center space-x-4 text-xs">
                                            {project.timeRequired && (
                                              <span className="text-blue-600">⏱️ {project.timeRequired}</span>
                                            )}
                                            {project.difficulty && (
                                              <span
                                                className={`px-2 py-1 rounded ${
                                                  project.difficulty === "beginner"
                                                    ? "bg-green-100 text-green-700"
                                                    : project.difficulty === "intermediate"
                                                      ? "bg-yellow-100 text-yellow-700"
                                                      : "bg-red-100 text-red-700"
                                                }`}
                                              >
                                                {project.difficulty}
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Tools & Software */}
                                {planData.toolsAndSoftware && (
                                  <div className="mb-6">
                                    <h3 className="text-xl font-bold text-gray-900 mb-4">Tools & Software</h3>
                                    <div className="grid md:grid-cols-2 gap-4">
                                      {planData.toolsAndSoftware.map((tool: any, index: number) => (
                                        <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                          <h4 className="font-semibold text-gray-900 mb-2">
                                            {tool.name || tool.title || `Tool ${index + 1}`}
                                          </h4>
                                          <p className="text-gray-600 text-sm mb-2">
                                            {tool.purpose || tool.description || "No description available"}
                                          </p>
                                          <div className="flex items-center justify-between">
                                            <span
                                              className={`inline-block px-2 py-1 rounded text-xs ${
                                                tool.cost === "Free" || tool.price === "Free"
                                                  ? "bg-green-100 text-green-700"
                                                  : "bg-yellow-100 text-yellow-700"
                                              }`}
                                            >
                                              {tool.cost || tool.price || "Free"}
                                            </span>
                                            {tool.url && (
                                              <a
                                                href={tool.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center space-x-1 text-xs text-blue-600 hover:text-blue-700 transition-colors duration-200"
                                              >
                                                <span>Visit</span>
                                                <ExternalLink className="w-3 h-3" />
                                              </a>
                                            )}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Assessment Methods */}
                                {planData.assessmentMethods && (
                                  <div className="mb-6">
                                    <h3 className="text-xl font-bold text-gray-900 mb-4">Assessment Methods</h3>
                                    <div className="space-y-3">
                                      {planData.assessmentMethods.map((method: any, index: number) => (
                                        <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                          <h4 className="font-semibold text-gray-900 mb-2">
                                            {method.method || method.title || `Method ${index + 1}`}
                                          </h4>
                                          <p className="text-gray-600 text-sm">
                                            {method.description || "No description available"}
                                          </p>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Pro Tips */}
                                {planData.proTips && (
                                  <div className="mb-6">
                                    <h3 className="text-xl font-bold text-gray-900 mb-4">Pro Tips</h3>
                                    <div className="grid md:grid-cols-3 gap-4">
                                      {planData.proTips.learning && (
                                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                          <h4 className="font-semibold text-gray-900 mb-3">Learning Tips</h4>
                                          <ul className="space-y-1 text-sm text-gray-700">
                                            {planData.proTips.learning.map((tip: string, index: number) => (
                                              <li key={index} className="flex items-start space-x-2">
                                                <span className="text-blue-600 mt-1">•</span>
                                                <span>{tip}</span>
                                              </li>
                                            ))}
                                          </ul>
                                        </div>
                                      )}
                                      {planData.proTips.motivation && (
                                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                          <h4 className="font-semibold text-gray-900 mb-3">Motivation</h4>
                                          <ul className="space-y-1 text-sm text-gray-700">
                                            {planData.proTips.motivation.map((tip: string, index: number) => (
                                              <li key={index} className="flex items-start space-x-2">
                                                <span className="text-green-600 mt-1">•</span>
                                                <span>{tip}</span>
                                              </li>
                                            ))}
                                          </ul>
                                        </div>
                                      )}
                                      {planData.proTips.troubleshooting && (
                                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                          <h4 className="font-semibold text-gray-900 mb-3">Troubleshooting</h4>
                                          <ul className="space-y-1 text-sm text-gray-700">
                                            {planData.proTips.troubleshooting.map((tip: string, index: number) => (
                                              <li key={index} className="flex items-start space-x-2">
                                                <span className="text-orange-600 mt-1">•</span>
                                                <span>{tip}</span>
                                              </li>
                                            ))}
                                          </ul>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}

                                {/* Next Steps */}
                                {planData.nextSteps && (
                                  <div className="mb-6">
                                    <h3 className="text-xl font-bold text-gray-900 mb-4">Next Steps</h3>
                                    <div className="grid md:grid-cols-3 gap-4">
                                      {planData.nextSteps.careerPaths && (
                                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                          <h4 className="font-semibold text-gray-900 mb-3">Career Paths</h4>
                                          <ul className="space-y-1 text-sm text-gray-700">
                                            {planData.nextSteps.careerPaths.map((path: string, index: number) => (
                                              <li key={index} className="flex items-start space-x-2">
                                                <span className="text-pink-600 mt-1">→</span>
                                                <span>{path}</span>
                                              </li>
                                            ))}
                                          </ul>
                                        </div>
                                      )}
                                      {planData.nextSteps.certifications && (
                                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                          <h4 className="font-semibold text-gray-900 mb-3">Certifications</h4>
                                          <ul className="space-y-1 text-sm text-gray-700">
                                            {planData.nextSteps.certifications.map((cert: string, index: number) => (
                                              <li key={index} className="flex items-start space-x-2">
                                                <span className="text-yellow-600 mt-1">🏆</span>
                                                <span>{cert}</span>
                                              </li>
                                            ))}
                                          </ul>
                                        </div>
                                      )}
                                      {planData.nextSteps.communities && (
                                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                          <h4 className="font-semibold text-gray-900 mb-3">Communities</h4>
                                          <ul className="space-y-1 text-sm text-gray-700">
                                            {planData.nextSteps.communities.map((community: string, index: number) => (
                                              <li key={index} className="flex items-start space-x-2">
                                                <span className="text-cyan-600 mt-1">👥</span>
                                                <span>{community}</span>
                                              </li>
                                            ))}
                                          </ul>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}

                                {/* If no structured data is available, show raw content */}
                                {!planData.phases && !planData.overview && (
                                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                    <h3 className="text-xl font-bold text-gray-900 mb-4">Learning Plan Content</h3>
                                    <div className="text-gray-700 whitespace-pre-wrap text-sm">
                                      {JSON.stringify(planData, null, 2)}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )
                          } catch (error) {
                            console.error("Error parsing learning plan content:", error)
                            console.error("Raw content:", selectedItem.content)
                            return (
                              <div className="space-y-4">
                                <p className="text-red-600">Error parsing learning plan data.</p>
                                <details className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                  <summary className="text-gray-700 cursor-pointer">Show raw data</summary>
                                  <pre className="text-gray-600 text-sm mt-2 whitespace-pre-wrap overflow-auto">
                                    {selectedItem.content}
                                  </pre>
                                </details>
                              </div>
                            )
                          }
                        })()}
                      </div>
                    ) : (
                      <p className="text-gray-600">No content available for this learning plan.</p>
                    )}
                  </div>
                ) : (
                  <div>
                    {selectedItem.content ? (
                      <div className="space-y-6">
                        {(() => {
                          try {
                            const quizData = JSON.parse(selectedItem.content)
                            return (
                              <div>
                                <div className="mb-6">
                                  <h3 className="text-xl font-bold text-gray-900 mb-4">Quiz Results</h3>
                                  <div className="grid grid-cols-3 gap-4 mb-6">
                                    <div className="bg-gray-50 rounded-lg p-3 text-center border border-gray-200">
                                      <p className="text-sm text-gray-600">Score</p>
                                      <p className="text-2xl font-bold text-green-600">
                                        {selectedItem.score}/{selectedItem.total_questions}
                                      </p>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-3 text-center border border-gray-200">
                                      <p className="text-sm text-gray-600">Percentage</p>
                                      <p className="text-2xl font-bold text-blue-600">
                                        {Math.round(
                                          ((selectedItem.score || 0) / (selectedItem.total_questions || 1)) * 100,
                                        )}
                                        %
                                      </p>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-3 text-center border border-gray-200">
                                      <p className="text-sm text-gray-600">Difficulty</p>
                                      <p className="text-lg font-bold text-purple-600 capitalize">
                                        {selectedItem.difficulty}
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                {quizData.questions && (
                                  <div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-4">Questions</h3>
                                    <div className="space-y-4">
                                      {quizData.questions.map((question: any, index: number) => (
                                        <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                          <h4 className="text-lg font-semibold text-gray-900 mb-3">
                                            Question {index + 1}: {question.question}
                                          </h4>
                                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                            {question.options?.map((option: string, optIndex: number) => (
                                              <div
                                                key={optIndex}
                                                className={`p-2 rounded text-sm ${
                                                  optIndex === question.correct
                                                    ? "bg-green-100 text-green-700 border border-green-200"
                                                    : "bg-white text-gray-700 border border-gray-200"
                                                }`}
                                              >
                                                {option}
                                                {optIndex === question.correct && (
                                                  <span className="ml-2">✓ Correct</span>
                                                )}
                                              </div>
                                            ))}
                                          </div>
                                          {question.explanation && (
                                            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded">
                                              <p className="text-blue-700 text-sm">
                                                <strong>Explanation:</strong> {question.explanation}
                                              </p>
                                            </div>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )
                          } catch (error) {
                            return <p className="text-gray-600">Unable to display quiz details.</p>
                          }
                        })()}
                      </div>
                    ) : (
                      <p className="text-gray-600">No content available for this quiz.</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default HistoryPage
